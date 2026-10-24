import {
  ExpeditionSimulation,
  PROTOCOL_VERSION,
  TICK_DT,
  createSimulationActor,
  parseClientMessage,
} from '@segnale/shared';
import type { ServerMessage, SimulationActor } from '@segnale/shared';

/** Both transports deliver the existing protocol, so the renderer uses one gameplay path. */
export interface GameTransport {
  readonly readyState: number;
  readonly bufferedAmount: number;
  send(data: string): void;
  close(code?: number, reason?: string): void;
  addEventListener<K extends keyof WebSocketEventMap>(
    type: K,
    listener: (event: WebSocketEventMap[K]) => void,
  ): void;
}

/** A single-player session running the same fixed-step simulation as the online server. */
export class LocalTransport implements GameTransport {
  readyState = 0;
  readonly bufferedAmount = 0;
  private readonly events = new EventTarget();
  private readonly simulation: ExpeditionSimulation;
  private actor: SimulationActor | undefined;
  private timer: ReturnType<typeof setInterval> | undefined;

  constructor() {
    this.simulation = new ExpeditionSimulation(crypto.getRandomValues(new Uint32Array(1))[0]);
    queueMicrotask(() => {
      if (this.readyState !== 0) return;
      this.readyState = 1;
      this.events.dispatchEvent(new Event('open'));
    });
  }

  addEventListener<K extends keyof WebSocketEventMap>(
    type: K,
    listener: (event: WebSocketEventMap[K]) => void,
  ): void {
    this.events.addEventListener(type, listener as EventListener);
  }

  private emit(message: ServerMessage): void {
    if (this.readyState === 1)
      this.events.dispatchEvent(new MessageEvent('message', { data: JSON.stringify(message) }));
  }

  private snapshot(): void {
    if (!this.actor) return;
    this.emit({
      type: 'snapshot',
      tick: this.simulation.tickNumber,
      elapsed: this.simulation.elapsed,
      players: [this.actor.player],
      depleted: [...this.simulation.depleted.keys()],
    });
  }

  send(data: string): void {
    if (this.readyState !== 1) return;
    let parsed: unknown;
    try {
      parsed = JSON.parse(data);
    } catch {
      return;
    }
    const message = parseClientMessage(parsed);
    if (!message) return;
    if (message.type === 'join') {
      if (this.actor || message.version !== PROTOCOL_VERSION || message.room) {
        this.emit({ type: 'error', message: 'Questa spedizione è solo per un esploratore.' });
        return;
      }
      this.actor = createSimulationActor(crypto.randomUUID(), message.name, this.simulation.seed);
      this.emit({
        type: 'welcome',
        playerId: this.actor.player.id,
        room: 'SOLO',
        seed: this.simulation.seed,
      });
      if (this.readyState !== 1 || !this.actor) return;
      this.snapshot();
      this.timer = setInterval(() => {
        if (!this.actor) return;
        this.simulation.advance([this.actor]);
        this.snapshot();
      }, TICK_DT * 1000);
      return;
    }
    if (!this.actor) return;
    let error: string | null = null;
    switch (message.type) {
      case 'input':
        this.simulation.input(this.actor, message.input);
        break;
      case 'gather':
        error = this.simulation.gather(this.actor, message.nodeId);
        break;
      case 'craft':
        error = this.simulation.craft(this.actor);
        break;
      case 'consume':
        error = this.simulation.consume(this.actor, message.itemId);
        break;
    }
    if (error) this.emit({ type: 'error', message: error });
  }

  close(code = 1000, reason = ''): void {
    if (this.readyState === 3) return;
    this.readyState = 3;
    clearInterval(this.timer);
    this.actor = undefined;
    this.events.dispatchEvent(new CloseEvent('close', { code, reason, wasClean: true }));
  }
}
