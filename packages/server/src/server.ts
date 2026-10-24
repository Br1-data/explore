import { randomInt } from 'node:crypto';
import { createServer } from 'node:http';
import { PROTOCOL_VERSION, TICK_RATE, parseClientMessage } from '@segnale/shared';
import { WebSocketServer, type WebSocket } from 'ws';
import { GameRoom, send, type RoomPlayer } from './game';

const ROOM_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const MAX_CONNECTIONS = 128;

export function createGameServer() {
  const rooms = new Map<string, GameRoom>();
  const server = createServer((req, res) => {
    if (req.url !== '/' && req.url !== '/health') {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ ok: true, protocol: PROTOCOL_VERSION }));
  });
  const wss = new WebSocketServer({ noServer: true, maxPayload: 2048 });
  const alive = new Set<WebSocket>();
  server.on('upgrade', (req, socket, head) => {
    if (req.url !== '/ws' || wss.clients.size >= MAX_CONNECTIONS) {
      socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
      return;
    }
    wss.handleUpgrade(req, socket, head, (connection) => wss.emit('connection', connection, req));
  });
  wss.on('connection', (socket) => {
    alive.add(socket);
    socket.on('pong', () => alive.add(socket));
    let room: GameRoom | undefined;
    let member: RoomPlayer | undefined;
    let token: string | undefined;
    let windowStart = Date.now();
    let messageCount = 0;
    const joinTimeout = setTimeout(() => socket.close(4000, 'Accesso scaduto'), 10_000);
    socket.on('error', () => {});
    socket.on('close', () => {
      alive.delete(socket);
      clearTimeout(joinTimeout);
      if (room && token) room.disconnect(token, socket);
    });
    socket.on('message', (data, isBinary) => {
      const now = Date.now();
      if (now - windowStart >= 1000) {
        windowStart = now;
        messageCount = 0;
      }
      if (++messageCount > 80 || isBinary) {
        socket.close(4000, 'Troppi messaggi o formato non supportato');
        return;
      }
      let parsed: unknown;
      try {
        parsed = JSON.parse(data.toString());
      } catch {
        send(socket, { type: 'error', message: 'Messaggio non valido.' });
        return;
      }
      const message = parseClientMessage(parsed);
      if (!message) {
        send(socket, { type: 'error', message: 'Messaggio non valido.' });
        return;
      }
      if (message.type === 'join') {
        if (member) {
          send(socket, { type: 'error', message: 'Hai già effettuato l’accesso.' });
          return;
        }
        if (message.version !== PROTOCOL_VERSION) {
          send(socket, { type: 'error', message: 'Versione incompatibile. Aggiorna la pagina.' });
          return;
        }
        if (message.room) {
          room = rooms.get(message.room.toUpperCase());
          if (!room) {
            send(socket, { type: 'error', message: 'Stanza non trovata. Controlla il codice.' });
            return;
          }
        } else {
          if (rooms.size >= 100) {
            send(socket, { type: 'error', message: 'Server pieno. Riprova tra poco.' });
            return;
          }
          let code: string;
          do {
            code = Array.from({ length: 4 }, () => ROOM_ALPHABET[randomInt(ROOM_ALPHABET.length)]).join('');
          } while (rooms.has(code));
          room = new GameRoom(code);
          rooms.set(code, room);
        }
        const joined = room.connect(message.token, message.name, socket);
        if (!joined) {
          send(socket, { type: 'error', message: 'Stanza piena: massimo 4 astronauti.' });
          room = undefined;
          return;
        }
        token = message.token;
        member = joined;
        clearTimeout(joinTimeout);
        send(socket, { type: 'welcome', playerId: member.player.id, room: room.code, seed: room.seed });
        room.broadcast();
        return;
      }
      if (!room || !member) {
        send(socket, { type: 'error', message: 'Entra in una stanza prima di giocare.' });
        return;
      }
      if (member.socket !== socket) return;
      let error: string | null = null;
      switch (message.type) {
        case 'input':
          room.input(member, message.input, now);
          break;
        case 'gather':
          error = room.gather(member, message.nodeId, now);
          break;
        case 'craft':
          error = room.craft(member, now);
          break;
        case 'consume':
          error = room.consume(member, message.itemId, now);
          break;
      }
      if (error) send(socket, { type: 'error', message: error });
    });
  });
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [code, room] of rooms) {
      room.tick(now);
      if (!room.players.size) rooms.delete(code);
      else room.broadcast();
    }
  }, 1000 / TICK_RATE);
  timer.unref();
  // Broken TCP connections must enter the same reconnect grace as explicit closes.
  const heartbeat = setInterval(() => {
    for (const socket of wss.clients) {
      if (!alive.has(socket)) socket.terminate();
      else {
        alive.delete(socket);
        socket.ping();
      }
    }
  }, 20_000);
  heartbeat.unref();

  async function close(): Promise<void> {
    clearInterval(timer);
    clearInterval(heartbeat);
    for (const socket of wss.clients) socket.terminate();
    await new Promise<void>((resolve, reject) => {
      wss.close((wsError) => {
        if (wsError) reject(wsError);
        else resolve();
      });
    });
    await new Promise<void>((resolve, reject) => {
      server.close((httpError) => {
        if (httpError) reject(httpError);
        else resolve();
      });
    });
  }
  return { server, wss, rooms, close };
}
