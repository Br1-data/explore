import { chiave } from '@/contenuti';
import type { Capitolo, Ruolo } from '@/contenuti/tipi';
import { Partita, type Ascoltatori, type Invito, type StatoScena } from '@/motore/partita';
import { NOME_GIOCO, type Contesto } from '../contesto';
import { h, icona, svuota } from '../dom';
import { VERBI } from '../etichette';
import { indirizzo } from '../indirizzi';
import { apriQuaderno, chiediUscita } from '../pannelli';
import { Scheda } from '../schede';

/** Ciò che l’app deve sapere del racconto in corso (tastiera, pause, conteggio). */
export interface SessioneGioco {
  partita: Partita;
  scheda: Scheda;
  aggiornaConteggio: () => void;
}

/** Il racconto nei panni di un personaggio: la tela, l’HUD, i comandi, le schede. */
export function avviaGioco(cx: Contesto, cap: Capitolo, ruolo: Ruolo): SessioneGioco {
  document.title = `${ruolo.nome} · ${cap.nome} · ${NOME_GIOCO}`;
  cx.schermo.hidden = true;
  cx.gioco.hidden = false;
  const k = chiave(cap);

  const tela = h('canvas', { class: 'gioco__tela', 'aria-label': 'La scena del racconto' });
  const luogo = h('span', { class: 'hud__luogo' });
  const titolo = h('strong', { class: 'hud__titolo' });
  const tappe = h('div', { class: 'tappe', 'aria-hidden': 'true' });
  const punti = h('span', { class: 'hud__punti' });
  const conta = h('b', null, '0');
  const audio = h('button', { class: 'tondo', type: 'button', 'aria-label': 'Audio' });
  const invito = h('button', { class: 'invito', type: 'button', hidden: true });
  const prosegui = h('button', { class: 'bottone bottone--primario prosegui', type: 'button', hidden: true }, 'Prosegui');
  const zonaScheda = h('div', { class: 'scheda-zona', hidden: true });
  const sinistra = h('button', { class: 'tondo tondo--grande', type: 'button', 'aria-label': 'Vai a sinistra' }, '‹');
  const destra = h('button', { class: 'tondo tondo--grande', type: 'button', 'aria-label': 'Vai a destra' }, '›');
  const aiuto = h('p', { class: 'hud__aiuto' });
  // Il modo può cambiare da una scena all’altra (es. Noè ancora dentro l’arca).
  const mostraModo = (modo: 'cammina' | 'osserva'): void => {
    cx.gioco.dataset['modo'] = modo;
    aiuto.textContent = `← → ${modo === 'osserva' ? 'sposta lo sguardo' : 'cammina'} · tocca o E per interagire · Q quaderno`;
  };
  mostraModo(ruolo.modo);

  const aggiornaAudio = (): void => {
    svuota(audio);
    audio.append(icona(cx.suono.muto ? 'muto' : 'audio'));
    audio.setAttribute('aria-label', cx.suono.muto ? 'Attiva l’audio' : 'Disattiva l’audio');
  };
  audio.addEventListener('click', () => {
    cx.suono.muto = !cx.suono.muto;
    cx.salvataggio.muto = cx.suono.muto;
    aggiornaAudio();
  });
  aggiornaAudio();

  const totali = Object.keys(cap.dettagli).length;
  const aggiornaConteggio = (): void => {
    conta.textContent = `${cx.salvataggio.dettagli(k).length}/${totali}`;
  };
  aggiornaConteggio();

  cx.gioco.append(
    tela,
    h(
      'div',
      { class: 'hud hud--alto' },
      h('button', { class: 'tondo', type: 'button', 'aria-label': 'Esci dal racconto', onclick: () => chiediUscita(cx, cap) }, '‹'),
      h('div', { class: 'hud__scena' }, luogo, titolo, h('div', { class: 'hud__riga' }, tappe, punti)),
      h(
        'div',
        { class: 'hud__destra' },
        h(
          'button',
          { class: 'bottone bottone--hud', type: 'button', 'aria-label': 'Quaderno di studio', onclick: () => apriQuaderno(cx, cap) },
          icona('quaderno'),
          h('span', { class: 'hud__etichetta' }, 'Quaderno'),
          conta,
        ),
        audio,
      ),
    ),
    h('div', { class: 'hud hud--basso' }, h('div', { class: 'comandi' }, sinistra, destra), invito, prosegui),
    aiuto,
    zonaScheda,
  );

  const scheda = new Scheda(zonaScheda, { capitolo: cap, salvataggio: cx.salvataggio, suono: cx.suono, aggiornato: aggiornaConteggio });

  const ascoltatori: Ascoltatori = {
    mostra: (passo, avanti) => {
      cx.gioco.classList.add('gioco--scheda');
      scheda.mostra(passo, avanti);
    },
    chiudiScheda: () => {
      cx.gioco.classList.remove('gioco--scheda');
      scheda.chiudi();
    },
    invito: (i: Invito | null) => {
      invito.hidden = !i;
      if (i) {
        svuota(invito);
        invito.dataset['tipo'] = i.tipo;
        invito.dataset['punto'] = i.id;
        invito.append(h('span', { class: 'invito__verbo' }, VERBI[i.tipo]), h('span', { class: 'invito__testo' }, i.testo), h('kbd', null, 'E'));
      }
    },
    stato: (s: StatoScena) => {
      luogo.textContent = `${ruolo.nome} · ${s.luogo}`;
      titolo.textContent = s.titolo;
      svuota(tappe);
      for (let i = 0; i < s.totale; i++) {
        tappe.append(h('i', { class: i < s.indice ? 'tappa tappa--fatta' : i === s.indice ? 'tappa tappa--ora' : 'tappa' }));
      }
      const [trovati, indizi] = s.indizi;
      punti.textContent = `${s.fatti} di ${s.obbligatori}${indizi ? ` · indizi ${trovati}/${indizi}` : ''}`;
      prosegui.hidden = !s.completa;
      prosegui.textContent = s.ultima ? 'Concludi il racconto' : 'Prosegui';
      if (s.completa && s.facoltativiRimasti > 0) {
        prosegui.title = `Qui c’è ancora ${s.facoltativiRimasti === 1 ? 'un dettaglio facoltativo' : `${s.facoltativiRimasti} dettagli facoltativi`}`;
      } else prosegui.removeAttribute('title');
      cx.gioco.dataset['scena'] = String(s.indice);
      mostraModo(s.modo);
      cx.gioco.style.setProperty('--suolo', s.suolo);
    },
    scenaCompletata: (indice) => cx.salvataggio.segnaScena(k, ruolo.id, indice + 1),
    fine: () => {
      cx.salvataggio.segnaFinito(k, ruolo.id);
      cx.vai(indirizzo.fine(cap, ruolo));
    },
    passo: () => cx.suono.passo(),
    evento: (cosa, x) => cx.suono.evento(cosa, x),
    paesaggio: (p) => cx.suono.paesaggio(p),
  };

  const partita = new Partita(tela, cap, ruolo, ascoltatori);
  cx.allUscita(() => partita.ferma());
  // Appigli per le prove automatiche (e2e/percorsi.mjs).
  (window as unknown as { __partita?: unknown }).__partita = partita;
  (window as unknown as { __suono?: unknown }).__suono = cx.suono;

  invito.addEventListener('click', () => partita.azione());
  prosegui.addEventListener('click', () => partita.prosegui());
  tela.addEventListener('pointerdown', (e) => {
    const r = tela.getBoundingClientRect();
    // Un tocco sulla scena salta le pause del racconto oppure indica dove andare.
    if (!partita.azioneSeInAttesa()) partita.vaiVerso(e.clientX - r.left, r.width);
  });
  for (const [bottone, dir] of [
    [sinistra, -1],
    [destra, 1],
  ] as const) {
    bottone.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      bottone.setPointerCapture(e.pointerId);
      partita.muovi(dir);
    });
    for (const fine of ['pointerup', 'pointercancel', 'lostpointercapture'] as const) {
      bottone.addEventListener(fine, () => partita.muovi(0));
    }
    bottone.addEventListener('contextmenu', (e) => e.preventDefault());
  }
  cx.osservaTela(tela, () => partita.adatta());

  const progresso = cx.salvataggio.ruolo(k, ruolo.id);
  partita.avvia(progresso.finito ? 0 : progresso.scena);
  return { partita, scheda, aggiornaConteggio };
}
