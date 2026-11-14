import { capitoloDi, chiave, PUBBLICAZIONI, tuttiICapitoli } from '@/contenuti';
import type { Capitolo, Ruolo } from '@/contenuti/tipi';
import { Partita, type Ascoltatori } from '@/motore/partita';
import { NOME_GIOCO, type Contesto } from '../contesto';
import { h } from '../dom';
import { indirizzo } from '../indirizzi';
import { apriFonti, apriGuida } from '../pannelli';

const ASCOLTATORI_MUTI: Ascoltatori = {
  mostra: (_p, avanti) => avanti(),
  chiudiScheda: () => {},
  invito: () => {},
  stato: () => {},
  scenaCompletata: () => {},
  fine: () => {},
};

/** Il racconto lasciato a metà più di recente, se c’è. */
function inCorso(cx: Contesto): { cap: Capitolo; ruolo: Ruolo; scena: number } | null {
  for (const cap of tuttiICapitoli()) {
    for (const ruolo of cap.ruoli) {
      const p = cx.salvataggio.ruolo(chiave(cap), ruolo.id);
      if (p.scena > 0 && !p.finito) return { cap, ruolo, scena: p.scena };
    }
  }
  return null;
}

/** Una scena della prima pubblicazione che scorre dietro al titolo. */
function avviaVetrina(cx: Contesto, tela: HTMLCanvasElement): void {
  const pub = PUBBLICAZIONI[0];
  const cap = capitoloDi(pub, pub.vetrina.capitolo);
  if (!cap) return;
  const ruolo: Ruolo = {
    id: 'vetrina',
    nome: '',
    titolo: '',
    descrizione: '',
    fedelta: '',
    modo: 'cammina',
    stile: pub.vetrina.stile,
    durata: '',
    conclusione: '',
    scene: [{ id: 'vetrina', titolo: '', luogo: '', ...pub.vetrina.scena, inizioX: 240, punti: [] }],
    epilogo: [],
  };
  const vetrina = new Partita(tela, cap, ruolo, {
    ...ASCOLTATORI_MUTI,
    // Arrivati in fondo, si ricomincia.
    fine: () => {
      vetrina.ferma();
      vetrina.avvia(0);
      vetrina.muovi(1);
    },
  });
  vetrina.avvia(0);
  vetrina.muovi(1);
  cx.allUscita(() => vetrina.ferma());
  cx.osservaTela(tela, () => vetrina.adatta());
}

export function schermoIniziale(cx: Contesto): void {
  cx.schermo.className = 'schermo schermo--inizio';
  const tela = h('canvas', { class: 'inizio__tela', 'aria-hidden': 'true' });
  const ripresa = inCorso(cx);
  const una = PUBBLICAZIONI.length === 1;
  cx.schermo.append(
    tela,
    h(
      'div',
      { class: 'inizio' },
      h('p', { class: 'occhiello' }, 'Avventura di studio'),
      h('h1', { class: 'inizio__titolo' }, NOME_GIOCO),
      h(
        'p',
        { class: 'inizio__testo' },
        'Rivivi i racconti della Bibbia dal punto di vista di chi c’era, con le pubblicazioni che li spiegano: per notare i dettagli e chiederti che cosa provarono.',
      ),
      h(
        'div',
        { class: 'inizio__azioni' },
        PUBBLICAZIONI.map((pub, i) =>
          h(
            'button',
            { class: `bottone bottone--grande${i === 0 ? ' bottone--primario' : ''}`, type: 'button', onclick: () => cx.vai(indirizzo.indice(pub.id)) },
            una ? `Apri ${pub.breve}` : `«${pub.titolo}»`,
          ),
        ),
        ripresa
          ? h(
              'button',
              { class: 'bottone bottone--grande', type: 'button', onclick: () => cx.vai(indirizzo.gioca(ripresa.cap, ripresa.ruolo)) },
              `Riprendi: ${ripresa.ruolo.nome}, tappa ${ripresa.scena + 1}`,
            )
          : null,
      ),
      h(
        'div',
        { class: 'inizio__secondarie' },
        h('button', { class: 'bottone bottone--testo', type: 'button', onclick: () => apriGuida(cx) }, 'Come si gioca'),
        h('button', { class: 'bottone bottone--testo', type: 'button', onclick: () => apriFonti(cx) }, 'Fonti e fedeltà'),
        h(
          'button',
          {
            class: 'bottone bottone--testo esci',
            type: 'button',
            onclick: () => {
              cx.salvataggio.esci();
              cx.vai(indirizzo.inizio());
            },
          },
          `Esci (${cx.salvataggio.utente})`,
        ),
      ),
    ),
    h('p', { class: 'inizio__nota' }, 'Progetto di studio personale, non ufficiale. Testi, audio e immagini delle pubblicazioni si trovano su jw.org.'),
  );
  avviaVetrina(cx, tela);
}
