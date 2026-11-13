import { describe, expect, it } from 'vitest';
import { CAPITOLI, dettagliDelRuolo, passiDelRuolo, sensazioniDelRuolo } from '../src/content';
import { MESSAGGIO, MESSAGGIO_INTERO } from '../src/content/capitoli/enoc/base';
import { NASTRO } from '../src/content/capitoli/enoc/enoc';
import { PARTI, TOTALE_CAPITOLI, URL_LIBRO } from '../src/content/libro';
import type { Fonte, Passo } from '../src/content/tipi';
import { ARTI } from '../src/motore/arte';
import { STILI } from '../src/motore/figure';
import { TIPI_OGGETTO } from '../src/motore/oggetti';
import { AMBIENTI } from '../src/motore/tavolozze';
import { ID_SCHEMI, VITE } from '../src/ui/schemi';

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

    it('propone attività risolvibili', () => {
      for (const p of passiDelRuolo(ruolo)) {
        if (p.t !== 'attivita') continue;
        const a = p.a;
        if (a.tipo === 'trova') expect(a.testo.match(/\[\[.+?\]\]/g)?.length ?? 0, a.id).toBeGreaterThan(0);
        if (a.tipo === 'componi') expect(a.pezzi.length, a.id).toBeGreaterThan(2);
        if (a.tipo === 'ordina') expect(a.voci.length, a.id).toBeGreaterThan(2);
        if (a.tipo === 'domanda') {
          expect(a.corretta, a.id).toBeLessThan(a.opzioni.length);
          expect(a.fonti.length, a.id).toBeGreaterThan(0);
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
    const attivita = cap.ruoli.flatMap(passiDelRuolo).flatMap((p) => (p.t === 'attivita' && p.a.tipo === 'trova' ? [p.a] : []));
    const quattro = attivita.filter((a) => a.id === 'quattro-volte');
    expect(quattro.length).toBeGreaterThan(0);
    for (const a of quattro) {
      expect(a.testo.match(/\[\[(.+?)\]\]/g)).toEqual(['[[empi]]', '[[empie]]', '[[empiamente]]', '[[empi]]']);
      expect(giuda).toContain(a.testo.replace(/\[\[|\]\]/g, '').replace(/^…/, '').replace(/\.$/, ''));
    }
    const due = attivita.find((a) => a.id === 'due-volte');
    expect(due?.testo.match(/\[\[continuò a camminare con il vero Dio\]\]/g)).toHaveLength(2);
    expect(cap.versi['gen-5-21'].testo).toContain(due?.testo.replace(/\[\[|\]\]/g, ''));
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
    for (const [nome, nasce, muore, anni] of VITE) {
      expect(nasce, nome).toBe(ADAMO - nascita[nome]);
      expect(nasce - muore, nome).toBe(anni);
      if (morte[nome] !== undefined) expect(muore, nome).toBe(ADAMO - morte[nome]);
    }
    expect(ADAMO - presa).toBe(3039);
    expect(ADAMO - diluvio).toBe(2370);
    expect(testo('mondo-di-empi')).toContain(`${ADAMO - presa - (ADAMO - diluvio)} anni`); // 669
  });
});
