import { b, LIBRO_BASE, perspicacia, RIVISTE, verso } from '../../fonti';
import type { Dettaglio, Fonte, Sensazione, SezioneStudio, Verso } from '../../tipi';

export { b };

/**
 * Capitolo 17 — Iael: «Benedetta fra le donne».
 *
 * Tutto ciò che il gioco afferma su questo racconto sta qui, con la fonte.
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
  'gdc-4-2': verso(
    'Giudici 4:2, 3',
    b('Giudici', 4, '2, 3'),
    'Geova li diede dunque in mano a Iàbin, re di Cànaan, che regnava ad Hàzor. A capo del suo esercito c’era Sìsera, il quale dimorava ad Aròset-Goìm. Poi gli israeliti implorarono Geova, perché Iàbin aveva 900 carri da guerra muniti di falci di ferro e da 20 anni li opprimeva duramente.',
    ['«li diede»: lett. “vendette”.', '«Aròset-Goìm»: o “Aròset delle Nazioni”.', '«carri da guerra muniti di falci di ferro»: lett. “carri di ferro”.'],
  ),
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
  'gdc-4-14': verso(
    'Giudici 4:14, 15',
    b('Giudici', 4, '14, 15'),
    'Debora disse ora a Bàrac: “Va’, perché questo è il giorno in cui Geova ti darà in mano Sìsera. Geova non sta forse andando davanti a te?” E Bàrac scese dal monte Tàbor alla testa dei 10.000 uomini. Allora Geova gettò nello scompiglio Sìsera, tutti i suoi carri da guerra e tutto l’esercito, consegnandoli alla spada di Bàrac. Infine Sìsera saltò giù dal carro e fuggì a piedi.',
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
  'gdc-4-23': verso('Giudici 4:23', b('Giudici', 4, '23'), 'Così quel giorno Dio sottomise Iàbin, re di Cànaan, agli israeliti.'),
  'gdc-5-6': verso(
    'Giudici 5:6, 7',
    b('Giudici', 5, '6, 7'),
    'Ai giorni di Samgàr, figlio di Anàt, ai giorni di Iàel, le strade erano deserte; si viaggiava per sentieri isolati. Non c’erano più abitanti nei villaggi d’Israele; non ce n’erano più, finché sorsi io, Debora, finché sorsi come madre in Israele.',
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
  'ebr-11-32': verso(
    'Ebrei 11:32-34',
    b('Ebrei', 11, '32-34'),
    'E cos’altro posso dire? Non mi basterebbe il tempo se volessi raccontare di Gedeone, di Bàrac, di Sansone, di Iefte, di Davide, di Samuele e degli altri profeti. Grazie alla fede sconfissero regni, stabilirono la giustizia, ottennero promesse, chiusero la bocca dei leoni, spensero la violenza del fuoco, sfuggirono al taglio della spada, da deboli furono resi forti, diventarono valorosi in guerra, misero in fuga eserciti invasori.',
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
    'paura',
    'Un paese impaurito',
    'Sotto il dominio cananeo forse molti si nascondevano nei boschi e sulle colline: avevano paura di coltivare la terra, di vivere in villaggi senza mura, di viaggiare su strade aperte dove potevano essere aggrediti.',
    'sembra',
    [F.wp15, b('Giudici', 5, '6, 7')],
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
    'nuovi-dei',
    'Si scelsero nuovi dèi',
    'Il canto lo dice così: «Si scelsero nuovi dèi, e allora ci fu guerra alle porte». Poiché gli israeliti avevano abbandonato Geova per servire altri dèi, Geova li abbandonò ai loro nemici.',
    'libro',
    [F.wp15, b('Giudici', 5, '8')],
  ),
  d(
    'disposti',
    'Quando il popolo fu disposto a cambiare',
    'Il terrore durò finché Geova vide che il suo popolo, ostinato, era disposto a cambiare. Allora suscitò Barac e Debora per guidare Israele alla vittoria.',
    'libro',
    [F.wp15, F.it('Iabin')],
  ),
  d(
    'una-donna',
    'Una donna, per sua decisione',
    'Geova permise a Debora di andare con Barac, come lui aveva chiesto, ma la ispirò anche a profetizzare che la gloria finale non sarebbe andata a un uomo: aveva stabilito che fosse una donna a giustiziare il malvagio Sisera.',
    'libro',
    [F.wp15, b('Giudici', 4, '9')],
  ),
  d(
    'stelle',
    'Dal cielo',
    'Il canto descrive l’intervento di Geova: «dai cieli caddero scrosci», «dal cielo combatterono le stelle», e il torrente Chison spazzò via i nemici.',
    'scritto',
    [b('Giudici', 5, '4'), b('Giudici', 5, '20, 21')],
  ),
  d(
    'chison',
    'Le acque di Meghiddo',
    'D’estate il letto del Chison è asciutto, ma dopo un acquazzone invernale il fiume allaga la pianura: forse per questo è chiamato «le acque di Meghiddo». Probabilmente fu un acquazzone improvviso a farlo straripare.',
    'sembra',
    [F.w08, b('Giudici', 5, '19')],
  ),
  d(
    'merito',
    'Tutto il merito a Geova',
    'Il canto di Debora e Barac attribuisce a Geova tutto il merito e tutta la lode per la vittoria che diede al suo popolo.',
    'libro',
    [F.it('Debora')],
  ),
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
    [F.libro, b('Giudici', 5, '1')],
  ),
  d(
    'fede-rafforzata',
    'Ricordata secoli dopo',
    'Molto tempo dopo, quando dieci nazioni cospiravano per annientare Israele, il Salmo 83 chiedeva a Geova di fare a quei nemici come aveva fatto a Sisera e a Iabin. Quell’antica vittoria dava ancora fiducia al popolo di Dio.',
    'libro',
    [F.w08, F.fondo(3)],
  ),

  // ——— Sisera: su che cosa contava ———
  d(
    'novecento',
    'Novecento carri',
    'L’esercito di Iabin aveva 900 carri da guerra muniti di falci di ferro. Alla lettera il testo dice «carri di ferro».',
    'scritto',
    [b('Giudici', 4, '3'), b('Giudici', 4, '13')],
  ),
  d(
    'falci',
    'Il fiore all’occhiello',
    'Le falci di ferro sporgevano dai mozzi delle ruote: i carri erano il fiore all’occhiello dell’esercito di Sisera.',
    'libro',
    [F.wp15],
  ),
  d(
    'aroset',
    'Più in vista del re',
    'Sisera abitava ad Aroset-Goim, «Aroset delle Nazioni», non ad Hazor, la città del re. Nel racconto biblico ha più rilievo dello stesso re Iabin.',
    'libro',
    [F.it('Sisera'), b('Giudici', 4, '2')],
  ),
  d(
    'terrore',
    'Un nome che faceva paura',
    'In Israele il solo nome di Sisera suscitava terrore e panico. Insieme a Iabin, oppresse duramente Israele per 20 anni.',
    'libro',
    [F.wp15, F.it('Sisera'), b('Giudici', 4, '3')],
  ),
  d(
    'radunati',
    'Sicuri di vincere',
    'Quando seppe che Barac era salito sul monte Tabor, Sisera radunò subito tutti i suoi carri e le sue truppe, e alcuni re cananei si unirono a lui. Erano convinti di sconfiggere in un attimo l’esercito di Israele.',
    'libro',
    [F.wp15, b('Giudici', 4, '12, 13'), b('Giudici', 5, '19')],
  ),
  d(
    'pioggia',
    'Un pantano',
    'Si abbatté una pioggia torrenziale e il terreno diventò un pantano. I carri appesantiti dal ferro affondarono nel fango: più un ostacolo che un punto di forza.',
    'libro',
    [F.wp15, b('Giudici', 5, '4')],
  ),
  d(
    'abbandona',
    'Solo, senza il suo carro',
    'Sisera saltò giù dal carro e fuggì, abbandonando i suoi uomini.',
    'libro',
    [b('Giudici', 4, '15'), F.libro],
  ),
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
  d(
    'nessuno',
    'Nessun superstite',
    'Dell’esercito di Sisera non si salvò nessuno: cadde tutto sotto la spada. Lui era l’unico ad essere scappato.',
    'scritto',
    [b('Giudici', 4, '16'), F.wp15],
  ),

  // ——— Barac: la profezia che si adempie ———
  d(
    'tabor',
    'Dalla cima del Tabor',
    'Il monte Tabor ha la forma di un grande cono con la cima smussata. Dalla vetta piatta si domina la pianura di Esdrelon, circa 400 metri più in basso, dove scorre il Chison.',
    'libro',
    [F.wp15],
  ),
  d(
    'inseguimento',
    'Fino ad Aroset-Goim',
    'Barac inseguì i carri da guerra e l’esercito nemico fino ad Aroset-Goim.',
    'scritto',
    [b('Giudici', 4, '16')],
  ),
  d(
    'bellezza',
    'La «bellezza» della vittoria',
    'Barac aveva voluto Debora con sé, come rappresentante di Dio. Lei accettò, ma predisse che la «bellezza» della vittoria sarebbe andata a una donna.',
    'libro',
    [F.it('Debora'), b('Giudici', 4, '8, 9')],
  ),
  d(
    'adempiute',
    'Parole adempiute',
    'Entrando nella tenda, Barac capì che si erano adempiute le parole profetiche di Debora: il potente guerriero Sisera era stato ucciso da una donna.',
    'libro',
    [F.libro, F.wp15],
  ),
  d(
    'annientato',
    'Fino in fondo',
    'Da quel giorno la mano degli israeliti si fece sempre più dura su Iabin, re di Canaan, finché non lo annientarono.',
    'scritto',
    [b('Giudici', 4, '24')],
  ),

  // ——— Debora: il canto ———
  d(
    'celebrare',
    'Canti e danze',
    'Le donne erano solite celebrare le vittorie con canti e danze. Un’immagine del capitolo mostra Debora e Barac che cantano mentre gli altri israeliti danzano e suonano i tamburelli.',
    'libro',
    [F.it('Debora'), F.immagineA, b('Esodo', 15, '20, 21')],
  ),
  d(
    'prima-persona',
    '«Finché sorsi io, Debora»',
    'Una parte del canto è in prima persona: segno che almeno in parte lo compose Debora.',
    'libro',
    [F.it('Debora'), b('Giudici', 5, '7')],
  ),
  d(
    'madre',
    'Madre in Israele',
    'Non sappiamo se Debora fosse madre in senso letterale: l’espressione «madre in Israele» va intesa in senso figurato. Geova le aveva affidato il compito di proteggere la nazione con le cure di una madre.',
    'libro',
    [F.wp15, b('Giudici', 5, '7')],
  ),
  d(
    'domande',
    'Domande alle tribù',
    'Il canto loda le tribù che risposero alla chiamata e rivolge domande indagatrici a quelle che non lo fecero.',
    'libro',
    [F.it('Debora'), b('Giudici', 5, '14-18')],
  ),
  d(
    'complementari',
    'Due racconti che si completano',
    'La battaglia è descritta due volte: nella narrazione di Giudici 4 e nel canto di Giudici 5. I due resoconti si completano, e ognuno riporta particolari che l’altro non menziona.',
    'libro',
    [F.wp15, F.it('Barac')],
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

  s('g-scelta', 'Il popolo che lo aveva abbandonato implora aiuto, e Geova risponde. Che cosa ti dice questo di lui?'),
  s('g-donna', 'Geova si serve di una donna che non è israelita, né profetessa, né soldato. Che cosa dice questo a chi pensa di contare poco?'),
  s('g-nemici', '«Quelli che ti amano siano come il sole che sorge nella sua gloria.» Che cosa vorresti che Geova vedesse in te?'),

  s('s-sicuro', 'Novecento carri, un’alleanza, una tenda, qualcuno di guardia all’entrata. Su che cosa stai contando, in realtà?'),
  s('s-fine', 'Niente di ciò su cui contava Sisera lo salvò. Tu in che cosa riponi la tua fiducia?'),

  s('b-gloria', 'La gloria della vittoria non va a te, ma a una donna. Che cosa conta di più: la tua gloria o che la parola di Geova si adempia?'),

  s('d-lode', 'Un’altra donna riceve la lode più grande. Come ti senti quando l’onore va a qualcun altro per una cosa a cui hai lavorato anche tu?'),

  s('m-attesa', 'Aspetti un figlio vittorioso e un ricco bottino. Su che cosa avevi costruito le tue certezze?'),
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
