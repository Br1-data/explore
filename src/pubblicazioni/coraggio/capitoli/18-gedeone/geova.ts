import type { Passo, Ruolo } from '@/contenuti/tipi';
import { b } from './base';
import {
  CAMPO,
  GOVERNO,
  HAROD,
  MATTINO,
  NOTTE,
  TORCHIO,
  VELLO,
  palcoCampo,
  palcoGoverno,
  palcoHarod,
  palcoMattino,
  palcoNotte,
  palcoTorchio,
  palcoVello,
} from './racconto';

const det = (id: string): Passo => ({ t: 'dettaglio', id });
const senti = (id: string): Passo => ({ t: 'senti', id });
const io = 'geova';

/**
 * Il punto di vista di Geova. Non viene raffigurato e non gli vengono attribuite parole
 * oltre al testo: vede tutto il racconto (racconto.ts) e compie soltanto gli atti che
 * Giudici 6–8 gli attribuisce (manda un profeta e un angelo, mette alla prova Gedeone,
 * gli dà il suo spirito e i segni, riduce l’esercito, fa sentire il sogno, volge la
 * spada dei nemici l’uno contro l’altro).
 */
export const geova: Ruolo = {
  id: 'geova',
  nome: 'Geova',
  titolo: 'Ciò che Geova vede e fa',
  descrizione:
    'Rispondi al grido del popolo con un profeta e un angelo, metti alla prova Gedeone, dai il tuo spirito e i segni del vello, riduci il suo esercito a 300 uomini, gli fai sentire il sogno e volgi la spada dei nemici l’uno contro l’altro.',
  fedelta:
    'Geova non viene raffigurato. Compie solo gli atti che Giudici 6–8 gli attribuisce, spiegati dal libro e dalle pubblicazioni che cita: nessuna parola e nessun pensiero gli vengono attribuiti oltre a ciò che è scritto.',
  modo: 'osserva',
  stile: 'nessuno',
  durata: '18-22 minuti',
  conclusione: 'Hai ripercorso ciò che fece Geova',
  scene: [
    {
      id: 'geova-ofra',
      titolo: 'Sette anni',
      luogo: 'Ofra, sotto il grande albero',
      ...palcoTorchio(io),
      inizioX: 1000,
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
          id: 'angelo',
          x: 760,
          tipo: 'agisci',
          etichetta: 'Manda il tuo angelo',
          richiede: ['profeta'],
          passi: [
            {
              t: 'narra',
              testo: 'Gedeone, figlio di Ioas, batte il grano nel torchio per il vino, per nasconderlo alla vista di Madian. L’angelo di Geova si siede sotto il grande albero.',
              certezza: 'scritto',
              fonti: [b('Giudici', 6, '11')],
            },
            ...TORCHIO.appare(),
            ...TORCHIO.dialogo(io),
            det('potenza'),
          ],
        },
        {
          id: 'segno',
          x: 560,
          tipo: 'agisci',
          etichetta: 'Dai il segno che Gedeone chiede',
          richiede: ['angelo'],
          passi: [
            {
              t: 'narra',
              testo: 'Gedeone chiede un segno e porta un dono: carne di capretto, pane senza lievito e brodo. L’angelo gli dice di metterli sulla grande roccia.',
              certezza: 'scritto',
              fonti: [b('Giudici', 6, '17-20')],
            },
            ...TORCHIO.dono(io),
            ...TORCHIO.fuoco(io),
            det('rassicura'),
            ...TORCHIO.altare(),
          ],
        },
      ],
    },
    {
      id: 'geova-notte',
      titolo: 'La prova',
      luogo: 'Ofra, di notte',
      ...palcoNotte(io),
      inizioX: 1500,
      ingresso: [
        {
          t: 'narra',
          testo: 'Quella notte, a Ofra. L’altare di Baal appartiene a Ioas, il padre di Gedeone.',
          certezza: 'scritto',
          fonti: [b('Giudici', 6, '25')],
        },
      ],
      punti: [
        {
          id: 'comando',
          x: 1400,
          tipo: 'agisci',
          etichetta: 'Da’ a Gedeone il tuo comando',
          passi: [
            {
              t: 'narra',
              testo: 'Geova dice a Gedeone di prendere il secondo giovane toro di suo padre, di demolire l’altare di Baal, di abbattere il palo sacro e di erigere un altare a Geova.',
              certezza: 'scritto',
              fonti: [b('Giudici', 6, '25, 26')],
            },
            det('prova'),
          ],
        },
        {
          id: 'eseguito',
          x: 1680,
          tipo: 'osserva',
          etichetta: 'Gedeone e i suoi servitori',
          richiede: ['comando'],
          passi: [
            ...NOTTE.demolisci(io),
            ...NOTTE.erigi(io),
            {
              t: 'narra',
              testo: 'Gedeone fa proprio come Geova gli ha detto, con dieci servitori. Per timore della città, lo fa di notte.',
              certezza: 'scritto',
              fonti: [b('Giudici', 6, '27')],
            },
          ],
        },
      ],
    },
    {
      id: 'geova-mattino',
      titolo: 'Baal non si difende',
      luogo: 'Ofra, il mattino dopo',
      ...palcoMattino(io),
      inizioX: 1700,
      ingresso: [
        {
          t: 'narra',
          testo: 'Al mattino gli uomini della città trovano l’altare di Baal demolito e il toro offerto sul nuovo altare.',
          certezza: 'scritto',
          fonti: [b('Giudici', 6, '28')],
        },
      ],
      punti: [
        { id: 'accusa', x: 1850, tipo: 'ascolta', etichetta: 'Gli uomini della città', passi: MATTINO.accusa() },
        {
          id: 'difesa',
          x: 1600,
          tipo: 'ascolta',
          etichetta: 'Ioas risponde',
          richiede: ['accusa'],
          passi: [...MATTINO.difesa(io), senti('g-baal')],
        },
      ],
    },
    {
      id: 'geova-vello',
      titolo: 'Il vello',
      luogo: 'L’aia, di notte e al mattino',
      ...palcoVello(io),
      inizioX: 600,
      ingresso: [
        {
          t: 'narra',
          testo: 'Madian, Amalec e gli orientali hanno unito le forze e si sono accampati nella Valle di Izreel.',
          certezza: 'scritto',
          fonti: [b('Giudici', 6, '33')],
        },
      ],
      punti: [
        {
          id: 'spirito',
          x: 520,
          tipo: 'agisci',
          etichetta: 'Fa’ venire il tuo spirito su Gedeone',
          passi: [...VELLO.corno(io), det('spirito')],
        },
        {
          id: 'vello',
          x: 1050,
          tipo: 'osserva',
          etichetta: 'Gedeone stende il vello',
          richiede: ['spirito'],
          passi: [
            {
              t: 'narra',
              testo: 'Gedeone chiede a Dio un segno: la rugiada solo sul vello, il terreno intorno asciutto.',
              certezza: 'scritto',
              fonti: [b('Giudici', 6, '36, 37')],
            },
            ...VELLO.stendi(io),
          ],
        },
        {
          id: 'rugiada',
          x: 1100,
          tipo: 'agisci',
          etichetta: 'Fa’ cadere la rugiada solo sul vello',
          richiede: ['vello'],
          passi: VELLO.rugiada(),
        },
        {
          id: 'asciutto',
          x: 1150,
          tipo: 'agisci',
          etichetta: 'Esaudisci anche la seconda richiesta',
          richiede: ['rugiada'],
          passi: [
            {
              t: 'narra',
              testo: 'Gedeone chiede di non adirarsi con lui e di fare un’altra prova: questa volta il vello asciutto e la rugiada su tutto il terreno.',
              certezza: 'scritto',
              fonti: [b('Giudici', 6, '39')],
            },
            ...VELLO.asciutto(),
            det('paziente'),
          ],
        },
      ],
    },
    {
      id: 'geova-harod',
      titolo: 'Troppi uomini',
      luogo: 'La sorgente di Harod',
      ...palcoHarod(io),
      inizioX: 900,
      ingresso: [
        {
          t: 'narra',
          testo: 'Gedeone si è accampato presso la sorgente di Harod con tutti quelli che hanno risposto alla chiamata.',
          certezza: 'scritto',
          fonti: [b('Giudici', 7, '1')],
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
            ...HAROD.annuncio(io),
            senti('g-pochi'),
          ],
        },
        {
          id: 'acqua',
          x: 1150,
          tipo: 'agisci',
          etichetta: 'Metti alla prova gli uomini all’acqua',
          richiede: ['troppi'],
          passi: [...HAROD.acqua(), det('pochi')],
        },
      ],
    },
    {
      id: 'geova-campo',
      titolo: 'Un sogno nella notte',
      luogo: 'L’accampamento di Madian',
      ...palcoCampo(io),
      inizioX: 1200,
      ingresso: [
        {
          t: 'narra',
          testo: 'Quella notte Geova dice a Gedeone di attaccare l’accampamento, e, se ha paura, di scendervi prima con il suo servitore Pura ad ascoltare ciò che diranno.',
          certezza: 'scritto',
          fonti: [b('Giudici', 7, '9-11')],
        },
      ],
      punti: [
        {
          id: 'sogno',
          x: 1400,
          tipo: 'agisci',
          etichetta: 'Fa’ sentire il sogno',
          passi: [...CAMPO.scendi(io), ...CAMPO.sogno(io), det('sogno')],
        },
        {
          id: 'trecento',
          x: 500,
          tipo: 'osserva',
          etichetta: 'I 300 intorno all’accampamento',
          richiede: ['sogno'],
          passi: [...CAMPO.ritorno(io), ...CAMPO.schierati(), ...CAMPO.attacco(io)],
        },
        {
          id: 'spada',
          x: 1600,
          tipo: 'agisci',
          etichetta: 'Volgi la spada dell’uno contro l’altro',
          richiede: ['trecento'],
          passi: [det('spada')],
        },
      ],
    },
    {
      id: 'geova-pace',
      titolo: 'Sarà Geova a governarvi',
      luogo: 'Dopo la vittoria',
      ...palcoGoverno(io),
      inizioX: 1200,
      ingresso: [
        {
          t: 'narra',
          testo: 'Madian è sottomesso. Gli uomini d’Israele si radunano intorno a Gedeone.',
          certezza: 'scritto',
          fonti: [b('Giudici', 8, '22'), b('Giudici', 8, '28')],
        },
      ],
      punti: [
        {
          id: 'governo',
          x: 1250,
          tipo: 'ascolta',
          etichetta: 'Ciò che chiedono a Gedeone',
          passi: [...GOVERNO.richiesta(), ...GOVERNO.risposta(io), det('re')],
        },
      ],
    },
  ],
  epilogo: [],
};
