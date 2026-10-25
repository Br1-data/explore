import { randomBytes, randomUUID } from 'node:crypto';
import {
  MAX_PLAYERS,
  REJOIN_GRACE,
  ExpeditionSimulation,
  createSimulationActor,
  type SimulationActor,
  type ServerMessage,
} from '@segnale/shared';
import { WebSocket } from 'ws';

export interface RoomPlayer extends SimulationActor {
  socket: WebSocket | null;
  disconnectedAt: number | null;
}

export function send(socket: WebSocket, message: ServerMessage): void {
  if (socket.readyState === WebSocket.OPEN && socket.bufferedAmount < 256 * 1024) {
    socket.send(JSON.stringify(message));
  }
}

/** A room owns all gameplay state; clients can request actions, never submit state. */
export class GameRoom extends ExpeditionSimulation {
  readonly players = new Map<string, RoomPlayer>();
  readonly runId = randomUUID();
  constructor(
    readonly code: string,
    seed = randomBytes(4).readUInt32LE(),
  ) {
    super(seed);
  }

  connect(token: string, name: string, socket: WebSocket | null, perks: string[] = []): RoomPlayer | null {
    let member = this.players.get(token);
    if (member) {
      const previous = member.socket;
      member.socket = socket;
      member.disconnectedAt = null;
      member.player.connected = true;
      member.input = null;
      if (previous && previous !== socket) previous.close(4001, 'Sessione riaperta');
      return member;
    }
    if (this.players.size >= MAX_PLAYERS) return null;
    member = {
      ...createSimulationActor(randomUUID(), name, this.seed, perks),
      socket,
      disconnectedAt: null,
    };
    this.players.set(token, member);
    return member;
  }

  disconnect(token: string, socket: WebSocket, now = Date.now()): void {
    const member = this.players.get(token);
    if (!member || member.socket !== socket) return;
    member.socket = null;
    member.input = null;
    member.player.connected = false;
    member.disconnectedAt = now;
  }

  tick(now = Date.now()): void {
    for (const [token, member] of this.players) {
      if (member.disconnectedAt !== null && now - member.disconnectedAt >= REJOIN_GRACE * 1000) {
        this.players.delete(token);
      }
    }
    this.advance(this.players.values(), now);
  }

  snapshot(): ServerMessage {
    return {
      type: 'snapshot',
      world: this.worldSnapshot(),
      tick: this.tickNumber,
      elapsed: this.elapsed,
      players: [...this.players.values()].map(({ player }) => ({
        ...player,
        inventory: { ...player.inventory },
      })),
      depleted: [...this.depleted.keys()],
    };
  }

  broadcast(): void {
    const snapshot = this.snapshot();
    for (const { socket } of this.players.values()) if (socket) send(socket, snapshot);
  }
}
