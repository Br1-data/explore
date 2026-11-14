import { b, LIBRO_BASE, perspicacia, RIVISTE, verso } from '@/contenuti/fonti';
import type { Dettaglio, Fonte, Sensazione, SezioneStudio, Verso } from '@/contenuti/tipi';

export { b };

/**
 * Capitolo 17 — Iael: «Benedetta fra le donne».
 *
 * Il capitolo copre Giudici 4:9, 11, 17-22 e 5:24-31: la fuga di Sisera fino alla
 * tenda di Iael, ciò che accade lì, la lode del canto, la madre di Sisera. L’oppressione,
 * la chiamata di Barac, il Tabor e la battaglia sono il capitolo 16.
 * Le parole messe tra «» sono citazioni; il resto è riassunto con parole nostre.
 */

export const URL_CAPITOLO = `${LIBRO_BASE}/dal-tempo-patriarchi-a-giudici/iael-benedetta-fra-le-donne/`;
const URL_TEMPO = `${LIBRO_BASE}/dal-tempo-patriarchi-a-giudici/linea-tempo-patriarchi-giudici/`;
const WP15 = `${RIVISTE}/wp20150801/debora-madre-in-israele/`;

export const F = {
  libro: { rif: 'Libro, cap. 17 «Benedetta fra le donne»', url: URL_CAPITOLO } as Fonte,
  immagine: { rif: 'Libro, cap. 17, immagine del capitolo', url: URL_CAPITOLO } as Fonte,
  immagineA: { rif: 'Libro, cap. 17, immagine A', url: URL_CAPITOLO } as Fonte,
  fondo: (n: number): Fonte => ({ rif: `Libro, cap. 17, «Vai più a fondo» n. ${n}`, url: URL_CAPITOLO }),
  riguarda: { rif: 'Libro, cap. 17, «Una storia che ti riguarda»', url: URL_CAPITOLO } as Fonte,
  prospettiva: { rif: 'Libro, cap. 17, «Una prospettiva più ampia»', url: URL_CAPITOLO } as Fonte,
  tempo: { rif: 'Libro, «Linea del tempo della Parte 1»', url: URL_TEMPO } as Fonte,
  wp15: { rif: 'La Torre di Guardia 1/8/2015, «Sorsi come madre in Israele»', url: WP15 } as Fonte,
  wp15lode: { rif: 'La Torre di Guardia 1/8/2015, p. 15 par. 3', url: `${WP15}#p25` } as Fonte,
  w19: {
    rif: 'La Torre di Guardia (studio), settembre 2019, pp. 8-9 parr. 3-6',
    url: `${RIVISTE}/torre-di-guardia-studio-settembre-2019/armaghedon-buona-notizia-genere-umano/`,
  } as Fonte,
  w08: {
    rif: 'La Torre di Guardia 15/10/2008, pp. 12-15',
    url: `${RIVISTE}/w20081015/Geova-esaudisce-una-fervida-preghiera/`,
  } as Fonte,
  donne: {
    rif: '«Donne della Bibbia. Cosa possiamo imparare da loro?», jw.org',
    url: 'https://www.jw.org/it/cosa-dice-la-Bibbia/domande/donne-nella-bibbia/',
  } as Fonte,
  it: perspicacia,
};

export const VERSI: Record<string, Verso> = {
  'gdc-4-9': verso(
    'Giudici 4:9',
    b('Giudici', 4, '9'),
    'E lei gli disse: “Verrò senz’altro. Ma non ti procurerai gloria tramite questa impresa, perché sarà nelle mani di una donna che Geova consegnerà Sìsera”. Dopodiché Debora si alzò e andò con Bàrac a Chèdes.',
  ),
  'gdc-4-11': verso(
    'Giudici 4:11',
    b('Giudici', 4, '11'),
    'Per inciso, Hèber il chenita si era separato dai cheniti (i discendenti di Obàb, suocero di Mosè) e aveva piantato la sua tenda vicino al grande albero di Zaanannìm, che è nei pressi di Chèdes.',
  ),
  'gdc-4-17': verso(
    'Giudici 4:17-22',
    b('Giudici', 4, '17-22'),
    'Sìsera invece fuggì a piedi fino alla tenda di Iàel, moglie di Hèber il chenita, dato che fra Iàbin, re di Hàzor, e la casa di Hèber il chenita c’era pace. Iàel uscì incontro a Sìsera e gli disse: “Vieni, mio signore, entra qui da me. Non aver paura”. Sìsera allora entrò nella sua tenda, e lei lo coprì con una coperta. Sìsera poi le disse: “Per favore, dammi un po’ d’acqua da bere; ho sete”. Lei aprì dunque un otre contenente latte e gli diede da bere, dopodiché lo coprì di nuovo. “Mettiti all’entrata della tenda”, le disse lui, “e se qualcuno viene a chiederti: ‘C’è un uomo qui?’, rispondi di no”. Ma Iàel, moglie di Hèber, prese un piolo da tenda e un martello, e mentre Sìsera era profondamente addormentato, esausto, gli si avvicinò furtivamente e gli piantò il piolo nelle tempie, fino a conficcarlo per terra. E Sìsera morì. Ora Bàrac giunse lì all’inseguimento di Sìsera. Andandogli incontro, Iàel gli disse: “Vieni, ti mostrerò l’uomo che stai cercando”. Bàrac entrò da lei e vide Sìsera a terra morto, con il piolo conficcato nelle tempie.',
    ['«Iàel»: o “Giaèle”.'],
  ),
  'gdc-4-18': verso(
    'Giudici 4:18',
    b('Giudici', 4, '18'),
    'Iàel uscì incontro a Sìsera e gli disse: “Vieni, mio signore, entra qui da me. Non aver paura”. Sìsera allora entrò nella sua tenda, e lei lo coprì con una coperta.',
  ),
  'gdc-5-24': verso(
    'Giudici 5:24',
    b('Giudici', 5, '24'),
    'Benedetta fra le donne è Iàel, moglie di Hèber il chenita; benedetta fra le donne che vivono in tende.',
  ),
  'gdc-5-24-31': verso(
    'Giudici 5:24-31',
    b('Giudici', 5, '24-31'),
    'Benedetta fra le donne è Iàel, moglie di Hèber il chenita; benedetta fra le donne che vivono in tende. Lui chiese acqua, lei gli diede latte; in una splendida coppa gli offrì latte cagliato. Allungò la mano verso il piolo, la destra verso il martello dell’operaio, e colpì Sìsera; gli fracassò la testa, gli frantumò le tempie, gliele trapassò. Fra i suoi piedi lui crollò; cadde e rimase immobile. Fra i piedi di lei crollò, cadde; dove crollò, là cadde sconfitto. Dalla finestra una donna guardava fuori, dalla grata la madre di Sìsera scrutava: ‘Perché il suo carro ancora non arriva? Perché tarda tanto lo scalpitio dei suoi cavalli?’ Le più sagge fra le sue dame le rispondevano, e anche lei ripeteva a sé stessa: ‘Si staranno dividendo le spoglie: una ragazza, due ragazze a ogni guerriero, un bottino di stoffe tinte per Sìsera, un bottino di stoffe tinte, un capo ricamato, stoffe tinte, due capi ricamati per coprire il collo di chi prende il bottino’. Così, o Geova, muoiano tutti i tuoi nemici, ma quelli che ti amano siano come il sole che sorge nella sua gloria”. E il paese fu in pace per 40 anni.',
    ['«latte cagliato»: o “panna”.', '«ragazza», «ragazze»: lett. “grembo”, “grembi”.'],
  ),
  'gdc-5-25': verso(
    'Giudici 5:25',
    b('Giudici', 5, '25'),
    'Lui chiese acqua, lei gli diede latte; in una splendida coppa gli offrì latte cagliato.',
    ['«latte cagliato»: o “panna”.'],
  ),
  'gdc-5-28': verso(
    'Giudici 5:28',
    b('Giudici', 5, '28'),
    'Dalla finestra una donna guardava fuori, dalla grata la madre di Sìsera scrutava: ‘Perché il suo carro ancora non arriva? Perché tarda tanto lo scalpitio dei suoi cavalli?’',
  ),
  'gdc-5-29': verso(
    'Giudici 5:29, 30',
    b('Giudici', 5, '29, 30'),
    'Le più sagge fra le sue dame le rispondevano, e anche lei ripeteva a sé stessa: ‘Si staranno dividendo le spoglie: una ragazza, due ragazze a ogni guerriero, un bottino di stoffe tinte per Sìsera, un bottino di stoffe tinte, un capo ricamato, stoffe tinte, due capi ricamati per coprire il collo di chi prende il bottino’.',
    ['«ragazza», «ragazze»: lett. “grembo”, “grembi”.'],
  ),
  'gdc-5-31': verso(
    'Giudici 5:31',
    b('Giudici', 5, '31'),
    'Così, o Geova, muoiano tutti i tuoi nemici, ma quelli che ti amano siano come il sole che sorge nella sua gloria”. E il paese fu in pace per 40 anni.',
  ),
  'sal-83-9': verso(
    'Salmo 83:9, 10',
    b('Salmo', 83, '9, 10'),
    'Fa’ a loro come facesti a Màdian, come facesti a Sìsera e a Iàbin presso il torrente Chìson. Furono annientati a En-Dor; divennero concime per la terra.',
    ['«torrente»: o “uadi”.'],
  ),
};

/** Le parole pronunciate nel racconto, alla lettera (Giudici 4:18-22). */
export const PAROLE = {
  invito: 'Vieni, mio signore, entra qui da me. Non aver paura',
  acqua: 'Per favore, dammi un po’ d’acqua da bere; ho sete',
  entrata: 'Mettiti all’entrata della tenda',
  rispondi: 'e se qualcuno viene a chiederti: ‘C’è un uomo qui?’, rispondi di no',
  mostra: 'Vieni, ti mostrerò l’uomo che stai cercando',
};

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
  // ——— Iael: la sua casa, la sua scelta, il suo coraggio ———
  d(
    'cheniti',
    'Il popolo di suo marito',
    'In generale i cheniti erano alleati di Israele: i buoni rapporti risalivano ai tempi di Mosè, che aveva sposato una donna di famiglia chenita. Erano un popolo nomade che ormai viveva in Israele.',
    'libro',
    [F.libro],
  ),
  d(
    'parentela',
    'Imparentati con Israele',
    'Heber discendeva da Obab, il suocero di Mosè: per questo la sua famiglia era imparentata con gli israeliti.',
    'libro',
    [F.it('Heber'), b('Giudici', 4, '11'), F.fondo(2)],
  ),
  d(
    'alleato',
    'Dalla parte di Iabin',
    'Heber però non era come gli altri cheniti. Invece che con Israele, si era alleato con Iabin, il re cananeo che opprimeva il popolo di Dio.',
    'libro',
    [F.libro, b('Giudici', 4, '17')],
  ),
  d(
    'non-israelita',
    'Una donna non israelita',
    'Iael non era israelita: era la moglie di un chenita. Eppure, quando venne il momento, si schierò con coraggio dalla parte del popolo di Dio.',
    'libro',
    [F.it('Iael'), F.donne],
  ),
  d(
    'pericoloso',
    'Sapeva chi era',
    'Iael sapeva senza dubbio chi era Sisera e quanto fosse pericoloso. Lo vide avvicinarsi mentre il marito non c’era, e dovette decidere in fretta che cosa fare.',
    'libro',
    [F.libro],
  ),
  d(
    'profezia-forse',
    'Che cosa sapeva',
    'Forse Iael non sapeva che cosa aveva detto la profetessa Debora: che Sisera sarebbe morto per mano di una donna. È possibile però che sapesse che cosa Geova voleva da lei: il canto ispirato di Debora la chiama infatti benedetta.',
    'sembra',
    [F.libro, b('Giudici', 4, '9'), b('Giudici', 5, '24')],
  ),
  d(
    'schierata',
    'Dalla parte di Geova',
    'Come aveva fatto Raab prima di lei, Iael si schierò dalla parte di Geova. Sapeva che Sisera era un nemico di Geova, e ora aveva l’occasione di eseguire il giudizio di Dio contro quell’uomo malvagio.',
    'libro',
    [F.libro],
  ),
  d(
    'coppa-latte',
    'Latte cagliato, in una coppa da banchetto',
    'Perspicacia descrive quella coppa come una grande scodella da banchetto. Il latte acido o cagliato, spesso addolcito con il miele, era considerato una bevanda rinfrescante.',
    'libro',
    [F.it('Iael'), F.it('Latte')],
  ),
  d(
    'attrezzi',
    'Gli attrezzi di ogni giorno',
    'Iael prese due attrezzi che evidentemente usava spesso: un grosso martello e un piolo da tenda, probabilmente entrambi di legno. Le donne che vivevano in tende li usavano spesso e con abilità. L’immagine del capitolo mostra un martello di legno dentro la tenda.',
    'sembra',
    [F.libro, F.wp15, F.immagine],
  ),
  d(
    'nessun-errore',
    'Nessun errore',
    'Un solo movimento sbagliato avrebbe significato per lei una morte terribile, ma Iael non commise il minimo errore.',
    'libro',
    [F.libro],
  ),
  d(
    'non-lo-dice',
    'Il racconto non lo dice',
    'A che cosa pensò Iael in quel momento? Alle sofferenze che quell’uomo aveva inflitto al popolo di Dio, o al privilegio di schierarsi dalla parte di Geova? Il racconto non lo dice: sappiamo solo che agì in fretta.',
    'libro',
    [F.wp15],
  ),
  d(
    'uomo-cercato',
    '«C’è un uomo qui?»',
    'Sisera le aveva detto di rispondere di no a chi avesse chiesto: «C’è un uomo qui?». Iael invece va incontro a Barac e gli dice: «Vieni, ti mostrerò l’uomo che stai cercando».',
    'scritto',
    [b('Giudici', 4, '20'), b('Giudici', 4, '22')],
  ),
  d(
    'non-malvagia',
    'Né astuta né malvagia',
    'Alcuni critici hanno descritto Iael come una donna astuta e malvagia. Non lo era: era una donna determinata e coraggiosa.',
    'libro',
    [F.libro, F.wp15],
  ),
  d(
    'tutto-cio-che-poteva',
    'Tutto quello che poteva',
    'Iael non era una profetessa, come Debora, né un soldato, come Barac. Eppure fece tutto quello che poteva per Geova.',
    'libro',
    [F.riguarda],
  ),
  d(
    'oggi',
    'Più di 3.200 anni dopo',
    'Dopo questo episodio la Bibbia non parla più di lei, ma il suo esempio insegna ancora. I servitori di Dio oggi non combattono con armi letterali: sono impegnati in una guerra spirituale, e hanno bisogno dello stesso coraggio.',
    'libro',
    [F.libro],
  ),

  // ——— Geova: ciò che fa e perché ———
  d(
    'armaghedon',
    'Il «monte di Meghiddo»',
    '«Armaghedon» viene da un’espressione ebraica che significa «monte di Meghiddo». Geova ha messo in relazione la guerra finale con Meghiddo, dove in alcune battaglie intervenne direttamente: là, «presso le acque di Meghiddo», aiutò Barac a sconfiggere Sisera.',
    'libro',
    [F.w19, b('Rivelazione', 16, '16'), F.fondo(1)],
  ),
  d(
    'differenza',
    'Una differenza sostanziale',
    'Anche ad Armaghedon i nemici di Dio moriranno e chi lo ama sarà salvato. Ma questa volta i servitori di Dio non combatteranno, e non saranno neppure armati: la loro forza starà nel mantenere la calma e nell’avere fiducia in Geova.',
    'libro',
    [F.w19, b('Giudici', 5, '31'), F.fondo(1)],
  ),
  d(
    'si-servi',
    'Si servì di una donna',
    'Per eseguire il suo giudizio su uno spietato guerriero, Dio si servì di una donna.',
    'libro',
    [F.libro],
  ),
  d(
    'uguali',
    'Uomini e donne',
    'Dio considera uomini e donne nello stesso modo: tutti possono ottenere la sua approvazione. Anche alle donne concede privilegi e prove della sua fiducia e del suo favore.',
    'libro',
    [F.wp15, b('Romani', 2, '11'), b('Galati', 3, '28')],
  ),
  d(
    'guida',
    'Le profezie si adempiono',
    'La storia di Iael dimostra che Dio può guidare gli eventi perché le sue profezie si adempiano.',
    'libro',
    [F.donne, b('Giudici', 4, '9')],
  ),
  d(
    'ispirato',
    'Un canto ispirato',
    'Dopo la vittoria Debora compose un canto per ispirazione divina, e in quel canto Iael viene lodata.',
    'libro',
    [F.libro, b('Giudici', 5, '24')],
  ),
  d(
    'fede-rafforzata',
    'Ricordata secoli dopo',
    'Molto tempo dopo, quando dieci nazioni cospiravano per annientare Israele, il Salmo 83 chiedeva a Geova di fare a quei nemici come aveva fatto a Sisera e a Iabin. Quell’antica vittoria dava ancora fiducia al popolo di Dio.',
    'libro',
    [F.w08, F.fondo(3)],
  ),

  // ——— Sisera: la fuga, un rifugio che non lo era ———
  d(
    'mal-equipaggiato',
    'Non riusciva a crederci',
    'Sisera non riusciva a credere che le sue potenti forze, con 900 temibili carri, fossero state sconfitte da un esercito di soldati mal equipaggiati.',
    'libro',
    [F.libro],
  ),
  d(
    'pace-heber',
    'Un rifugio fra alleati',
    'Sisera cercò un luogo sicuro presso gli alleati più vicini a cui potesse pensare: le tende di Heber il chenita, perché fra il re Iabin e la casa di Heber c’era pace.',
    'libro',
    [F.wp15, b('Giudici', 4, '17')],
  ),
  d(
    'inconcepibile',
    'Non conosceva Iael',
    'Evidentemente Sisera pensò che Iael avrebbe rispettato l’accordo del marito con Iabin. Forse per lui era inconcepibile che una donna potesse agire, o anche solo pensare, in modo diverso da suo marito.',
    'sembra',
    [F.wp15, F.libro],
  ),
  d(
    'credendosi',
    'Al sicuro, credeva',
    'Stremato dalla battaglia e dalla fuga, Sisera si sentiva al sicuro nella tenda di Iael e decise di riposarsi.',
    'libro',
    [F.it('Sisera'), F.it('Iael')],
  ),
  d(
    'esausto',
    'Esausto',
    'Sisera si addormentò profondamente: era esausto.',
    'scritto',
    [b('Giudici', 4, '21')],
  ),
  // ——— Barac: la profezia che si adempie ———
  d(
    'adempiute',
    'Parole adempiute',
    'Entrando nella tenda, Barac capì che si erano adempiute le parole profetiche di Debora: il potente guerriero Sisera era stato ucciso da una donna.',
    'libro',
    [F.libro, F.wp15],
  ),

  // ——— Debora: la lode a Iael ———
  d(
    'celebrare',
    'Canti e danze',
    'Le donne erano solite celebrare le vittorie con canti e danze. Un’immagine del capitolo mostra Debora e Barac che cantano mentre gli altri israeliti danzano e suonano i tamburelli.',
    'libro',
    [F.it('Debora'), F.immagineA, b('Esodo', 15, '20, 21')],
  ),
  d(
    'prodiga',
    'Senza invidia',
    'Debora fu generosa nelle lodi: non invidiò la gloria di Iael. Ciò che le stava davvero a cuore era che la parola di Geova si fosse realizzata.',
    'libro',
    [F.wp15lode, F.fondo(4)],
  ),

  // ——— La madre di Sisera: un’attesa vana ———
  d(
    'invano',
    'Un’attesa vana',
    'La madre di Sisera e il suo seguito attesero invano che lui tornasse con molto bottino.',
    'libro',
    [F.it('Sisera'), F.it('Debora')],
  ),
  d(
    'grembo',
    '«Una ragazza, due ragazze»',
    'La parola resa «ragazza» significa alla lettera «grembo»: quelle donne erano considerate soprattutto per la capacità di avere figli. Il canto lascia capire che Sisera tornava spesso dalle sue campagne con un bottino che comprendeva delle ragazze, a volte più di una per soldato, e con ogni probabilità subivano violenza.',
    'libro',
    [F.wp15, b('Giudici', 5, '30')],
  ),
  d(
    'religione',
    'Una cultura crudele',
    'La religione e la cultura dei cananei erano crudeli: comprendevano sacrifici di bambini e prostituzione sacra.',
    'libro',
    [F.wp15],
  ),
  d(
    'silenzio-madre',
    'Il canto si ferma',
    'Il canto la lascia alla finestra, mentre aspetta. Non racconta il momento in cui seppe che cosa era successo a suo figlio.',
    'scritto',
    [b('Giudici', 5, '28-31')],
  ),
]);

function s(id: string, domanda: string): [string, Sensazione] {
  return [id, { id, domanda }];
}

export const SENSAZIONI: Record<string, Sensazione> = Object.fromEntries([
  s('i-casa', 'Tuo marito è in pace con il re che opprime il popolo di Dio. Che cosa provi, vivendo in questa situazione?'),
  s('i-decisione', 'Un uomo pericoloso si avvicina alla tua tenda e sei sola. Che cosa ti serve per non tirarti indietro?'),
  s('i-coraggio', 'Un solo movimento sbagliato, e saresti morta. Da dove può venire un coraggio così?'),
  s('i-limiti', 'Iael non era profetessa né soldato, eppure fece quello che poteva. Pensa a un tuo limite: che cosa puoi fare comunque per Geova?'),

  s('g-donna', 'Geova si serve di una donna che non è israelita, né profetessa, né soldato. Che cosa dice questo a chi pensa di contare poco?'),
  s('g-nemici', '«Quelli che ti amano siano come il sole che sorge nella sua gloria.» Che cosa vorresti che Geova vedesse in te?'),

  s(
    's-sicuro',
    'Prima i 900 carri, ora l’alleanza con Heber e una donna di guardia all’entrata: Sisera passa da una sicurezza all’altra. Che cosa ti dice questo di chi non conta su Dio?',
  ),
  s('s-fine', 'Niente di ciò su cui contava Sisera lo salvò. Tu in che cosa riponi la tua fiducia?'),

  s('b-gloria', 'La gloria della vittoria non va a te, ma a una donna. Che cosa conta di più: la tua gloria o che la parola di Geova si adempia?'),

  s('d-lode', 'Un’altra donna riceve la lode più grande. Come ti senti quando l’onore va a qualcun altro per una cosa a cui hai lavorato anche tu?'),

  s(
    'm-attesa',
    'La madre di Sisera aspetta un figlio vittorioso e un ricco bottino, ma lui non tornerà. Su che cosa aveva costruito le sue certezze? E tu, su che cosa costruisci le tue?',
  ),
]);

/** Le sezioni di studio del capitolo, riproposte come domande aperte per il quaderno. */
export const STUDIO: SezioneStudio[] = [
  {
    id: 'parlarne',
    titolo: 'Per parlarne insieme',
    domande: [{ id: 'parlarne-1', testo: 'In quali modi Iael mostrò coraggio?' }],
  },
  {
    id: 'fondo',
    titolo: 'Vai più a fondo',
    nota: 'Le risposte si trovano nelle pubblicazioni indicate accanto a ogni domanda.',
    domande: [
      {
        id: 'fondo-1',
        testo: 'Che cosa hanno in comune la battaglia combattuta al tempo di Barac e la guerra di Armaghedon? E in che cosa sono diverse?',
        fonti: [F.w19],
      },
      {
        id: 'fondo-2',
        testo: 'Heber, il marito di Iael, si era alleato con i cananei, nemici di Israele. Che parentela c’era tra lui e gli israeliti?',
        fonti: [F.it('Heber')],
      },
      {
        id: 'fondo-3',
        testo: 'In che modo la vittoria su Sisera e Iabin rafforzò la fede del popolo di Dio anche molti anni dopo?',
        fonti: [F.w08],
      },
      {
        id: 'fondo-4',
        testo: 'Perché è degno di nota il modo in cui Debora lodò Iael?',
        fonti: [F.wp15lode, F.immagineA],
      },
    ],
  },
  {
    id: 'riguarda',
    titolo: 'Una storia che ti riguarda',
    domande: [
      {
        id: 'riguarda-1',
        testo: 'In quali situazioni una sorella che ha il marito non Testimone potrebbe aver bisogno di coraggio, come Iael?',
      },
      {
        id: 'riguarda-2',
        testo: 'Iael non era una profetessa né un soldato, ma fece tutto quello che poteva per Geova. Che cosa puoi imparare da lei se hai delle limitazioni?',
      },
      { id: 'riguarda-3', testo: 'In quali altri modi potresti imitare il coraggio di Iael?' },
    ],
  },
  {
    id: 'prospettiva',
    titolo: 'Una prospettiva più ampia',
    domande: [
      { id: 'prospettiva-1', testo: 'Che cosa ti insegna su Geova la storia di Iael?' },
      { id: 'prospettiva-2', testo: 'In che modo questa storia si collega al proposito di Geova?' },
      { id: 'prospettiva-3', testo: 'Che cosa vorresti chiedere a Iael quando sarà risuscitata?' },
    ],
  },
];

export const APPROFONDISCI: Fonte[] = [
  { rif: 'Il capitolo 17 del libro su jw.org (testo, audio, immagini)', url: URL_CAPITOLO },
  {
    rif: 'Video «Non imitiamo i codardi, ma imitiamo i coraggiosi! | Non imitiamo gli abitanti di Meroz, ma Iael» (indicato nel capitolo)',
    url: URL_CAPITOLO,
  },
  { rif: '«Sorsi come madre in Israele», La Torre di Guardia 1/8/2015', url: F.wp15.url },
  { rif: '«Donne della Bibbia. Cosa possiamo imparare da loro?» (indicato nel capitolo)', url: F.donne.url },
  { rif: 'Perspicacia nello studio delle Scritture, «Iael»', url: F.it('Iael').url },
];
