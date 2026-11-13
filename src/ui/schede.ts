import type { Attivita, Capitolo } from '../content/tipi';
import { creaArte } from '../motore/arte';
import type { PassoVisibile } from '../motore/partita';
import type { Suono } from '../motore/suono';
import type { Salvataggio } from '../salvataggio';
import { esterno, h, mescolaStabile, svuota } from './dom';
import { distintivo, elencoFonti, PER_TE } from './etichette';
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
        if (passo.certezza || passo.fonti) {
          corpo.append(
            h('div', { class: 'scheda__meta' }, passo.certezza ? distintivo(passo.certezza) : null, elencoFonti(passo.fonti)),
          );
        }
        break;
      }
      case 'verso': {
        const v = this.cx.capitolo.versi[passo.id];
        this.cx.salvataggio.leggiVerso(this.cx.capitolo.numero, passo.id);
        corpo.append(
          h('div', { class: 'scheda__testa' }, h('span', { class: 'occhiello' }, 'Leggi'), esterno(v.rif, v.url, 'rif')),
        );
        if (passo.intro) corpo.append(h('p', { class: 'scheda__intro' }, passo.intro));
        corpo.append(h('blockquote', { class: 'verso' }, conEvidenza(v.testo, passo.evidenzia)));
        if (v.note?.length) corpo.append(h('ul', { class: 'note' }, v.note.map((n) => h('li', null, n))));
        break;
      }
      case 'dettaglio': {
        const d = this.cx.capitolo.dettagli[passo.id];
        const nuovo = this.cx.salvataggio.scopri(this.cx.capitolo.numero, passo.id);
        if (nuovo) {
          this.cx.suono.scoperta();
          this.cx.aggiornato();
        }
        articolo.dataset['dettaglio'] = passo.id;
        corpo.append(
          h(
            'div',
            { class: 'scheda__testa' },
            h('span', { class: 'occhiello' }, 'Dettaglio'),
            distintivo(d.certezza),
            nuovo ? h('span', { class: 'nuovo' }, 'Nuovo nel quaderno') : h('span', { class: 'gia' }, 'Già nel quaderno'),
          ),
          h('h3', { class: 'scheda__titolo' }, d.titolo),
          h('p', { class: 'scheda__testo' }, d.testo),
          elencoFonti(d.fonti) ?? '',
        );
        break;
      }
      case 'senti': {
        const s = this.cx.capitolo.sensazioni[passo.id];
        const numero = this.cx.capitolo.numero;
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
        const schema = creaSchema(passo.id);
        if (schema) corpo.append(schema);
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

    if (a.tipo === 'componi' || a.tipo === 'ordina') {
      const voci =
        a.tipo === 'componi' ? a.pezzi.map((p) => ({ testo: p, nota: undefined as string | undefined })) : a.voci;
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
            if (a.tipo === 'ordina') corpo.append(h('p', { class: 'attivita__spiegazione' }, a.spiegazione));
            else corpo.append(h('p', { class: 'attivita__spiegazione' }, a.rif));
            risolta();
          }
        });
        return b;
      });
      banco.append(...mescolaStabile(bottoni, a.id));
      corpo.append(
        h('div', { class: 'scheda__testa' }, h('span', { class: 'occhiello' }, a.tipo === 'componi' ? 'Ricomponi' : 'Metti in ordine')),
        h('p', { class: 'scheda__consegna' }, a.consegna),
        composto,
        banco,
        stato,
      );
      aggiorna();
      return;
    }

    if (a.tipo === 'trova') {
      const stato = h('p', { class: 'attivita__stato' });
      const testo = h('p', { class: 'verso trova' });
      const parti = a.testo.split(/(\[\[.*?\]\])/g).filter(Boolean);
      const totale = parti.filter((p) => p.startsWith('[[')).length;
      let trovati = 0;
      const aggiorna = (): void => {
        stato.textContent = `${trovati} di ${totale}`;
      };
      const parola = (testoParola: string, alClic: (b: HTMLButtonElement) => void): HTMLButtonElement => {
        const b = h('button', { class: 'parola', type: 'button' }, testoParola);
        b.addEventListener('click', () => alClic(b));
        return b;
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
          const b = parola(pezzo, (el) => {
            if (gruppo) trovato();
            else if (trovati < totale) scuoti(el);
          });
          if (gruppo && prima) b.dataset['bersaglio'] = '1';
          prima = false;
          (gruppo ?? testo).append(b);
        }
        if (gruppo) testo.append(gruppo);
      }
      corpo.append(
        h('div', { class: 'scheda__testa' }, h('span', { class: 'occhiello' }, 'Cerca nel testo'), h('span', { class: 'rif' }, a.rif)),
        h('p', { class: 'scheda__consegna' }, a.consegna),
        testo,
        stato,
      );
      aggiorna();
      return;
    }

    // Domanda di osservazione sul testo.
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
        corpo.append(h('p', { class: 'attivita__spiegazione' }, a.spiegazione), elencoFonti(a.fonti) ?? '');
        risolta();
      });
      opzioni.append(b);
    });
    corpo.append(
      h('div', { class: 'scheda__testa' }, h('span', { class: 'occhiello' }, 'Osserva il testo')),
      h('p', { class: 'scheda__consegna' }, a.domanda),
      opzioni,
    );
  }
}
