/**
 * Suono generato al momento con Web Audio: un ambiente sommesso per ogni
 * scena e pochi segnali discreti. Nessun file audio.
 */
export class Suono {
  private ac: AudioContext | null = null;
  private uscita: GainNode | null = null;
  private letto: { guadagno: GainNode; nodi: AudioScheduledSourceNode[] } | null = null;
  private rumore: AudioBuffer | null = null;
  private ambienteCorrente = '';
  private _muto = false;

  constructor(muto: boolean) {
    this._muto = muto;
  }

  get muto(): boolean {
    return this._muto;
  }

  set muto(v: boolean) {
    this._muto = v;
    if (this.uscita && this.ac) this.uscita.gain.setTargetAtTime(v ? 0 : 0.9, this.ac.currentTime, 0.08);
  }

  /** Da chiamare dopo un gesto di chi gioca: i browser non avviano l’audio prima. */
  sblocca(): void {
    if (this.ac) {
      if (this.ac.state === 'suspended') void this.ac.resume();
      return;
    }
    const Classe = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Classe) return;
    try {
      this.ac = new Classe();
    } catch {
      return;
    }
    this.uscita = this.ac.createGain();
    this.uscita.gain.value = this._muto ? 0 : 0.9;
    this.uscita.connect(this.ac.destination);
    const n = this.ac.sampleRate * 2;
    this.rumore = this.ac.createBuffer(1, n, this.ac.sampleRate);
    const dati = this.rumore.getChannelData(0);
    let ultimo = 0;
    for (let i = 0; i < n; i++) {
      // Rumore «marrone»: più morbido di quello bianco.
      const bianco = Math.random() * 2 - 1;
      ultimo = (ultimo + 0.02 * bianco) / 1.02;
      dati[i] = ultimo * 3.5;
    }
    if (this.ambienteCorrente) {
      const a = this.ambienteCorrente;
      this.ambienteCorrente = '';
      this.ambiente(a);
    }
  }

  sospendi(v: boolean): void {
    if (!this.ac) return;
    if (v && this.ac.state === 'running') void this.ac.suspend();
    if (!v && this.ac.state === 'suspended') void this.ac.resume();
  }

  ambiente(tipo: string): void {
    if (tipo === this.ambienteCorrente) return;
    this.ambienteCorrente = tipo;
    const ac = this.ac;
    if (!ac || !this.uscita || !this.rumore) return;
    const ora = ac.currentTime;
    if (this.letto) {
      const vecchio = this.letto;
      vecchio.guadagno.gain.setTargetAtTime(0, ora, 0.5);
      setTimeout(() => {
        for (const n of vecchio.nodi) {
          try {
            n.stop();
          } catch {
            /* già fermo */
          }
        }
        vecchio.guadagno.disconnect();
      }, 2500);
      this.letto = null;
    }
    if (!tipo) return;
    const guadagno = ac.createGain();
    guadagno.gain.value = 0;
    guadagno.connect(this.uscita);
    const nodi: AudioScheduledSourceNode[] = [];

    const soffio = (freq: number, q: number, livello: number, ondulazione: number): void => {
      const src = ac.createBufferSource();
      src.buffer = this.rumore;
      src.loop = true;
      const filtro = ac.createBiquadFilter();
      filtro.type = 'bandpass';
      filtro.frequency.value = freq;
      filtro.Q.value = q;
      const g = ac.createGain();
      g.gain.value = livello;
      const lfo = ac.createOscillator();
      lfo.frequency.value = ondulazione;
      const profondita = ac.createGain();
      profondita.gain.value = livello * 0.55;
      lfo.connect(profondita).connect(g.gain);
      src.connect(filtro).connect(g).connect(guadagno);
      src.start();
      lfo.start();
      nodi.push(src, lfo);
    };
    const nota = (freq: number, livello: number, tremolo: number): void => {
      const o = ac.createOscillator();
      o.type = 'sine';
      o.frequency.value = freq;
      const g = ac.createGain();
      g.gain.value = livello;
      const lfo = ac.createOscillator();
      lfo.frequency.value = tremolo;
      const profondita = ac.createGain();
      profondita.gain.value = livello * 0.5;
      lfo.connect(profondita).connect(g.gain);
      o.connect(g).connect(guadagno);
      o.start();
      lfo.start();
      nodi.push(o, lfo);
    };

    switch (tipo) {
      case 'folla':
        soffio(520, 0.9, 0.5, 0.31);
        soffio(1100, 1.4, 0.2, 0.83);
        nota(73.4, 0.05, 0.11);
        break;
      case 'notte':
        soffio(260, 0.7, 0.42, 0.13);
        nota(55, 0.085, 0.07);
        nota(82.4, 0.045, 0.09);
        break;
      case 'pioggia':
        soffio(2600, 0.3, 0.55, 0.07);
        soffio(760, 0.5, 0.22, 0.12);
        nota(49, 0.05, 0.05);
        break;
      case 'quiete':
        soffio(700, 0.5, 0.12, 0.09);
        nota(196, 0.035, 0.11);
        nota(246.9, 0.028, 0.08);
        nota(293.7, 0.024, 0.13);
        break;
      default:
        soffio(420, 0.6, 0.38, 0.17);
        soffio(900, 0.8, 0.12, 0.29);
    }
    guadagno.gain.setTargetAtTime(0.5, ora, 1.2);
    this.letto = { guadagno, nodi };
  }

  private tono(freq: number, durata: number, livello: number, tipo: OscillatorType = 'sine', ritardo = 0): void {
    const ac = this.ac;
    if (!ac || !this.uscita) return;
    const t = ac.currentTime + ritardo;
    const o = ac.createOscillator();
    o.type = tipo;
    o.frequency.value = freq;
    const g = ac.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(livello, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0008, t + durata);
    o.connect(g).connect(this.uscita);
    o.start(t);
    o.stop(t + durata + 0.05);
  }

  passo(): void {
    const ac = this.ac;
    if (!ac || !this.uscita || !this.rumore) return;
    const src = ac.createBufferSource();
    src.buffer = this.rumore;
    const filtro = ac.createBiquadFilter();
    filtro.type = 'lowpass';
    filtro.frequency.value = 520 + Math.random() * 240;
    const g = ac.createGain();
    const t = ac.currentTime;
    g.gain.setValueAtTime(0.32, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
    src.connect(filtro).connect(g).connect(this.uscita);
    src.start(t, Math.random());
    src.stop(t + 0.1);
  }

  scoperta(): void {
    this.tono(659.3, 0.5, 0.07);
    this.tono(880, 0.7, 0.06, 'sine', 0.11);
  }

  giusto(): void {
    this.tono(783.99, 0.28, 0.06);
  }

  sbagliato(): void {
    this.tono(155.6, 0.22, 0.08, 'triangle');
  }

  pagina(): void {
    this.tono(392, 0.16, 0.025);
  }
}
