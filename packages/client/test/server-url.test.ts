import { describe, expect, it } from 'vitest';
import { resolveServerEndpoint } from '../src/server-url';

const page = 'https://br1-data.github.io/explore/?room=ABCD';

describe('WebSocket server configuration', () => {
  it('uses the same-origin Vite proxy only in development', () => {
    expect(resolveServerEndpoint(undefined, 'http://localhost:5173/', true)).toEqual({
      url: 'ws://localhost:5173/ws',
    });
    expect(resolveServerEndpoint(undefined, page, true)).toEqual({
      url: 'wss://br1-data.github.io/ws',
    });
    expect(resolveServerEndpoint(undefined, page, false)).toEqual({ url: null, reason: 'missing' });
    expect(resolveServerEndpoint('  ', page, false)).toEqual({ url: null, reason: 'missing' });
  });

  it('preserves an explicit secure endpoint including its path', () => {
    expect(resolveServerEndpoint(' wss://game.example.com/ws ', page, false)).toEqual({
      url: 'wss://game.example.com/ws',
    });
  });

  it('rejects mixed content, unsupported schemes, relative URLs and embedded credentials', () => {
    for (const value of [
      'ws://game.example.com/ws',
      'https://game.example.com/ws',
      '/ws',
      'not a url',
      'wss://user:secret@game.example.com/ws',
      'wss://game.example.com/ws#fragment',
    ]) {
      expect(resolveServerEndpoint(value, page, false)).toEqual({ url: null, reason: 'invalid' });
    }
    expect(resolveServerEndpoint('ws://localhost:2567/ws', 'http://localhost:5173/', true)).toEqual({
      url: 'ws://localhost:2567/ws',
    });
  });
});
