import type { AddressInfo } from 'node:net';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PROTOCOL_VERSION, type ClientMessage, type ServerMessage } from '@segnale/shared';
import { WebSocket } from 'ws';
import { createGameServer } from '../src/server';

class TestClient {
  readonly socket: WebSocket;
  private messages: ServerMessage[] = [];
  private listeners = new Set<() => void>();

  constructor(url: string) {
    this.socket = new WebSocket(url);
    this.socket.on('message', (raw) => {
      this.messages.push(JSON.parse(raw.toString()) as ServerMessage);
      for (const listener of this.listeners) listener();
    });
  }

  async open(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.socket.once('open', resolve);
      this.socket.once('error', reject);
    });
  }

  send(message: ClientMessage): void {
    this.socket.send(JSON.stringify(message));
  }

  message<T extends ServerMessage['type']>(type: T): Promise<Extract<ServerMessage, { type: T }>> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.listeners.delete(check);
        reject(new Error(`No ${type} message received`));
      }, 2000);
      const check = () => {
        const index = this.messages.findIndex((message) => message.type === type);
        if (index < 0) return;
        clearTimeout(timer);
        this.listeners.delete(check);
        resolve(this.messages.splice(index, 1)[0] as Extract<ServerMessage, { type: T }>);
      };
      this.listeners.add(check);
      check();
    });
  }
}

describe('WebSocket multiplayer server', () => {
  let game: ReturnType<typeof createGameServer>;
  let url: string;

  beforeEach(async () => {
    game = createGameServer();
    await new Promise<void>((resolve) => game.server.listen(0, '127.0.0.1', resolve));
    const port = (game.server.address() as AddressInfo).port;
    url = `ws://127.0.0.1:${port}/ws`;
  });

  afterEach(async () => {
    await game.close();
  });

  async function connect(token: string, room?: string) {
    const client = new TestClient(url);
    await client.open();
    client.send({ type: 'join', version: PROTOCOL_VERSION, name: 'Ada', token, ...(room ? { room } : {}) });
    return client;
  }

  it('exposes health and creates a shared room with authoritative snapshots', async () => {
    const health = await fetch(url.replace('ws:', 'http:').replace('/ws', '/health'));
    expect(await health.json()).toEqual({ ok: true, protocol: PROTOCOL_VERSION });
    const first = await connect('first-token');
    const welcome = await first.message('welcome');
    expect(welcome.room).toMatch(/^[A-Z]{4}$/);
    const second = await connect('second-token', welcome.room);
    const joined = await second.message('welcome');
    expect(joined.seed).toBe(welcome.seed);
    expect(joined.playerId).not.toBe(welcome.playerId);
    const state = await second.message('snapshot');
    expect(state.players).toHaveLength(2);
    expect(state.players.map((player) => player.id)).toContain(welcome.playerId);
  });

  it('enforces capacity and reconnects the same token to its existing character', async () => {
    const first = await connect('first-token');
    const welcome = await first.message('welcome');
    for (let i = 0; i < 3; i++) {
      const client = await connect(`other-token-${i}`, welcome.room);
      await client.message('welcome');
    }
    const fifth = await connect('fifth-token', welcome.room);
    expect((await fifth.message('error')).message).toMatch(/piena/);
    first.socket.close();
    const rejoined = await connect('first-token', welcome.room);
    expect((await rejoined.message('welcome')).playerId).toBe(welcome.playerId);
    const state = await rejoined.message('snapshot');
    expect(state.players).toHaveLength(4);
  });

  it('rejects malformed messages, missing rooms and incompatible versions without crashing', async () => {
    const client = new TestClient(url);
    await client.open();
    client.socket.send('{');
    expect((await client.message('error')).message).toMatch(/non valido/);
    client.send({ type: 'join', version: PROTOCOL_VERSION + 1, name: 'Ada', token: 'first-token' });
    expect((await client.message('error')).message).toMatch(/incompatibile/);
    client.send({ type: 'join', version: PROTOCOL_VERSION, name: 'Ada', token: 'first-token', room: 'NONE' });
    expect((await client.message('error')).message).toMatch(/non trovata/);
    client.send({ type: 'join', version: PROTOCOL_VERSION, name: 'Ada', token: 'first-token' });
    await client.message('welcome');
    client.socket.send(JSON.stringify({ type: 'input', input: { seq: 0, moveX: 500 } }));
    expect((await client.message('error')).message).toMatch(/non valido/);
  });
});
