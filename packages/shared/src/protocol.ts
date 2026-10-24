import type { MoveInput, PlayerState } from './player';

export type ClientMessage =
  | { type: 'join'; version: number; name: string; token: string; room?: string }
  | { type: 'input'; input: MoveInput }
  | { type: 'gather'; nodeId: string }
  | { type: 'craft'; itemId: 'oxycell' }
  | { type: 'consume'; itemId: 'oxycell' | 'fruit' };

export type ServerMessage =
  | { type: 'welcome'; playerId: string; room: string; seed: number }
  | { type: 'snapshot'; tick: number; players: PlayerState[]; depleted: string[]; elapsed: number }
  | { type: 'error'; message: string };

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function finite(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

/** Validate untrusted WebSocket data before it reaches authoritative state. */
export function parseClientMessage(value: unknown): ClientMessage | null {
  if (!record(value)) return null;
  switch (value.type) {
    case 'join': {
      if (
        !Number.isSafeInteger(value.version) ||
        typeof value.name !== 'string' ||
        value.name.trim().length < 1 ||
        value.name.length > 24 ||
        typeof value.token !== 'string' ||
        !/^[A-Za-z0-9_-]{8,128}$/.test(value.token) ||
        (value.room !== undefined && (typeof value.room !== 'string' || !/^[A-Z]{4}$/.test(value.room)))
      ) {
        return null;
      }
      return {
        type: 'join',
        version: value.version as number,
        name: value.name.trim(),
        token: value.token,
        ...(value.room === undefined ? {} : { room: value.room as string }),
      };
    }
    case 'input': {
      const input = value.input;
      if (
        !record(input) ||
        !Number.isSafeInteger(input.seq) ||
        (input.seq as number) < 0 ||
        !finite(input.moveX) ||
        Math.abs(input.moveX) > 1 ||
        !finite(input.moveZ) ||
        Math.abs(input.moveZ) > 1 ||
        !finite(input.yaw) ||
        Math.abs(input.yaw) > Math.PI * 1000 ||
        typeof input.sprint !== 'boolean' ||
        typeof input.jump !== 'boolean'
      ) {
        return null;
      }
      return {
        type: 'input',
        input: {
          seq: input.seq as number,
          moveX: input.moveX,
          moveZ: input.moveZ,
          yaw: input.yaw,
          sprint: input.sprint,
          jump: input.jump,
        },
      };
    }
    case 'gather':
      return typeof value.nodeId === 'string' && /^node-\d{1,6}$/.test(value.nodeId)
        ? { type: 'gather', nodeId: value.nodeId }
        : null;
    case 'craft':
      return value.itemId === 'oxycell' ? { type: 'craft', itemId: 'oxycell' } : null;
    case 'consume':
      return value.itemId === 'oxycell' || value.itemId === 'fruit'
        ? { type: 'consume', itemId: value.itemId }
        : null;
    default:
      return null;
  }
}
