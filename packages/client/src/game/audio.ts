import type { GameEvent } from '@segnale/shared';

type SoundKind = GameEvent['kind'] | 'ui' | 'alarm';
type Voice = OscillatorNode | AudioBufferSourceNode;

/** Quiet procedural sound effects. Audio is created/resumed only by unlock(). */
export class GameAudio {
  private context: AudioContext | undefined;
  private master: GainNode | undefined;
  private limiter: DynamicsCompressorNode | undefined;
  private noise: AudioBuffer | undefined;
  private muted = false;
  private disposed = false;
  private readonly voices = new Set<Voice>();
  private readonly lastPlayed = new Map<SoundKind, number>();
  private readonly maxVoices = 12;

  /** Call directly from a click/key handler; never from the render loop. */
  unlock(): void {
    if (this.disposed || typeof window === 'undefined') return;
    if (navigator.userActivation && !navigator.userActivation.isActive) return;
    try {
      if (!this.context || this.context.state === 'closed') {
        const Context =
          window.AudioContext ??
          (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Context) return;
        const context = new Context({ latencyHint: 'interactive' });
        const master = context.createGain();
        const limiter = context.createDynamicsCompressor();
        master.gain.value = this.muted ? 0 : 0.18;
        limiter.threshold.value = -18;
        limiter.knee.value = 12;
        limiter.ratio.value = 5;
        limiter.attack.value = 0.003;
        limiter.release.value = 0.15;
        master.connect(limiter);
        limiter.connect(context.destination);
        this.context = context;
        this.master = master;
        this.limiter = limiter;
        const noise = context.createBuffer(1, Math.floor(context.sampleRate * 0.3), context.sampleRate);
        const samples = noise.getChannelData(0);
        for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
        this.noise = noise;
      }
      if (this.context.state !== 'running') void this.context.resume().catch(() => {});
    } catch {
      // Sound is optional on devices with no usable audio output.
    }
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (!this.context || !this.master || this.context.state === 'closed') return;
    const now = this.context.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(muted ? 0 : 0.18, now + 0.025);
  }

  play(kind: SoundKind): void {
    const context = this.context;
    if (this.disposed || this.muted || !context || context.state !== 'running' || !this.master) return;
    const now = context.currentTime;
    const gap = kind === 'alarm' ? 0.8 : kind === 'extract' ? 1 : kind === 'damage' ? 0.15 : 0.06;
    if (now - (this.lastPlayed.get(kind) ?? -Infinity) < gap) return;
    this.lastPlayed.set(kind, now);
    switch (kind) {
      case 'gather':
        this.tone(880, 1320, 0.12, 'sine', 0.35, 0, -0.12);
        this.tone(1760, 1580, 0.16, 'sine', 0.12, 0.035, 0.12);
        break;
      case 'hit':
        this.tone(170, 55, 0.1, 'triangle', 0.55);
        this.noiseBurst(0.06, 0.2, 1800);
        break;
      case 'shot':
        this.tone(1400, 140, 0.16, 'sawtooth', 0.18);
        this.tone(740, 110, 0.1, 'sine', 0.3, 0.015);
        break;
      case 'craft':
        this.tone(440, 440, 0.12, 'triangle', 0.28);
        this.tone(660, 660, 0.16, 'triangle', 0.24, 0.07);
        this.tone(880, 1100, 0.2, 'sine', 0.2, 0.14);
        break;
      case 'build':
        this.noiseBurst(0.12, 0.2, 1000);
        this.tone(100, 60, 0.16, 'triangle', 0.5);
        this.tone(400, 600, 0.18, 'sine', 0.18, 0.1);
        break;
      case 'damage':
        this.tone(130, 55, 0.16, 'sawtooth', 0.22);
        this.noiseBurst(0.12, 0.22, 650);
        break;
      case 'revive':
        this.tone(330, 660, 0.35, 'sine', 0.28);
        this.tone(495, 990, 0.4, 'sine', 0.18, 0.12, 0.12);
        break;
      case 'extract':
        for (const [index, frequency] of [392, 494, 587, 784].entries()) {
          this.tone(frequency, frequency, index === 3 ? 0.7 : 0.3, 'triangle', 0.22, index * 0.16);
          this.tone(frequency * 2, frequency * 2, 0.3, 'sine', 0.08, index * 0.16, 0.12);
        }
        break;
      case 'death':
        this.tone(220, 65, 0.6, 'triangle', 0.35);
        this.tone(165, 49, 0.7, 'sine', 0.2, 0.08);
        break;
      case 'alarm':
        this.tone(370, 320, 0.2, 'sine', 0.22);
        this.tone(370, 320, 0.2, 'sine', 0.22, 0.3);
        break;
      case 'ui':
        this.tone(640, 820, 0.055, 'sine', 0.15);
        break;
    }
  }

  private reserve(source: Voice): void {
    if (this.voices.size >= this.maxVoices) {
      const oldest = this.voices.values().next().value;
      if (oldest) {
        this.voices.delete(oldest);
        try {
          oldest.stop();
        } catch {
          /* It may already have ended. */
        }
      }
    }
    this.voices.add(source);
  }

  private tone(
    startHz: number,
    endHz: number,
    duration: number,
    type: OscillatorType,
    level: number,
    delay = 0,
    pan = 0,
  ): void {
    const context = this.context;
    if (!context || !this.master || context.state !== 'running') return;
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    const panner = context.createStereoPanner();
    const start = context.currentTime + delay;
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(startHz, start);
    oscillator.frequency.exponentialRampToValueAtTime(endHz, start + duration);
    envelope.gain.setValueAtTime(0, start);
    envelope.gain.linearRampToValueAtTime(level, start + 0.008);
    envelope.gain.exponentialRampToValueAtTime(0.001, start + duration);
    panner.pan.value = pan;
    oscillator.connect(envelope);
    envelope.connect(panner);
    panner.connect(this.master);
    this.reserve(oscillator);
    oscillator.onended = () => {
      this.voices.delete(oscillator);
      oscillator.disconnect();
      envelope.disconnect();
      panner.disconnect();
    };
    oscillator.start(start);
    oscillator.stop(start + duration + 0.01);
  }

  private noiseBurst(duration: number, level: number, cutoff: number): void {
    const context = this.context;
    if (!context || !this.master || !this.noise || context.state !== 'running') return;
    const source = context.createBufferSource();
    const envelope = context.createGain();
    const filter = context.createBiquadFilter();
    const start = context.currentTime;
    source.buffer = this.noise;
    filter.type = 'lowpass';
    filter.frequency.value = cutoff;
    envelope.gain.setValueAtTime(level, start);
    envelope.gain.exponentialRampToValueAtTime(0.001, start + duration);
    source.connect(filter);
    filter.connect(envelope);
    envelope.connect(this.master);
    this.reserve(source);
    source.onended = () => {
      this.voices.delete(source);
      source.disconnect();
      filter.disconnect();
      envelope.disconnect();
    };
    source.start(start);
    source.stop(start + duration);
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    for (const voice of this.voices) {
      try {
        voice.stop();
      } catch {
        /* Already stopped sources need no work. */
      }
      voice.disconnect();
    }
    this.voices.clear();
    this.master?.disconnect();
    this.limiter?.disconnect();
    this.noise = undefined;
    if (this.context && this.context.state !== 'closed') void this.context.close().catch(() => {});
    this.context = undefined;
    this.master = undefined;
    this.limiter = undefined;
  }
}
