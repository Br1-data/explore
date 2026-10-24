export type ServerEndpoint = { url: string; reason?: never } | { url: null; reason: 'missing' | 'invalid' };

/** Production needs an explicit backend; static hosts cannot serve WebSocket rooms. */
export function resolveServerEndpoint(
  configured: string | undefined,
  pageUrl: string,
  development: boolean,
): ServerEndpoint {
  const value = configured?.trim();
  if (!value) {
    if (!development) return { url: null, reason: 'missing' };
    const url = new URL('/ws', pageUrl);
    url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
    return { url: url.href };
  }
  try {
    const url = new URL(value);
    if (
      !['ws:', 'wss:'].includes(url.protocol) ||
      !url.hostname ||
      url.username ||
      url.password ||
      url.hash ||
      (new URL(pageUrl).protocol === 'https:' && url.protocol !== 'wss:')
    ) {
      return { url: null, reason: 'invalid' };
    }
    return { url: url.href };
  } catch {
    return { url: null, reason: 'invalid' };
  }
}
