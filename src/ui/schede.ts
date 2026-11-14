import { chiave } from '@/contenuti';
import type { Attivita, Capitolo } from '@/contenuti/tipi';
import { creaArte } from '../motore/arte';
import type { PassoVisibile } from '../motore/partita';
import type { Suono } from '../motore/suono';
import type { Salvataggio } from '../salvataggio';
import { esterno, h, mescolaStabile, svuota } from './dom';
import { distintivo, distintivoRicostruzione, elencoFonti, PER_TE } from './etichette';
import { creaSchema } from './schemi';

export interface ContestoScheda {
  capitolo: Capitolo;
  salvataggio: Salvataggio;
  suono: Suono;
  /** Chiamato quando cambia il numero di dettagli scoperti. */
  aggiornato(): void;
}

/** Evidenzia nel testo le espressioni indicate. */
export function conEvidenza(testo: string, evidenzia: string[] | undefined): (Node | string)[] {
  if (!evidenzia?.length) return [testo];
  const parti: (Node | string)[] = [];
  let resto = testo;
  while (resto) {
    let primo = -1;
    let trovato = '';
    for (const e of evidenzia) {
      const i = resto.indexOf(e);
      if (i >= 0 && (primo < 0 || i < primo)) {
        primo = i;
        trovato = e;
      }
    }
    if (primo < 0) {
      parti.push(resto);
      break;
    }
    if (primo > 0) parti.push(resto.slice(0, primo));
    parti.push(h('mark', null, trovato));
    resto = resto.slice(primo + trovato.length);
  }
  return parti;
}

/** Anno leggibile: i negativi sono a.E.V. */
export function etichettaAnno(anno: number): string {
  return anno < 0 ? `${-anno} a.E.V.` : `${anno} E.V.`;
}

/** La scheda che compare sopra la scena: racconto, versetti, dettagli, attività. */
export class Scheda {
  private principale: HTMLButtonElement | null = null;

  constructor(
    private radice: HTMLElement,
    private cx: ContestoScheda,
  ) {}

  get aperta(): boolean {
    return !this.radice.hidden;
  }

  chiudi(): void {
    this.radice.hidden = true;
    svuota(this.radice);
    this.principale = null;
  }

  /** Invio o barra spaziatrice: preme il pulsante principale, se è attivo. */
  conferma(): boolean {
    if (!this.aperta || !this.principale || this.principale.disabled) return false;
    this.principale.click();
    return true;
  }

  /** Registra un dettaglio nel quaderno e ne restituisce il contenuto. */
  private dettaglio(id: string): HTMLElement[] {
    const d = this.cx.capitolo.dettagli[id];
    const nuovo = this.cx.salvataggio.scopri(chiave(this.cx.capitolo), id);
    if (nuovo) {
      this.cx.suono.scoperta();
      this.cx.aggiornato();
    }
    return [
      h(
        'div',
        { class: 'scheda__testa' },
        h('span', { class: 'occhiello' }, 'Dettaglio'),
        distintivo(d.certezza),
        nuovo ? h('span', { class: 'nuovo' }, 'Nuovo nel quaderno') : h('span', { class: 'gia' }, 'Già nel quaderno'),
      ),
      h('h3', { class: 'scheda__titolo' }, d.titolo),
      h('p', { class: 'scheda__testo' }, d.testo),
      elencoFonti(d.fonti) ?? h('span'),
    ];
  }

  /** Il dettaglio che un’attività rivela quando è risolta. */
  private rivela(id: string): HTMLElement {
    return h('div', { class: 'rivelato', 'data-dettaglio': id }, this.dettaglio(id));
  }

  mostra(passo: PassoVisibile, avanti: () => void): void {
    svuota(this.radice);
    this.radice.hidden = false;
    const corpo = h('div', { class: 'scheda__corpo' });
    const piede = h('div', { class: 'scheda__piede' });
    const continua = h('button', { class: 'bottone bottone--primario', type: 'button' }, 'Continua');
    let prima: (() => void) | null = null;
    continua.addEventListener('click', () => {
      prima?.();
      this.cx.suono.pagina();
      avanti();
    });
    this.principale = continua;
    const articolo = h('article', { class: `scheda scheda--${passo.t}`, 'data-passo': passo.t }, corpo, piede);

    switch (passo.t) {
      case 'narra': {
        if (passo.arte) {
          const arte = creaArte(passo.arte);
          if (arte) corpo.append(arte);
        }
        if (passo.titolo) corpo.append(h('h3', { class: 'scheda__titolo' }, passo.titolo));
        corpo.append(h('p', { class: 'scheda__testo' }, passo.testo));
        if (passo.certezza || passo.fonti || passo.ricostruzione) {
          corpo.append(
            h(
              'div',
              { class: 'scheda__meta' },
              passo.ricostruzione ? distintivoRicostruzione() : null,
              passo.certezza ? distintivo(passo.certezza) : null,
              elencoFonti(passo.fonti, passo.ricostruzione ? 'Si basa su: ' : 'Fonti: '),
            ),
          );
        }
        break;
      }
      case 'verso': {
        const v = this.cx.capitolo.versi[passo.id];
        this.cx.salvataggio.leggiVerso(chiave(this.cx.capitolo), passo.id);
        corpo.append(
          h('div', { class: 'scheda__testa' }, h('span', { class: 'occhiello' }, 'Leggi'), esterno(v.rif, v.url, 'rif')),
        );
        if (passo.intro) corpo.append(h('p', { class: 'scheda__intro' }, passo.intro));
        corpo.append(h('blockquote', { class: 'verso' }, conEvidenza(v.testo, passo.evidenzia)));
        if (v.note?.length) corpo.append(h('ul', { class: 'note' }, v.note.map((n) => h('li', null, n))));
        break;
      }
      case 'dettaglio': {
        articolo.dataset['dettaglio'] = passo.id;
        corpo.append(...this.dettaglio(passo.id));
        break;
      }
      case 'senti': {
        const s = this.cx.capitolo.sensazioni[passo.id];
        const numero = chiave(this.cx.capitolo);
        this.cx.salvataggio.senti(numero, passo.id);
        const area = h('textarea', {
          class: 'appunto',
          rows: 3,
          placeholder: 'Se vuoi, scrivi qui. Resta nel tuo quaderno.',
          'aria-label': 'La tua riflessione',
        });
        area.value = this.cx.salvataggio.sensazioni(numero)[passo.id] ?? '';
        prima = () => this.cx.salvataggio.senti(numero, passo.id, area.value.trim());
        corpo.append(
          h(
            'div',
            { class: 'scheda__testa' },
            h('span', { class: 'occhiello' }, 'Fermati e immagina'),
            h('span', { class: 'distintivo distintivo--per-te', title: PER_TE.descrizione }, PER_TE.etichetta),
          ),
          h('p', { class: 'scheda__domanda' }, s.domanda),
          area,
        );
        break;
      }
      case 'schema': {
        if (passo.intro) corpo.append(h('p', { class: 'scheda__intro' }, passo.intro));
        corpo.append(creaSchema(passo.schema));
        break;
      }
      case 'attivita': {
        continua.disabled = true;
        articolo.dataset['attivita'] = passo.a.tipo;
        this.attivita(passo.a, corpo, () => {
          continua.disabled = false;
          continua.focus({ preventScroll: true });
        });
        break;
      }
    }

    piede.append(continua);
    this.radice.append(articolo);
    if (passo.t !== 'attivita' && passo.t !== 'senti') continua.focus({ preventScroll: true });
  }

  private attivita(a: Attivita, corpo: HTMLElement, risolta: () => void): void {
    const suono = this.cx.suono;
    const scuoti = (el: HTMLElement): void => {
      el.classList.remove('scossa');
      void el.offsetWidth;
      el.classList.add('scossa');
      suono.sbagliato();
    };
    const testa = (occhiello: string, ...altro: (Node | null)[]): HTMLElement =>
      h('div', { class: 'scheda__testa' }, h('span', { class: 'occhiello' }, occhiello), altro);

    switch (a.tipo) {
      case 'componi':
      case 'ordina': {
        const voci = a.tipo === 'componi' ? a.pezzi.map((p) => ({ testo: p, nota: undefined as string | undefined })) : a.voci;
        const composto = h(a.tipo === 'componi' ? 'p' : 'ol', {
          class: a.tipo === 'componi' ? 'composto verso' : 'composto composto--lista',
          'aria-live': 'polite',
        });
        const banco = h('div', { class: 'banco' });
        const stato = h('p', { class: 'attivita__stato' });
        let atteso = 0;
        let errori = 0;
        const aggiorna = (): void => {
          stato.textContent = atteso < voci.length ? `${atteso} di ${voci.length}` : '';
        };
        const bottoni = voci.map((v, indice) => {
          const b = h('button', { class: 'pezzo', type: 'button', 'data-indice': indice }, v.testo);
          b.addEventListener('click', () => {
            if (indice !== atteso) {
              errori++;
              scuoti(b);
              // Dopo due errori, il pezzo giusto viene indicato.
              if (errori >= 2) bottoni[atteso].classList.add('pezzo--aiuto');
              return;
            }
            suono.giusto();
            errori = 0;
            b.remove();
            if (a.tipo === 'componi') {
              composto.append(h('span', { class: 'composto__pezzo' }, `${v.testo} `));
            } else {
              composto.append(h('li', null, h('b', null, v.testo), v.nota ? h('span', null, ` · ${v.nota}`) : null));
            }
            atteso++;
            aggiorna();
            if (atteso === voci.length) {
              banco.remove();
              corpo.append(h('p', { class: 'attivita__spiegazione' }, a.tipo === 'ordina' ? a.spiegazione : a.rif));
              risolta();
            }
          });
          return b;
        });
        // Le voci estranee alla sequenza: toccate, si scartano.
        const estranee = (a.tipo === 'ordina' ? (a.distrattori ?? []) : []).map((testo) => {
          const b = h('button', { class: 'pezzo', type: 'button' }, testo);
          b.addEventListener('click', () => {
            scuoti(b);
            b.disabled = true;
            b.classList.add('pezzo--fuori');
          });
          return b;
        });
        banco.append(...mescolaStabile([...bottoni, ...estranee], a.id));
        corpo.append(
          testa(a.tipo === 'componi' ? 'Ricomponi' : 'Metti in ordine'),
          h('p', { class: 'scheda__consegna' }, a.consegna),
          composto,
          banco,
          stato,
        );
        aggiorna();
        return;
      }

      case 'trova': {
        const stato = h('p', { class: 'attivita__stato' });
        const testo = h('p', { class: 'verso trova' });
        const parti = a.testo.split(/(\[\[.*?\]\])/g).filter(Boolean);
        const totale = parti.filter((p) => p.startsWith('[[')).length;
        let trovati = 0;
        const aggiorna = (): void => {
          stato.textContent = `${trovati} di ${totale}`;
        };
        for (const parte of parti) {
          const bersaglio = parte.startsWith('[[');
          // Ogni parola si tocca da sola, così l’impaginazione non rivela dove sono le parti da trovare.
          const gruppo = bersaglio ? h('span', { class: 'gruppo' }) : null;
          const trovato = (): void => {
            if (!gruppo || gruppo.classList.contains('gruppo--trovato')) return;
            gruppo.classList.add('gruppo--trovato');
            suono.giusto();
            trovati++;
            aggiorna();
            if (trovati === totale) {
              testo.classList.add('trova--finito');
              corpo.append(h('p', { class: 'attivita__spiegazione' }, a.spiegazione));
              risolta();
            }
          };
          let prima = true;
          for (const pezzo of (bersaglio ? parte.slice(2, -2) : parte).split(/(\s+)/)) {
            if (!pezzo.trim()) {
              (gruppo ?? testo).append(pezzo);
              continue;
            }
            const b = h('button', { class: 'parola', type: 'button' }, pezzo);
            b.addEventListener('click', () => {
              if (gruppo) trovato();
              else if (trovati < totale) scuoti(b);
            });
            if (gruppo && prima) b.dataset['bersaglio'] = '1';
            prima = false;
            (gruppo ?? testo).append(b);
          }
          if (gruppo) testo.append(gruppo);
        }
        corpo.append(
          testa('Cerca nel testo', h('span', { class: 'rif' }, a.rif)),
          h('p', { class: 'scheda__consegna' }, a.consegna),
          testo,
          stato,
        );
        aggiorna();
        return;
      }

      case 'domanda': {
        const opzioni = h('div', { class: 'opzioni' });
        a.opzioni.forEach((testo, i) => {
          const b = h('button', { class: 'opzione', type: 'button', 'data-corretta': i === a.corretta ? '1' : null }, testo);
          b.addEventListener('click', () => {
            if (i !== a.corretta) {
              b.disabled = true;
              b.classList.add('opzione--no');
              scuoti(b);
              return;
            }
            suono.giusto();
            b.classList.add('opzione--si');
            for (const altro of opzioni.querySelectorAll('button')) altro.disabled = true;
            if (a.dettaglio) corpo.append(this.rivela(a.dettaglio));
            else corpo.append(h('p', { class: 'attivita__spiegazione' }, a.spiegazione ?? ''), elencoFonti(a.fonti) ?? '');
            risolta();
          });
          opzioni.append(b);
        });
        corpo.append(testa('Osserva il testo'), h('p', { class: 'scheda__consegna' }, a.domanda), opzioni);
        return;
      }

      case 'condotta': {
        const esito = h('div', { class: 'esito-scelta', 'aria-live': 'polite' });
        const opzioni = h('div', { class: 'opzioni' });
        const bottoni = a.opzioni.map((o) => {
          const b = h('button', { class: 'opzione', type: 'button', 'data-fedele': o.fedele ? '1' : null }, o.testo);
          b.addEventListener('click', () => {
            svuota(esito);
            if (!o.fedele) {
              // Non è un errore da punire: si scopre come agivano gli altri.
              suono.pagina();
              b.disabled = true;
              b.classList.add('opzione--altra');
              esito.append(h('p', { class: 'esito-scelta__testo' }, o.esito ?? ''), elencoFonti(o.fonti) ?? '');
              return;
            }
            suono.giusto();
            b.classList.add('opzione--si');
            for (const altro of bottoni) altro.disabled = true;
            if (o.dettaglio) esito.append(this.rivela(o.dettaglio));
            risolta();
          });
          return b;
        });
        opzioni.append(...mescolaStabile(bottoni, a.id));
        corpo.append(
          testa('Mettiti nei suoi panni', a.narrata ? null : distintivoRicostruzione()),
          h('p', { class: 'scheda__situazione' }, a.situazione),
          elencoFonti(a.base, a.narrata ? 'Lo racconta: ' : 'Si basa su: ') ?? '',
          h('p', { class: 'scheda__consegna' }, a.domanda ?? 'Che cosa fai?'),
          opzioni,
          esito,
        );
        return;
      }

      case 'completa': {
        const v = this.cx.capitolo.versi[a.verso];
        const testo = h('p', { class: 'verso completa' });
        const attese: string[] = [];
        const lacune: HTMLElement[] = [];
        for (const parte of a.testo.split(/(\[\[.*?\]\])/g).filter(Boolean)) {
          if (!parte.startsWith('[[')) {
            testo.append(parte);
            continue;
          }
          const parola = parte.slice(2, -2);
          const lacuna = h('span', { class: 'lacuna', style: `min-width:${Math.max(3, parola.length * 0.62)}em` });
          attese.push(parola);
          lacune.push(lacuna);
          testo.append(lacuna);
        }
        let k = 0;
        lacune[0]?.classList.add('lacuna--attiva');
        const banco = h('div', { class: 'banco' });
        const stato = h('p', { class: 'attivita__stato' });
        const aggiorna = (): void => {
          stato.textContent = k < attese.length ? `${k} di ${attese.length}` : '';
        };
        const parole = [
          ...attese.map((p, i) => ({ p, ordine: i as number | null })),
          ...a.distrattori.map((p) => ({ p, ordine: null })),
        ].map(({ p, ordine }) => {
          const b = h('button', { class: 'pezzo', type: 'button', 'data-ordine': ordine }, p);
          b.addEventListener('click', () => {
            if (p !== attese[k]) {
              scuoti(b);
              return;
            }
            suono.giusto();
            b.remove();
            lacune[k].textContent = p;
            lacune[k].classList.replace('lacuna--attiva', 'lacuna--piena');
            k++;
            lacune[k]?.classList.add('lacuna--attiva');
            aggiorna();
            if (k === attese.length) {
              banco.remove();
              corpo.append(h('p', { class: 'attivita__spiegazione' }, v.rif));
              risolta();
            }
          });
          return b;
        });
        banco.append(...mescolaStabile(parole, a.id));
        corpo.append(
          testa('Completa il versetto', esterno(v.rif, v.url, 'rif')),
          h('p', { class: 'scheda__consegna' }, a.consegna),
          testo,
          banco,
          stato,
        );
        aggiorna();
        return;
      }

      case 'classifica': {
        const voci = mescolaStabile(a.voci, a.id);
        // Fonti uguali per tutte le voci: si mostrano una volta sola, in fondo.
        const firma = (v: (typeof a.voci)[number]): string => v.fonti.map((f) => f.rif).join('|');
        const comuni = a.voci.every((v) => firma(v) === firma(a.voci[0]));
        let i = 0;
        const carta = h('p', { class: 'carta-voce', 'aria-live': 'polite' });
        const stato = h('p', { class: 'attivita__stato' });
        const liste = a.categorie.map(() => h('ul', { class: 'cesto__voci' }));
        const scelte = a.categorie.map((nome, c) => {
          const b = h('button', { class: 'opzione opzione--cesto', type: 'button' }, nome);
          b.addEventListener('click', () => {
            const v = voci[i];
            if (v.cat !== c) {
              scuoti(b);
              return;
            }
            suono.giusto();
            liste[c].append(
              h('li', { 'data-ordine': a.voci.indexOf(v) }, h('span', null, v.testo), comuni ? null : elencoFonti(v.fonti, '')),
            );
            i++;
            mostra();
          });
          return b;
        });
        const mostra = (): void => {
          if (i >= voci.length) {
            carta.remove();
            for (const b of scelte) b.remove();
            stato.textContent = '';
            // Finito: ogni categoria si rilegge nell’ordine del testo.
            for (const lista of liste) {
              lista.append(...[...lista.children].sort((x, y) => Number((x as HTMLElement).dataset['ordine']) - Number((y as HTMLElement).dataset['ordine'])));
            }
            if (comuni) corpo.append(elencoFonti(a.voci[0].fonti) ?? '');
            if (a.spiegazione) corpo.append(h('p', { class: 'attivita__spiegazione' }, a.spiegazione));
            if (a.dettaglio) corpo.append(this.rivela(a.dettaglio));
            risolta();
            return;
          }
          carta.textContent = voci[i].testo;
          scelte.forEach((b, c) => {
            if (c === voci[i].cat) b.dataset['giusta'] = '1';
            else delete b.dataset['giusta'];
          });
          stato.textContent = `${i + 1} di ${voci.length}`;
        };
        corpo.append(
          testa('Metti al suo posto'),
          h('p', { class: 'scheda__consegna' }, a.consegna),
          carta,
          h('div', { class: 'classifica__scelte' }, scelte),
          stato,
          h(
            'div',
            { class: 'cesti' },
            a.categorie.map((nome, c) => h('section', { class: 'cesto' }, h('h4', null, nome), liste[c])),
          ),
        );
        mostra();
        return;
      }

      case 'linea': {
        const da = Math.min(...a.persone.map((p) => p.nasce));
        const a_ = Math.max(...a.persone.map((p) => p.muore));
        const pos = (anno: number): number => ((anno - da) / (a_ - da)) * 100;
        const cursore = h('span', { class: 'linea__cursore' });
        const righe = a.persone.map((p) =>
          h(
            'div',
            { class: 'vita' },
            h('span', { class: 'vita__nome' }, p.nome),
            h(
              'span',
              { class: 'vita__traccia' },
              h('span', { class: 'vita__barra', style: `left:${pos(p.nasce)}%;width:${pos(p.muore) - pos(p.nasce)}%` }),
            ),
            h('span', { class: 'vita__anni' }, p.muore - p.nasce),
          ),
        );
        const cursoreBox = h('div', { class: 'vite__segni', 'aria-hidden': 'true' }, cursore);
        const cursore_ = h('input', {
          class: 'linea__scorri',
          type: 'range',
          min: da,
          max: a_,
          step: 1,
          value: da,
          'data-meta': a.meta,
          'aria-label': 'Anno sulla linea del tempo',
        });
        const lettura = h('p', { class: 'linea__lettura', 'aria-live': 'polite' });
        const meno = h('button', { class: 'tondo tondo--chiaro', type: 'button', 'aria-label': 'Un anno prima' }, '−');
        const piu = h('button', { class: 'tondo tondo--chiaro', type: 'button', 'aria-label': 'Un anno dopo' }, '+');
        const fissa = h('button', { class: 'bottone linea__fissa', type: 'button' }, 'Fissa qui');
        const aggiorna = (): void => {
          const anno = Number(cursore_.value);
          cursore.style.left = `${pos(anno)}%`;
          const vivi = a.persone
            .filter((p) => p.nasce <= anno && anno <= p.muore)
            .map((p) => `${p.nome} ${anno - p.nasce}${anno === p.muore ? ' †' : anno === p.nasce ? ' (nasce)' : ''}`);
          svuota(lettura);
          lettura.append(h('b', null, etichettaAnno(anno)), ` · ${vivi.length ? vivi.join(' · ') : 'nessuno di loro'}`);
        };
        // Rilasciato il cursore, si aggancia alla nascita o alla morte più vicina.
        const aggancia = (): void => {
          const anno = Number(cursore_.value);
          const eventi = a.persone.flatMap((p) => [p.nasce, p.muore]);
          const vicino = eventi.reduce((m, e) => (Math.abs(e - anno) < Math.abs(m - anno) ? e : m), eventi[0]);
          if (Math.abs(vicino - anno) <= 12) cursore_.value = String(vicino);
          aggiorna();
        };
        cursore_.addEventListener('input', aggiorna);
        cursore_.addEventListener('change', aggancia);
        meno.addEventListener('click', () => {
          cursore_.value = String(Number(cursore_.value) - 1);
          aggiorna();
        });
        piu.addEventListener('click', () => {
          cursore_.value = String(Number(cursore_.value) + 1);
          aggiorna();
        });
        fissa.addEventListener('click', () => {
          if (Number(cursore_.value) !== a.meta) {
            scuoti(fissa);
            return;
          }
          suono.giusto();
          for (const el of [cursore_, meno, piu, fissa]) el.disabled = true;
          corpo.append(a.dettaglio ? this.rivela(a.dettaglio) : (elencoFonti(a.fonti) ?? ''));
          risolta();
        });
        corpo.append(
          testa('Linea del tempo'),
          h('p', { class: 'scheda__consegna' }, a.consegna),
          h('figure', { class: 'schema schema--vite' }, h('div', { class: 'vite' }, righe, cursoreBox)),
          // Il cursore sta nella stessa colonna delle barre, così segue l’anno indicato.
          h('div', { class: 'vita vita--scorri' }, h('span'), cursore_, h('span')),
          lettura,
          h('div', { class: 'linea__comandi' }, meno, piu, fissa),
        );
        aggiorna();
        return;
      }
    }
  }
}
