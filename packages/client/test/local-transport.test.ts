import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PROTOCOL_VERSION } from '@segnale/shared';
import type { ServerMessage } from '@segnale/shared';
import { LocalTransport } from '../src/local-transport';

let transport: LocalTransport;
let messages: ServerMessage[];

beforeEach(async () => {
  vi.useFakeTimers();
  vi.stubGlobal('CloseEvent', class extends Event {});
  messages = [];
  transport = new LocalTransport();
  transport.addEventListener('message', (event) => messages.push(JSON.parse(event.data)));
  await Promise.resolve();
});
afterEach(() => {
  transport.close();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

function join() {
  transport.send(
    JSON.stringify({ type: 'join', version: PROTOCOL_VERSION, token: 'local-token', name: 'Ada' }),
  );
}
function snapshot() {
  return messages.filter((message) => message.type === 'snapshot').at(-1)!;
}

describe('local browser transport', () => {
  it('opens and runs the shared simulation without a network connection', () => {
    expect(transport.readyState).toBe(1);
    join();
    expect(messages[0]).toMatchObject({ type: 'welcome', room: 'SOLO' });
    const start = snapshot().players[0].z;
    transport.send(
      JSON.stringify({
        type: 'input',
        input: { seq: 0, moveX: 0, moveZ: 1, yaw: 0, sprint: false, jump: false },
      }),
    );
    vi.advanceTimersByTime(50);
    expect(snapshot().tick).toBe(1);
    expect(snapshot().players[0].z).toBeGreaterThan(start);
    expect(snapshot().players[0].o2).toBeLessThan(100);
    expect(snapshot().players).toHaveLength(1);
  });

  it('supports gathering, crafting and consuming through the same messages as online play', () => {
    join();
    transport.send(JSON.stringify({ type: 'gather', nodeId: 'node-0' }));
    vi.advanceTimersByTime(400);
    transport.send(JSON.stringify({ type: 'gather', nodeId: 'node-1' }));
    vi.advanceTimersByTime(400);
    transport.send(JSON.stringify({ type: 'craft', itemId: 'oxycell' }));
    vi.advanceTimersByTime(400);
    expect(snapshot().players[0].inventory).toMatchObject({ oxycell: 1, scrap: 1, crystal: 0 });
    transport.send(JSON.stringify({ type: 'consume', itemId: 'oxycell' }));
    vi.advanceTimersByTime(50);
    expect(snapshot().players[0].inventory.oxycell).toBe(0);
    expect(snapshot().players[0].o2).toBeGreaterThan(99.9);
    expect(messages.filter((message) => message.type === 'error')).toEqual([]);
  });

  it('stops emitting snapshots when the local expedition is closed', () => {
    join();
    vi.advanceTimersByTime(100);
    transport.close();
    const count = messages.length;
    vi.advanceTimersByTime(1000);
    expect(transport.readyState).toBe(3);
    expect(messages).toHaveLength(count);
  });
});
