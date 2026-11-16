import type { Passo, Ruolo } from '@/contenuti/tipi';
import { b } from './base';
import { MATTINO, palcoMattino } from './racconto';

const det = (id: string): Passo => ({ t: 'dettaglio', id });
const senti = (id: string): Passo => ({ t: 'senti', id });
const io = 'ioas';

/**
 * Il punto di vista di Ioas, padre di Gedeone: l’altare di Baal era suo, ma quando la
 * città vuole uccidere suo figlio lo difende (Giudici 6:25-32). È la stessa scena che
 * vivono Gedeone (da dentro casa) e Geova (racconto.ts); la Bibbia non dice che Ioas
 * fosse presente altrove nel racconto, perciò il suo punto di vista finisce qui.
 */
export const ioas: Ruolo = {
  id: 'ioas',
  nome: 'Ioas',
  titolo: 'Il padre che difese il figlio',
  descrizione: 'Al mattino il tuo altare di Baal è demolito, e la città vuole la morte di tuo figlio. Che cosa rispondi?',
  fedelta: 'Giudici 6:25-32 e 7:1. Le parole di Ioas e degli uomini della città sono quelle del testo; non gli vengono attribuiti pensieri.',
  modo: 'cammina',
  stile: 'ioas',
  durata: '4-5 minuti',
  conclusione: 'Hai vissuto il racconto nei panni di Ioas',
  scene: [
    {
      id: 'ioas-mattina',
      titolo: '«Porta fuori tuo figlio!»',
      luogo: 'Ofra, il mattino dopo',
      // Al mattino l’altare di Baal è a terra e c’è il nuovo altare con il toro offerto (Giudici 6:28).
      ...palcoMattino(io),
      inizioX: 1350,
      ingresso: [
        {
          t: 'narra',
          titolo: 'Sei Ioas l’abiezerita',
          testo: 'Sei Ioas, padre di Gedeone. Questa mattina gli uomini della città si sono alzati presto, e hanno trovato qualcosa di cambiato.',
          certezza: 'scritto',
          fonti: [b('Giudici', 6, '11'), b('Giudici', 6, '28')],
        },
      ],
      punti: [
        { id: 'altare', x: 1650, tipo: 'esamina', etichetta: 'Il tuo altare', passi: [det('altare-padre')] },
        {
          id: 'citta',
          x: 1700,
          tipo: 'ascolta',
          etichetta: 'Gli uomini della città',
          richiede: ['altare'],
          passi: [...MATTINO.accusa(), det('minaccia')],
        },
        {
          id: 'rispondi',
          x: 1600,
          tipo: 'agisci',
          etichetta: 'Rispondi',
          richiede: ['citta'],
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'completa',
                id: 'ierubbaal',
                consegna: 'Che cosa rispondi, e che nome dai a tuo figlio? Completa il versetto.',
                verso: 'gdc-6-31',
                testo: 'Iòas rispose a tutti quelli che lo fronteggiavano: “Dovete essere voi a difendere [[Bàal]]? Dovete essere voi a salvarlo? Chiunque lo difenda dev’essere messo a morte questa mattina stessa. Se è un dio si difenda da [[solo]], visto che il suo altare è stato demolito”. E quel giorno diede a Gedeone il nome di [[Ierubbàal]], dicendo: “Bàal si difenda, visto che il suo altare è stato demolito”.',
                distrattori: ['Geova', 'voi', 'Iòas'],
              },
            },
            ...MATTINO.difesa(io),
            det('nome'),
            senti('i-figlio'),
          ],
        },
      ],
    },
  ],
  epilogo: [],
};
