import { b, LIBRO_BASE, perspicacia, RIVISTE, verso } from '@/contenuti/fonti';
import type { Dettaglio, Fonte, Sensazione, SezioneStudio, Verso } from '@/contenuti/tipi';

export { b };

/**
 * Capitolo 18 — Gedeone: «Coraggioso e cauto».
 *
 * Il capitolo copre Giudici 6:1–7:22, 8:4-23 e 8:28. Restano fuori l’efod d’oro e la
 * fine della vita di Gedeone (8:24-27, 29-35), salvo ciò che dice il libro; Giudici
 * 8:1-3 compare perché lo cita «Una storia che ti riguarda». Le morti non si mostrano.
 */

export const URL_CAPITOLO = `${LIBRO_BASE}/dal-tempo-patriarchi-a-giudici/gedeone-coraggioso-e-cauto/`;

export const F = {
  libro: { rif: 'Libro, cap. 18 «Coraggioso e cauto»', url: URL_CAPITOLO } as Fonte,
  immagine: { rif: 'Libro, cap. 18, immagine del capitolo', url: URL_CAPITOLO } as Fonte,
  immagineA: { rif: 'Libro, cap. 18, immagine A', url: URL_CAPITOLO } as Fonte,
  immagineB: { rif: 'Libro, cap. 18, immagine B', url: URL_CAPITOLO } as Fonte,
  fondo: (n: number): Fonte => ({ rif: `Libro, cap. 18, «Vai più a fondo» n. ${n}`, url: URL_CAPITOLO }),
  riguarda: { rif: 'Libro, cap. 18, «Una storia che ti riguarda»', url: URL_CAPITOLO } as Fonte,
  w00: {
    rif: 'La Torre di Guardia 1/8/2000, «La sapienza è con i modesti»',
    url: `${RIVISTE}/w20000801/La-sapienza-%C3%A8-con-i-modesti/#p16`,
  } as Fonte,
  w04: { rif: 'La Torre di Guardia 15/10/2004, p. 16 parr. 9-10', url: `${RIVISTE}/w20041015/Percorri-il-paese/#p12` } as Fonte,
  w05: {
    rif: 'La Torre di Guardia 15/4/2005, «Quanto è accurata la storia biblica?»',
    url: `${RIVISTE}/w20050415/Quanto-%C3%A8-accurata-la-storia-biblica/`,
  } as Fonte,
  it: perspicacia,
};

export const VERSI: Record<string, Verso> = {
  'gdc-6-1': verso(
    'Giudici 6:1-40',
    b('Giudici', 6, '1-40'),
    'Tuttavia gli israeliti fecero di nuovo ciò che era male agli occhi di Geova, e Geova li diede in mano a Màdian per sette anni. La mano di Màdian oppresse Israele. A causa di Màdian gli israeliti si fecero nascondigli nelle montagne, nelle caverne e in luoghi difficilmente accessibili. Se gli israeliti seminavano, Màdian, Àmalec e gli orientali li attaccavano. Si accampavano contro di loro e distruggevano le colture del paese fino a Gaza, e non lasciavano a Israele né cibo, né pecora, né toro, né asino. Arrivavano con il loro bestiame e le loro tende, numerosi come locuste; non li si poteva contare, né loro né i loro cammelli. Entravano nel paese per devastarlo. Così Israele si impoverì molto a causa di Màdian; e gli israeliti supplicarono Geova di aiutarli. Quando gli israeliti supplicarono Geova di aiutarli a causa di Màdian, Geova mandò loro un profeta, che dichiarò: “Questo è ciò che Geova, l’Iddio d’Israele, dice: ‘Io vi feci salire dall’Egitto e vi feci uscire dalla casa di schiavitù. Vi liberai dalla mano dell’Egitto e da tutti i vostri oppressori; li scacciai davanti a voi e vi diedi il loro paese. E vi dissi: “Io sono Geova vostro Dio. Non dovete adorare gli dèi degli amorrei nel cui paese dimorate”. Ma voi non mi avete ubbidito’”. In seguito venne l’angelo di Geova, e si sedette sotto il grande albero che era a Ofra e che apparteneva a Iòas l’abiezerita. Suo figlio Gedeone stava battendo il grano nel torchio per il vino, in modo da nasconderlo alla vista di Màdian. L’angelo di Geova gli apparve e gli disse: “Geova è con te, potente guerriero”. Gedeone a sua volta disse: “Perdonami, mio signore, ma se Geova è con noi, perché ci è successo tutto questo? Dove sono tutte le sue straordinarie gesta che i nostri padri ci hanno narrato, dicendo: ‘Geova non ci fece forse uscire dall’Egitto?’ Ora Geova ci ha abbandonato e ci ha dato in mano a Màdian”. Geova si rivolse a lui e gli disse: “Va’ con la potenza che hai, e salverai Israele dalla mano di Màdian. Non sono forse io che ti mando?” Gedeone gli rispose: “Perdonami, Geova. Come posso salvare Israele? Ecco, la mia famiglia è la più piccola di Manasse, e io sono il più insignificante della casa di mio padre”. Ma Geova gli disse: “Dato che io sarò con te, abbatterai Màdian come se fosse un uomo solo”. Quindi Gedeone gli disse: “Se ho ottenuto il tuo favore, dimostrami con un segno che sei tu a parlarmi. Ti prego, non andartene da qui finché non sarò tornato con un dono e non te lo avrò messo davanti”. Lui rispose: “Rimarrò qui finché non sarai tornato”. Gedeone rientrò, preparò un capretto e, con un’efa di farina, fece del pane senza lievito. Mise la carne nel cesto e il brodo nella pentola, dopodiché li portò fuori e glieli servì sotto il grande albero. Allora l’angelo del vero Dio gli disse: “Prendi la carne e il pane senza lievito e mettili su quella grande roccia, poi versa il brodo”. E lui fece così. L’angelo di Geova stese quindi il bastone che aveva in mano e con la punta toccò la carne e il pane senza lievito, e un fuoco divampò dalla roccia e consumò la carne e il pane senza lievito. L’angelo di Geova poi scomparve. Allora Gedeone capì che era l’angelo di Geova. Subito esclamò: “Ohimè, Sovrano Signore Geova, ho visto l’angelo di Geova faccia a faccia!” Ma Geova gli disse: “La pace sia con te. Non aver paura; non morirai”. Lì Gedeone eresse dunque a Geova un altare, tuttora conosciuto come Geova-Shalòm. Si trova ancora a Ofra degli abiezeriti. Quella notte Geova gli disse: “Prendi il giovane toro di tuo padre, il secondo giovane toro, quello che ha sette anni; demolisci l’altare di Bàal che appartiene a tuo padre e abbatti il palo sacro che gli sta accanto. In cima a questa roccaforte erigi un altare a Geova tuo Dio con delle pietre disposte in fila; dopodiché prendi il toro e offrilo in olocausto sui pezzi di legno del palo sacro che avrai abbattuto”. Perciò Gedeone prese 10 uomini fra i suoi servitori e fece proprio come Geova gli aveva detto. Tuttavia aveva troppo timore della casa di suo padre e degli uomini della città per farlo di giorno, per cui lo fece di notte. Quando la mattina dopo si alzarono di buon’ora, gli uomini della città si accorsero che l’altare di Bàal era stato demolito, il palo sacro lì accanto era stato abbattuto e il secondo giovane toro era stato offerto sull’altare appena eretto. Si chiesero l’un l’altro: “Chi è stato a far questo?” Dopo aver indagato, dissero: “È stato Gedeone, il figlio di Iòas”. Gli uomini della città intimarono dunque a Iòas: “Porta fuori tuo figlio! Deve morire, perché ha demolito l’altare di Bàal e ha abbattuto il palo sacro che gli stava accanto”. Iòas rispose a tutti quelli che lo fronteggiavano: “Dovete essere voi a difendere Bàal? Dovete essere voi a salvarlo? Chiunque lo difenda dev’essere messo a morte questa mattina stessa. Se è un dio si difenda da solo, visto che il suo altare è stato demolito”. E quel giorno diede a Gedeone il nome di Ierubbàal, dicendo: “Bàal si difenda, visto che il suo altare è stato demolito”. E tutto Màdian, Àmalec e gli orientali unirono le forze; attraversarono il fiume, entrarono nella Valle di Izreèl e vi si accamparono. Allora lo spirito di Geova venne su Gedeone e lui suonò il corno, e gli abiezeriti si radunarono dietro di lui. Mandò messaggeri per tutto Manasse, e anche loro si radunarono dietro di lui. Mandò messaggeri anche per Àser, Zàbulon e Nèftali, e questi salirono da lui. Gedeone disse quindi al vero Dio: “Se stai per salvare Israele tramite me, come hai promesso, ecco, stenderò un vello di lana nell’aia. Se ci sarà la rugiada solo sul vello ma tutto il terreno intorno sarà asciutto, allora saprò che tu salverai Israele tramite me, come hai promesso”. E così avvenne. Quando il giorno dopo si alzò di buon’ora e strizzò il vello, uscì abbastanza rugiada da riempire d’acqua una grande scodella. Comunque Gedeone disse al vero Dio: “Non si accenda la tua ira contro di me, ma permettimi di chiedere ancora una cosa. Lasciami fare, ti prego, solo un’altra prova con il vello. Ti prego, fa’ che resti asciutto solo il vello e che ci sia rugiada su tutto il terreno”. Quella notte Dio fece proprio così: solo il vello rimase asciutto e su tutto il terreno ci fu la rugiada.',
    ['«nascondigli»: o forse “depositi sotterranei”.', '«adorare»: lett. “temere”.', '«Iòas»: o “Jòas”.'],
  ),
  'gdc-7-1': verso(
    'Giudici 7:1-22',
    b('Giudici', 7, '1-22'),
    'Quindi Ierubbàal, cioè Gedeone, e tutti quelli che erano con lui si alzarono presto e si accamparono presso la sorgente di Haròd. L’accampamento di Màdian si trovava a nord rispetto a loro, ai piedi del colle di More, nella pianura. Geova disse ora a Gedeone: “Ci sono troppi uomini con te perché io dia Màdian in mano loro. Altrimenti Israele potrebbe vantarsi e dire contro di me: ‘È stata la mia mano a salvarmi’. Quindi, per favore, fa’ questo annuncio ai tuoi uomini: ‘Chi ha paura e trema torni a casa’”. Così Gedeone li mise alla prova. Allora 22.000 tornarono a casa, e rimasero in 10.000. Tuttavia Geova disse a Gedeone: “Sono ancora troppi. Falli scendere all’acqua in modo che là io possa metterli alla prova per te. Quando ti dirò: ‘Questo verrà con te’, quello verrà con te. Ma quando ti dirò: ‘Questo non verrà con te’, quello non verrà”. Gedeone fece dunque scendere gli uomini all’acqua. Quindi Geova disse a Gedeone: “Separa tutti quelli che bevono leccando l’acqua con la lingua come fanno i cani da quelli che per bere si inginocchiano”. Il numero degli uomini che leccarono l’acqua portandosela con la mano alla bocca fu di 300. Tutti gli altri, invece, per bere si inginocchiarono. Geova disse poi a Gedeone: “Vi salverò tramite i 300 uomini che hanno leccato l’acqua dalla mano, e consegnerò Màdian nelle tue mani. Tutti gli altri tornino a casa”. Così, dopo che quelli ebbero preso dai compagni le provviste e i corni, Gedeone rimandò a casa tutti gli altri uomini d’Israele. Tenne con sé soltanto i 300. L’accampamento di Màdian si trovava sotto di lui, nella pianura. Quella notte Geova gli disse: “Alzati, attacca l’accampamento, perché te l’ho dato in mano. Ma se hai paura di attaccare, scendi all’accampamento con il tuo servitore Pura. Ascolta ciò che diranno, e allora troverai il coraggio di attaccare l’accampamento”. Quindi Gedeone e il suo servitore Pura scesero fino ai margini dell’accampamento. Màdian, Àmalec e tutti gli orientali coprivano la pianura come uno sciame di locuste, e i loro cammelli non si potevano contare, numerosi come i granelli di sabbia sulla spiaggia del mare. Quando Gedeone arrivò, c’era un uomo che raccontava un sogno al suo compagno e diceva: “Questo è il sogno che ho fatto. C’era un pane rotondo d’orzo che entrava rotolando nell’accampamento di Màdian. Ha raggiunto una tenda e l’ha colpita così forte da farla cadere. La tenda si è rovesciata ed è crollata a terra”. Il suo compagno gli rispose: “Non può essere altro che la spada di Gedeone, figlio di Iòas, un uomo d’Israele. Dio gli ha dato in mano Màdian e tutto l’accampamento”. Non appena ebbe udito il racconto del sogno e la sua interpretazione, Gedeone si inchinò per adorare Dio. Poi tornò all’accampamento d’Israele e disse: “Alzatevi, perché Geova vi ha dato in mano l’accampamento di Màdian”. Quindi divise i 300 uomini in tre schiere, e diede a tutti dei corni e delle grosse giare con dentro delle torce. “Guardate me e fate esattamente quello che faccio io”, disse loro. “Quando sarò arrivato ai margini dell’accampamento, dovrete fare proprio come me. Quando suonerò il corno, io e tutti quelli che sono con me, anche voi suonerete i vostri corni tutt’intorno all’accampamento e griderete: ‘Per Geova e per Gedeone!’” Gedeone e i 100 uomini con lui arrivarono ai margini dell’accampamento all’inizio della veglia intermedia della notte, subito dopo il cambio delle sentinelle. Suonarono i corni e fracassarono le grosse giare che avevano in mano. Allora tutt’e tre le schiere suonarono i corni e fracassarono le grosse giare. Tenendo la torcia nella mano sinistra, suonarono il corno che avevano nella destra e gridarono: “La spada di Geova e di Gedeone!” Rimasero ciascuno al suo posto, intorno all’accampamento; nell’accampamento, invece, tutti si misero a correre e a urlare, e si diedero alla fuga. I 300 continuarono a suonare i corni, e in tutto l’accampamento Geova volse la spada dell’uno contro l’altro; l’esercito fuggì fino a Bet-Sitta, verso Zèrera, fino alla periferia di Abèl-Meòla, presso Tabbàt.',
    ['«pianura»: o “bassopiano”.', '«troverai il coraggio»: lett. “le tue mani si faranno forti”.'],
  ),
  'gdc-8-4': verso(
    'Giudici 8:4-23',
    b('Giudici', 8, '4-23'),
    'Gedeone giunse poi al Giordano e lo attraversò. Lui e i suoi 300 uomini erano stanchi, ma continuarono l’inseguimento. Agli abitanti di Succòt disse: “Vi prego, date del pane agli uomini al mio seguito, perché sono stanchi e io sto inseguendo Zeba e Zalmùnna, i re di Màdian”. Ma i principi di Succòt replicarono: “Zeba e Zalmùnna sono forse già in mano tua? Perché dovremmo dare pane al tuo esercito?” Allora Gedeone disse: “Se è così, quando Geova mi avrà dato in mano Zeba e Zalmùnna vi fustigherò con le spine e i rovi del deserto”. E da lì salì a Penuèl e fece la stessa richiesta, ma gli uomini di Penuèl gli diedero la stessa risposta di quelli di Succòt. Perciò anche agli uomini di Penuèl disse: “Quando sarò tornato vittorioso, abbatterò questa torre”. Ora Zeba e Zalmùnna erano a Carcòr con i loro eserciti, circa 15.000 uomini. Questo era ciò che rimaneva dell’intero esercito degli orientali, visto che 120.000 uomini armati di spada erano caduti. Gedeone continuò a salire per la via dei nomadi a est di Noba e di Iogbèa e attaccò l’accampamento, che non era preparato a un assalto. I due re madianiti, Zeba e Zalmùnna, si diedero alla fuga, ma Gedeone si lanciò al loro inseguimento e li catturò, gettando nel panico l’intero accampamento. Gedeone, figlio di Iòas, tornò poi dalla guerra attraverso il passo che sale a Ères. Lungo il cammino catturò un giovane di Succòt e lo interrogò, e questi gli scrisse i nomi dei principi e degli anziani di Succòt, 77 uomini. Allora Gedeone andò dagli uomini di Succòt e disse loro: “Ecco Zeba e Zalmùnna, a proposito dei quali mi avete deriso dicendo: ‘Zeba e Zalmùnna sono forse già in mano tua? Perché dovremmo dare pane ai tuoi uomini esausti?’” Prese quindi gli anziani di Succòt, e così, con spine e rovi del deserto, diede a quegli uomini una lezione. Dopodiché abbatté la torre di Penuèl e uccise gli uomini di quella città. Poi chiese a Zeba e a Zalmùnna: “Com’erano gli uomini che avete ucciso sul Tàbor?” Gli risposero: “Erano come te; ognuno di loro sembrava il figlio di un re”. Allora lui replicò: “Erano miei fratelli, figli di mia madre. Com’è vero che Geova vive, se aveste risparmiato loro la vita non dovrei uccidervi”. Disse quindi a Ièter, il suo primogenito: “Avanti, uccidili”. Ma il ragazzo non estrasse la spada; aveva paura, perché era ancora giovane. Zeba e Zalmùnna allora dissero: “Avanti, mettici a morte tu stesso, perché un uomo si giudica dalla sua forza”. Pertanto Gedeone si fece avanti e uccise Zeba e Zalmùnna, e prese gli ornamenti a forma di mezzaluna che erano al collo dei loro cammelli. In seguito gli uomini d’Israele dissero a Gedeone: “Governa su di noi, tu e tuo figlio e tuo nipote, dato che ci hai salvato dalla mano di Màdian”. Ma Gedeone disse loro: “Non sarò io a governarvi, né vi governerà mio figlio. Sarà Geova a governarvi”.',
    ['«sono forse già in mano tua?»: lett. “il palmo di Zeba e di Zalmùnna”.'],
  ),
  'gdc-8-28': verso(
    'Giudici 8:28',
    b('Giudici', 8, '28'),
    'Màdian venne dunque sottomesso agli israeliti, e non li sfidò più; e ai giorni di Gedeone il paese fu in pace per 40 anni.',
  ),
  'gdc-6-11': verso(
    'Giudici 6:11, 12',
    b('Giudici', 6, '11, 12'),
    'In seguito venne l’angelo di Geova, e si sedette sotto il grande albero che era a Ofra e che apparteneva a Iòas l’abiezerita. Suo figlio Gedeone stava battendo il grano nel torchio per il vino, in modo da nasconderlo alla vista di Màdian. L’angelo di Geova gli apparve e gli disse: “Geova è con te, potente guerriero”.',
  ),
  'gdc-6-15': verso(
    'Giudici 6:15, 16',
    b('Giudici', 6, '15, 16'),
    'Gedeone gli rispose: “Perdonami, Geova. Come posso salvare Israele? Ecco, la mia famiglia è la più piccola di Manasse, e io sono il più insignificante della casa di mio padre”. Ma Geova gli disse: “Dato che io sarò con te, abbatterai Màdian come se fosse un uomo solo”.',
  ),
  'gdc-6-31': verso(
    'Giudici 6:31, 32',
    b('Giudici', 6, '31, 32'),
    'Iòas rispose a tutti quelli che lo fronteggiavano: “Dovete essere voi a difendere Bàal? Dovete essere voi a salvarlo? Chiunque lo difenda dev’essere messo a morte questa mattina stessa. Se è un dio si difenda da solo, visto che il suo altare è stato demolito”. E quel giorno diede a Gedeone il nome di Ierubbàal, dicendo: “Bàal si difenda, visto che il suo altare è stato demolito”.',
  ),
  'gdc-6-39': verso(
    'Giudici 6:39, 40',
    b('Giudici', 6, '39, 40'),
    'Comunque Gedeone disse al vero Dio: “Non si accenda la tua ira contro di me, ma permettimi di chiedere ancora una cosa. Lasciami fare, ti prego, solo un’altra prova con il vello. Ti prego, fa’ che resti asciutto solo il vello e che ci sia rugiada su tutto il terreno”. Quella notte Dio fece proprio così: solo il vello rimase asciutto e su tutto il terreno ci fu la rugiada.',
  ),
  'gdc-7-2': verso(
    'Giudici 7:2',
    b('Giudici', 7, '2'),
    'Geova disse ora a Gedeone: “Ci sono troppi uomini con te perché io dia Màdian in mano loro. Altrimenti Israele potrebbe vantarsi e dire contro di me: ‘È stata la mia mano a salvarmi’.',
  ),
  'gdc-7-13': verso(
    'Giudici 7:13, 14',
    b('Giudici', 7, '13, 14'),
    'Quando Gedeone arrivò, c’era un uomo che raccontava un sogno al suo compagno e diceva: “Questo è il sogno che ho fatto. C’era un pane rotondo d’orzo che entrava rotolando nell’accampamento di Màdian. Ha raggiunto una tenda e l’ha colpita così forte da farla cadere. La tenda si è rovesciata ed è crollata a terra”. Il suo compagno gli rispose: “Non può essere altro che la spada di Gedeone, figlio di Iòas, un uomo d’Israele. Dio gli ha dato in mano Màdian e tutto l’accampamento”.',
  ),
  'gdc-8-22': verso(
    'Giudici 8:22, 23',
    b('Giudici', 8, '22, 23'),
    'In seguito gli uomini d’Israele dissero a Gedeone: “Governa su di noi, tu e tuo figlio e tuo nipote, dato che ci hai salvato dalla mano di Màdian”. Ma Gedeone disse loro: “Non sarò io a governarvi, né vi governerà mio figlio. Sarà Geova a governarvi”.',
  ),
};

/** Le parole pronunciate, alla lettera (Giudici 6:31; 7:14, 20). */
export const PAROLE = {
  difendere: 'Dovete essere voi a difendere Bàal? Dovete essere voi a salvarlo?',
  siDifenda: 'Se è un dio si difenda da solo, visto che il suo altare è stato demolito',
  spada: 'Non può essere altro che la spada di Gedeone, figlio di Iòas, un uomo d’Israele',
  grido: 'La spada di Geova e di Gedeone!',
};

function d(id: string, titolo: string, testo: string, certezza: Dettaglio['certezza'], fonti: Fonte[]): [string, Dettaglio] {
  return [id, { id, titolo, testo, certezza, fonti }];
}

export const DETTAGLI: Record<string, Dettaglio> = Object.fromEntries([
  // ——— Gedeone: coraggioso e cauto, modesto ———
  d('nascosti', 'Nascosti nelle caverne', 'Per sette anni Madian oppresse Israele: gli israeliti si fecero nascondigli nelle montagne, nelle caverne e in luoghi difficilmente accessibili.', 'scritto', [b('Giudici', 6, '1, 2')]),
  d(
    'cauto',
    'Il grano nel torchio',
    'Gedeone non smise di battere il grano, ma lo faceva nel torchio per il vino, probabilmente una grande vasca scavata nella roccia: così era meno esposto alla vista dei madianiti. Coraggioso, e cauto.',
    'sembra',
    [F.libro],
  ),
  d(
    'modesto',
    'Non cercava gloria',
    'Gedeone non si lasciò lusingare dal complimento dell’angelo e non accettò l’incarico di corsa per diventare un eroe: si chiese con modestia come avrebbe potuto salvare Israele.',
    'libro',
    [F.w00],
  ),
  d(
    'discrezione',
    'Di notte, con dieci servitori',
    'Gedeone agì di notte, quando molto probabilmente sarebbe passato inosservato, e prese con sé dieci servitori: forse alcuni facevano la guardia mentre gli altri lo aiutavano.',
    'sembra',
    [F.w00, b('Giudici', 6, '27')],
  ),
  d(
    'mite',
    'Una risposta mite',
    'Quando gli uomini di Efraim lo attaccarono con asprezza perché non li aveva chiamati a combattere, Gedeone rispose con mitezza, dando a loro il merito: e si calmarono.',
    'scritto',
    [b('Giudici', 8, '1-3'), F.riguarda],
  ),
  d(
    'efa',
    'Un’efa di farina',
    'Per il dono Gedeone preparò un capretto e fece del pane senza lievito con un’efa di farina: circa 22 litri. Mise la carne nel cesto e il brodo nella pentola.',
    'scritto',
    [b('Giudici', 6, '19')],
  ),
  d(
    'shalom',
    'Geova è pace',
    'Gedeone temette di morire, perché aveva visto l’angelo di Geova faccia a faccia. Ma Geova gli disse: «Non aver paura; non morirai». Lì Gedeone eresse un altare e lo chiamò Geova-Shalom, che significa «Geova è pace».',
    'scritto',
    [b('Giudici', 6, '22-24')],
  ),
  d(
    'toro',
    'Il toro di sette anni',
    'Il toro da offrire era il secondo giovane toro di suo padre, quello di sette anni; e la legna per l’olocausto era quella del palo sacro appena abbattuto.',
    'scritto',
    [b('Giudici', 6, '25, 26')],
  ),
  d(
    'radunati',
    'Al suono del corno',
    'Lo spirito di Geova venne su Gedeone: al suono del suo corno si radunarono gli abiezeriti, e i suoi messaggeri chiamarono anche Manasse, Aser, Zabulon e Neftali.',
    'scritto',
    [b('Giudici', 6, '34, 35')],
  ),
  d(
    'scodella',
    'Una scodella piena',
    'Il mattino dopo Gedeone si alzò presto e strizzò il vello: ne uscì abbastanza rugiada da riempire d’acqua una grande scodella, mentre il terreno intorno era asciutto.',
    'scritto',
    [b('Giudici', 6, '37, 38')],
  ),
  d('adora', 'Prima di tutto, adorò', 'Appena udito il sogno e la sua interpretazione, Gedeone si inchinò per adorare Dio; solo dopo tornò dai suoi uomini.', 'scritto', [b('Giudici', 7, '15')]),
  d(
    'veglia',
    'La veglia intermedia',
    'Gli israeliti dividevano la notte in tre veglie. Quella intermedia andava all’incirca dalle 22 alle 2: Gedeone arrivò ai margini dell’accampamento proprio al suo inizio, subito dopo il cambio delle sentinelle.',
    'libro',
    [F.it('Notte'), b('Giudici', 7, '19')],
  ),
  d(
    'esempio',
    '«Guardate me»',
    'Gedeone diede istruzioni ai suoi uomini e si raccomandò che facessero esattamente quello che avrebbe fatto lui: fu il primo a suonare il corno e a fracassare la giara.',
    'libro',
    [F.libro, b('Giudici', 7, '17-19')],
  ),
  d(
    'catturati',
    'I due re',
    'A Carcor Gedeone salì per la via dei nomadi e attaccò l’accampamento, che non era preparato a un assalto. Zeba e Zalmunna, i re di Madian, fuggirono, ma lui li inseguì e li catturò.',
    'scritto',
    [b('Giudici', 8, '10-12')],
  ),
  d('umile', 'Nessun potere per sé', 'Gedeone aveva guidato il popolo alla vittoria, eppure non cercò potere né per sé né per la sua famiglia.', 'libro', [F.libro]),
  d(
    'pace',
    'Quarant’anni di pace',
    'Madian non sfidò più Israele: ai giorni di Gedeone il paese fu in pace per 40 anni. Gedeone morì dopo una lunga e serena vecchiaia.',
    'libro',
    [b('Giudici', 8, '28'), F.libro],
  ),

  // ——— Geova: il profeta, la pazienza, i 300, il sogno ———
  d(
    'profeta',
    'Prima un profeta',
    'Prima di mandare un salvatore, Geova mandò agli israeliti un profeta a ricordare perché li aveva abbandonati: lui li aveva liberati dall’Egitto, ma loro avevano adorato altri dèi.',
    'scritto',
    [b('Giudici', 6, '7-10'), F.libro],
  ),
  d('paziente', 'Con pazienza', 'Gedeone chiese due segni con il vello, uno dopo l’altro, e Geova con pazienza assecondò le sue richieste.', 'libro', [F.libro, b('Giudici', 6, '36-40')]),
  d(
    'pochi',
    'Da 32.000 a 300',
    'L’esercito di Gedeone passò da 32.000 uomini a 300, mentre i nemici erano circa 135.000: così nessuno avrebbe potuto dire di essersi salvato da solo.',
    'libro',
    [F.libro, F.w04],
  ),
  d(
    'sogno',
    'Un’altra prova',
    'Geova diede a Gedeone un’altra prova di essere con lui: gli fece sentire, nell’accampamento nemico, il racconto di un sogno che indicava la vittoria di Israele.',
    'libro',
    [F.libro, b('Giudici', 7, '9-14')],
  ),

  // ——— Ioas: il padre ———
  d('altare-padre', 'L’altare era tuo', 'L’altare di Baal e il palo sacro lì accanto appartenevano a te, Ioas. Fu tuo figlio a demolirli, su ordine di Geova.', 'scritto', [b('Giudici', 6, '25-27')]),
  d(
    'minaccia',
    '«Porta fuori tuo figlio!»',
    'La mattina dopo gli uomini della città scoprirono chi era stato, e ti intimarono di consegnare tuo figlio perché fosse messo a morte.',
    'scritto',
    [b('Giudici', 6, '28-30')],
  ),
  d('nome', 'Ierubbaal', 'Da quel giorno Gedeone ebbe anche il nome di Ierubbaal: con quel nome lo chiama il racconto della battaglia.', 'scritto', [b('Giudici', 6, '32'), b('Giudici', 7, '1')]),

  // ——— Uno dei 300 ———
  d('trecento', 'Rimasero in 300', 'Rimasero soltanto quelli che, stando in guardia, si chinarono e si portarono l’acqua con la mano alla bocca: 300 uomini.', 'libro', [F.libro, b('Giudici', 7, '6, 7')]),
  d(
    'corni',
    'Il suono di 300 corni',
    'Il corno di montone serviva per i segnali di guerra: di solito il suono di 300 corni avrebbe indicato la presenza di un grande esercito.',
    'libro',
    [F.it('Corno'), F.fondo(2), F.immagineA],
  ),
  d(
    'giare',
    'Luci all’improvviso',
    'Le torce stavano dentro le grosse giare: quando le fracassarono, le luci comparvero tutte insieme, con il suono dei corni. Un effetto improvviso e terrificante.',
    'libro',
    [F.libro, F.immagine],
  ),
  d(
    'provviste',
    'I corni dei compagni',
    'Prima che gli altri tornassero a casa, i 300 presero da loro le provviste e i corni: così ognuno ebbe il suo corno.',
    'scritto',
    [b('Giudici', 7, '8')],
  ),
  d('stanchi', 'Stanchi, ma avanti', 'Attraversato il Giordano, eravate stanchi, ma continuaste l’inseguimento.', 'scritto', [b('Giudici', 8, '4')]),
  d(
    'pane-negato',
    'Nessuno vi diede pane',
    'I principi di Succot e gli uomini di Penuel rifiutarono di darvi del pane: non credevano che avreste preso i re di Madian.',
    'scritto',
    [b('Giudici', 8, '5-8')],
  ),
  d(
    'ottanta',
    'Circa 80 chilometri',
    'L’impresa non finì in una notte: Gedeone e i suoi inseguirono i nemici per circa 80 chilometri, fino a Iogbea.',
    'libro',
    [F.w04, F.fondo(3), F.immagineB],
  ),

  // ——— Un soldato madianita ———
  d(
    'incursioni',
    'Le vostre incursioni',
    'Quando gli israeliti seminavano, voi madianiti, con gli amalechiti e gli orientali, distruggevate le colture e non lasciavate né cibo, né pecora, né toro, né asino.',
    'scritto',
    [b('Giudici', 6, '3, 4')],
  ),
  d('locuste', 'Come locuste', 'Eravate numerosi come locuste, e i vostri cammelli non si potevano contare.', 'scritto', [b('Giudici', 6, '5'), b('Giudici', 7, '12')]),
  d(
    'orzo',
    'Un pane d’orzo',
    'L’orzo era un cibo comune e umile: forse per questo il pane rotondo d’orzo del sogno rappresentava bene l’umile esercito di Gedeone.',
    'sembra',
    [F.it('Orzo'), F.fondo(1)],
  ),
  d(
    'panico',
    'Circondati, credevano',
    'Pensarono di essere circondati e sotto attacco: furono presi dal panico, e Geova fece in modo che si scagliassero gli uni contro gli altri.',
    'libro',
    [F.libro, b('Giudici', 7, '22')],
  ),
  d(
    'quindicimila',
    'Ne rimasero 15.000',
    'Dell’esercito degli orientali, circa 135.000 uomini, rimasero in 15.000: gli altri 120.000 erano caduti.',
    'numeri',
    [b('Giudici', 8, '10'), F.libro],
  ),
]);

function s(id: string, domanda: string): [string, Sensazione] {
  return [id, { id, domanda }];
}

export const SENSAZIONI: Record<string, Sensazione> = Object.fromEntries([
  s('ge-cauto', 'Gedeone fu coraggioso e cauto insieme. In quale situazione serve a te essere l’uno e l’altro?'),
  s('ge-segni', 'Gedeone chiese dei segni per essere sicuro. Che cosa ti aiuta a essere sicuro di fare ciò che Geova vuole?'),
  s('g-pochi', 'Geova sceglie di vincere con 300 uomini. Che cosa ti dice questo quando ti senti in pochi, o debole?'),
  s('i-figlio', 'Tutta la città vuole la morte di tuo figlio. Che cosa ti serve per difendere chi fa ciò che Dio chiede?'),
  s('t-paura', 'Chi aveva paura poteva tornare a casa, e 22.000 se ne andarono. Che cosa ti avrebbe dato il coraggio di restare?'),
  s('t-stanchi', 'Siete stanchi e nessuno vi dà del pane, ma continuate. Che cosa ti aiuta ad andare avanti quando sei stanco?'),
  s('m-sogno', 'Un pane d’orzo che rovescia una tenda: il sogno dice che la vostra forza non basta. Su che cosa contava il tuo esercito?'),
]);

export const STUDIO: SezioneStudio[] = [
  { id: 'parlarne', titolo: 'Per parlarne insieme', domande: [{ id: 'parlarne-1', testo: 'In quali modi Gedeone mostrò coraggio?' }] },
  {
    id: 'fondo',
    titolo: 'Vai più a fondo',
    nota: 'Le risposte si trovano nelle pubblicazioni indicate accanto a ogni domanda.',
    domande: [
      {
        id: 'fondo-1',
        testo: 'Perché il pane rotondo d’orzo del sogno del soldato madianita poteva rappresentare bene l’esercito di Gedeone?',
        fonti: [{ rif: 'Perspicacia nello studio delle Scritture, «Orzo», par. 7', url: `${F.it('Orzo').url}#p8` }],
      },
      {
        id: 'fondo-2',
        testo: 'Perché il suono dei 300 corni spaventò e confuse i madianiti?',
        fonti: [{ rif: 'Perspicacia nello studio delle Scritture, «Corno», par. 3', url: `${F.it('Corno').url}#p4` }, F.immagineA],
      },
      { id: 'fondo-3', testo: 'Che cosa dovettero fare Gedeone e i suoi uomini per sconfiggere i madianiti?', fonti: [F.w04, F.immagineB] },
      { id: 'fondo-4', testo: 'Quali dettagli confermano l’accuratezza di questo racconto biblico?', fonti: [F.w05] },
    ],
  },
  {
    id: 'riguarda',
    titolo: 'Una storia che ti riguarda',
    domande: [
      {
        id: 'riguarda-1',
        testo: 'Gedeone rispose con mitezza a chi lo accusava. Come possono imitarlo capifamiglia e anziani quando qualcuno è irritato con loro?',
        fonti: [b('Giudici', 8, '1-3')],
      },
      { id: 'riguarda-2', testo: 'In quali situazioni potremmo aver bisogno di essere sia coraggiosi che cauti?' },
      { id: 'riguarda-3', testo: 'In quali altri modi potresti imitare il coraggio di Gedeone?' },
    ],
  },
  {
    id: 'prospettiva',
    titolo: 'Una prospettiva più ampia',
    domande: [
      { id: 'prospettiva-1', testo: 'Che cosa ti insegna su Geova la storia di Gedeone?' },
      { id: 'prospettiva-2', testo: 'In che modo questa storia si collega al proposito di Geova?' },
      { id: 'prospettiva-3', testo: 'Che cosa vorresti chiedere a Gedeone quando sarà risuscitato?' },
    ],
  },
];

export const APPROFONDISCI: Fonte[] = [
  { rif: 'Il capitolo 18 del libro su jw.org (testo, audio, immagini)', url: URL_CAPITOLO },
  { rif: '«La sapienza è con i modesti», La Torre di Guardia 1/8/2000 (indicato nel capitolo)', url: F.w00.url },
  { rif: 'Storia biblica a fumetti «Geova rafforza Gedeone» (indicata nel capitolo)', url: URL_CAPITOLO },
  { rif: '«Percorri il paese», La Torre di Guardia 15/10/2004', url: F.w04.url },
];
