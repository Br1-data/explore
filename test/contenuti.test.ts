import { describe, expect, it } from 'vitest';
import { CAPITOLI, dettagliDelRuolo, passiDelRuolo, sensazioniDelRuolo } from '../src/content';
import { MESSAGGIO, MESSAGGIO_INTERO, VITE } from '../src/content/capitoli/enoc/base';
import { NASTRO } from '../src/content/capitoli/enoc/enoc';
import { PARTI, TOTALE_CAPITOLI, URL_LIBRO } from '../src/content/libro';
import type { Attivita, Fonte, Passo, Ruolo } from '../src/content/tipi';
import { ARTI } from '../src/motore/arte';
import { STILI } from '../src/motore/figure';
import { TIPI_OGGETTO } from '../src/motore/oggetti';
import { SUONI_OGGETTI } from '../src/motore/suono';
import { AMBIENTI } from '../src/motore/tavolozze';
import { ID_SCHEMI } from '../src/ui/schemi';

const attivitaDel = (ruolo: Ruolo): Attivita[] => passiDelRuolo(ruolo).flatMap((p) => (p.t === 'attivita' ? [p.a] : []));

const capitoli = Object.values(CAPITOLI);

describe('indice del libro', () => {
  it('elenca i 54 capitoli in tre parti, numerati di seguito', () => {
    expect(PARTI.map((p) => p.capitoli.length)).toEqual([21, 19, 14]);
    expect(TOTALE_CAPITOLI).toBe(54);
    expect(PARTI.flatMap((p) => p.capitoli.map((c) => c.numero))).toEqual(Array.from({ length: 54 }, (_, i) => i + 1));
  });

  it('collega ogni capitolo al testo del libro su jw.org', () => {
    for (const c of PARTI.flatMap((p) => p.capitoli)) {
      expect(c.url.startsWith(URL_LIBRO), `${c.numero} ${c.nome}`).toBe(true);
      expect(c.nome.length).toBeGreaterThan(1);
      expect(c.titolo.length).toBeGreaterThan(3);
    }
  });
});

describe('suoni', () => {
  it('fa suonare solo oggetti che esistono nel motore', () => {
    for (const tipo of Object.keys(SUONI_OGGETTI)) expect(TIPI_OGGETTO, tipo).toContain(tipo);
  });

  it('dà a ogni scena un luogo sonoro coerente con la luce', () => {
    for (const cap of capitoli) {
      for (const scena of cap.ruoli.flatMap((r) => r.scene)) {
        // Di notte non c’è il brusio di un luogo abitato né la quiete dell’alba: c’è la notte.
        if (scena.ambiente === 'notte') expect(scena.suono, scena.id).toBe('notte');
        if (scena.suono === 'notte') expect(scena.ambiente, scena.id).toBe('notte');
      }
    }
  });
});

describe.each(capitoli)('capitolo $numero · $nome', (cap) => {
  const fontiValide = (fonti: Fonte[] | undefined, dove: string): void => {
    expect(fonti?.length, `${dove}: senza fonte`).toBeGreaterThan(0);
    for (const f of fonti ?? []) {
      expect(f.rif.length, dove).toBeGreaterThan(3);
      expect(f.url, `${dove}: ${f.rif}`).toMatch(/^https:\/\/www\.jw\.org\/it\//);
    }
  };

  it('dà una fonte a ogni dettaglio', () => {
    for (const d of Object.values(cap.dettagli)) {
      fontiValide(d.fonti, d.id);
      expect(['scritto', 'numeri', 'libro', 'sembra']).toContain(d.certezza);
      expect(d.testo.length, d.id).toBeGreaterThan(20);
    }
  });

  it('segnala come «sembra» ciò che il testo stesso presenta con cautela', () => {
    const cautela = /(sembra|forse|probabil|è possibile|potrebbe|a quanto pare|evidentemente|deve aver|supporre)/i;
    for (const d of Object.values(cap.dettagli)) {
      if (d.certezza === 'sembra') expect(d.testo, d.id).toMatch(cautela);
    }
  });

  it('dà una fonte a ogni affermazione del racconto', () => {
    for (const ruolo of cap.ruoli) {
      for (const p of passiDelRuolo(ruolo)) {
        if (p.t === 'narra' && p.certezza) fontiValide(p.fonti, `${ruolo.id}: «${p.testo.slice(0, 40)}»`);
      }
    }
  });

  it('non lascia dettagli o sensazioni irraggiungibili', () => {
    const dettagli = new Set(cap.ruoli.flatMap(dettagliDelRuolo));
    const sensazioni = new Set(cap.ruoli.flatMap(sensazioniDelRuolo));
    expect(Object.keys(cap.dettagli).filter((id) => !dettagli.has(id))).toEqual([]);
    expect(Object.keys(cap.sensazioni).filter((id) => !sensazioni.has(id))).toEqual([]);
  });

  it('dà a ogni personaggio i suoi dettagli, senza ripeterli negli altri punti di vista', () => {
    const dove = new Map<string, string[]>();
    for (const ruolo of cap.ruoli) {
      for (const id of dettagliDelRuolo(ruolo)) dove.set(id, [...(dove.get(id) ?? []), ruolo.id]);
      for (const id of sensazioniDelRuolo(ruolo)) dove.set(`senti:${id}`, [...(dove.get(`senti:${id}`) ?? []), ruolo.id]);
    }
    const ripetuti = [...dove].filter(([, ruoli]) => ruoli.length > 1).map(([id, ruoli]) => `${id}: ${ruoli.join(', ')}`);
    expect(ripetuti).toEqual([]);
    // Anche dentro lo stesso punto di vista, un dettaglio compare una volta sola.
    for (const ruolo of cap.ruoli) {
      const tutti = passiDelRuolo(ruolo).flatMap((p) => (p.t === 'dettaglio' ? [p.id] : []));
      expect(tutti.length, ruolo.id).toBe(new Set(tutti).size);
    }
  });

  it('non ripete le attività tra un punto di vista e l’altro', () => {
    const ids = cap.ruoli.flatMap((r) => attivitaDel(r).map((a) => a.id));
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
  });

  it('tratta «camminare con Dio» come condotta, non come percorso', () => {
    // «cammino», «a piedi»: il linguaggio di un percorso fisico (prima versione del gioco).
    const letterale = /\bcammino\b|a piedi|strada degli anni/i;
    for (const ruolo of cap.ruoli) {
      const testi = [ruolo.titolo, ruolo.descrizione, ruolo.fedelta, ...ruolo.scene.flatMap((s) => [s.titolo, s.luogo])];
      for (const p of passiDelRuolo(ruolo)) if (p.t === 'narra' || p.t === 'senti') testi.push(p.t === 'narra' ? p.testo : cap.sensazioni[p.id].domanda);
      for (const t of testi) expect(t, ruolo.id).not.toMatch(letterale);
    }
  });

  it('dichiara le ricostruzioni e dice su che cosa si basano', () => {
    for (const ruolo of cap.ruoli) {
      for (const p of passiDelRuolo(ruolo)) {
        if (p.t === 'narra' && p.ricostruzione) fontiValide(p.fonti, `${ruolo.id}: «${p.testo.slice(0, 40)}»`);
      }
      for (const a of attivitaDel(ruolo)) if (a.tipo === 'condotta') fontiValide(a.base, `${ruolo.id}/${a.id}`);
    }
  });

  it('cita i versetti alla lettera', () => {
    for (const ruolo of cap.ruoli) {
      for (const p of passiDelRuolo(ruolo)) {
        if (p.t !== 'verso') continue;
        const v = cap.versi[p.id];
        expect(v, `${ruolo.id}: verso ${p.id}`).toBeDefined();
        for (const e of p.evidenzia ?? []) expect(v.testo, `${p.id}: «${e}»`).toContain(e);
      }
    }
    for (const id of cap.passiDaLeggere) expect(cap.versi[id], id).toBeDefined();
    for (const v of Object.values(cap.versi)) expect(v.url).toMatch(/^https:\/\/www\.jw\.org\/it\/biblioteca-digitale\/bibbia\//);
    // Ogni versetto riportato si legge da qualche parte.
    const usati = new Set(cap.passiDaLeggere);
    for (const p of cap.ruoli.flatMap(passiDelRuolo)) {
      if (p.t === 'verso') usati.add(p.id);
      if (p.t === 'attivita' && p.a.tipo === 'completa') usati.add(p.a.verso);
    }
    expect(Object.keys(cap.versi).filter((id) => !usati.has(id))).toEqual([]);
  });

  it('fa pronunciare soltanto parole del testo biblico, alla lettera', () => {
    const versi = Object.values(cap.versi).map((v) => v.testo);
    for (const p of cap.ruoli.flatMap(passiDelRuolo)) {
      if (p.t !== 'fx' || p.fx.k !== 'nastro') continue;
      const parole = p.fx.testo.replace(/^…|…$/g, '').replace(/\.$/, '');
      expect(versi.some((v) => v.includes(parole)), `«${p.fx.testo}»`).toBe(true);
    }
  });

  describe.each(cap.ruoli)('punto di vista: $nome', (ruolo) => {
    it('rimanda solo a contenuti che esistono', () => {
      const controlla = (p: Passo, dove: string): void => {
        if (p.t === 'dettaglio') expect(cap.dettagli[p.id], `${dove}: dettaglio ${p.id}`).toBeDefined();
        if (p.t === 'senti') expect(cap.sensazioni[p.id], `${dove}: sensazione ${p.id}`).toBeDefined();
        if (p.t === 'schema') expect(ID_SCHEMI, dove).toContain(p.id);
        if (p.t === 'narra' && p.arte) expect(ARTI, dove).toContain(p.arte);
      };
      passiDelRuolo(ruolo).forEach((p) => controlla(p, ruolo.id));
      if (ruolo.modo === 'cammina') expect(STILI[ruolo.stile], ruolo.stile).toBeDefined();
    });

    it('ha scene percorribili fino in fondo', () => {
      expect(ruolo.scene.length).toBeGreaterThan(0);
      for (const scena of ruolo.scene) {
        expect(AMBIENTI, scena.id).toContain(scena.ambiente);
        if (scena.ambiente2) expect(AMBIENTI, scena.id).toContain(scena.ambiente2);
        for (const o of scena.oggetti) expect(TIPI_OGGETTO, `${scena.id}: ${o.tipo}`).toContain(o.tipo);
        const ids = scena.punti.map((p) => p.id);
        expect(new Set(ids).size, `${scena.id}: punti duplicati`).toBe(ids.length);
        expect(scena.punti.some((p) => !p.facoltativo), `${scena.id}: nessun punto obbligatorio`).toBe(true);
        for (const p of scena.punti) {
          expect(p.x, `${scena.id}/${p.id}`).toBeGreaterThanOrEqual(60);
          expect(p.x, `${scena.id}/${p.id}`).toBeLessThanOrEqual(scena.larghezza - 60);
          expect(p.passi.length, `${scena.id}/${p.id}`).toBeGreaterThan(0);
          for (const r of p.richiede ?? []) expect(ids, `${scena.id}/${p.id} richiede ${r}`).toContain(r);
        }
        // Seguendo i prerequisiti, tutti i punti devono poter essere completati.
        const fatti = new Set<string>();
        for (let giro = 0; giro < ids.length; giro++) {
          for (const p of scena.punti) if ((p.richiede ?? []).every((r) => fatti.has(r))) fatti.add(p.id);
        }
        expect(ids.filter((id) => !fatti.has(id)), `${scena.id}: punti bloccati`).toEqual([]);
        // Un punto obbligatorio non può dipendere da uno facoltativo.
        const facoltativi = new Set(scena.punti.filter((p) => p.facoltativo).map((p) => p.id));
        for (const p of scena.punti.filter((x) => !x.facoltativo)) {
          for (const r of p.richiede ?? []) expect(facoltativi.has(r), `${scena.id}/${p.id}`).toBe(false);
        }
      }
    });

    it('usa nelle sequenze solo personaggi presenti in scena', () => {
      for (const scena of ruolo.scene) {
        const presenti = new Set(['giocatore', ...(scena.attori ?? []).map((a) => a.id)]);
        const passi = [...(scena.ingresso ?? []), ...scena.punti.flatMap((p) => p.passi), ...(scena.uscita ?? [])];
        for (const p of passi) {
          if (p.t !== 'fx') continue;
          if ('chi' in p.fx) {
            expect(presenti.has(p.fx.chi), `${scena.id}: ${p.fx.chi}`).toBe(true);
            if (ruolo.modo === 'osserva') expect(p.fx.chi, `${scena.id}: chi osserva non ha un corpo`).not.toBe('giocatore');
          }
          if (p.fx.k === 'var' && p.fx.nome !== 'dissolvi') expect(scena.vars, `${scena.id}: ${p.fx.nome}`).toHaveProperty(p.fx.nome);
        }
        for (const f of scena.folle ?? []) {
          if (f.bersaglio) expect(presenti.has(f.bersaglio), `${scena.id}: bersaglio ${f.bersaglio}`).toBe(true);
          if (f.seVar) expect(scena.vars, `${scena.id}: ${f.seVar}`).toHaveProperty(f.seVar);
        }
        for (const o of scena.oggetti) if (o.seVar) expect(scena.vars, `${scena.id}: ${o.seVar}`).toHaveProperty(o.seVar);
      }
    });

    it('propone attività risolvibili e fondate', () => {
      for (const a of attivitaDel(ruolo)) {
        const rivela = (id: string | undefined): void => {
          if (id) expect(cap.dettagli[id], `${a.id}: dettaglio ${id}`).toBeDefined();
        };
        switch (a.tipo) {
          case 'trova':
            expect(a.testo.match(/\[\[.+?\]\]/g)?.length ?? 0, a.id).toBeGreaterThan(0);
            break;
          case 'componi':
            expect(a.pezzi.length, a.id).toBeGreaterThan(2);
            break;
          case 'ordina':
            expect(a.voci.length, a.id).toBeGreaterThan(2);
            for (const d of a.distrattori ?? []) expect(a.voci.map((v) => v.testo), a.id).not.toContain(d);
            break;
          case 'domanda':
            expect(a.corretta, a.id).toBeLessThan(a.opzioni.length);
            // O rivela un dettaglio (con le sue fonti) o spiega con le sue fonti.
            if (a.dettaglio) rivela(a.dettaglio);
            else fontiValide(a.fonti, a.id);
            break;
          case 'condotta': {
            const fedeli = a.opzioni.filter((o) => o.fedele);
            expect(fedeli.length, `${a.id}: una sola condotta fedele`).toBe(1);
            expect(fedeli[0].dettaglio, a.id).toBeDefined();
            rivela(fedeli[0].dettaglio);
            expect(a.opzioni.length, a.id).toBeGreaterThan(1);
            for (const o of a.opzioni.filter((x) => !x.fedele)) {
              expect(o.esito?.length ?? 0, `${a.id}: «${o.testo}»`).toBeGreaterThan(20);
              fontiValide(o.fonti, `${a.id}: «${o.testo}»`);
            }
            break;
          }
          case 'completa': {
            const v = cap.versi[a.verso];
            expect(v, a.id).toBeDefined();
            // Tolte le parentesi, il testo è il versetto alla lettera.
            expect(a.testo.replace(/\[\[|\]\]/g, ''), a.id).toBe(v.testo);
            const attese = [...a.testo.matchAll(/\[\[(.+?)\]\]/g)].map((m) => m[1]);
            expect(attese.length, a.id).toBeGreaterThan(1);
            for (const d of a.distrattori) expect(attese, a.id).not.toContain(d);
            break;
          }
          case 'classifica':
            expect(a.voci.length, a.id).toBeGreaterThan(3);
            expect(new Set(a.voci.map((v) => v.cat)).size, `${a.id}: entrambe le categorie`).toBe(2);
            for (const v of a.voci) fontiValide(v.fonti, `${a.id}: «${v.testo}»`);
            rivela(a.dettaglio);
            break;
          case 'linea': {
            // La meta è una nascita o una morte di chi compare sulla linea.
            const eventi = a.persone.flatMap((p) => [p.nasce, p.muore]);
            expect(eventi, a.id).toContain(a.meta);
            for (const p of a.persone) expect(VITE, `${a.id}: ${p.nome}`).toContainEqual(p);
            fontiValide(a.fonti, a.id);
            rivela(a.dettaglio);
            break;
          }
        }
      }
    });
  });
});

describe('Enoc: fedeltà al testo', () => {
  const cap = CAPITOLI[1];
  const giuda = cap.versi['giuda-14'].testo;

  it('riporta il messaggio di Enoc parola per parola (Giuda 14, 15)', () => {
    expect(MESSAGGIO.join(' ')).toBe(MESSAGGIO_INTERO);
    expect(giuda).toContain(MESSAGGIO_INTERO.replace(/\.$/, ''));
    const proclamato = NASTRO.map((n) => n.replace(/^…|…$/g, '')).join(' ');
    expect(proclamato).toBe(MESSAGGIO_INTERO);
  });

  it('fa trovare le quattro ricorrenze dell’empietà e le due di «continuò a camminare»', () => {
    const attivita = cap.ruoli.flatMap(attivitaDel).flatMap((a) => (a.tipo === 'trova' ? [a] : []));
    const quattro = attivita.find((a) => a.id === 'quattro-volte');
    expect(quattro?.testo.match(/\[\[(.+?)\]\]/g)).toEqual(['[[empi]]', '[[empie]]', '[[empiamente]]', '[[empi]]']);
    expect(giuda).toContain(quattro?.testo.replace(/\[\[|\]\]/g, '').replace(/^…/, '').replace(/\.$/, ''));
    const due = attivita.find((a) => a.id === 'due-volte');
    expect(due?.testo.match(/\[\[continuò a camminare con il vero Dio\]\]/g)).toHaveLength(2);
    expect(cap.versi['gen-5-21'].testo).toContain(due?.testo.replace(/\[\[|\]\]/g, ''));
  });

  it('ricostruisce le genealogie come le riporta Genesi', () => {
    const tutte = cap.ruoli.flatMap(attivitaDel);
    const discendenza = tutte.find((a) => a.id === 'discendenza');
    expect(discendenza?.tipo === 'ordina' && discendenza.voci.map((v) => v.testo)).toEqual(VITE.slice(0, 7).map((v) => v.nome));
    const linee = tutte.find((a) => a.id === 'linee');
    if (linee?.tipo !== 'classifica') throw new Error('manca la classifica delle due linee');
    const caino = linee.voci.filter((v) => v.cat === 0).map((v) => v.testo.split(',')[0]);
    const set = linee.voci.filter((v) => v.cat === 1).map((v) => v.testo.split(',')[0]);
    expect(caino).toEqual(['Caino', 'Enoc', 'Irad', 'Mehuiael', 'Metusael', 'Lamec']); // Genesi 4:17, 18
    expect(set).toEqual(VITE.slice(1, 7).map((v) => v.nome)); // Genesi 5:3-18
  });

  it('non mette parole in bocca a Geova', () => {
    const geova = cap.ruoli.find((r) => r.id === 'geova');
    expect(geova?.modo).toBe('osserva');
    for (const p of passiDelRuolo(geova!)) {
      // Nessun nastro di parole pronunciate è attribuito a chi osserva.
      if (p.t === 'fx' && p.fx.k === 'nastro') expect(p.fx.chi).toBe('enoc');
    }
  });
});

describe('Barac e Debora, Iael: fedeltà al testo', () => {
  const classifica = (numero: number, id: string) => {
    const a = CAPITOLI[numero].ruoli.flatMap(attivitaDel).find((x) => x.id === id);
    if (a?.tipo !== 'classifica') throw new Error(`manca la classifica ${id}`);
    return a;
  };

  it('mette ogni particolare nel resoconto giusto (Giudici 4 o 5)', () => {
    for (const [numero, id] of [
      [16, 'resoconti'],
      [17, 'resoconti-tenda'],
    ] as const) {
      for (const v of classifica(numero, id).voci) {
        for (const f of v.fonti) expect(f.rif, v.testo).toMatch(v.cat === 0 ? /^Giudici 4:/ : /^Giudici 5:/);
      }
    }
  });

  it('elenca le tribù come le ricorda il canto (Giudici 5:14-18)', () => {
    const tribu = classifica(16, 'tribu').voci;
    expect(tribu.filter((v) => v.cat === 0).map((v) => v.testo)).toEqual(['Efraim', 'Beniamino', 'Machir', 'Zabulon', 'Issacar', 'Neftali']);
    expect(tribu.filter((v) => v.cat === 1).map((v) => v.testo)).toEqual(['Ruben', 'Galaad', 'Dan', 'Aser']);
  });

  it('divide i capitoli come il libro: al 16 Giudici 4:1-16, 23, 24 e 5:1-23; al 17 la tenda di Iael e 5:24-31', () => {
    // Ogni versetto biblico citato dai contenuti deve stare nei passi del suo capitolo
    // (o fuori da Giudici 4-5, come Ebrei 11 o il Salmo 83).
    const nel16 = (c: number, v: number) => (c === 4 && (v <= 16 || v >= 23)) || (c === 5 && v <= 23);
    const nel17 = (c: number, v: number) => (c === 4 && (v === 9 || v === 11 || (v >= 17 && v <= 22))) || (c === 5 && v >= 24);
    for (const [numero, dentro] of [
      [16, nel16],
      [17, nel17],
    ] as const) {
      const cap = CAPITOLI[numero];
      const rif = [
        ...Object.values(cap.versi).map((v) => v.rif),
        ...Object.values(cap.dettagli).flatMap((d) => d.fonti.map((f) => f.rif)),
      ];
      for (const r of rif) {
        const m = /^Giudici ([45]):(\d+)/.exec(r);
        if (m) expect(dentro(Number(m[1]), Number(m[2])), `cap. ${numero}: ${r}`).toBe(true);
      }
    }
  });

  it('cita alla lettera le domande di Sisera e la risposta di Iael', () => {
    const cap = CAPITOLI[17];
    const testo = cap.versi['gdc-4-17'].testo;
    for (const citazione of cap.dettagli['uomo-cercato'].testo.match(/«[^»]+»/g) ?? []) {
      expect(testo).toContain(citazione.slice(1, -1).replace(/\.$/, ''));
    }
  });

  it('non mostra il momento in cui qualcuno viene ucciso', () => {
    // Dove il racconto arriva a quel punto, la scena si oscura prima.
    for (const ruolo of capitoli.flatMap((c) => c.ruoli)) {
      for (const scena of ruolo.scene) {
        for (const p of scena.punti) {
          const i = p.passi.findIndex((x) => x.t === 'narra' && /muore|morì/.test(x.testo));
          if (i < 0) continue;
          const prima = p.passi.slice(0, i).some((x) => x.t === 'fx' && x.fx.k === 'dissolvi' && x.fx.a === 1);
          expect(prima, `${ruolo.id}/${p.id}`).toBe(true);
        }
      }
    }
  });
});

describe('Enoc: i numeri di Genesi 5', () => {
  // Età alla nascita del figlio indicato e durata della vita (Genesi 5:3-31; 7:6).
  const GENESI_5: [string, number, number][] = [
    ['Adamo', 130, 930],
    ['Set', 105, 912],
    ['Enos', 90, 905],
    ['Chenan', 70, 910],
    ['Maalalel', 65, 895],
    ['Iared', 162, 962],
    ['Enoc', 65, 365],
    ['Matusalemme', 187, 969],
    ['Lamec', 182, 777],
  ];
  const nascita: Record<string, number> = {};
  const morte: Record<string, number> = {};
  let anno = 0;
  for (const [nome, etaFiglio, vita] of GENESI_5) {
    nascita[nome] = anno;
    morte[nome] = anno + vita;
    anno += etaFiglio;
  }
  nascita['Noè'] = anno;
  const diluvio = nascita['Noè'] + 600;
  const presa = morte['Enoc'];
  const testo = (id: string): string => CAPITOLI[1].dettagli[id].testo;

  it('conferma ogni calcolo citato nei dettagli', () => {
    expect(testo('adamo-vivo')).toContain(`${morte['Adamo'] - nascita['Enoc']} anni`); // 308
    expect(testo('quattro-secoli')).toContain(`${nascita['Enoc'] - nascita['Enos']} anni`); // 387
    expect(testo('nipote')).toContain(`${nascita['Lamec'] - nascita['Enoc']}`); // 252
    expect(testo('nipote')).toContain(`${presa - nascita['Lamec']} anni`); // 113
    expect(testo('m-300')).toContain(`${presa - nascita['Matusalemme']} anni`); // 300
    expect(testo('m-adamo')).toContain(`${morte['Adamo'] - nascita['Matusalemme']}`); // 243
    expect(testo('m-antenati')).toContain(`${presa - morte['Adamo']} anni`); // 57
    expect(testo('m-antenati')).toContain(`${morte['Iared'] - presa} anni`); // 435
    expect(testo('m-noe')).toContain(`${nascita['Noè'] - nascita['Matusalemme']} anni`); // 369
    expect(testo('m-noe')).toContain(`${nascita['Noè'] - presa} anni`); // 69
    expect(morte['Matusalemme']).toBe(diluvio);
    expect(diluvio - morte['Lamec']).toBe(5);
    expect(testo('m-diluvio')).toContain('cinque anni prima');
    // Quando Enoc viene preso, dei suoi antenati è morto solo Adamo.
    expect(['Set', 'Enos', 'Chenan', 'Maalalel', 'Iared'].every((n) => morte[n] > presa)).toBe(true);
    expect(morte['Adamo']).toBeLessThan(presa);
  });

  it('concorda con le date della linea del tempo del libro', () => {
    const ADAMO = 4026;
    const anni: Record<string, number> = Object.fromEntries([...GENESI_5.map(([n, , v]) => [n, v]), ['Noè', 950]]);
    for (const { nome, nasce, muore } of VITE) {
      expect(-nasce, nome).toBe(ADAMO - nascita[nome]);
      expect(muore - nasce, nome).toBe(anni[nome]); // Noè: Genesi 9:29
      if (morte[nome] !== undefined) expect(-muore, nome).toBe(ADAMO - morte[nome]);
    }
    expect(ADAMO - presa).toBe(3039);
    expect(ADAMO - diluvio).toBe(2370);
    expect(testo('mondo-di-empi')).toContain(`${ADAMO - presa - (ADAMO - diluvio)} anni`); // 669
  });
});
