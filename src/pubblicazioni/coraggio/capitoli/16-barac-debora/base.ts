import { b, LIBRO_BASE, perspicacia, RIVISTE, verso } from '@/contenuti/fonti';
import type { Dettaglio, Fonte, Sensazione, SezioneStudio, Verso } from '@/contenuti/tipi';

export { b };

/**
 * Capitolo 16 — Barac e Debora: «Verrò senz’altro».
 *
 * Il capitolo copre Giudici 4:1-16, 23, 24 e 5:1-23: l’oppressione, la chiamata di
 * Barac, il Tabor, la battaglia, la fuga di Sisera, il canto fino a Meroz. Ciò che
 * accade nella tenda di Iael (Giudici 4:17-22; 5:24-31) è il capitolo 17.
 * Le parole messe tra «» sono citazioni; il resto è riassunto con parole nostre.
 */

export const URL_CAPITOLO = `${LIBRO_BASE}/dal-tempo-patriarchi-a-giudici/barac-debora-verr%C3%B2-senz-altro/`;
const WP15 = `${RIVISTE}/wp20150801/debora-madre-in-israele/`;

export const F = {
  libro: { rif: 'Libro, cap. 16 «Verrò senz’altro»', url: URL_CAPITOLO } as Fonte,
  immagine: { rif: 'Libro, cap. 16, immagine del capitolo', url: URL_CAPITOLO } as Fonte,
  immagineA: { rif: 'Libro, cap. 16, immagine A', url: URL_CAPITOLO } as Fonte,
  immagineB: { rif: 'Libro, cap. 16, immagine B', url: URL_CAPITOLO } as Fonte,
  fondo: (n: number): Fonte => ({ rif: `Libro, cap. 16, «Vai più a fondo» n. ${n}`, url: URL_CAPITOLO }),
  riguarda: { rif: 'Libro, cap. 16, «Una storia che ti riguarda»', url: URL_CAPITOLO } as Fonte,
  wp15: { rif: 'La Torre di Guardia 1/8/2015, «Sorsi come madre in Israele»', url: WP15 } as Fonte,
  wp15vita: { rif: 'La Torre di Guardia 1/8/2015, p. 12 par. 6', url: `${WP15}#p9` } as Fonte,
  wp15madre: { rif: 'La Torre di Guardia 1/8/2015, p. 13 par. 1', url: `${WP15}#p10` } as Fonte,
  w03: {
    rif: 'La Torre di Guardia 15/11/2003, «Mediante la fede Barac mise in fuga un potente esercito»',
    url: `${RIVISTE}/w20031115/Mediante-la-fede-Barac-mise-in-fuga-un-potente-esercito/`,
  } as Fonte,
  w05: {
    rif: 'La Torre di Guardia 15/1/2005, «Punti notevoli del libro di Giudici»',
    url: `${RIVISTE}/w20050115/Punti-notevoli-del-libro-di-Giudici/#p21`,
  } as Fonte,
  w17: {
    rif: 'La Torre di Guardia (studio), aprile 2017, «Lodiamo Geova con il nostro spirito volenteroso!»',
    url: `${RIVISTE}/torre-di-guardia-studio-aprile-2017/lodiamo-geova-dio-con-nostro-spirito-volenteroso/`,
  } as Fonte,
  /** Solo nella Biblioteca online (wol.jw.org): il sito jw.org non ha le riviste del 1986. */
  w86: {
    rif: 'La Torre di Guardia 1/6/1986, p. 31, «Domande dai lettori»',
    url: 'https://wol.jw.org/it/wol/d/r6/lp-i/1986409',
  } as Fonte,
  it: perspicacia,
};

const NOTE_4 = {
  diede: '«li diede»: lett. “vendette”.',
  aroset: '«Aròset-Goìm»: o “Aròset delle Nazioni”.',
  ferro: '«carri da guerra muniti di falci di ferro»: lett. “carri di ferro”.',
  marcia: '«marcia verso il monte Tàbor»: o “dispiega i tuoi uomini sul monte Tàbor”.',
  torrente: '«torrente»: o “uadi”.',
};

export const VERSI: Record<string, Verso> = {
  'gdc-4-1': verso(
    'Giudici 4:1-16',
    b('Giudici', 4, '1-16'),
    'Tuttavia, dopo la morte di Èud, gli israeliti ricominciarono a fare ciò che era male agli occhi di Geova. Geova li diede dunque in mano a Iàbin, re di Cànaan, che regnava ad Hàzor. A capo del suo esercito c’era Sìsera, il quale dimorava ad Aròset-Goìm. Poi gli israeliti implorarono Geova, perché Iàbin aveva 900 carri da guerra muniti di falci di ferro e da 20 anni li opprimeva duramente. A giudicare Israele c’era in quel tempo Debora, una profetessa, moglie di Lappidòt. Era solita sedere sotto la palma di Debora, fra Rama e Bètel, nella regione montuosa di Èfraim; e gli israeliti salivano da lei per il giudizio. Debora mandò a chiamare Bàrac, figlio di Abinòam, che si trovava a Chèdes-Nèftali, e gli disse: “Geova, l’Iddio d’Israele, ti ha dato il seguente comando: ‘Va’, marcia verso il monte Tàbor, e prendi con te 10.000 uomini da Nèftali e da Zàbulon. Porterò Sìsera, capo dell’esercito di Iàbin, con i suoi carri da guerra e le sue truppe lì da te, presso il torrente Chìson, e te lo darò in mano’”. Bàrac le rispose: “Se verrai con me, ci andrò; ma se non verrai, non ci andrò”. E lei gli disse: “Verrò senz’altro. Ma non ti procurerai gloria tramite questa impresa, perché sarà nelle mani di una donna che Geova consegnerà Sìsera”. Dopodiché Debora si alzò e andò con Bàrac a Chèdes. Bàrac convocò Zàbulon e Nèftali a Chèdes, e 10.000 uomini lo seguirono. Anche Debora salì con lui. Per inciso, Hèber il chenita si era separato dai cheniti (i discendenti di Obàb, suocero di Mosè) e aveva piantato la sua tenda vicino al grande albero di Zaanannìm, che è nei pressi di Chèdes. Fu dunque riferito a Sìsera che Bàrac, figlio di Abinòam, era salito sul monte Tàbor. Sìsera radunò subito tutti i suoi carri da guerra (i 900 carri muniti di falci di ferro) e tutte le truppe che erano con lui per andare da Aròset-Goìm al torrente Chìson. Debora disse ora a Bàrac: “Va’, perché questo è il giorno in cui Geova ti darà in mano Sìsera. Geova non sta forse andando davanti a te?” E Bàrac scese dal monte Tàbor alla testa dei 10.000 uomini. Allora Geova gettò nello scompiglio Sìsera, tutti i suoi carri da guerra e tutto l’esercito, consegnandoli alla spada di Bàrac. Infine Sìsera saltò giù dal carro e fuggì a piedi. Bàrac inseguì i carri da guerra e l’esercito fino ad Aròset-Goìm. Così l’intero esercito di Sìsera cadde sotto i colpi della spada. Non ci furono superstiti.',
    [NOTE_4.diede, NOTE_4.aroset, '«Iàbin» (v. 3): lett. “egli”.', NOTE_4.ferro, NOTE_4.marcia, NOTE_4.torrente],
  ),
  'gdc-4-2': verso(
    'Giudici 4:2, 3',
    b('Giudici', 4, '2, 3'),
    'Geova li diede dunque in mano a Iàbin, re di Cànaan, che regnava ad Hàzor. A capo del suo esercito c’era Sìsera, il quale dimorava ad Aròset-Goìm. Poi gli israeliti implorarono Geova, perché Iàbin aveva 900 carri da guerra muniti di falci di ferro e da 20 anni li opprimeva duramente.',
    [NOTE_4.diede, NOTE_4.aroset, NOTE_4.ferro],
  ),
  'gdc-4-4': verso(
    'Giudici 4:4, 5',
    b('Giudici', 4, '4, 5'),
    'A giudicare Israele c’era in quel tempo Debora, una profetessa, moglie di Lappidòt. Era solita sedere sotto la palma di Debora, fra Rama e Bètel, nella regione montuosa di Èfraim; e gli israeliti salivano da lei per il giudizio.',
  ),
  'gdc-4-8': verso(
    'Giudici 4:8, 9',
    b('Giudici', 4, '8, 9'),
    'Bàrac le rispose: “Se verrai con me, ci andrò; ma se non verrai, non ci andrò”. E lei gli disse: “Verrò senz’altro. Ma non ti procurerai gloria tramite questa impresa, perché sarà nelle mani di una donna che Geova consegnerà Sìsera”. Dopodiché Debora si alzò e andò con Bàrac a Chèdes.',
  ),
  'gdc-4-14': verso(
    'Giudici 4:14, 15',
    b('Giudici', 4, '14, 15'),
    'Debora disse ora a Bàrac: “Va’, perché questo è il giorno in cui Geova ti darà in mano Sìsera. Geova non sta forse andando davanti a te?” E Bàrac scese dal monte Tàbor alla testa dei 10.000 uomini. Allora Geova gettò nello scompiglio Sìsera, tutti i suoi carri da guerra e tutto l’esercito, consegnandoli alla spada di Bàrac. Infine Sìsera saltò giù dal carro e fuggì a piedi.',
  ),
  'gdc-4-23': verso(
    'Giudici 4:23, 24',
    b('Giudici', 4, '23, 24'),
    'Così quel giorno Dio sottomise Iàbin, re di Cànaan, agli israeliti. La mano degli israeliti si fece sempre più dura su Iàbin, re di Cànaan, finché non lo annientarono.',
  ),
  'gdc-5-1': verso(
    'Giudici 5:1-23',
    b('Giudici', 5, '1-23'),
    'Quel giorno Debora intonò questo canto insieme a Bàrac, figlio di Abinòam: “A motivo dei capelli sciolti in Israele, a motivo del popolo che si offrì spontaneamente, lodate Geova! Ascoltate, voi re! Prestate orecchio, voi principi! A Geova io canterò. Canterò lodi a Geova, Dio d’Israele. O Geova, al tuo uscire da Sèir, al tuo marciare dal paese di Èdom, la terra sobbalzò e dai cieli caddero scrosci, dalle nubi caddero scrosci d’acqua. Davanti a Geova i monti si sciolsero, anche il Sinai, davanti a Geova, Dio d’Israele. Ai giorni di Samgàr, figlio di Anàt, ai giorni di Iàel, le strade erano deserte; si viaggiava per sentieri isolati. Non c’erano più abitanti nei villaggi d’Israele; non ce n’erano più, finché sorsi io, Debora, finché sorsi come madre in Israele. Si scelsero nuovi dèi, e allora ci fu guerra alle porte. Non si vedeva né scudo né lancia tra quarantamila in Israele. Il mio cuore è con i comandanti d’Israele, che si offrirono volontari con il popolo. Lodate Geova! Voi che cavalcate asine rossicce, voi che sedete su tappeti pregiati, voi che camminate per la strada, riflettete! Presso gli abbeveratoi si udivano le voci di chi attingeva acqua per le bestie; là raccontavano i giusti atti di Geova, i giusti atti degli abitanti dei villaggi d’Israele. Allora il popolo di Geova scese alle porte. Déstati, déstati, Debora! Déstati, déstati, intona un canto! Avanti, Bàrac! Conduci via i tuoi prigionieri, figlio di Abinòam! Allora quelli che restavano scesero dai nobili; il popolo di Geova scese da me contro i potenti. Quelli nella valle, le cui origini erano in Èfraim, seguirono te, o Beniamino, fra le tue genti. Da Machìr scesero i comandanti, e da Zàbulon quelli che reclutavano guerrieri. I principi di Ìssacar furono con Debora; e come Ìssacar, così fu Bàrac; a piedi fu mandato nella pianura. Fra le schiere di Ruben, grande fu l’indecisione dei cuori. Perché rimanesti seduto fra le due bisacce ad ascoltare il suono dei flauti per le greggi? Fra le schiere di Ruben, grande fu il rimuginare. Gàlaad restò al di là del Giordano; e Dan, perché rimase con le navi? Àser se ne stette inerte sulla riva del mare, fermo presso i suoi porti. Zàbulon fu un popolo che disprezzò la propria vita di fronte alla morte, e così Nèftali sulle alture. Vennero re e combatterono; i re di Cànaan combatterono dunque a Taanàc, presso le acque di Meghiddo. Non presero alcun bottino d’argento. Dal cielo combatterono le stelle, dalle loro orbite combatterono contro Sìsera. Il Chìson li spazzò via, l’antico torrente, il torrente Chìson. Calpestasti i forti, anima mia. Allora gli zoccoli dei cavalli martellarono il suolo mentre i suoi destrieri galoppavano furiosamente. ‘Maledite Meròz’, disse l’angelo di Geova, ‘maleditene gli abitanti, perché non sono venuti in aiuto di Geova, in aiuto di Geova insieme ai potenti’.',
    [
      '«capelli sciolti»: o “dei guerrieri dai capelli sciolti”.',
      '«Canterò lodi»: o “suonerò melodie”.',
      '«si sciolsero»: o forse “tremarono”.',
      '«quelli che reclutavano guerrieri»: o forse “quelli che maneggiavano strumenti da scriba”.',
      '«nella valle», «nella pianura»: o “nel bassopiano”.',
      '«porti»: o “approdi”.',
      '«vita»: o “anima”.',
    ],
  ),
  'gdc-5-1-3': verso(
    'Giudici 5:1-3',
    b('Giudici', 5, '1-3'),
    'Quel giorno Debora intonò questo canto insieme a Bàrac, figlio di Abinòam: “A motivo dei capelli sciolti in Israele, a motivo del popolo che si offrì spontaneamente, lodate Geova! Ascoltate, voi re! Prestate orecchio, voi principi! A Geova io canterò. Canterò lodi a Geova, Dio d’Israele.',
    ['«capelli sciolti»: o “dei guerrieri dai capelli sciolti”.', '«Canterò lodi»: o “suonerò melodie”.'],
  ),
  'gdc-5-6': verso(
    'Giudici 5:6-8',
    b('Giudici', 5, '6-8'),
    'Ai giorni di Samgàr, figlio di Anàt, ai giorni di Iàel, le strade erano deserte; si viaggiava per sentieri isolati. Non c’erano più abitanti nei villaggi d’Israele; non ce n’erano più, finché sorsi io, Debora, finché sorsi come madre in Israele. Si scelsero nuovi dèi, e allora ci fu guerra alle porte. Non si vedeva né scudo né lancia tra quarantamila in Israele.',
  ),
  'gdc-5-20': verso(
    'Giudici 5:20, 21',
    b('Giudici', 5, '20, 21'),
    'Dal cielo combatterono le stelle, dalle loro orbite combatterono contro Sìsera. Il Chìson li spazzò via, l’antico torrente, il torrente Chìson. Calpestasti i forti, anima mia.',
  ),
  'gdc-5-23': verso(
    'Giudici 5:23',
    b('Giudici', 5, '23'),
    '‘Maledite Meròz’, disse l’angelo di Geova, ‘maleditene gli abitanti, perché non sono venuti in aiuto di Geova, in aiuto di Geova insieme ai potenti’.',
  ),
  'ebr-11-32': verso(
    'Ebrei 11:32-34',
    b('Ebrei', 11, '32-34'),
    'E cos’altro posso dire? Non mi basterebbe il tempo se volessi raccontare di Gedeone, di Bàrac, di Sansone, di Iefte, di Davide, di Samuele e degli altri profeti. Grazie alla fede sconfissero regni, stabilirono la giustizia, ottennero promesse, chiusero la bocca dei leoni, spensero la violenza del fuoco, sfuggirono al taglio della spada, da deboli furono resi forti, diventarono valorosi in guerra, misero in fuga eserciti invasori.',
  ),
};

/** Le parole pronunciate nel racconto, alla lettera (Giudici 4:6-9, 14). */
export const PAROLE = {
  comando: 'Geova, l’Iddio d’Israele, ti ha dato il seguente comando: ‘Va’, marcia verso il monte Tàbor, e prendi con te 10.000 uomini da Nèftali e da Zàbulon',
  promessa: 'Porterò Sìsera, capo dell’esercito di Iàbin, con i suoi carri da guerra e le sue truppe lì da te, presso il torrente Chìson, e te lo darò in mano',
  condizione: 'Se verrai con me, ci andrò; ma se non verrai, non ci andrò',
  verro: 'Verrò senz’altro',
  va: 'Va’, perché questo è il giorno in cui Geova ti darà in mano Sìsera',
  davanti: 'Geova non sta forse andando davanti a te?',
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
  // ——— Debora: profetessa, messaggera, madre in Israele ———
  d(
    'dispute',
    'Risolveva le controversie',
    'Oltre a profetizzare, evidentemente Debora dirimeva le controversie indicando la risposta di Geova, e giudicava i casi difficili che il popolo le presentava. Un’immagine del capitolo la mostra sotto la palma mentre aiuta due uomini con delle pecore ad appianare una disputa.',
    'libro',
    [F.wp15, F.libro, F.immagineA],
  ),
  d(
    'profetessa',
    'Una profetessa',
    'Il titolo di profetessa rende Debora una figura insolita nella narrazione biblica, anche se non è l’unica donna ad averlo ricevuto. La Bibbia la presenta prima di tutto come profetessa, e a guidare il popolo verso la liberazione fu soprattutto Barac: per questo di solito non viene contata fra i 12 giudici, anche se ebbe una parte nel giudicare Israele.',
    'libro',
    [F.wp15, F.w86, F.fondo(2)],
  ),
  d(
    'non-autorita',
    'Il comando viene da Geova',
    'Con quelle parole Debora chiarì che non intendeva avere autorità su Barac: era soltanto il mezzo attraverso cui arrivava il comando di Dio.',
    'libro',
    [F.w03],
  ),
  d(
    'coraggio',
    'Lasciare un luogo sicuro',
    'Con coraggio Debora accettò di andare con Barac. Era disposta a lasciare la sua casa, dove era al sicuro, per seguirlo sul campo di battaglia.',
    'libro',
    [F.libro, F.w03, F.it('Debora')],
  ),
  d(
    'segnale',
    'Aspettavano un segnale',
    'Barac avrebbe combattuto seguendo le indicazioni di Geova: per questo, sul Tabor, lui e i suoi uomini aspettavano un segnale da Debora.',
    'libro',
    [F.wp15],
  ),
  d(
    'incoraggiamento',
    'Una donna in marcia con loro',
    'Barac fu felice di avere un modo per accrescere il coraggio dei suoi uomini. Probabilmente quei soldati si sentirono rafforzati nel vedere che una donna coraggiosa li accompagnava, disposta a rischiare la vita al loro fianco.',
    'sembra',
    [F.wp15, b('Giudici', 4, '10')],
  ),
  d(
    'prima-persona',
    '«A Geova io canterò»',
    'Una parte del canto è in prima persona: segno che almeno in parte lo compose Debora.',
    'libro',
    [F.it('Debora'), b('Giudici', 5, '3'), b('Giudici', 5, '7')],
  ),
  d(
    'madre',
    'Come una madre',
    'Non sappiamo se Debora fosse madre in senso letterale: l’espressione va intesa in senso figurato. Geova le aveva affidato il compito di proteggere la nazione con le cure di una madre: convocare Barac e incoraggiarlo a insorgere contro Sisera.',
    'libro',
    [F.wp15madre, F.fondo(3)],
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
    'La battaglia è descritta due volte: nella narrazione di Giudici 4 e nel canto di Giudici 5. Vanno studiati insieme, perché ognuno riporta particolari che l’altro non menziona.',
    'libro',
    [F.w17, F.it('Debora')],
  ),
  d(
    'meroz',
    'Che cos’era Meroz?',
    'Meroz fu maledetta in modo così efficace che oggi non si sa con certezza che cosa fosse. Forse era una città i cui abitanti non risposero alla chiamata e non si offrirono volontari.',
    'sembra',
    [F.w17, b('Giudici', 5, '23')],
  ),

  // ——— Barac: fede, umiltà, ubbidienza ———
  d(
    'stupore',
    'Una promessa sorprendente',
    'Immaginiamo la sorpresa di Barac: Geova gli prometteva la vittoria su Sisera e sui suoi 900 carri, mentre Israele non aveva un esercito ed era praticamente disarmato.',
    'libro',
    [F.libro, F.wp15],
  ),
  d(
    'fede',
    'Non era debolezza',
    'Chiedendo a Debora di andare con lui, Barac mostrò fede: la presenza della rappresentante di Dio avrebbe assicurato a lui e ai suoi uomini la guida di Geova e dato loro coraggio. Per questo l’apostolo Paolo lo include fra gli esempi di fede.',
    'libro',
    [F.libro, F.w03, F.w05, b('Ebrei', 11, '32')],
  ),
  d(
    'altri-uomini',
    'Come Mosè, Gedeone e Geremia',
    'Anche Mosè, Gedeone e Geremia non si sentivano all’altezza della missione che Dio affidava loro. Non per questo avevano poca fede.',
    'libro',
    [F.w03],
  ),
  d(
    'bellezza',
    'La «bellezza» della vittoria',
    'Barac aveva voluto Debora con sé, come rappresentante di Dio. Lei accettò, ma predisse che la «bellezza» della vittoria sarebbe andata a una donna.',
    'libro',
    [F.it('Debora'), b('Giudici', 4, '8, 9')],
  ),
  d(
    'tabor',
    'Dalla cima del Tabor',
    'Il monte Tabor ha la forma di un cono con la punta smussata e si eleva per quasi 600 metri. Dalla vetta piatta si domina la Valle di Izreel, circa 400 metri più in basso, dove scorre il Chison.',
    'libro',
    [F.libro, F.wp15],
  ),
  d(
    'raduno',
    'Il punto di raccolta',
    'Per le tribù di Neftali e di Zabulon, che vivevano nei dintorni, la cima del Tabor era il punto di raccolta ideale.',
    'libro',
    [F.w03],
  ),
  d(
    'salvatore',
    'Il giudice scelto da Geova',
    'Geova aveva scelto Barac come giudice e salvatore del suo popolo. Nell’elenco dei 12 giudici che Geova suscitò per salvare Israele c’è lui, della tribù di Neftali.',
    'libro',
    [F.libro, F.w05],
  ),
  d(
    'ubbidienza',
    'La battaglia è di Geova',
    'Barac sapeva che la battaglia non era sua, ma di Geova. Quando tramite Debora Geova gli disse di andare all’attacco, seguì le sue istruzioni e scese nella pianura ad affrontare quel temibile esercito.',
    'libro',
    [F.libro, b('Giudici', 4, '14')],
  ),
  d(
    'inseguimento',
    'Fino ad Aroset-Goim',
    'Barac inseguì i carri da guerra e l’esercito nemico fino ad Aroset-Goim: circa 25 chilometri.',
    'libro',
    [b('Giudici', 4, '16'), F.w17],
  ),
  d(
    'nessuno',
    'Nessun superstite',
    'Dell’esercito di Sisera non si salvò nessuno: cadde tutto sotto la spada.',
    'scritto',
    [b('Giudici', 4, '16')],
  ),
  d(
    'annientato',
    'Fino in fondo',
    'Da quel giorno la mano degli israeliti si fece sempre più dura su Iabin, re di Canaan, finché non lo annientarono.',
    'scritto',
    [b('Giudici', 4, '24')],
  ),

  // ——— Geova: ciò che fa e perché ———
  d(
    'nuovi-dei',
    'Si scelsero nuovi dèi',
    'Gli israeliti avevano abbandonato Geova per servire altri dèi: per questo Geova li abbandonò ai loro nemici, come li aveva avvertiti.',
    'libro',
    [F.wp15, F.libro, b('Giudici', 5, '8')],
  ),
  d(
    'disposti',
    'Quando il popolo fu disposto a cambiare',
    'Il terrore durò 20 anni, finché Geova vide che il suo popolo, ostinato, era disposto a cambiare. Allora affidò a Debora il compito di convocare Barac.',
    'libro',
    [F.wp15madre, b('Giudici', 4, '3')],
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
    'In che modo combatterono le stelle?',
    'La Bibbia non lo spiega: forse con un aiuto angelico, forse con una pioggia di meteoriti che gli indovini di Sisera presero per un cattivo presagio, o con predizioni astrologiche rivelatesi false. In ogni caso, ci fu senza dubbio un intervento di Dio.',
    'libro',
    [F.w05, F.fondo(4)],
  ),
  d(
    'chison',
    'L’antico torrente',
    'La valle del Chison è un uadi, di solito quasi asciutto: dopo acquazzoni o piogge prolungate si trasforma all’improvviso in un torrente impetuoso. Probabilmente fu un temporale a impantanare i carri e a far straripare il Chison.',
    'sembra',
    [F.w03, F.wp15],
  ),
  d(
    'tre-volte',
    'Nessuno poteva vantarsi',
    'Nessuno dei 10.000 volontari poteva vantarsi di aver liberato il popolo. Le piogge torrenziali che misero fuori uso 900 carri caddero proprio nel posto giusto e al momento giusto.',
    'libro',
    [F.w17, b('Giudici', 4, '14, 15')],
  ),
  d(
    'merito',
    'Tutto il merito a Geova',
    'Il canto di Debora e Barac attribuisce a Geova tutto il merito e tutta la lode per la vittoria che diede al suo popolo.',
    'libro',
    [F.it('Debora')],
  ),
  d(
    'sforzi',
    'Gli sforzi che contano',
    'Geova è felice di coinvolgere esseri umani fedeli nell’adempimento del suo proposito. Apprezza molto lo spirito volenteroso dei suoi servitori e non dimentica ciò che fanno per lui.',
    'libro',
    [F.w17, b('Ebrei', 6, '10')],
  ),

  // ——— Uno dei 10.000: la vita sotto Sisera, la chiamata, la battaglia ———
  d(
    'paura',
    'Un paese impaurito',
    'Sotto il dominio cananeo forse molti si nascondevano nei boschi e sulle colline: avevano paura di coltivare la terra, di vivere in villaggi senza mura, di viaggiare su strade aperte dove potevano essere aggrediti.',
    'sembra',
    [F.wp15vita, F.fondo(1)],
  ),
  d(
    'disarmati',
    'Senza armi',
    'La maggior parte degli israeliti non aveva armi né armature: non era in grado di difendersi.',
    'libro',
    [F.libro, F.w17],
  ),
  d(
    'razzie',
    'Villaggi devastati',
    'Da 20 anni le forze di Sisera devastavano il paese. Quando attaccavano una città o un villaggio, a quanto pare portavano via le ragazze e le violentavano.',
    'sembra',
    [F.libro],
  ),
  d(
    'volontari',
    'Si offrirono volontari',
    'Il canto loda il popolo che si offrì spontaneamente. Gli uomini di Zabulon e di Neftali misero a rischio la propria vita.',
    'scritto',
    [b('Giudici', 5, '2'), b('Giudici', 5, '9'), b('Giudici', 5, '18')],
  ),
  d(
    'svantaggio',
    'In pianura, contro i carri',
    'Scendere nella pianura voleva dire affrontare i carri in netto svantaggio. Con armi leggere, combattere contro carri muniti di falci di ferro sarebbe stato comunque impossibile.',
    'libro',
    [F.w03],
  ),
  d(
    'niente-panico',
    'Sapevano chi l’aveva mandata',
    'Barac e i suoi uomini non si fecero prendere dal panico per il temporale: sapevano chi lo aveva causato, e corsero verso l’esercito cananeo.',
    'libro',
    [F.wp15],
  ),
  d(
    'corpo-a-corpo',
    'Senza il vantaggio dei carri',
    'Con i carri impantanati nel fango, i soldati di Sisera dovettero combattere corpo a corpo, senza il vantaggio di colpire dall’alto dei carri.',
    'libro',
    [F.libro],
  ),
  d(
    'raccontare',
    'Lo videro con i loro occhi',
    'Chi si offrì volontario vide di persona come Geova difende il suo popolo: poteva raccontare «i giusti atti di Geova» per esperienza diretta.',
    'libro',
    [F.w17, b('Giudici', 5, '11')],
  ),

  // ——— Sisera: su che cosa contava ———
  d(
    'aroset',
    'Più in vista del re',
    'Sisera abitava ad Aroset-Goim, «Aroset delle Nazioni», non ad Hazor, la città del re. Nel racconto biblico ha più rilievo dello stesso re Iabin.',
    'libro',
    [F.it('Sisera'), b('Giudici', 4, '2')],
  ),
  d(
    'novecento',
    'Novecento carri',
    'L’esercito di Iabin aveva 900 carri da guerra muniti di falci di ferro. Alla lettera il testo dice «carri di ferro».',
    'scritto',
    [b('Giudici', 4, '3'), b('Giudici', 4, '13')],
  ),
  d(
    'falci',
    'Le falci',
    'Dai mozzi delle ruote dei carri sporgevano micidiali falci di ferro.',
    'libro',
    [F.wp15, F.w03],
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
    'Si abbatté una pioggia torrenziale e la valle diventò una grande palude. I carri appesantiti dal ferro affondarono nel fango: più un ostacolo che un punto di forza.',
    'libro',
    [F.libro, F.wp15, b('Giudici', 5, '4')],
  ),
  d(
    'causa-disfatta',
    'Il vanto, la rovina',
    'I carri, il fiore all’occhiello della potente macchina bellica cananea, si rivelarono la causa della disfatta.',
    'libro',
    [F.w03],
  ),
  d(
    'abbandona',
    'Senza curarsi dei suoi uomini',
    'Senza curarsi del destino dei suoi uomini, Sisera saltò giù dal carro, li abbandonò e fuggì attraverso il fango verso un punto più elevato.',
    'libro',
    [b('Giudici', 4, '15'), F.libro],
  ),
]);

function s(id: string, domanda: string): [string, Sensazione] {
  return [id, { id, domanda }];
}

export const SENSAZIONI: Record<string, Sensazione> = Object.fromEntries([
  s('d-coraggio', 'Debora lascia un luogo sicuro per andare dove c’è pericolo, perché è Geova a chiederlo. In quali occasioni serve anche a te un coraggio simile?'),
  s('d-madre', 'Geova affida a Debora la cura del suo popolo, come a una madre. Chi, intorno a te, ha bisogno di questo tipo di cura?'),

  s('b-aiuto', 'Barac accetta umilmente l’aiuto di una donna di fede. Quando ti è difficile accettare l’aiuto di qualcuno?'),
  s('b-istruzioni', 'Scendere in pianura contro 900 carri sembrava una follia. Che cosa ti aiuta a seguire le istruzioni di Geova quando ti sembrano difficili da capire?'),

  s('g-scelta', 'Il popolo che lo aveva abbandonato implora aiuto, e Geova risponde. Che cosa ti dice questo di lui?'),
  s('g-sforzi', 'Geova avrebbe potuto vincere senza nessuno, eppure chiamò 10.000 volontari. Che cosa ti dice questo dei tuoi sforzi per lui?'),

  s('v-offrirsi', 'Offrirsi voleva dire rischiare la vita, mentre altri restavano con le greggi o con le navi. Che cosa ti spinge oggi a offrirti per Geova?'),
  s('v-visto', 'I volontari videro con i loro occhi che cosa fece Geova. C’è un momento della tua vita in cui hai visto il suo aiuto?'),

  s('s-carri', 'Sisera contava sui suoi carri, e proprio i carri causarono la sua disfatta. Su che cosa rischi di contare tu, invece che su Geova?'),
]);

/** Le sezioni di studio del capitolo, riproposte come domande aperte per il quaderno. */
export const STUDIO: SezioneStudio[] = [
  {
    id: 'parlarne',
    titolo: 'Per parlarne insieme',
    domande: [{ id: 'parlarne-1', testo: 'In quali modi Barac e Debora mostrarono coraggio?' }],
  },
  {
    id: 'fondo',
    titolo: 'Vai più a fondo',
    nota: 'Le risposte si trovano nelle pubblicazioni indicate accanto a ogni domanda.',
    domande: [
      { id: 'fondo-1', testo: 'Com’era la vita degli israeliti mentre erano oppressi da Sisera?', fonti: [F.wp15vita] },
      {
        id: 'fondo-2',
        testo: 'Perché di solito Debora non viene contata fra i 12 giudici che Geova suscitò per salvare Israele?',
        fonti: [F.w86],
      },
      { id: 'fondo-3', testo: 'In che senso Debora sorse «come madre in Israele»?', fonti: [F.wp15madre, F.immagineA] },
      {
        id: 'fondo-4',
        testo: 'Che cosa intendevano Debora e Barac quando nel canto dissero che le stelle combatterono contro Sisera?',
        fonti: [F.w05],
      },
    ],
  },
  {
    id: 'riguarda',
    titolo: 'Una storia che ti riguarda',
    domande: [
      {
        id: 'riguarda-1',
        testo: 'In quale situazione un fratello potrebbe imitare Barac, che accettò umilmente l’aiuto di una donna di fede?',
        fonti: [F.immagineB],
      },
      {
        id: 'riguarda-2',
        testo: 'Perché Debora ebbe bisogno di coraggio per accompagnare Barac? In quali occasioni serve a noi un coraggio simile?',
      },
      { id: 'riguarda-3', testo: 'In quali altri modi potresti imitare il coraggio di Barac e Debora?' },
    ],
  },
  {
    id: 'prospettiva',
    titolo: 'Una prospettiva più ampia',
    domande: [
      { id: 'prospettiva-1', testo: 'Che cosa ti insegna su Geova la storia di Barac e Debora?' },
      { id: 'prospettiva-2', testo: 'In che modo questa storia si collega al proposito di Geova?' },
      { id: 'prospettiva-3', testo: 'Che cosa vorresti chiedere a Barac e a Debora quando saranno risuscitati?' },
    ],
  },
];

export const APPROFONDISCI: Fonte[] = [
  { rif: 'Il capitolo 16 del libro su jw.org (testo, audio, immagini)', url: URL_CAPITOLO },
  { rif: '«Lodiamo Geova con il nostro spirito volenteroso!» (indicato nel capitolo)', url: F.w17.url },
  { rif: '«Mediante la fede Barac mise in fuga un potente esercito» (indicato nel capitolo)', url: F.w03.url },
  { rif: '«Sorsi come madre in Israele», La Torre di Guardia 1/8/2015', url: F.wp15.url },
  { rif: '«Punti notevoli del libro di Giudici», La Torre di Guardia 15/1/2005', url: F.w05.url },
];
