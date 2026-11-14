import { b, BIBBIA, LIBRO_BASE, RIVISTE, verso } from '@/contenuti/fonti';
import type { Dettaglio, Fonte, Sensazione, SezioneStudio, Verso, Vita } from '@/contenuti/tipi';

export { b };

/**
 * Capitolo 1 — Enoc: «Camminò con Dio».
 *
 * Tutto ciò che il gioco afferma su questo racconto sta qui, con la fonte.
 * Le parole messe tra «» sono citazioni; il resto è riassunto con parole nostre.
 */

export const URL_CAPITOLO = `${LIBRO_BASE}/dal-tempo-patriarchi-a-giudici/enoc-cammin%C3%B2-con-dio/`;
const URL_TEMPO = `${LIBRO_BASE}/dal-tempo-patriarchi-a-giudici/linea-tempo-patriarchi-giudici/`;

/**
 * Le vite di Genesi 5 sulla linea del tempo (anni a.E.V., quindi negativi).
 * Adamo, Enoc e Noè dalla linea del tempo del libro; le altre date sono
 * calcolate con gli anni di Genesi 5 e 9:29.
 */
export const VITE: Vita[] = [
  { nome: 'Adamo', nasce: -4026, muore: -3096 },
  { nome: 'Set', nasce: -3896, muore: -2984 },
  { nome: 'Enos', nasce: -3791, muore: -2886 },
  { nome: 'Chenan', nasce: -3701, muore: -2791 },
  { nome: 'Maalalel', nasce: -3631, muore: -2736 },
  { nome: 'Iared', nasce: -3566, muore: -2604 },
  { nome: 'Enoc', nasce: -3404, muore: -3039 },
  { nome: 'Matusalemme', nasce: -3339, muore: -2370 },
  { nome: 'Lamec', nasce: -3152, muore: -2375 },
  { nome: 'Noè', nasce: -2970, muore: -2020 },
];

export const F = {
  libro: { rif: 'Libro, cap. 1 «Camminò con Dio»', url: URL_CAPITOLO } as Fonte,
  immagine: { rif: 'Libro, cap. 1, immagine d’apertura', url: URL_CAPITOLO } as Fonte,
  immagineA: { rif: 'Libro, cap. 1, immagine A', url: URL_CAPITOLO } as Fonte,
  fondo: (n: number): Fonte => ({ rif: `Libro, cap. 1, «Vai più a fondo» n. ${n}`, url: URL_CAPITOLO }),
  riguarda: { rif: 'Libro, cap. 1, «Una storia che ti riguarda»', url: URL_CAPITOLO } as Fonte,
  prospettiva: { rif: 'Libro, cap. 1, «Una prospettiva più ampia»', url: URL_CAPITOLO } as Fonte,
  tempo: { rif: 'Libro, «Linea del tempo della Parte 1»', url: URL_TEMPO } as Fonte,
  w01: {
    rif: 'La Torre di Guardia 15/9/2001, pp. 29-31',
    url: `${RIVISTE}/w20010915/Enoc-cammin%C3%B2-con-Dio-in-un-mondo-empio/`,
  } as Fonte,
  w01riquadro: {
    rif: 'La Torre di Guardia 15/9/2001, riquadro a p. 30',
    url: `${RIVISTE}/w20010915/Enoc-cammin%C3%B2-con-Dio-in-un-mondo-empio/`,
  } as Fonte,
  w05: {
    rif: 'La Torre di Guardia 1/9/2005, pp. 13-17',
    url: `${RIVISTE}/w20050901/Camminate-con-Dio-in-questi-tempi-turbolenti/`,
  } as Fonte,
  w05p: (par: number): Fonte => ({
    rif: `La Torre di Guardia 1/9/2005, par. ${par}`,
    url: `${RIVISTE}/w20050901/Camminate-con-Dio-in-questi-tempi-turbolenti/`,
  }),
  w06: {
    rif: 'La Torre di Guardia 1/10/2006, p. 19 parr. 13-14',
    url: `${RIVISTE}/w20061001/Coraggiosi-grazie-alla-fede-e-al-santo-timore/#p19`,
  } as Fonte,
  apprEbr: {
    rif: 'Bibbia per lo studio, approfondimenti a Ebrei 11:5',
    url: `${BIBBIA}/ebrei/11/#v58011005`,
  } as Fonte,
};

export const VERSI: Record<string, Verso> = {
  'gen-3-15': verso(
    'Genesi 3:15',
    b('Genesi', 3, '15'),
    '«Io susciterò ostilità fra te e la donna, e fra la tua discendenza e la discendenza di lei. Lui ti schiaccerà la testa e tu lo colpirai al calcagno».',
    ['«ostilità»: o “inimicizia”.'],
  ),
  'gen-4-23': verso(
    'Genesi 4:23, 24',
    b('Genesi', 4, '23, 24'),
    'E Làmec compose questi versi per le sue mogli Ada e Zilla: «Ascoltate la mia voce, voi mogli di Làmec. Prestate attenzione a quello che dico: ho ucciso un uomo perché mi aveva ferito, ho ucciso un giovane perché mi aveva colpito. Se Caino dev’essere vendicato sette volte, allora Làmec settantasette volte».',
  ),
  'gen-4-26': verso(
    'Genesi 4:26',
    b('Genesi', 4, '26'),
    'Anche Set ebbe un figlio, che chiamò Ènos. In quel tempo si cominciò a invocare il nome di Geova.',
    ['«invocare»: evidentemente nel senso di “profanare”.'],
  ),
  'gen-5-21': verso(
    'Genesi 5:21-24',
    b('Genesi', 5, '21-24'),
    'Quanto a Ènoc, all’età di 65 anni generò Matusalemme. Dopo la nascita di Matusalemme, Ènoc continuò a camminare con il vero Dio per 300 anni. E generò figli e figlie. L’intera vita di Ènoc fu dunque di 365 anni. Ènoc continuò a camminare con il vero Dio. Poi nessuno lo vide più, perché Dio lo prese.',
    ['«Matusalemme»: o “Metusèla”.', '«con il vero Dio»: lett. “con il Dio”.', '«nessuno lo vide più»: o “non fu più”.'],
  ),
  'gen-5-24': verso(
    'Genesi 5:24',
    b('Genesi', 5, '24'),
    'Ènoc continuò a camminare con il vero Dio. Poi nessuno lo vide più, perché Dio lo prese.',
    ['«nessuno lo vide più»: o “non fu più”.'],
  ),
  'gen-5-25': verso(
    'Genesi 5:25-27',
    b('Genesi', 5, '25-27'),
    'Quanto a Matusalemme, all’età di 187 anni generò Làmec. Dopo la nascita di Làmec, Matusalemme visse 782 anni. E generò figli e figlie. L’intera vita di Matusalemme fu dunque di 969 anni; poi morì.',
  ),
  'gen-7-6': verso('Genesi 7:6', b('Genesi', 7, '6'), 'Noè aveva 600 anni quando il diluvio si abbatté sulla terra.'),
  'prov-27-11': verso(
    'Proverbi 27:11',
    b('Proverbi', 27, '11'),
    'Sii saggio, figlio mio, e rallegra il mio cuore, perché io possa rispondere a chi mi accusa.',
    ['«mi accusa»: o “sfida”, “biasima”.'],
  ),
  'ebr-11-5': verso(
    'Ebrei 11:5',
    b('Ebrei', 11, '5'),
    'Per fede Ènoc fu portato via in modo da non vedere la morte, e non fu più trovato perché Dio l’aveva portato via; infatti prima che fosse portato via ebbe la conferma di essere gradito a Dio.',
    ['«ebbe la conferma»: lett. “ricevette testimonianza”.'],
  ),
  'giuda-14': verso(
    'Giuda 14, 15',
    b('Giuda', 1, '14, 15'),
    'Ènoc, il settimo uomo nella discendenza di Adamo, profetizzò anche riguardo a loro quando disse: «Ecco, Geova è venuto con le sue sante miriadi per eseguire il giudizio contro tutti e dimostrare la colpevolezza di tutti gli empi per tutte le opere empie che hanno empiamente compiuto e per tutte le cose offensive che gli empi peccatori hanno detto contro di lui».',
    ['«miriadi»: o “decine di migliaia”.'],
  ),
  '2pt-2-5': verso(
    '2 Pietro 2:5',
    b('2 Pietro', 2, '5'),
    'Non si trattenne nemmeno dal punire il mondo antico, ma quando portò il diluvio su un mondo di empi salvò Noè, predicatore di giustizia, e altre sette persone.',
  ),
};

/** Il messaggio di Enoc, diviso in pezzi nell’ordine del testo (Giuda 14, 15). */
export const MESSAGGIO = [
  'Ecco, Geova è venuto',
  'con le sue sante miriadi',
  'per eseguire il giudizio contro tutti',
  'e dimostrare la colpevolezza di tutti gli empi',
  'per tutte le opere empie che hanno empiamente compiuto',
  'e per tutte le cose offensive',
  'che gli empi peccatori hanno detto contro di lui.',
];

export const MESSAGGIO_INTERO =
  'Ecco, Geova è venuto con le sue sante miriadi per eseguire il giudizio contro tutti e dimostrare la colpevolezza di tutti gli empi per tutte le opere empie che hanno empiamente compiuto e per tutte le cose offensive che gli empi peccatori hanno detto contro di lui.';

function d(
  id: string,
  titolo: string,
  testo: string,
  certezza: Dettaglio['certezza'],
  fonti: Fonte[],
): [string, Dettaglio] {
  return [id, { id, titolo, testo, certezza, fonti }];
}

export const DETTAGLI: Record<string, Dettaglio> = Object.fromEntries([
  // ——— Il tempo e il mondo di Enoc ———
  d(
    'settimo',
    'Il settimo da Adamo',
    'Giuda lo chiama «il settimo uomo nella discendenza di Adamo»: nella genealogia di Genesi 5 la sua è la settima generazione.',
    'scritto',
    [b('Giuda', 1, '14'), b('Genesi', 5, '3-18')],
  ),
  d(
    'adamo-vivo',
    'Adamo è ancora vivo',
    'Quando Enoc nasce, Adamo è ancora in vita, anche se molto vecchio. Morirà quando Enoc avrà 308 anni.',
    'numeri',
    [F.libro, F.tempo, b('Genesi', 5, '3-18')],
  ),
  d(
    'spirito-ribelle',
    'Uno spirito che si è diffuso',
    'Lo spirito ribelle di Adamo ed Eva si è diffuso in tutta la famiglia umana.',
    'libro',
    [F.libro],
  ),
  d(
    'norma',
    'La norma del tempo',
    'La condotta peccaminosa ed empia era diventata la norma. Il mondo di allora era simile al nostro: violento, blasfemo, empio.',
    'libro',
    [F.w01],
  ),
  d(
    'caino-abele',
    'Il primo uomo di fede, ucciso',
    'Caino ha assassinato suo fratello Abele, il primo uomo di fede.',
    'scritto',
    [b('Genesi', 4, '8'), b('Ebrei', 11, '4'), F.libro],
  ),
  d(
    'cinque-secoli',
    'Quasi cinque secoli',
    'Per quasi cinque secoli dopo la morte di Abele nessuno si era distinto come fedele servitore di Geova. Poi comparve Enoc.',
    'libro',
    [F.w01],
  ),
  d(
    'lamec-versi',
    'I versi di Lamec',
    'Un discendente di Caino, Lamec, compose dei versi in cui si vantava di aver ucciso un uomo che lo aveva ferito e un giovane che lo aveva colpito. Alcuni discendenti di Caino si rivelarono malvagi quanto lui, se non di più.',
    'scritto',
    [b('Genesi', 4, '23, 24'), F.libro],
  ),
  d(
    'due-settimi',
    'Un altro settimo, un altro Enoc',
    'Anche Lamec è alla settima generazione da Adamo, ma nella linea di Caino: Adamo, Caino, Enoc, Irad, Mehuiael, Metusael, Lamec. L’Enoc di quella linea è il figlio di Caino: un altro uomo. Il libro rimanda al video «Imitiamo Enoc, non Lamec».',
    'numeri',
    [b('Genesi', 4, '17, 18'), b('Giuda', 1, '14'), F.libro],
  ),
  d(
    'citta',
    'Città, tende, musica, metalli',
    'Tra i discendenti di Caino la Bibbia menziona chi costruì una città, chi viveva in tende e allevava bestiame, chi suonava la cetra e il flauto e chi realizzava arnesi in rame e ferro.',
    'scritto',
    [b('Genesi', 4, '17-22')],
  ),
  d(
    'nome-profanato',
    'Il nome di Dio, profanato',
    'Ai giorni di Enos «si cominciò a invocare il nome di Geova». La nota in calce precisa: «Evidentemente nel senso di “profanare”». Sembra che lo si facesse in modo blasfemo, non per dare lode a Geova.',
    'sembra',
    [b('Genesi', 4, '26'), F.libro, F.fondo(1)],
  ),
  d(
    'quattro-secoli',
    'Quasi quattro secoli prima',
    'Tra la nascita di Enos e quella di Enoc passano 387 anni: quasi quattro secoli.',
    'numeri',
    [b('Genesi', 5, '6-18'), F.w01],
  ),
  d(
    'nome-come',
    'In che modo, forse',
    'È possibile che alcuni applicassero il nome di Geova a sé stessi o ad altri uomini, per mezzo dei quali pretendevano di accostarsi a Dio, oppure che dessero il suo nome a oggetti idolatrici.',
    'sembra',
    [F.w01],
  ),
  d(
    'rifiuto-nome',
    'Enoc si rifiuta',
    'Enoc si rifiutò di fare una cosa del genere. Amava e rispettava il santo nome di Dio, e per questo si distinse dai suoi contemporanei.',
    'libro',
    [F.libro],
  ),
  d(
    'pacifico',
    'Un uomo pacifico',
    'Lo spirito violento del suo tempo non riuscì a influenzarlo: con coraggio, Enoc rimase un uomo pacifico.',
    'libro',
    [F.libro],
  ),
  d(
    'solo',
    'L’unico descritto così',
    'Enoc sapeva cosa significa sentirsi soli. È l’unico uomo del suo tempo di cui la Bibbia dice: «continuò a camminare con il vero Dio».',
    'libro',
    [F.libro, b('Genesi', 5, '22, 24')],
  ),
  d(
    'antenati',
    'Dei suoi antenati non è detto',
    'Di Set, Enos, Chenan, Maalalel e Iared non viene detto che camminassero con Dio. Enoc è la prima persona di cui le Scritture lo affermano.',
    'libro',
    [F.w01, F.w05, b('Genesi', 5, '3-27')],
  ),

  // ——— Camminare con Dio ———
  d(
    'a-65',
    'A 65 anni: Matusalemme',
    'All’età di 65 anni Enoc genera Matusalemme. La nota in calce riporta anche la forma «Metusèla».',
    'scritto',
    [b('Genesi', 5, '21')],
  ),
  d(
    'famiglia',
    'Un padre di famiglia',
    'Enoc era un padre di famiglia: aveva moglie, «figli e figlie». Uno di loro era Matusalemme.',
    'libro',
    [F.w01, b('Genesi', 5, '21, 22')],
  ),
  d(
    'casa',
    'Dirigere la casa',
    'Enoc deve aver fatto tutto il possibile per dirigere la sua casa in modo eccellente. Con tutta l’empietà che lo circondava, non dev’essergli stato facile servire Dio.',
    'sembra',
    [F.w01],
  ),
  d(
    'linea-condotta',
    'Non come si cammina con un amico',
    'Non si cammina con Dio, invisibile e onnipotente, come si cammina con i propri simili. Nella Bibbia «camminare» può significare «seguire una certa linea d’azione»: chi cammina con Dio segue la condotta che Dio ha tracciato e che approva, e questo lo rende diverso da chi gli sta intorno.',
    'libro',
    [F.w05p(5)],
  ),
  d(
    'amicizia',
    'Come in un’amicizia',
    'Una buona relazione con Geova richiede più che conoscerlo. Come chi tiene a un amico evita ciò che rovinerebbe l’amicizia, così occorre sapere con esattezza che cosa Dio approva e disapprova, e poi lasciarsene guidare. Per camminare con Dio bisogna piacergli: è ciò che Enoc fece per centinaia di anni.',
    'libro',
    [F.w01],
  ),
  d(
    'conoscenza',
    'Su che cosa poggiava la sua fede',
    'La vera fede si basa sull’accurata conoscenza. Enoc sapeva ciò che era successo in Eden e probabilmente aveva sentito parlare di com’era la vita nel giardino, che forse esisteva ancora anche se nessuno poteva entrarvi. Conosceva anche il proposito di Dio: che i discendenti di Adamo riempissero la terra e la rendessero simile al paradiso.',
    'sembra',
    [F.w05p(14), b('Genesi', 1, '28'), b('Genesi', 3, '23, 24')],
  ),
  d(
    'seme',
    'Il seme promesso',
    'Enoc deve aver esercitato fede nel «seme» promesso in Eden, che avrebbe schiacciato la testa del serpente. La sua profezia, conservata nella lettera di Giuda, è legata alla distruzione del seme di Satana.',
    'sembra',
    [F.w01, F.w05p(14), b('Genesi', 3, '15')],
  ),
  d(
    'sguardo',
    'Lo sguardo più lontano',
    'Enoc non riponeva la sua speranza nel mondo in cui viveva: aveva lo sguardo fisso su qualcosa di immensamente più grande.',
    'libro',
    [F.w05p(16)],
  ),
  d(
    'due-volte',
    'Detto due volte',
    'La stessa frase, «Ènoc continuò a camminare con il vero Dio», apre e chiude il racconto dei suoi trecento anni: la Bibbia la scrive due volte in tre versetti.',
    'scritto',
    [b('Genesi', 5, '22, 24')],
  ),
  d(
    'verbo',
    'Un’azione continua',
    'La forma del verbo ebraico usata per dire che Enoc «camminò» con Dio indica un’azione continua e ripetuta. Alla lettera il testo dice «con il Dio».',
    'libro',
    [F.w01, b('Genesi', 5, '22')],
  ),
  d(
    'due-modi',
    'In almeno due modi',
    'Enoc camminò con il vero Dio in almeno due modi: si rifiutò di adeguarsi al mondo malvagio che lo circondava e fece quello che Dio gli aveva chiesto di fare.',
    'libro',
    [F.libro],
  ),
  d(
    'familiarita',
    'Che cosa implicava',
    'Camminare con Geova implicava avere con lui familiarità e intimità, possibili solo perché Enoc viveva in armonia con la volontà divina.',
    'libro',
    [F.w01],
  ),
  d(
    'settanta',
    '«Fu gradito a Dio»',
    'Geova approvò la devozione di Enoc. Dove il testo ebraico dice che Enoc «continuò a camminare con il vero Dio», l’antica traduzione greca dei Settanta dice: «Enoc fu gradito a Dio». A quanto pare Paolo allude a questa resa in Ebrei 11:5.',
    'libro',
    [F.w01, F.apprEbr, b('Genesi', 5, '22')],
  ),
  d(
    'contesa',
    'Una sfida',
    'Il Diavolo sostiene di poter allontanare da Dio tutti gli esseri umani, e a volte dev’essere sembrato che ci riuscisse. Chi cammina con Dio mostra da che parte sta in questa contesa, sorta in Eden: la contesa della sovranità.',
    'libro',
    [F.w01, F.w05p(7)],
  ),
  d(
    'eden',
    'Ciò su cui poteva meditare',
    'Un’immagine del libro mostra Enoc che medita su avvenimenti che riguardano i suoi antenati: il giardino di Eden protetto da cherubini e da una spada fiammeggiante, Adamo ed Eva invecchiati, Caino accanto al corpo di suo fratello Abele.',
    'libro',
    [F.immagineA, b('Genesi', 3, '24'), b('Genesi', 4, '8')],
  ),
  d(
    'ostilita',
    'Sapeva che sarebbe stato messo alla prova',
    'In Eden Geova aveva detto che tra i suoi servitori e quelli di Satana ci sarebbe stata ostilità, e quell’odio si era già visto quando Caino uccise Abele. Con tutta probabilità, già prima di profetizzare Enoc sapeva che la sua fede e il suo coraggio sarebbero stati messi alla prova.',
    'sembra',
    [F.w06, F.fondo(3), b('Genesi', 3, '15')],
  ),
  d(
    'adamo-info',
    'Forse da Adamo stesso',
    'Se conobbe Adamo di persona, Enoc potrebbe aver ricevuto da lui informazioni sui rapporti fra Dio e la prima coppia umana in Eden.',
    'sembra',
    [F.w01],
  ),
  d(
    'preghiera',
    'Chiedere aiuto',
    'Chiedere l’aiuto di Geova in preghiera deve aver rafforzato la determinazione di Enoc a evitare qualunque cosa potesse dispiacere al suo Creatore.',
    'sembra',
    [F.w01],
  ),
  d(
    'nipote',
    'Nonno di Lamec',
    'Matusalemme genera Lamec a 187 anni, quando Enoc ne ha 252: nonno e nipote sono contemporanei per 113 anni.',
    'numeri',
    [b('Genesi', 5, '21-25')],
  ),
  d(
    'lamec-fede',
    'Forse uno solo, oltre a lui',
    'Lamec, padre di Noè, potrebbe essere stato l’unico contemporaneo di Enoc a esercitare fede in Geova.',
    'sembra',
    [F.w01, b('Genesi', 5, '28, 29')],
  ),

  // ——— L’incarico e il messaggio ———
  d(
    'profeta',
    'Un incarico speciale',
    'Geova diede a Enoc un incarico speciale: quello di profeta. Per assolverlo ci voleva ancora più coraggio.',
    'libro',
    [F.libro],
  ),
  d(
    'primo-profeta',
    'Per la prima volta',
    'Era un incarico che per la prima volta veniva affidato a un essere umano: Enoc servì come primo fedele profeta di Dio.',
    'libro',
    [F.fondo(2), F.w01],
  ),
  d(
    'spirito',
    'Sotto la guida dello spirito di Dio',
    'La Bibbia non descrive il momento in cui Enoc ricevette l’incarico. Enoc pronunciò la profezia sotto la guida dello spirito di Dio.',
    'libro',
    [F.w01],
  ),
  d(
    'messaggio',
    'Il messaggio',
    '«Ecco, Geova è venuto con le sue sante miriadi per eseguire il giudizio contro tutti…»: un messaggio molto forte, da portare a persone che avevano un atteggiamento e un comportamento molto diversi dai suoi.',
    'scritto',
    [b('Giuda', 1, '14, 15'), F.libro],
  ),
  d(
    'al-passato',
    'Formulata al passato',
    'La profezia dice «è venuto», come se Dio avesse già portato quel giudizio. Questo dimostra quanto fosse certo che quelle parole si sarebbero adempiute.',
    'libro',
    [F.libro, b('Giuda', 1, '14')],
  ),
  d(
    'quattro-volte',
    'Quattro volte',
    'Nel messaggio il concetto di empietà è ripetuto ben quattro volte: «empi», «empie», «empiamente», «empi».',
    'scritto',
    [b('Giuda', 1, '15'), F.libro],
  ),
  d(
    'empi-significato',
    'Chi sono gli «empi»',
    'Nella lettera di Giuda una nota in calce spiega la parola «empi»: «Cioè irriverenti verso Dio».',
    'libro',
    [b('Giuda', 1, '4')],
  ),
  d(
    'opere-parole',
    'Opere e parole',
    'Il messaggio parla di due cose: le «opere empie che hanno empiamente compiuto» e le «cose offensive» che gli empi peccatori hanno detto contro Geova.',
    'scritto',
    [b('Giuda', 1, '15')],
  ),
  d(
    'miriadi',
    'Sante miriadi',
    'Geova viene «con le sue sante miriadi». La nota in calce precisa: «O “decine di migliaia”».',
    'scritto',
    [b('Giuda', 1, '14')],
  ),
  d(
    'forza',
    'Anche la forza',
    'Geova affidò a Enoc un pesante messaggio di giudizio da dichiarare, ma gli diede anche la forza di proclamarlo.',
    'libro',
    [F.w01],
  ),
  d(
    'solo-giuda',
    'Dove sono scritte queste parole',
    'Nella Bibbia solo la lettera di Giuda riporta le parole profetiche di Enoc. Il cosiddetto «libro di Enoc» è un testo apocrifo, falsamente attribuito a lui. Le Scritture non rivelano come Giuda venne a conoscenza della profezia: è attendibile perché Giuda scrisse sotto ispirazione.',
    'libro',
    [F.w01riquadro, b('2 Timoteo', 3, '16')],
  ),
  d(
    'non-gradite',
    'Parole non gradite',
    'Di sicuro quelle parole non risultarono molto gradite a chi ascoltava. Eppure Enoc, con coraggio, disse tutto ciò che Geova voleva che sapessero.',
    'libro',
    [F.libro],
  ),
  d(
    'strada',
    'In una strada affollata',
    'L’immagine d’apertura del capitolo mostra Enoc che proclama il messaggio di giudizio di Dio in una strada affollata: alcuni sono arrabbiati o infastiditi, e c’è chi è armato.',
    'libro',
    [F.immagine],
  ),
  d(
    'infastiditi',
    'Infastiditi',
    'Possiamo essere sicuri che anche ai giorni di Enoc la sua profezia infastidì molti «empi peccatori».',
    'libro',
    [F.w05],
  ),

  // ——— Il pericolo e la fine ———
  d(
    'reazione',
    'La Bibbia non lo dice apertamente',
    'Come reagirono le persone? La Bibbia non lo dice apertamente, ma lascia intendere che a un certo punto Enoc si trovò in grave pericolo. Sembra che fosse perseguitato dalle persone malvagie del suo tempo.',
    'sembra',
    [F.libro],
  ),
  d(
    'scherni',
    'Beffe, scherni, minacce',
    'È ragionevole supporre che quelle parole pungenti lo rendessero impopolare, dando forse adito a beffe, scherni e minacce. Alcuni avranno desiderato metterlo a tacere per sempre.',
    'sembra',
    [F.w01],
  ),
  d(
    'come-abele',
    'Sapeva di Abele',
    'Enoc non si fece intimidire. Sapeva cosa era accaduto al giusto Abele e, come lui, era determinato a servire Dio a qualunque costo.',
    'libro',
    [F.w01],
  ),
  d(
    'amore',
    'Spinto dall’amore',
    'Sembra che Geova non abbia permesso ai malvagi di fare del male a Enoc o di ucciderlo: spinto dall’amore, lo portò via, sottraendolo al pericolo.',
    'sembra',
    [F.libro, F.apprEbr],
  ),
  d(
    'cura',
    'Ebbe cura di lui',
    'Enoc adempì coraggiosamente il suo incarico e Dio ebbe cura di lui nonostante l’opposizione dei nemici.',
    'libro',
    [F.w01],
  ),
  d(
    'conferma',
    'La conferma',
    'Prima di essere portato via, Enoc «ebbe la conferma di essere gradito a Dio». Alla lettera: «ricevette testimonianza».',
    'scritto',
    [b('Ebrei', 11, '5'), F.apprEbr],
  ),
  d(
    'regalo',
    'Un regalo speciale',
    'Il libro lo chiama un regalo speciale. Prima che Enoc morisse, Geova gli diede conferma, in un modo speciale, di essere molto contento della vita fedele che aveva fatto.',
    'libro',
    [F.libro, F.apprEbr],
  ),
  d(
    'visione',
    'Forse una visione',
    'Forse Geova gli fece avere una visione di ciò che lo aspettava: una vita pacifica nel Paradiso qui sulla terra. Le Scritture non rivelano in che modo gli diede quella conferma.',
    'sembra',
    [F.libro, F.w01],
  ),
  d(
    'prese',
    'Fu Dio a prenderlo',
    'Genesi 5:24 attribuisce a Dio ciò che accadde: «Dio lo prese». La nota in calce rende «nessuno lo vide più» anche con «non fu più».',
    'scritto',
    [b('Genesi', 5, '24')],
  ),
  d(
    'addormentato',
    'Addormentato nella morte',
    'Geova lo sottrasse al pericolo facendolo addormentare nella morte. Probabilmente pose fine alla sua vita in modo tranquillo, forse mentre Enoc era in uno stato di estasi profetica: così non avrebbe provato le doglie della morte.',
    'sembra',
    [F.libro, F.apprEbr, F.w01],
  ),
  d(
    'non-trovato',
    'Non fu più trovato',
    'La Bibbia non racconta chi lo cercò né dove. Dice soltanto che Enoc «non fu più trovato perché Dio l’aveva portato via».',
    'scritto',
    [b('Ebrei', 11, '5')],
  ),
  d(
    'corpo',
    'Come con Mosè',
    'A quanto pare Enoc non fu trovato perché Geova fece sparire il suo corpo, come fece con quello di Mosè.',
    'sembra',
    [F.w01, b('Deuteronomio', 34, '5, 6')],
  ),
  d(
    'non-cielo',
    'Non in cielo',
    'Enoc non fu portato in cielo. Gesù disse: «Nessun uomo è asceso al cielo se non colui che è disceso dal cielo». E di Enoc, insieme ad altri, Paolo scrive: «Nella fede morirono tutti questi».',
    'scritto',
    [b('Giovanni', 3, '13'), b('Ebrei', 11, '13'), F.fondo(4)],
  ),
  d(
    'verbo-greco',
    '«Portato via»',
    'Il verbo greco reso «portato via» non contiene l’idea di essere portato in cielo: può indicare qualcosa che subisce un cambiamento o qualcuno che viene trasferito da un posto a un altro.',
    'libro',
    [F.apprEbr],
  ),
  d(
    'anni-365',
    '365 anni',
    'L’intera vita di Enoc fu di 365 anni: molto meno della maggioranza dei suoi contemporanei. Suo padre Iared ne visse 962, suo figlio Matusalemme 969.',
    'scritto',
    [b('Genesi', 5, '20-27'), F.w01],
  ),
  d(
    'per-fede',
    'Per fede',
    'Fu «per fede», cioè a motivo della sua fede, che a Enoc venne risparmiata una morte violenta. Subito dopo Paolo scrive: «Senza fede è impossibile piacere a Dio».',
    'libro',
    [b('Ebrei', 11, '5, 6'), F.apprEbr],
  ),
  d(
    'ricompensa',
    'Ricompensa chi lo cerca',
    'Dio «ricompensa quelli che lo cercano assiduamente»: Paolo lo scrive subito dopo aver parlato di Enoc.',
    'scritto',
    [b('Ebrei', 11, '6')],
  ),
  d(
    'memoria',
    'Al sicuro nella memoria di Geova',
    'Portandolo via così, Geova fece in modo che Enoc rimanesse al sicuro nella sua memoria, dove nessuno avrebbe potuto fargli del male.',
    'libro',
    [F.libro],
  ),
  d(
    'certezza-amore',
    'Chiuse gli occhi',
    'Enoc chiuse gli occhi sapendo che Geova lo amava e che lo aveva benedetto per la sua forte fede e per il suo grande coraggio.',
    'libro',
    [F.libro],
  ),
  d(
    'risurrezione',
    'Sarà risuscitato',
    'Il libro invita a pensare a che cosa vorresti chiedere a Enoc «quando sarà risuscitato». Possiamo essere certi che Geova si ricorderà di lui nella risurrezione.',
    'libro',
    [F.prospettiva, F.w01],
  ),
  d(
    'rallegra',
    'Rallegra il cuore di Geova',
    'Il libro dice che il fatto che Enoc restasse un uomo pacifico rallegrò tanto Geova, e collega Proverbi 27:11 a come si sente Geova quando camminiamo coraggiosamente con lui.',
    'libro',
    [F.libro, F.riguarda, b('Proverbi', 27, '11')],
  ),

  // ——— I numeri di Genesi 5 (Matusalemme) ———
  d(
    'm-300',
    'I suoi primi trecento anni',
    'Matusalemme ha 300 anni quando suo padre «non fu più trovato»: i suoi primi tre secoli coincidono con i 300 anni in cui Enoc continua a camminare con il vero Dio.',
    'numeri',
    [b('Genesi', 5, '21-24')],
  ),
  d(
    'm-adamo',
    'La morte di Adamo',
    'Adamo muore a 930 anni, quando Matusalemme ne ha 243. È il primo della genealogia di Genesi 5 a morire.',
    'numeri',
    [b('Genesi', 5, '3-21')],
  ),
  d(
    'm-antenati',
    'Gli antenati ancora vivi',
    'Enoc viene preso 57 anni dopo la morte di Adamo. In quel momento sono ancora vivi Set, Enos, Chenan, Maalalel e Iared, il padre di Enoc, che vivrà altri 435 anni.',
    'numeri',
    [b('Genesi', 5, '6-24')],
  ),
  d(
    'm-poi-mori',
    '«Poi morì»: otto volte, non per Enoc',
    'In Genesi 5, da Adamo a Lamec, la formula «poi morì» ricorre otto volte. Solo per Enoc il testo cambia: «Poi nessuno lo vide più, perché Dio lo prese».',
    'scritto',
    [b('Genesi', 5, '5-31')],
  ),
  d(
    'm-noe',
    'Noè non conobbe Enoc',
    'Noè nasce quando Matusalemme ha 369 anni, 69 anni dopo che Enoc fu preso. Di Noè la Bibbia dirà la stessa cosa detta di Enoc: «camminò con il vero Dio».',
    'numeri',
    [b('Genesi', 5, '25-29'), b('Genesi', 6, '9')],
  ),
  d(
    'm-lamec-parole',
    'Le parole di Lamec, padre di Noè',
    'Chiamando suo figlio Noè, Lamec disse: «Lui ci consolerà dal duro lavoro e dalle fatiche delle nostre mani a motivo del suolo che Geova ha maledetto».',
    'scritto',
    [b('Genesi', 5, '28, 29')],
  ),
  d(
    'm-969',
    '969 anni',
    'L’intera vita di Matusalemme fu di 969 anni: la più lunga tra quelle elencate in Genesi 5.',
    'scritto',
    [b('Genesi', 5, '27')],
  ),
  d(
    'm-diluvio',
    'L’anno del Diluvio',
    'Sommando gli anni di Genesi 5 (187 + 182 + 600 = 969), Matusalemme muore nell’anno in cui Noè compie 600 anni: l’anno del Diluvio, il 2370 a.E.V. Suo figlio Lamec era morto cinque anni prima.',
    'numeri',
    [b('Genesi', 5, '25-31'), b('Genesi', 7, '6'), F.tempo],
  ),
  d(
    'm-silenzio',
    'Solo nomi e numeri',
    'Di Matusalemme la Bibbia riporta nomi e numeri. Non dice che cosa vide, che cosa provò, né se camminò con Dio come suo padre.',
    'scritto',
    [b('Genesi', 5, '21-27')],
  ),

  // ——— Il messaggio oltre i giorni di Enoc ———
  d(
    'anche-loro',
    '«Anche riguardo a loro»',
    'Giuda scrive che Enoc profetizzò «anche riguardo a loro», cioè agli uomini empi che si erano insinuati tra i cristiani del suo tempo: il messaggio non valeva solo per i contemporanei di Enoc.',
    'scritto',
    [b('Giuda', 1, '4'), b('Giuda', 1, '14')],
  ),
  d(
    'adempimento',
    'L’adempimento finale',
    'Le parole di Enoc avranno il loro adempimento finale ad Armaghedon.',
    'libro',
    [F.w05, b('Rivelazione', 16, '14, 16')],
  ),
  d(
    'mondo-di-empi',
    '«Un mondo di empi»',
    'Pietro chiama il mondo di prima del Diluvio «un mondo di empi». Secondo la linea del tempo del libro, il Diluvio arrivò nel 2370 a.E.V., 669 anni dopo che Enoc fu preso.',
    'numeri',
    [b('2 Pietro', 2, '5'), F.tempo],
  ),
  d(
    'sottratto',
    'Sottratto a loro',
    'Evidentemente Geova trasferì Enoc dal paese dei viventi al sonno della morte prima che gli oppositori mettessero le mani su di lui.',
    'sembra',
    [F.w05],
  ),
]);

function s(id: string, domanda: string): [string, Sensazione] {
  return [id, { id, domanda }];
}

export const SENSAZIONI: Record<string, Sensazione> = Object.fromEntries([
  s('solo', 'Intorno a te nessun altro segue la condotta che Dio approva. Che cosa provi a essere l’unico?'),
  s('pacifico', 'Intorno a te alla violenza si risponde con la violenza. Che cosa ti costa restare un uomo pacifico?'),
  s('nome', 'Vicino a te c’è chi usa il nome di Geova in modo profano, senza rispetto. Che cosa provi a sentirlo?'),
  s('famiglia', 'Cresci dei figli in un mondo empio. Che cosa ti preoccupa di più per loro, e che cosa faresti per proteggerli?'),
  s(
    'trecento',
    'Trecento anni, un giorno dopo l’altro, seguendo la condotta che Dio approva. Che cosa ti aiuta a non smettere?',
  ),
  s(
    'amicizia',
    'Pensa a una persona a cui tieni molto: che cosa eviti di fare per non rovinare il vostro rapporto? E con Geova?',
  ),
  s(
    'medita',
    'Ripensi all’Eden, ad Adamo ed Eva ormai vecchi, ad Abele ucciso da suo fratello. Sai che il tuo coraggio sarà messo alla prova. Che cosa ti aiuterebbe a decidere di restare fedele a Geova?',
  ),
  s('incarico', 'Devi annunciare il giudizio di Geova a persone molto diverse da te. Che cosa provi prima di farlo?'),
  s(
    'strada',
    'Hai annunciato tutto il messaggio di Geova e senti gli sguardi di tutti su di te. Che cosa ti ha dato la forza di non tacere?',
  ),
  s('pericolo', 'Dopo il tuo messaggio ti trovi in grave pericolo. In un momento così, su che cosa o su chi conti?'),
  s('conferma', 'Geova ti fa sapere che gli sei gradito. Che cosa significherebbe per te sapere con certezza che Dio approva la tua vita?'),

  s('g-rallegra', 'Un uomo resta pacifico in un mondo violento, e questo rallegra tanto Geova. Che cosa ti dice questo di lui?'),
  s(
    'g-incarico',
    'Geova affida un messaggio così forte a un essere umano, e gli dà anche la forza di proclamarlo. Che cosa ti insegna questo su di lui?',
  ),
  s(
    'g-protegge',
    'Geova non permette che facciano del male al suo profeta. Che cosa ti dice questo di come tratta chi gli è fedele?',
  ),
  s('g-memoria', 'Enoc è al sicuro nella memoria di Geova. Che cosa vorresti chiedere a Enoc quando sarà risuscitato?'),

  s(
    'e-mondo',
    'Violenza e profanazione sono la norma, e tu ne fai parte. Che cosa rende così difficile accorgersi che è sbagliato?',
  ),
  s(
    'e-parole',
    'Nel messaggio di Enoc la parola «empi» ritorna quattro volte, e parla di te. Che cosa ti dà più fastidio? E che cosa avresti potuto fare, invece?',
  ),
  s(
    'e-vuoto',
    'Voi empi cercate Enoc, ma non lo trovate più: Dio lo ha preso. Il suo messaggio però lo avete sentito tutti. Ora che lui non c’è più, che cosa potreste fare di quelle parole?',
  ),

  s(
    'm-padre',
    'Per trecento anni hai un padre che cammina con il vero Dio. La Bibbia non dice che cosa provi. Tu, al suo posto, che cosa avresti imparato da lui?',
  ),
  s(
    'm-vuoto',
    'Hai 300 anni e tuo padre non si trova più. La Bibbia non dice che cosa provi. Tu che cosa avresti provato?',
  ),
  s(
    'm-diluvio',
    'Tuo padre aveva annunciato che Geova sarebbe venuto a giudicare gli empi. Tu vivi altri 669 anni dopo che lui non si trova più, e muori proprio nell’anno del Diluvio. Che cosa ti dice una così lunga attesa su Geova?',
  ),
]);

/** Le sezioni di studio del capitolo, riproposte come domande aperte per il quaderno. */
export const STUDIO: SezioneStudio[] = [
  {
    id: 'parlarne',
    titolo: 'Per parlarne insieme',
    domande: [{ id: 'parlarne-1', testo: 'In quali modi Enoc mostrò coraggio?' }],
  },
  {
    id: 'fondo',
    titolo: 'Vai più a fondo',
    nota: 'Le risposte si trovano nelle pubblicazioni indicate accanto a ogni domanda.',
    domande: [
      {
        id: 'fondo-1',
        testo: 'Che cosa potrebbe significare che a un certo punto «si cominciò a invocare il nome di Geova»?',
        fonti: [b('Genesi', 4, '26'), F.w01],
      },
      {
        id: 'fondo-2',
        testo:
          'Enoc svolse un incarico affidato per la prima volta a un essere umano. Quale? E come riuscì a portarlo a termine?',
        fonti: [F.w01],
      },
      {
        id: 'fondo-3',
        testo:
          'Perché si può dire che Enoc, ancor prima di iniziare a profetizzare, probabilmente sapeva che il suo coraggio sarebbe stato messo alla prova?',
        fonti: [F.w06],
      },
      {
        id: 'fondo-4',
        testo: 'Come puoi dimostrare che Enoc non fu portato in cielo, come credono alcuni?',
        fonti: [b('Giovanni', 3, '13'), b('Ebrei', 11, '5'), b('Ebrei', 11, '13')],
      },
    ],
  },
  {
    id: 'riguarda',
    titolo: 'Una storia che ti riguarda',
    domande: [
      {
        id: 'riguarda-1',
        testo:
          'Quando potresti aver bisogno di particolare coraggio per predicare? Pensando all’esempio di Enoc, che cosa può aiutarti?',
      },
      {
        id: 'riguarda-2',
        testo: 'Come si sente Geova quando camminiamo coraggiosamente con lui?',
        fonti: [b('Proverbi', 27, '11'), b('Ebrei', 11, '5')],
      },
      { id: 'riguarda-3', testo: 'In quali altri modi potresti imitare il coraggio di Enoc?' },
    ],
  },
  {
    id: 'prospettiva',
    titolo: 'Una prospettiva più ampia',
    domande: [
      { id: 'prospettiva-1', testo: 'Che cosa ti insegna su Geova la storia di Enoc?' },
      { id: 'prospettiva-2', testo: 'In che modo questa storia si collega al proposito di Geova?' },
      { id: 'prospettiva-3', testo: 'Che cosa vorresti chiedere a Enoc quando sarà risuscitato?' },
    ],
  },
];

export const APPROFONDISCI: Fonte[] = [
  { rif: 'Il capitolo 1 del libro su jw.org (testo, audio, immagini)', url: URL_CAPITOLO },
  { rif: 'Video «Fede: esempi positivi e negativi | Imitiamo Enoc, non Lamec» (indicato nel capitolo)', url: URL_CAPITOLO },
  { rif: '«Camminate con Dio in questi tempi turbolenti», La Torre di Guardia 1/9/2005', url: F.w05.url },
  { rif: '«Enoc camminò con Dio in un mondo empio», La Torre di Guardia 15/9/2001', url: F.w01.url },
];
