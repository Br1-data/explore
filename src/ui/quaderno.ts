import type { Capitolo, Certezza } from '../content/tipi';
import type { Salvataggio } from '../salvataggio';
import { esterno, h, svuota } from './dom';
import { CERTEZZE, distintivo, elencoFonti, ORDINE_CERTEZZE, PER_TE } from './etichette';

/** Le sezioni di studio del capitolo, con spazio per le proprie risposte. */
export function sezioniStudio(capitolo: Capitolo, salvataggio: Salvataggio): HTMLElement {
  const risposte = salvataggio.risposte(capitolo.numero);
  return h(
    'div',
    { class: 'studio' },
    capitolo.studio.map((sezione) =>
      h(
        'section',
        { class: 'studio__sezione' },
        h('h3', null, sezione.titolo),
        sezione.nota ? h('p', { class: 'studio__nota' }, sezione.nota) : null,
        sezione.domande.map((d) => {
          const area = h('textarea', { class: 'appunto', rows: 2, placeholder: 'La tua risposta', 'aria-label': d.testo });
          area.value = risposte[d.id] ?? '';
          area.addEventListener('input', () => salvataggio.rispondi(capitolo.numero, d.id, area.value));
          return h('div', { class: 'studio__domanda' }, h('p', null, d.testo), elencoFonti(d.fonti), area);
        }),
      ),
    ),
    h(
      'section',
      { class: 'studio__sezione' },
      h('h3', null, 'Scopri di più'),
      h('ul', { class: 'elenco-link' }, capitolo.approfondisci.map((f) => h('li', null, f.url ? esterno(f.rif, f.url) : f.rif))),
    ),
  );
}

function testoQuaderno(capitolo: Capitolo, salvataggio: Salvataggio): string {
  const n = capitolo.numero;
  const righe: string[] = [];
  righe.push(`QUADERNO DI STUDIO — Capitolo ${n}: ${capitolo.nome}, «${capitolo.titolo}»`);
  righe.push(`Libro «Cammina coraggiosamente con Dio» — ${capitolo.url}`, '');
  const scoperti = new Set(salvataggio.dettagli(n));
  for (const c of ORDINE_CERTEZZE) {
    const voci = Object.values(capitolo.dettagli).filter((d) => d.certezza === c && scoperti.has(d.id));
    if (!voci.length) continue;
    righe.push(`— ${CERTEZZE[c].etichetta.toUpperCase()} — ${CERTEZZE[c].descrizione}`);
    for (const d of voci) {
      righe.push(`• ${d.titolo}: ${d.testo}`);
      righe.push(`  (${d.fonti.map((f) => f.rif).join('; ')})`);
    }
    righe.push('');
  }
  const sens = salvataggio.sensazioni(n);
  if (Object.keys(sens).length) {
    righe.push('— SENSAZIONI — domande per te, non fatti del racconto');
    for (const [id, testo] of Object.entries(sens)) {
      const s = capitolo.sensazioni[id];
      if (!s) continue;
      righe.push(`• ${s.domanda}`);
      if (testo) righe.push(`  ${testo}`);
    }
    righe.push('');
  }
  const risposte = salvataggio.risposte(n);
  for (const sezione of capitolo.studio) {
    righe.push(`— ${sezione.titolo.toUpperCase()} —`);
    for (const d of sezione.domande) {
      righe.push(`• ${d.testo}`);
      if (risposte[d.id]) righe.push(`  ${risposte[d.id]}`);
    }
    righe.push('');
  }
  return righe.join('\n');
}

type Linguetta = 'dettagli' | 'sensazioni' | 'passi' | 'domande';

/** Il quaderno: tutto ciò che si è scoperto e annotato in un capitolo. */
export function creaQuaderno(capitolo: Capitolo, salvataggio: Salvataggio, chiudi: () => void): HTMLElement {
  const n = capitolo.numero;
  const contenuto = h('div', { class: 'quaderno__contenuto' });
  const linguette: Record<Linguetta, HTMLButtonElement> = {} as Record<Linguetta, HTMLButtonElement>;

  const pagine: Record<Linguetta, () => void> = {
    dettagli() {
      const scoperti = new Set(salvataggio.dettagli(n));
      const tutti = Object.values(capitolo.dettagli);
      contenuto.append(
        h(
          'p',
          { class: 'quaderno__riassunto' },
          `Hai scoperto ${scoperti.size} dettagli su ${tutti.length}. Ogni punto di vista ne rivela di diversi.`,
        ),
      );
      for (const c of ORDINE_CERTEZZE) {
        const gruppo = tutti.filter((d) => d.certezza === c);
        const trovati = gruppo.filter((d) => scoperti.has(d.id));
        contenuto.append(
          h(
            'section',
            { class: 'quaderno__gruppo' },
            h('header', null, distintivo(c as Certezza), h('span', { class: 'conta' }, `${trovati.length} di ${gruppo.length}`)),
            h('p', { class: 'quaderno__legenda' }, CERTEZZE[c as Certezza].descrizione),
            trovati.map((d) =>
              h('article', { class: 'voce' }, h('h4', null, d.titolo), h('p', null, d.testo), elencoFonti(d.fonti)),
            ),
            trovati.length < gruppo.length
              ? h('p', { class: 'quaderno__mancanti' }, `Ancora ${gruppo.length - trovati.length} da scoprire.`)
              : null,
          ),
        );
      }
    },
    sensazioni() {
      const sens = salvataggio.sensazioni(n);
      const ids = Object.keys(sens).filter((id) => capitolo.sensazioni[id]);
      contenuto.append(h('p', { class: 'quaderno__riassunto' }, PER_TE.descrizione));
      if (!ids.length) {
        contenuto.append(h('p', { class: 'quaderno__vuoto' }, 'Le domande che incontrerai nel racconto compariranno qui.'));
        return;
      }
      for (const id of ids) {
        const area = h('textarea', { class: 'appunto', rows: 2, placeholder: 'La tua riflessione' });
        area.value = sens[id] ?? '';
        area.addEventListener('input', () => salvataggio.senti(n, id, area.value));
        contenuto.append(h('article', { class: 'voce' }, h('p', { class: 'voce__domanda' }, capitolo.sensazioni[id].domanda), area));
      }
    },
    passi() {
      const letti = new Set(salvataggio.versi(n));
      contenuto.append(
        h('p', { class: 'quaderno__riassunto' }, 'I passi indicati dal capitolo e quelli che hai incontrato nel racconto.'),
      );
      const ordine = [...capitolo.passiDaLeggere, ...Object.keys(capitolo.versi).filter((id) => !capitolo.passiDaLeggere.includes(id) && letti.has(id))];
      for (const id of ordine) {
        const v = capitolo.versi[id];
        contenuto.append(
          h(
            'article',
            { class: 'voce' },
            h(
              'h4',
              null,
              esterno(v.rif, v.url),
              capitolo.passiDaLeggere.includes(id) ? h('span', { class: 'conta' }, 'Da leggere') : null,
            ),
            h('blockquote', { class: 'verso' }, v.testo),
            v.note?.length ? h('ul', { class: 'note' }, v.note.map((nota) => h('li', null, nota))) : null,
          ),
        );
      }
    },
    domande() {
      contenuto.append(sezioniStudio(capitolo, salvataggio));
    },
  };

  const apri = (quale: Linguetta): void => {
    svuota(contenuto);
    for (const [nome, b] of Object.entries(linguette)) b.setAttribute('aria-selected', String(nome === quale));
    pagine[quale]();
    contenuto.scrollTop = 0;
  };

  const etichette: [Linguetta, string][] = [
    ['dettagli', 'Dettagli'],
    ['sensazioni', 'Sensazioni'],
    ['passi', 'Passi biblici'],
    ['domande', 'Domande'],
  ];
  const barra = h(
    'div',
    { class: 'linguette', role: 'tablist' },
    etichette.map(([id, testo]) => {
      const b = h('button', { type: 'button', role: 'tab', class: 'linguetta', onclick: () => apri(id) }, testo);
      linguette[id] = b;
      return b;
    }),
  );

  const scarica = (): void => {
    const blob = new Blob([testoQuaderno(capitolo, salvataggio)], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = h('a', { href: url, download: `quaderno-${capitolo.slug}.txt` });
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  const pannello = h(
    'div',
    { class: 'pannello quaderno', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Quaderno di studio' },
    h(
      'header',
      { class: 'pannello__testa' },
      h('div', null, h('span', { class: 'occhiello' }, `Capitolo ${n} · ${capitolo.nome}`), h('h2', null, 'Quaderno di studio')),
      h('button', { class: 'bottone bottone--chiudi', type: 'button', onclick: chiudi, 'aria-label': 'Chiudi il quaderno' }, '×'),
    ),
    barra,
    contenuto,
    h(
      'footer',
      { class: 'pannello__piede' },
      h('button', { class: 'bottone', type: 'button', onclick: scarica }, 'Scarica come testo'),
      h('button', { class: 'bottone', type: 'button', onclick: () => window.print() }, 'Stampa'),
    ),
  );
  apri('dettagli');
  return pannello;
}
