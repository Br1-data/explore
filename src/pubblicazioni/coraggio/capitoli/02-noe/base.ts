import { b, LIBRO_BASE, perspicacia, RIVISTE, verso } from '@/contenuti/fonti';
import type { Dettaglio, Fonte, Sensazione, SezioneStudio, Verso } from '@/contenuti/tipi';

export { b };

/**
 * Capitolo 2 — Noè: «Condannò il mondo».
 *
 * Il capitolo copre Genesi 6:1–8:22 e 9:8-19, Ebrei 11:7 e 2 Pietro 2:5. Ciò che viene
 * dopo (Genesi 9:20-29: la vigna, Cam e Canaan) non fa parte del capitolo; la torre di
 * Babele compare solo perché la cita «Vai più a fondo» (Perspicacia, «Noè»).
 * Le parole tra «» sono citazioni; il resto è riassunto con parole nostre.
 */

export const URL_CAPITOLO = `${LIBRO_BASE}/dal-tempo-patriarchi-a-giudici/no%C3%A8-condann%C3%B2-il-mondo/`;

export const F = {
  libro: { rif: 'Libro, cap. 2 «Condannò il mondo»', url: URL_CAPITOLO } as Fonte,
  immagine: { rif: 'Libro, cap. 2, immagine del capitolo', url: URL_CAPITOLO } as Fonte,
  immagineA: { rif: 'Libro, cap. 2, immagine A', url: URL_CAPITOLO } as Fonte,
  immagineB: { rif: 'Libro, cap. 2, immagine B', url: URL_CAPITOLO } as Fonte,
  fondo: (n: number): Fonte => ({ rif: `Libro, cap. 2, «Vai più a fondo» n. ${n}`, url: URL_CAPITOLO }),
  w02: {
    rif: 'La Torre di Guardia 1/3/2002, «Perché quel mondo antico perì?»',
    url: `${RIVISTE}/w20020301/Perch%C3%A9-quel-mondo-antico-per%C3%AC/#p4`,
  } as Fonte,
  w12: {
    rif: 'La Torre di Guardia 15/4/2012, p. 23 parr. 5-8',
    url: `${RIVISTE}/w20120415/Geova-sa-liberare-il-suo-popolo/#p12`,
  } as Fonte,
  w13: {
    rif: 'La Torre di Guardia 1/8/2013, «Salvato insieme alla sua famiglia»',
    url: 'https://wol.jw.org/it/wol/d/r6/lp-i/2013566',
  } as Fonte,
  w01: {
    rif: 'La Torre di Guardia 15/11/2001, «La fede di Noè condanna il mondo»',
    url: 'https://wol.jw.org/it/wol/d/r6/lp-i/2001848',
  } as Fonte,
  diluvio: {
    rif: '«Noè e il diluvio universale: solo una leggenda?», jw.org',
    url: 'https://www.jw.org/it/cosa-dice-la-Bibbia/domande/diluvio-universale/',
  } as Fonte,
  it: perspicacia,
};

const NOTA_CUBITO = '«cubiti»: un cubito corrispondeva a 44,5 cm.';

export const VERSI: Record<string, Verso> = {
  'gen-6-1': verso(
    'Genesi 6:1-22',
    b('Genesi', 6, '1-22'),
    'Quando gli uomini cominciarono ad aumentare di numero sulla terra e nacquero loro delle figlie, i figli del vero Dio notarono che quelle donne erano molto belle. Perciò presero in moglie tutte quelle che vollero. Geova allora disse: “Il mio spirito non tollererà l’uomo all’infinito, perché è solo carne. Pertanto vivrà 120 anni”. In quei giorni, e anche successivamente, sulla terra c’erano i nefilìm. Durante quel periodo i figli del vero Dio avevano rapporti sessuali con le figlie degli uomini, le quali partorirono loro dei figli. Questi furono i potenti dell’antichità, gli uomini famosi. Geova vide quindi che la malvagità degli uomini era grande sulla terra e che nel loro cuore erano inclini a nutrire sempre e solo pensieri cattivi. Geova si rammaricò di aver fatto gli uomini sulla terra, e se ne rattristò nel suo cuore. Geova dunque disse: “Cancellerò dalla faccia della terra gli uomini che ho creato, l’uomo insieme agli animali domestici, agli animali striscianti e alle creature alate dei cieli, perché mi rammarico di averli fatti”. Noè invece ebbe l’approvazione di Geova. Questa è la storia di Noè. Noè fu un uomo giusto. Si dimostrò integro tra i suoi contemporanei. Noè camminò con il vero Dio. Generò tre figli: Sem, Cam e Iàfet. La terra comunque si era rovinata agli occhi del vero Dio ed era piena di violenza. Guardando la terra, infatti, Dio vide che era rovinata e che tutti si comportavano in modo corrotto. Dio allora disse a Noè: “Ho deciso di mettere fine a tutti gli esseri viventi, perché per colpa loro la terra è piena di violenza; quindi li distruggerò insieme alla terra. Costruisci un’arca di legno resinoso. Nell’arca dovrai fare degli scompartimenti, e dovrai coprirla di catrame dentro e fuori. La farai così: lunga 300 cubiti, larga 50 cubiti e alta 30 cubiti. A un cubito da dove comincia il tetto, farai una finestra per la luce. Metterai la porta d’ingresso da un lato, e farai un piano inferiore, un secondo piano e un terzo piano. “Quanto a me, sto per portare un diluvio sulla terra per distruggere sotto il cielo ogni essere vivente che ha l’alito della vita. Tutto ciò che è sulla terra morirà. Ma con te stringo un patto, e tu devi entrare nell’arca, e insieme a te i tuoi figli, tua moglie e le mogli dei tuoi figli. Di ogni tipo di creatura vivente devi portare nell’arca due esemplari, un maschio e una femmina, perché siano conservati in vita con te. Due esemplari di tutte le creature alate secondo le loro specie, di tutti gli animali domestici secondo le loro specie e di tutti gli animali che strisciano sul suolo secondo le loro specie verranno nell’arca da te perché siano conservati in vita. E tu devi raccogliere e portare con te cibo di ogni tipo: servirà per nutrire te e gli animali”. E Noè fece tutto ciò che Dio gli aveva comandato. Fece proprio così.',
    [
      '«figli del vero Dio»: espressione ebraica che si riferisce agli angeli.',
      '«nefilìm»: forse significa “gli abbattitori”, “quelli che fanno cadere altri”.',
      '«arca»: cioè una grande imbarcazione. Lett. “cassa”.',
      '«catrame»: o “bitume”.',
      NOTA_CUBITO,
    ],
  ),
  'gen-7-1': verso(
    'Genesi 7:1-24',
    b('Genesi', 7, '1-24'),
    'Geova disse quindi a Noè: “Entra nell’arca, tu insieme a tutta la tua famiglia, perché ho visto che, in mezzo a questa generazione, tu sei giusto. Di ogni animale puro devi prendere sette esemplari, il maschio e la sua compagna, mentre di ogni animale che non è puro solo due, il maschio e la sua compagna. Anche di ogni creatura alata dei cieli devi prendere sette esemplari, maschio e femmina, perché la loro progenie sia conservata in vita su tutta la terra. Fra soli 7 giorni infatti farò piovere sulla terra per 40 giorni e 40 notti, e cancellerò dalla faccia della terra ogni essere vivente che ho fatto”. E Noè fece tutto ciò che Geova gli aveva comandato. Noè aveva 600 anni quando il diluvio si abbatté sulla terra. Prima del diluvio Noè entrò nell’arca insieme ai suoi figli, a sua moglie e alle mogli dei suoi figli. Gli esemplari di tutti gli animali puri, di tutti gli animali impuri, di tutte le creature alate e di tutte le creature che si muovono sul suolo andarono nell’arca da Noè a due a due, maschio e femmina, proprio come Dio aveva comandato a Noè. E sette giorni dopo, il diluvio si abbatté sulla terra. Nel 600º anno della vita di Noè, nel 2º mese, il 17º giorno del mese, proprio in quel giorno, tutte le sorgenti delle acque degli abissi si aprirono e le cateratte dei cieli si spalancarono. E sulla terra piovve a dirotto per 40 giorni e 40 notti. In quello stesso giorno Noè entrò nell’arca insieme ai suoi figli — Sem, Cam e Iàfet — a sua moglie e alle tre mogli dei suoi figli. Entrarono insieme a tutti gli animali selvatici secondo le loro specie, a tutti gli animali domestici secondo le loro specie, a tutti gli animali che strisciano sul suolo secondo le loro specie e a tutti i volatili secondo le loro specie, uccelli e creature alate. Tutti gli esseri viventi che avevano l’alito della vita continuarono ad andare nell’arca da Noè a due a due. Entrarono, il maschio e la femmina di tutti gli esseri viventi, proprio come Dio aveva comandato a Noè. Poi Geova chiuse la porta dietro di lui. Il diluvio continuò per 40 giorni sulla terra, e le acque aumentarono e sollevarono l’arca, che iniziò a galleggiare molto al di sopra della terra. Le acque diventarono travolgenti e continuarono ad aumentare sempre di più sopra la terra, ma l’arca galleggiava sulle acque. Le acque aumentarono al punto che tutti i monti più alti sotto l’intero cielo furono coperti. Le acque si alzarono di 15 cubiti al di sopra dei monti. E così morirono tutti gli esseri viventi che si muovevano sulla terra: le creature alate, gli animali domestici, gli animali selvatici, gli animali che brulicano e tutto il genere umano. Tutto ciò che si trovava sull’asciutto e che aveva nelle narici l’alito della vita morì. Così Dio cancellò dalla faccia della terra ogni essere vivente: uomini e animali, dagli animali striscianti alle creature alate dei cieli. Furono tutti cancellati dalla terra; sopravvissero solo Noè e quelli che erano con lui nell’arca. E le acque continuarono a sommergere la terra per 150 giorni.',
    ['«sette esemplari»: o forse “sette paia”.', NOTA_CUBITO],
  ),
  'gen-8-1': verso(
    'Genesi 8:1-22',
    b('Genesi', 8, '1-22'),
    'Dio comunque non si era dimenticato di Noè, né di tutti gli animali selvatici e domestici che erano con lui nell’arca. E Dio fece soffiare un vento sopra la terra, così le acque cominciarono ad abbassarsi. Le sorgenti delle acque degli abissi e le cateratte dei cieli furono chiuse, perciò la pioggia smise di cadere. Allora le acque cominciarono pian piano a ritirarsi dalla terra, e dopo 150 giorni si erano considerevolmente abbassate. Nel 7º mese, il 17º giorno del mese, l’arca si fermò sopra i monti di Araràt. Le acque continuarono a calare fino al 10º mese. Il primo giorno di quel mese apparvero le cime dei monti. Dopo 40 giorni Noè aprì la finestra che aveva fatto nell’arca e fece volare fuori un corvo. Il corvo continuò ad andare e tornare, finché le acque sulla terra non si asciugarono. Successivamente, per vedere se le acque si erano ritirate dalla superficie del suolo, Noè fece volare fuori una colomba. Non trovando nessun luogo su cui posarsi, la colomba tornò da lui nell’arca, perché le acque coprivano ancora la superficie di tutta la terra. Allora Noè stese la mano per prenderla e la riportò dentro l’arca. Aspettò altri sette giorni, e poi fece di nuovo volare la colomba fuori dall’arca. Verso sera la colomba tornò da lui, ed ecco che nel becco aveva una foglia fresca d’olivo! Così Noè capì che le acque erano diminuite sulla terra. Dopo aver aspettato altri sette giorni, fece di nuovo volare fuori la colomba, che però non tornò più da lui. Nel 601º anno, nel 1º mese, il 1º giorno del mese, le acque erano defluite dalla terra. Noè tolse una parte del tetto dell’arca e vide che la superficie del suolo si stava asciugando. Nel 2º mese, il 27º giorno del mese, la terra si era asciugata. Allora Dio disse a Noè: “Esci dall’arca, tu insieme a tua moglie, ai tuoi figli e alle mogli dei tuoi figli. Fa’ uscire anche tutte le creature viventi — le creature alate, gli animali e tutte le creature che strisciano sul suolo — perché siano feconde, si moltiplichino e abbondino sulla terra”. Noè quindi uscì, e con lui i suoi figli, sua moglie e le mogli dei suoi figli. Tutte le creature viventi, dagli animali striscianti alle creature alate e a tutto ciò che si muove sulla terra, uscirono dall’arca in base alle loro famiglie. E Noè eresse un altare a Geova; poi prese alcuni di tutti gli animali puri e di tutte le creature alate pure e offrì olocausti sull’altare. E Geova sentì un odore gradevole. Allora Geova disse in cuor suo: “Non maledirò più il suolo a causa dell’uomo, perché l’uomo è incline a nutrire nel suo cuore pensieri cattivi fin dalla giovinezza. E non colpirò più ogni essere vivente come ho fatto. D’ora in poi la terra non smetterà mai di avere semina e raccolta, freddo e caldo, estate e inverno, giorno e notte”.',
    ['«non si era dimenticato»: lett. “si ricordò”.', '«odore gradevole»: o “che placa”, “che calma”; lett. “riposante”.'],
  ),
  'gen-9-8': verso(
    'Genesi 9:8-19',
    b('Genesi', 9, '8-19'),
    'Dopodiché Dio disse a Noè e ai suoi figli con lui: “Stringo ora il mio patto con voi e con i vostri discendenti dopo di voi, e con tutte le creature viventi che sono uscite dall’arca con voi (gli uccelli, gli animali e tutte le creature viventi della terra), ogni creatura vivente della terra. Stringo con voi questo patto: nessun essere vivente sarà più distrutto dalle acque di un diluvio, e la terra non sarà mai più ridotta in rovina da un diluvio”. E Dio aggiunse: “Il segno del patto tra me e voi e ogni creatura vivente che è con voi, per tutte le generazioni future, è questo: metto nelle nuvole il mio arcobaleno, che servirà da segno del patto tra me e la terra. Ogni volta che porterò nuvole sopra la terra, l’arcobaleno apparirà nelle nuvole. E certamente ricorderò il mio patto tra me e voi e ogni creatura vivente; e le acque non diventeranno mai più un diluvio che distrugga ogni essere vivente. Quando nelle nuvole apparirà l’arcobaleno, io certamente lo vedrò e mi ricorderò del patto eterno tra me e ogni creatura vivente sulla terra”. Poi Dio ripeté a Noè: “Questo è il segno del patto tra me e ogni essere vivente che è sulla terra”. I figli di Noè che uscirono dall’arca furono Sem, Cam e Iàfet. In seguito Cam generò Cànaan. Questi tre furono i figli di Noè, e da loro venne e si diffuse tutta la popolazione della terra.',
  ),
  'ebr-11-7': verso(
    'Ebrei 11:7',
    b('Ebrei', 11, '7'),
    'Per fede Noè, avvertito divinamente di cose che ancora non si vedevano, mostrò timore di Dio e costruì un’arca per la salvezza della sua famiglia; e mediante tale fede condannò il mondo ed ereditò la giustizia che deriva dalla fede.',
  ),
  '2pt-2-5': verso(
    '2 Pietro 2:5',
    b('2 Pietro', 2, '5'),
    'Non si trattenne nemmeno dal punire il mondo antico, ma quando portò il diluvio su un mondo di empi salvò Noè, predicatore di giustizia, e altre sette persone.',
  ),
  'gen-6-3': verso(
    'Genesi 6:3',
    b('Genesi', 6, '3'),
    'Geova allora disse: “Il mio spirito non tollererà l’uomo all’infinito, perché è solo carne. Pertanto vivrà 120 anni”.',
    ['«perché è solo carne»: o “perché agisce in base alla carne”.', '«vivrà»: o “lo lascerò vivere per”.'],
  ),
  'gen-6-5': verso(
    'Genesi 6:5, 6',
    b('Genesi', 6, '5, 6'),
    'Geova vide quindi che la malvagità degli uomini era grande sulla terra e che nel loro cuore erano inclini a nutrire sempre e solo pensieri cattivi. Geova si rammaricò di aver fatto gli uomini sulla terra, e se ne rattristò nel suo cuore.',
    ['«si rammaricò»: o “si addolorò”.'],
  ),
  'gen-6-9': verso(
    'Genesi 6:9, 10',
    b('Genesi', 6, '9, 10'),
    'Questa è la storia di Noè. Noè fu un uomo giusto. Si dimostrò integro tra i suoi contemporanei. Noè camminò con il vero Dio. Generò tre figli: Sem, Cam e Iàfet.',
    ['«integro»: o “irreprensibile”.', '«contemporanei»: lett. “sue generazioni”.'],
  ),
  'gen-6-21': verso(
    'Genesi 6:21',
    b('Genesi', 6, '21'),
    'E tu devi raccogliere e portare con te cibo di ogni tipo: servirà per nutrire te e gli animali”.',
  ),
  'gen-6-22': verso('Genesi 6:22', b('Genesi', 6, '22'), 'E Noè fece tutto ciò che Dio gli aveva comandato. Fece proprio così.'),
  'gen-7-2': verso(
    'Genesi 7:2, 3',
    b('Genesi', 7, '2, 3'),
    'Di ogni animale puro devi prendere sette esemplari, il maschio e la sua compagna, mentre di ogni animale che non è puro solo due, il maschio e la sua compagna. Anche di ogni creatura alata dei cieli devi prendere sette esemplari, maschio e femmina, perché la loro progenie sia conservata in vita su tutta la terra.',
    ['«sette esemplari»: o forse “sette paia”.'],
  ),
  'gen-7-16': verso(
    'Genesi 7:16',
    b('Genesi', 7, '16'),
    'Entrarono, il maschio e la femmina di tutti gli esseri viventi, proprio come Dio aveva comandato a Noè. Poi Geova chiuse la porta dietro di lui.',
  ),
  'gen-8-10': verso(
    'Genesi 8:10, 11',
    b('Genesi', 8, '10, 11'),
    'Aspettò altri sette giorni, e poi fece di nuovo volare la colomba fuori dall’arca. Verso sera la colomba tornò da lui, ed ecco che nel becco aveva una foglia fresca d’olivo! Così Noè capì che le acque erano diminuite sulla terra.',
  ),
  'gen-9-13': verso('Genesi 9:13', b('Genesi', 9, '13'), 'metto nelle nuvole il mio arcobaleno, che servirà da segno del patto tra me e la terra.'),
  'gen-9-18': verso(
    'Genesi 9:18, 19',
    b('Genesi', 9, '18, 19'),
    'I figli di Noè che uscirono dall’arca furono Sem, Cam e Iàfet. In seguito Cam generò Cànaan. Questi tre furono i figli di Noè, e da loro venne e si diffuse tutta la popolazione della terra.',
  ),
  'mt-24-37': verso(
    'Matteo 24:37-39',
    b('Matteo', 24, '37-39'),
    'Come furono i giorni di Noè, così sarà la presenza del Figlio dell’uomo. Infatti, come nei giorni prima del diluvio mangiavano e bevevano, gli uomini si sposavano e le donne erano date in moglie, fino al giorno in cui Noè entrò nell’arca, e non si accorsero di nulla finché venne il diluvio e li spazzò via tutti, così sarà la presenza del Figlio dell’uomo.',
  ),
};

function d(id: string, titolo: string, testo: string, certezza: Dettaglio['certezza'], fonti: Fonte[]): [string, Dettaglio] {
  return [id, { id, titolo, testo, certezza, fonti }];
}

export const DETTAGLI: Record<string, Dettaglio> = Object.fromEntries([
  // ——— Noè: giusto in un mondo violento, costruttore e predicatore ———
  d('violenza', 'Piena di violenza', 'La terra si era rovinata agli occhi di Dio ed era piena di violenza: tutti si comportavano in modo corrotto.', 'scritto', [b('Genesi', 6, '11, 12')]),
  d(
    'integro',
    'Senza difetto',
    'Noè poté essere definito integro, o senza difetto, perché a differenza di quel mondo fu pienamente all’altezza di ciò che Dio richiedeva da lui. Non si lasciò corrompere.',
    'libro',
    [F.it('Noè')],
  ),
  d('decenni', 'Decenni di lavoro', 'Per decenni, forse per una cinquantina d’anni, Noè e la sua famiglia lavorarono all’arca, che piano piano prese forma.', 'sembra', [F.libro]),
  d(
    'predicatore',
    'Predicatore di giustizia',
    'Noè non si limitò a costruire l’arca: avvertì le persone di ciò che stava per accadere, tanto che è chiamato «predicatore di giustizia». Ma nessuno lo ascoltò, evidentemente nemmeno i suoi molti parenti.',
    'libro',
    [F.libro, b('2 Pietro', 2, '5')],
  ),
  d(
    'condanno',
    'Condannò il mondo',
    'Che differenza tra quell’uomo di fede e il mondo che lo circondava! Per questo la Bibbia dice che mediante la sua fede Noè «condannò il mondo».',
    'libro',
    [F.libro, b('Ebrei', 11, '7')],
  ),
  d(
    'annotazioni',
    'Prese nota di tutto',
    'Mentre era nell’arca Noè prese accuratamente nota degli avvenimenti importanti. Per mezzo di lui e della sua famiglia Dio preservò la storia della creazione e una cronologia che risale fino al primo uomo.',
    'libro',
    [F.it('Noè')],
  ),
  d(
    'cipresso',
    'Un legno che non marcisce',
    'Il legno resinoso forse era cipresso, o un albero simile. In quella regione il cipresso abbondava, e per costruire navi lo si preferisce ancora oggi: resiste molto bene all’acqua e non marcisce.',
    'sembra',
    [F.it('Arca'), b('Genesi', 6, '14')],
  ),
  d(
    'impresa',
    'Mai vista prima',
    'Noè non aveva mai visto nulla di simile al diluvio annunciato da Geova, né si era mai dedicato a un’impresa così impegnativa: nessuna nave da carico dell’antichità somigliava neanche lontanamente all’arca. Eppure si mise all’opera.',
    'libro',
    [F.libro, F.it('Arca')],
  ),
  d(
    'specie',
    'Secondo le loro specie',
    'Le «specie» di Genesi sono gruppi più ampi delle specie di oggi, come gli equini o i bovini. Poche decine di «specie» di mammiferi e di uccelli potrebbero aver prodotto la varietà di animali che conosciamo; anche con stime abbondanti, l’arca poteva accoglierle facilmente.',
    'sembra',
    [F.it('Arca'), b('Genesi', 7, '2, 3')],
  ),
  d(
    'otto',
    'Otto persone',
    'Noè, sua moglie, i tre figli e le loro mogli: otto persone in tutto. Insieme avevano portato a termine l’incarico con determinazione, e insieme ora entravano nell’arca.',
    'libro',
    [F.libro, b('Genesi', 7, '13'), b('2 Pietro', 2, '5')],
  ),
  d(
    'cassa',
    'Una cassa che galleggia',
    'L’arca era una grande cassa dal fondo piatto: non le servivano né prua né timone, perché non doveva navigare ma solo essere impermeabile e stare a galla. Una forma così è molto stabile e non si capovolge facilmente.',
    'libro',
    [F.it('Arca')],
  ),
  d(
    'corvo',
    'Il corvo',
    'Il corvo è resistente in volo e si nutre di cibi di ogni genere: era l’uccello più adatto da mandare fuori per primo. La Bibbia indica che rimase fuori e si posava sull’arca solo per riposare.',
    'libro',
    [F.it('Corvo'), b('Genesi', 8, '5-7')],
  ),
  d(
    'ararat',
    'Su un terreno adatto',
    'L’arca si posò sui monti di Ararat cinque mesi dopo l’inizio del diluvio: probabilmente non sulla vetta più alta, ma su un terreno adatto, dove tutti avrebbero potuto vivere comodamente ancora per alcuni mesi.',
    'sembra',
    [F.it('Arca'), b('Genesi', 8, '4')],
  ),
  d(
    'adempiuto',
    'Il patto mantenuto',
    'Prima del diluvio Dio aveva detto a Noè: «con te stringo un patto». Grazie all’ubbidienza di Noè, Geova preservò la vita umana e animale: il patto si adempì quando uomini e animali poterono di nuovo vivere sulla terraferma.',
    'libro',
    [F.it('Patto'), b('Genesi', 6, '18'), b('Genesi', 8, '15-17')],
  ),
  d(
    'per-sempre',
    'Un patto per sempre',
    'Il patto dell’arcobaleno fu stretto sui monti di Ararat con Noè e la sua famiglia, che rappresentavano ogni essere vivente. Geova promise che non avrebbe mai più portato un diluvio, e diede l’arcobaleno come garanzia: il patto durerà per sempre.',
    'libro',
    [F.it('Patto'), F.libro, b('Genesi', 9, '8-17')],
  ),
  d('gratitudine', 'Grati', 'Appena uscita dall’arca, la famiglia di Noè si mise ad adorare Geova, grata di essere stata salvata.', 'libro', [F.libro, b('Genesi', 8, '20')]),
  d(
    'babele',
    'Più di un secolo dopo',
    'Durante la vita di Noè la falsa religione si affermò di nuovo: i seguaci di Nimrod cercarono di costruire una torre che arrivasse fino al cielo, ribellandosi al comando di Dio di riempire la terra e a Noè, suo profeta. Noè vide il giudizio di Geova su quei costruttori, dispersi su tutta la terra.',
    'libro',
    [F.it('Noè'), F.fondo(4), F.immagineB],
  ),

  // ——— Geova: il giudizio, il tempo stabilito, il patto ———
  d(
    'giudizio',
    'Non una catastrofe naturale',
    'Il diluvio non fu una catastrofe naturale: fu un giudizio di Dio. Prima venne dato un avvertimento, che però fu in gran parte ignorato.',
    'libro',
    [F.w02, F.fondo(1)],
  ),
  d(
    'decreto',
    'Un tempo stabilito',
    'Con quelle parole Geova non fissava la durata della vita umana: stabiliva quando avrebbe agito. Dato che il diluvio iniziò nel 2370 a.E.V., quel decreto fu emesso nel 2490, quando Noè aveva 480 anni.',
    'libro',
    [F.w12, F.fondo(2)],
  ),
  d('porta', 'La fine degli scherni', 'Quando tutto fu pronto, fu Geova a chiudere l’arca. Forse quel gesto pose fine a tutti gli scherni.', 'sembra', [F.libro]),
  d(
    'tempi',
    'Sette giorni prima',
    'Geova aveva stabilito il tempo del diluvio molto prima di incaricare Noè. A Noè lo rivelò sette giorni prima: il tempo necessario per far entrare gli animali. Così, quando le cateratte del cielo si aprirono, tutto era pronto.',
    'libro',
    [F.w12, b('Genesi', 7, '4')],
  ),
  d(
    'promessa',
    'Semina e raccolta',
    'Dopo l’olocausto di Noè, Geova disse in cuor suo che non avrebbe più maledetto il suolo a causa dell’uomo: la terra non avrebbe mai smesso di avere semina e raccolta, freddo e caldo, estate e inverno, giorno e notte.',
    'scritto',
    [b('Genesi', 8, '21, 22')],
  ),
  d(
    'modello',
    'Un modello per il futuro',
    'Gesù e l’apostolo Pietro spiegarono che i giorni di Noè sono un modello profetico: della «presenza del Figlio dell’uomo» e del futuro giorno del giudizio.',
    'libro',
    [F.it('Noè'), b('Matteo', 24, '37-39')],
  ),

  // ——— La moglie di Noè: la famiglia, le provviste, gli scherni ———
  d('educati', 'Una famiglia diversa', 'Tu e Noè insegnaste ai vostri tre figli a ubbidire a Geova: per questo la vostra famiglia era diversa da tutte le altre.', 'libro', [F.libro]),
  d(
    'adulti',
    'Figli già sposati',
    'I vostri figli erano già adulti e sposati quando Dio comandò a Noè di costruire l’arca: per questo è probabile che mancassero solo 40 o 50 anni al diluvio.',
    'sembra',
    [F.w12, F.it('Noè'), F.fondo(2)],
  ),
  d(
    'prepotenti',
    'Vicini che facevano paura',
    'Gli angeli che avevano preso forma umana dovevano far paura, e i loro figli erano prepotenti. Probabilmente la vostra famiglia incontrò opposizione e scherni.',
    'sembra',
    [F.libro],
  ),
  d(
    'provviste',
    'Le provviste',
    'Bisognava caricare le provviste per la famiglia e per tutti gli animali, e organizzare gli spazi. L’immagine del capitolo mostra la famiglia di Noè con un carretto pieno di provviste, mentre la gente la deride.',
    'libro',
    [F.libro, F.immagine],
  ),
  d('spontanei', 'Vennero da soli', 'Gli animali vennero spontaneamente: «andarono nell’arca da Noè a due a due».', 'libro', [F.libro, b('Genesi', 7, '9')]),
  d('derisi', 'Ancora più scherni', 'È possibile che, mentre finivate di caricare l’arca, la gente vi deridesse ancora di più.', 'sembra', [F.libro]),

  // ——— Uno dei figli: il cantiere, l’anno nell’arca, la nuova terra ———
  d('resinoso', 'Legno resinoso', 'Dio aveva detto di costruire l’arca di legno resinoso.', 'scritto', [b('Genesi', 6, '14')]),
  d(
    'scompartimenti',
    'Tre piani di scompartimenti',
    'Dentro, l’arca era divisa in scompartimenti, su tre piani: uno inferiore, un secondo e un terzo. I due piani aggiunti la rinforzavano internamente.',
    'libro',
    [b('Genesi', 6, '14, 16'), F.it('Arca')],
  ),
  d('catrame', 'Dentro e fuori', 'Dio aveva detto di coprire l’arca di catrame, o bitume, dentro e fuori.', 'scritto', [b('Genesi', 6, '14')]),
  d(
    'scorte',
    'Cibo per più di un anno',
    'Bisognava imbarcare una gran quantità e varietà di cibo per tutte le creature, sufficiente per più di un anno.',
    'libro',
    [F.it('Arca'), b('Genesi', 6, '21')],
  ),

  // ——— Dentro l’arca (ricostruzione, con la cautela delle pubblicazioni) ———
  d(
    'fiducia',
    'Le travi scricchiolano',
    'Probabilmente la pioggia batteva forte sul tetto e le travi scricchiolavano. Ma Noè non temeva per l’arca: confidava nella promessa di Dio.',
    'sembra',
    [F.w13],
  ),
  d(
    'culto',
    'Le cose di Dio, in famiglia',
    'Nell’arca senza dubbio Noè prese l’iniziativa nel parlare con la famiglia di argomenti spirituali, e ringraziava Dio.',
    'libro',
    [F.w01],
  ),
  d(
    'lampada',
    'Una lampada a olio',
    'Probabilmente dentro l’arca c’era soltanto la luce fioca di una lampada a olio. Luce e aria fresca entrarono di più quando Noè tolse una parte del tetto.',
    'sembra',
    [F.w13, b('Genesi', 8, '13')],
  ),
  d('assordante', 'La pioggia sul tetto', 'Forse il rumore della pioggia torrenziale sul tetto e sui fianchi dell’arca era assordante.', 'sembra', [F.w13]),
  d(
    'preghiera',
    'Insieme, per pregare',
    'Probabilmente la famiglia si riuniva per pregare e parlare della protezione di Dio.',
    'sembra',
    [F.w13],
  ),
  d(
    'occupati',
    'Un anno di lavoro',
    'Nell’arca la famiglia fu occupata a sfamare e abbeverare gli animali, a eliminare i rifiuti e a tenere il conto del tempo, per un anno lunare e dieci giorni.',
    'libro',
    [F.w01],
  ),
  d('tranquilli', 'Animali più tranquilli', 'Forse Dio rese gli animali più tranquilli, in una specie di torpore simile al letargo.', 'sembra', [F.w13]),
  d(
    'compiti',
    'I lavori più pesanti',
    'Probabilmente Noè affidò ai figli i lavori più pesanti: nutrire gli animali e tenerli puliti e in salute.',
    'sembra',
    [F.w13],
  ),
  d(
    'tsohar',
    'La luce sotto il tetto',
    'Non è chiaro che cosa fosse la «finestra per la luce»: forse un’apertura alta un cubito che correva lungo i lati sotto il tetto, per la luce e l’aria; forse un tetto leggermente spiovente.',
    'sembra',
    [F.it('Arca'), b('Genesi', 6, '16')],
  ),
  d(
    'dimensioni',
    'Circa 133 metri',
    'Con un cubito di 44,5 centimetri, l’arca misurava circa 133 metri per 22 per 13: un volume di circa 40.000 metri cubi. La proporzione fra lunghezza e larghezza, 6 a 1, è quella che usano anche gli architetti navali di oggi.',
    'libro',
    [F.it('Arca')],
  ),
  d(
    'un-anno',
    'Più di un anno',
    'La pioggia cominciò nel 600º anno di Noè, il 17º giorno del 2º mese; la terra era asciutta nel 601º anno, il 27º giorno del 2º mese. La famiglia restò nell’arca più di un anno.',
    'numeri',
    [b('Genesi', 7, '11'), b('Genesi', 8, '14')],
  ),
  d('discendenti', 'Tutti da voi', 'Tutti gli esseri umani in vita oggi discendono da Noè e dalla sua famiglia.', 'libro', [F.libro]),

  // ——— Uno dei contemporanei: il mondo che non ascoltò ———
  d(
    'nefilim',
    'I nefilim',
    'Alcuni angeli ribelli presero forma umana e sposarono tutte le donne che vollero. Dalle loro unioni nacquero i nefilim, giganti violenti e crudeli: il loro nome forse significa «gli abbattitori», quelli che fanno cadere altri.',
    'libro',
    [F.libro, b('Genesi', 6, '4')],
  ),
  d(
    'civilta',
    'Una civiltà progredita',
    'Tutti parlavano la stessa lingua e vivevano per secoli: c’erano città, fucine per attrezzi di rame e di ferro, strumenti musicali. Ma tutto finì all’improvviso.',
    'libro',
    [F.w02],
  ),
  d(
    'intorpiditi',
    'Troppo presi da altro',
    'La società di quel tempo andava agli estremi nel gozzovigliare: questo intorpidì la sensibilità delle persone e contribuì a far loro ignorare l’avvertimento di Dio.',
    'libro',
    [F.it('Noè')],
  ),
  d(
    'non-credevano',
    'Difficile da credere',
    'A quanto pare, per la gente era difficile credere che tutto ciò che aveva intorno sarebbe finito.',
    'sembra',
    [F.w02],
  ),
]);

function s(id: string, domanda: string): [string, Sensazione] {
  return [id, { id, domanda }];
}

export const SENSAZIONI: Record<string, Sensazione> = Object.fromEntries([
  s('n-integro', 'Intorno a te tutti si comportano in modo corrotto. Che cosa ti serve per restare integro, anche da solo?'),
  s('n-grato', 'Esci vivo dall’arca dopo più di un anno. Qual è la prima cosa che vorresti fare per Geova?'),
  s('g-uno', 'In tutta la terra, un solo uomo ha l’approvazione di Geova. Che cosa ti dice questo di come Geova guarda ciascuno?'),
  s('g-segno', 'Geova lega una promessa a un segno che si vede ancora oggi. Che cosa provi quando vedi un arcobaleno?'),
  s('m-derisa', 'La gente ride di voi mentre caricate le provviste. Che cosa ti aiuta a non vergognarti di ciò che fai per Geova?'),
  s('f-diverso', 'Sei cresciuto in una famiglia diversa da tutte le altre. Che cosa ti costa essere diverso dai tuoi coetanei, e che cosa ci guadagni?'),
  s('n-porta', 'Sei dentro, e la porta non l’hai chiusa tu: l’ha chiusa Geova. Che cosa provi a lasciare a lui ciò che non puoi controllare?'),
  s('n-arca', 'Le travi scricchiolano e fuori c’è solo acqua. Su quale promessa ti appoggi quando non vedi come andrà a finire?'),
  s('m-arca', 'Siete chiusi nell’arca da mesi, e fuori piove senza sosta. Che cosa aiuta una famiglia ad andare avanti, giorno dopo giorno?'),
  s('f-lavoro', 'Ogni giorno lo stesso lavoro faticoso, per mesi. Che cosa rende prezioso un lavoro così, quando è Geova ad averlo chiesto?'),
  s('c-avvertimento', 'Hai sentito l’avvertimento di Noè per anni. Che cosa ti ha impedito di prenderlo sul serio?'),
]);

export const STUDIO: SezioneStudio[] = [
  { id: 'parlarne', titolo: 'Per parlarne insieme', domande: [{ id: 'parlarne-1', testo: 'In quali modi Noè mostrò coraggio?' }] },
  {
    id: 'fondo',
    titolo: 'Vai più a fondo',
    nota: 'Le risposte si trovano nelle pubblicazioni indicate accanto a ogni domanda.',
    domande: [
      { id: 'fondo-1', testo: 'Com’era il mondo prima del diluvio?', fonti: [F.w02] },
      {
        id: 'fondo-2',
        testo: 'Quando ricevette Noè l’incarico di costruire l’arca? E quanto tempo prima seppe quando sarebbe iniziato il diluvio?',
        fonti: [F.w12],
      },
      { id: 'fondo-3', testo: 'Perché possiamo credere che il diluvio sia accaduto davvero?', fonti: [F.diluvio, F.immagineA] },
      {
        id: 'fondo-4',
        testo: 'Che cosa avvenne più di un secolo dopo il diluvio, e come potrebbe aver influito sui sentimenti e sulla vita di Noè ormai anziano?',
        fonti: [{ rif: 'Perspicacia nello studio delle Scritture, «Noè», par. 13', url: `${F.it('Noè').url}#p14` }, F.immagineB],
      },
    ],
  },
  {
    id: 'riguarda',
    titolo: 'Una storia che ti riguarda',
    domande: [
      { id: 'riguarda-1', testo: 'Sotto quali aspetti il tempo in cui viviamo somiglia a quello di Noè?', fonti: [b('Matteo', 24, '36-39')] },
      { id: 'riguarda-2', testo: 'Che cosa ti insegna l’esempio di Noè sull’importanza di essere organizzati, di lavorare con impegno e di essere pazienti?' },
      { id: 'riguarda-3', testo: 'Come potresti imitare il coraggio di Noè nella tua vita?' },
    ],
  },
  {
    id: 'prospettiva',
    titolo: 'Una prospettiva più ampia',
    domande: [
      { id: 'prospettiva-1', testo: 'Che cosa ti insegna su Geova la storia di Noè?' },
      { id: 'prospettiva-2', testo: 'In che modo questa storia si collega al proposito di Geova?' },
      { id: 'prospettiva-3', testo: 'Che cosa vorresti chiedere a Noè quando sarà risuscitato?' },
    ],
  },
];

export const APPROFONDISCI: Fonte[] = [
  { rif: 'Il capitolo 2 del libro su jw.org (testo, audio, immagini)', url: URL_CAPITOLO },
  { rif: 'Video «Fede: esempi positivi e negativi | Imitiamo Noè, non i suoi contemporanei» (indicato nel capitolo)', url: URL_CAPITOLO },
  { rif: 'Lezione per bambini «Noè ha fede in Dio» (indicata nel capitolo)', url: URL_CAPITOLO },
  { rif: '«Noè e il diluvio universale: solo una leggenda?»', url: F.diluvio.url },
  { rif: 'Perspicacia nello studio delle Scritture, «Noè» e «Arca»', url: F.it('Noè').url },
];
