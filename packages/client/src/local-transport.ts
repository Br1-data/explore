import {
  ExpeditionSimulation,
  PROTOCOL_VERSION,
  TICK_DT,
  createSimulationActor,
  parseClientMessage,
} from '@segnale/shared';
import type { ServerMessage, SimulationActor } from '@segnale/shared';
import {
  awardLocalRun,
  clearLocalSave,
  loadLocalProfile,
  purchaseLocalPerk,
  readLocalRun,
  writeLocalRun,
} from './profile';

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

/** Pages and online rooms share both the wire protocol and authoritative rules. */
export class LocalTransport implements GameTransport {
  readyState = 0;
  readonly bufferedAmount = 0;
  readonly resumed: boolean;
  private readonly events = new EventTarget();
  private readonly simulation: ExpeditionSimulation;
  private actor: SimulationActor | undefined;
  private readonly runId: string;
  private timer: ReturnType<typeof setInterval> | undefined;
  private paused = false;
  private joined = false;
  private awarded = false;
  private lastSave = 0;
  private lastTickAt = 0;
  private readonly pageHide = () => this.save();

  constructor(options: { resume?: boolean } = {}) {
    const saved = options.resume ? readLocalRun() : null;
    const restored = saved ? ExpeditionSimulation.restore(saved.data) : null;
    if (restored && ['exploring', 'extracting'].includes(restored.simulation.run.phase)) {
      this.simulation = restored.simulation;
      this.actor = restored.actors[0];
      this.runId = saved!.id;
      this.resumed = true;
    } else {
      this.simulation = new ExpeditionSimulation(crypto.getRandomValues(new Uint32Array(1))[0]);
      this.runId = crypto.randomUUID();
      this.resumed = false;
    }
    globalThis.addEventListener?.('pagehide', this.pageHide);
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
    if (!this.awarded && ['won', 'lost'].includes(this.simulation.run.phase)) {
      this.awarded = true;
      this.emit({
        type: 'profile',
        profile: awardLocalRun(this.runId, this.simulation.run.research, this.simulation.run.phase === 'won'),
      });
      clearLocalSave();
    }
    this.emit({
      type: 'snapshot',
      tick: this.simulation.tickNumber,
      elapsed: this.simulation.elapsed,
      players: [this.actor.player],
      depleted: [...this.simulation.depleted.keys()],
      world: this.simulation.worldSnapshot(),
    });
  }
  private save(): void {
    if (!this.actor || !this.joined || this.awarded) return;
    writeLocalRun({
      version: 1,
      id: this.runId,
      savedAt: Date.now(),
      data: this.simulation.serialize([this.actor]),
    });
    this.lastSave = Date.now();
  }
  pause(paused: boolean): void {
    this.paused = paused;
    this.lastTickAt = Date.now();
    if (this.actor) this.actor.input = null;
    if (paused) this.save();
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
      if (this.joined || message.version !== PROTOCOL_VERSION || message.room) {
        this.emit({ type: 'error', message: 'Questa spedizione è solo per un esploratore.' });
        return;
      }
      this.actor ??= createSimulationActor(
        crypto.randomUUID(),
        message.name,
        this.simulation.seed,
        loadLocalProfile().unlocks,
      );
      this.actor.player.name = message.name;
      this.joined = true;
      this.emit({ type: 'profile', profile: loadLocalProfile() });
      this.emit({
        type: 'welcome',
        playerId: this.actor.player.id,
        room: 'SOLO',
        seed: this.simulation.seed,
      });
      if (this.readyState !== 1 || !this.actor) return;
      this.snapshot();
      this.save();
      this.lastTickAt = Date.now();
      this.timer = setInterval(() => {
        if (!this.actor || this.paused) return;
        const now = Date.now();
        const stepMs = TICK_DT * 1000;
        const elapsedMs = Math.max(0, now - this.lastTickAt);
        const steps = Math.min(20, Math.floor(elapsedMs / stepMs));
        if (steps === 0) return;
        this.lastTickAt = now - (elapsedMs % stepMs);
        // In a local session the most recent held input remains valid until the
        // UI replaces it or pauses on blur; no network heartbeat can be lost.
        if (this.actor.input) this.actor.lastInputAt = now;
        for (let step = 0; step < steps; step++) this.simulation.advance([this.actor], now);
        this.snapshot();
        if (Date.now() - this.lastSave >= 5000) this.save();
      }, TICK_DT * 1000);
      return;
    }
    if (!this.actor || !this.joined) return;
    if (message.type === 'unlock') {
      const purchase = purchaseLocalPerk(message.perkId);
      this.emit({ type: 'profile', profile: purchase.profile });
      if (purchase.error) this.emit({ type: 'error', message: purchase.error });
      return;
    }
    if (message.type === 'chat') {
      this.emit({ type: 'chat', playerName: this.actor.player.name, text: message.text });
      return;
    }
    if (this.paused) return;
    const error = this.simulation.handleAction(this.actor, message, Date.now(), [this.actor]);
    if (error) this.emit({ type: 'error', message: error });
  }
  close(code = 1000, reason = ''): void {
    if (this.readyState === 3) return;
    this.save();
    this.readyState = 3;
    clearInterval(this.timer);
    globalThis.removeEventListener?.('pagehide', this.pageHide);
    this.actor = undefined;
    this.events.dispatchEvent(new CloseEvent('close', { code, reason, wasClean: true }));
  }
}
