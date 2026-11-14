import type { Passo, Ruolo } from '@/contenuti/tipi';
import { F, b } from './base';
import { campoMadian, harod, ofra } from './scenari';

const det = (id: string): Passo => ({ t: 'dettaglio', id });
const senti = (id: string): Passo => ({ t: 'senti', id });

/**
 * Il punto di vista di Geova. Non viene raffigurato e non gli vengono attribuite parole
 * oltre al testo: compie soltanto gli atti che Giudici 6–7 gli attribuisce (manda un
 * profeta e un angelo, dà i segni, riduce l’esercito, fa sentire il sogno, volge la
 * spada dei nemici l’uno contro l’altro).
 */
export const geova: Ruolo = {
  id: 'geova',
  nome: 'Geova',
  titolo: 'Ciò che Geova vede e fa',
  descrizione: 'Rispondi al grido del popolo con un profeta e un salvatore, assecondi con pazienza i segni chiesti da Gedeone, riduci il suo esercito a 300 uomini.',
  fedelta:
    'Geova non viene raffigurato. Compie solo gli atti che Giudici 6 e 7 gli attribuiscono, spiegati dal libro e dalle pubblicazioni che cita: nessuna parola e nessun pensiero gli vengono attribuiti oltre a ciò che è scritto.',
  modo: 'osserva',
  stile: 'nessuno',
  durata: '8-10 minuti',
  conclusione: 'Hai ripercorso ciò che fece Geova',
  scene: [
    {
      id: 'geova-ofra',
      titolo: 'Sette anni',
      luogo: 'Israele sotto Madian',
      ...ofra(false, 2200),
      inizioX: 700,
      ingresso: [
        {
          t: 'narra',
          titolo: 'Il punto di vista di Geova',
          testo: 'Qui non muovi un personaggio: sposti lo sguardo sul paese. Le azioni che compirai sono soltanto quelle che il racconto attribuisce a Geova.',
        },
        {
          t: 'narra',
          testo: 'Gli israeliti hanno fatto di nuovo ciò che è male agli occhi di Geova. Ora, impoveriti da Madian, lo supplicano di aiutarli.',
          certezza: 'scritto',
          fonti: [b('Giudici', 6, '1-6')],
        },
      ],
      punti: [
        { id: 'profeta', x: 1350, tipo: 'agisci', etichetta: 'Manda un profeta', passi: [det('profeta')] },
        {
          id: 'vello',
          x: 900,
          tipo: 'agisci',
          etichetta: 'Rispondi alla richiesta del vello',
          richiede: ['profeta'],
          passi: [
            {
              t: 'narra',
              testo: 'La prima notte la rugiada è solo sul vello; la seconda, solo il vello resta asciutto.',
              certezza: 'scritto',
              fonti: [b('Giudici', 6, '37-40')],
            },
            det('paziente'),
          ],
        },
      ],
    },
    {
      id: 'geova-harod',
      titolo: 'Troppi uomini',
      luogo: 'La sorgente di Harod',
      ...harod(2200),
      inizioX: 900,
      folle: [{ x0: 500, x1: 1400, n: 18, seme: 311, armati: 0.4, comportamento: 'vaga' }],
      ingresso: [
        {
          t: 'narra',
          testo: 'Gedeone si è accampato presso la sorgente di Harod con 32.000 uomini.',
          certezza: 'libro',
          fonti: [b('Giudici', 7, '1'), F.libro],
        },
      ],
      punti: [
        {
          id: 'troppi',
          x: 1100,
          tipo: 'leggi',
          etichetta: 'Perché meno uomini?',
          passi: [
            {
              t: 'attivita',
              a: {
                tipo: 'completa',
                id: 'vantarsi',
                consegna: 'Che cosa dice Geova a Gedeone? Completa il versetto.',
                verso: 'gdc-7-2',
                testo: 'Geova disse ora a Gedeone: “Ci sono troppi uomini con te perché io dia Màdian in mano loro. Altrimenti Israele potrebbe [[vantarsi]] e dire contro di me: ‘È stata la mia [[mano]] a salvarmi’.',
                distrattori: ['pentirsi', 'spada'],
              },
            },
            det('pochi'),
            senti('g-pochi'),
          ],
        },
      ],
    },
    {
      id: 'geova-notte',
      titolo: 'Un sogno nella notte',
      luogo: 'L’accampamento di Madian',
      ...campoMadian(2400),
      inizioX: 1200,
      folle: [{ x0: 500, x1: 1900, n: 16, seme: 313, armati: 0.6, comportamento: 'vaga' }],
      ingresso: [
        {
          t: 'narra',
          testo: 'Gedeone e il suo servitore Pura sono scesi di notte ai margini dell’accampamento nemico.',
          certezza: 'scritto',
          fonti: [b('Giudici', 7, '10, 11')],
        },
      ],
      punti: [
        { id: 'sogno', x: 1400, tipo: 'agisci', etichetta: 'Fa’ sentire il sogno', passi: [det('sogno')] },
        {
          id: 'spada',
          x: 1800,
          tipo: 'agisci',
          etichetta: 'Volgi la spada dell’uno contro l’altro',
          richiede: ['sogno'],
          passi: [
            {
              t: 'narra',
              testo: 'Al suono dei 300 corni, nell’accampamento tutti si mettono a correre e a urlare, e si danno alla fuga.',
              certezza: 'scritto',
              fonti: [b('Giudici', 7, '21, 22')],
            },
          ],
        },
      ],
    },
  ],
  epilogo: [],
};
