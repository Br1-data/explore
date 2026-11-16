import type { Passo, Ruolo } from '@/contenuti/tipi';
import { b } from './base';
import { FINESTRA, palcoFinestra } from './racconto';

const det = (id: string): Passo => ({ t: 'dettaglio', id });
const senti = (id: string): Passo => ({ t: 'senti', id });
const io = 'madre';

/**
 * Il punto di vista della madre di Sisera.
 *
 * Compare soltanto nel canto di Debora e Barac (Giudici 5:28-30) e la Bibbia non
 * ne riporta il nome. Le sue parole sono quelle del canto; il resto viene dalle
 * pubblicazioni, e dove il testo tace il gioco lo dice.
 */
export const madre: Ruolo = {
  id: 'madre',
  nome: 'La madre di Sisera',
  titolo: 'Un’attesa vana',
  descrizione: 'Aspetti alla finestra il ritorno di tuo figlio vittorioso. Le tue dame ti rassicurano. Il carro non arriva.',
  fedelta:
    'Compare soltanto nel canto ispirato di Debora e Barac (Giudici 5:28-30), senza nome: qui non c’è altro. Non è un modello da imitare: mostra che cosa si aspettava chi stava dalla parte dei nemici di Dio.',
  modo: 'cammina',
  stile: 'madre',
  durata: '5 minuti',
  conclusione: 'Hai visto il racconto dalla finestra di Aroset',
  scene: [
    {
      id: 'madre-finestra',
      titolo: 'Alla finestra',
      luogo: 'Nella casa di Sisera',
      ...palcoFinestra(io),
      inizioX: 780,
      ingresso: [
        {
          t: 'narra',
          titolo: 'Sei la madre di Sisera',
          testo:
            'La Bibbia non riporta il tuo nome: compari soltanto nel canto di Debora e Barac, mentre aspetti il ritorno di tuo figlio.',
          certezza: 'scritto',
          fonti: [b('Giudici', 5, '28')],
        },
      ],
      punti: [
        {
          id: 'finestra',
          x: 670,
          tipo: 'osserva',
          etichetta: 'Dalla grata',
          passi: [
            ...FINESTRA.attesa(io),
            {
              t: 'attivita',
              a: {
                tipo: 'completa',
                id: 'finestra',
                consegna: 'Il canto ti descrive così. Completa il versetto.',
                verso: 'gdc-5-28',
                testo:
                  'Dalla finestra una donna guardava fuori, dalla [[grata]] la madre di Sìsera scrutava: ‘Perché il suo [[carro]] ancora non arriva? Perché tarda tanto lo scalpitio dei suoi [[cavalli]]?’',
                distrattori: ['porta', 'esercito', 'servi'],
              },
            },
            det('invano'),
          ],
        },
        {
          id: 'dame',
          x: 1060,
          tipo: 'ascolta',
          etichetta: 'Le tue dame',
          passi: [...FINESTRA.dame(io), { t: 'verso', id: 'gdc-5-29', evidenzia: ['Si staranno dividendo le spoglie'] }, det('grembo')],
        },
        {
          id: 'mondo',
          x: 930,
          tipo: 'esamina',
          etichetta: 'Il mondo in cui vivi',
          passi: [det('religione')],
        },
        {
          id: 'strada',
          x: 1420,
          tipo: 'leggi',
          etichetta: 'La strada da cui dovrebbe tornare',
          richiede: ['finestra', 'dame', 'mondo'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'classifica',
                id: 'due-donne',
                consegna: 'Nel canto, subito prima di te, si parla di un’altra donna. Di chi si dice ciascuna cosa?',
                categorie: ['Iael', 'La madre di Sisera'],
                voci: [
                  { testo: 'Vive in una tenda', cat: 0, fonti: [b('Giudici', 5, '24')] },
                  { testo: 'Guarda fuori da una grata', cat: 1, fonti: [b('Giudici', 5, '28')] },
                  { testo: 'Offre latte in una splendida coppa', cat: 0, fonti: [b('Giudici', 5, '25')] },
                  { testo: 'Ha intorno a sé delle dame', cat: 1, fonti: [b('Giudici', 5, '29')] },
                  { testo: 'Si aspetta stoffe tinte e ricamate', cat: 1, fonti: [b('Giudici', 5, '30')] },
                  { testo: 'È chiamata benedetta fra le donne', cat: 0, fonti: [b('Giudici', 5, '24')] },
                ],
                spiegazione: 'Nel canto le due scene si susseguono: prima Iael nella sua tenda, poi la madre di Sisera alla finestra.',
              },
            },
            det('silenzio-madre'),
            senti('m-attesa'),
          ],
        },
      ],
    },
  ],
  epilogo: [],
};
