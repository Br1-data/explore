import { describe, expect, it } from 'vitest';
import { PROTOCOL_VERSION } from '../src/constants';
import { parseClientMessage } from '../src/protocol';

const input = {
  seq: 12,
  moveX: 0.5,
  moveZ: 1,
  yaw: Math.PI,
  sprint: true,
  jump: false,
};

describe('client protocol validation', () => {
  it('accepts a bounded join and normalizes whitespace in the player name', () => {
    expect(
      parseClientMessage({
        type: 'join',
        version: PROTOCOL_VERSION,
        name: '  Ada  ',
        token: 'player_token-123',
        room: 'ABCD',
      }),
    ).toEqual({
      type: 'join',
      version: PROTOCOL_VERSION,
      name: 'Ada',
      token: 'player_token-123',
      room: 'ABCD',
    });
    expect(parseClientMessage({ type: 'input', input })).toEqual({ type: 'input', input });
  });

  it('rejects malformed, nonfinite and oversized movement fields', () => {
    for (const change of [
      { seq: -1 },
      { seq: 0.5 },
      { seq: Number.MAX_SAFE_INTEGER + 1 },
      { moveX: NaN },
      { moveX: 2 },
      { moveZ: Infinity },
      { yaw: -Infinity },
      { yaw: 100000 },
      { sprint: 1 },
      { jump: 'yes' },
    ]) {
      expect(parseClientMessage({ type: 'input', input: { ...input, ...change } })).toBeNull();
    }
    for (const value of [null, 42, [], {}, { type: 'input' }, { type: 'unknown' }]) {
      expect(parseClientMessage(value)).toBeNull();
    }
  });

  it('rejects unbounded join and action identifiers', () => {
    const join = { type: 'join', version: PROTOCOL_VERSION, name: 'Ada', token: 'valid-token123' };
    for (const change of [
      { name: ' ' },
      { name: 'a'.repeat(25) },
      { token: '' },
      { token: 'a'.repeat(129) },
      { token: 'invalid token' },
      { room: 'ABCDE' },
      { room: '12AB' },
      { version: 2.5 },
    ]) {
      expect(parseClientMessage({ ...join, ...change })).toBeNull();
    }
    expect(parseClientMessage({ type: 'gather', nodeId: 'node-42' })).toEqual({
      type: 'gather',
      nodeId: 'node-42',
    });
    expect(parseClientMessage({ type: 'gather', nodeId: '__proto__' })).toBeNull();
    expect(parseClientMessage({ type: 'craft', itemId: 'constructor' })).toBeNull();
    expect(parseClientMessage({ type: 'craft', itemId: 'uplink' })).toMatchObject({ itemId: 'uplink' });
    expect(parseClientMessage({ type: 'consume', itemId: 'tool1' })).toBeNull();
    expect(parseClientMessage({ type: 'craft', itemId: 'oxycell' })).toEqual({
      type: 'craft',
      itemId: 'oxycell',
    });
    expect(parseClientMessage({ type: 'consume', itemId: 'fruit' })).toEqual({
      type: 'consume',
      itemId: 'fruit',
    });
  });
});
