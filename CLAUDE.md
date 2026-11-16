# Nei loro panni — istruzioni per riprendere il lavoro

Avventura 2D di studio sui racconti del libro **«Cammina coraggiosamente con Dio»**
(https://www.jw.org/it/biblioteca-digitale/libri/cammina-coraggiosamente-con-dio/).
Ogni capitolo del libro (54 in 3 parti) diventa un racconto da vivere nei panni di uno
dei personaggi, Geova compreso. Il gioco si chiamava «In cammino»: il nome è stato
cambiato perché spingeva a leggere alla lettera il «camminare con Dio» (decisione 7).

**Obiettivo del committente: fare in seguito tutti i 54 racconti.** Le scelte qui sotto
sono architetturali e valgono per ogni capitolo: il motore e lo schema dei contenuti
sono generici, un capitolo nuovo aggiunge solo contenuti (ed eventualmente scenografie).

**Stato:** giocabili il capitolo 1 (Enoc, quattro punti di vista), il capitolo 2 (Noè,
cinque: Noè, Geova, la moglie di Noè, uno dei figli, uno dei contemporanei), il capitolo 16
(Barac e Debora, cinque punti di vista: Debora, Barac, Geova, uno dei 10.000, Sisera) e
il capitolo 17 (Iael, sei punti di vista: Iael, Geova, Sisera, Barac, Debora, la madre di
Sisera) e il capitolo 18 (Gedeone, cinque: Gedeone, Geova, Ioas, uno dei 300, un soldato
madianita). Gli altri 49 capitoli compaiono nell’indice come «in preparazione».
Tutti e cinque hanno le scene comuni in `racconto.ts` (decisione 8): ogni punto di vista
vive le stesse scene in cui il suo personaggio era presente, con appunti propri.
**Prossimo passo:** il capitolo che indicherà il committente, con la stessa struttura
(modello: `18-gedeone/`).

Lingua del progetto: italiano (codice, commenti, testi, commit).

## Decisioni del committente (non rimetterle in discussione)

Date in risposta a domande dirette o come correzioni; valgono per tutti i capitoli.

1. **Avventura 2D esplorabile.** Vista laterale: il personaggio si muove negli ambienti e
   interagisce con persone e oggetti.
2. **Fedeltà assoluta, niente di apocrifo.** «Non devi aggiungere cose apocrife. La
   narrazione dev'essere fedele. È un impersonamento, e l'obiettivo è imparare il più
   possibile dai racconti carpendo dettagli e sensazioni. È un videogioco, ma in realtà
   è un progetto di studio.» Quindi:
   - nessun episodio, dialogo, nome o pensiero inventato; dove la Bibbia tace, il gioco
     lo dice esplicitamente;
   - nessuna scelta che cambi il racconto;
   - ogni affermazione ha una fonte e un livello di certezza (vedi sotto);
   - le «sensazioni» sono **domande rivolte al giocatore**, mai fatti attribuiti ai
     personaggi.
3. **Geova agisce realmente come agisce nell'episodio vero**, non come «luce e voce»
   mistiche. Non viene raffigurato; chi lo impersona sposta lo sguardo sulla scena
   (`modo: 'osserva'`) e compie solo gli atti che la Bibbia e il libro gli attribuiscono
   (per Enoc: affida l'incarico, dà la forza, conferma che gli è gradito, lo prende).
   Nessuna parola gli viene messa in bocca oltre al testo.
4. **Giocabili tutti i personaggi impersonabili** del capitolo. Per Enoc: Enoc, Geova,
   Matusalemme (solo nomi e numeri di Genesi 5) e «Uno degli empi» (chi ascoltò il
   messaggio; la Bibbia non dà nomi).
5. **Interattività, non solo passeggiare** (feedback sul primo prototipo). Tre forme,
   scelte dal committente:
   - **indagine sulla scena**: i dettagli si scoprono esaminando persone e oggetti
     (punti `tipo: 'esamina'`, senza segnale da lontano, con un luccichio da vicino);
   - **attività da manipolare**: ordina, componi, trova, completa (versetto con parole
     mancanti), classifica (due categorie), linea del tempo, domanda;
   - **situazioni di condotta** (`tipo: 'condotta'`): una situazione tipica del tempo,
     il giocatore sceglie che cosa fare; la scelta fedele rivela la condotta del
     personaggio con la sua fonte, le altre mostrano come agivano gli altri. Se il
     momento è raccontato dal testo (es. Sisera che arriva alla tenda di Iael) la
     situazione è `narrata: true`: niente contrassegno «Ricostruzione», fonti «Lo racconta».
   Le «azioni del personaggio» come minigiochi in tempo reale **non** sono state scelte.
6. **Ricostruzioni ammesse solo se dichiarate.** Una scena non narrata ma descritta in
   generale dalle fonti (es. «la violenza era la norma» → una rissa) si può mettere in
   scena con il contrassegno «Ricostruzione» e le fonti su cui si basa
   (`ricostruzione: true` su `narra`, `base` su `condotta`). Mai parole, nomi o episodi
   attribuiti ai personaggi.
7. **«Camminare con Dio» è simbolico.** Significa seguire la condotta che Dio approva,
   in un rapporto di familiarità con lui (La Torre di Guardia 1/9/2005, par. 5;
   15/9/2001). Il movimento nel gioco serve solo a spostarsi e **non rappresenta mai** il
   camminare con Dio: niente «strada degli anni», «trecento anni di cammino», percorsi a
   piedi come simbolo. Lo stesso vale per espressioni simili negli altri capitoli.
   Un test vieta «cammino», «a piedi», «strada degli anni» nei testi dei ruoli.
8. **Le stesse scene per tutti, gli appunti di ciascuno.** «L’obiettivo della divisione
   non è “spezzettare” la narrazione in più personaggi, ma rivivere le stesse dinamiche
   da diversi punti di vista. Reintegra tutto in tutti i racconti, variando solo i
   dettagli rilevanti, ma non le scene. Esempio: Gedeone deve sentire le voci dei nemici
   che fanno il sogno, ma gli appunti devono riflettere il suo punto di vista.» Quindi:
   - ogni punto di vista vive **tutte le scene del racconto in cui il suo personaggio era
     presente**, con le stesse voci (`nastro`), gli stessi gesti, gli stessi suoni e la
     stessa scenografia: un personaggio principale non perde un pezzo di storia perché
     «ce l’ha» un altro ruolo. Le scene comuni stanno in `racconto.ts` del capitolo
     (i «palchi» e i «momenti»), e ogni ruolo le compone (modello: `18-gedeone/`);
   - Geova vede tutto e le vive tutte, compiendo solo i suoi atti (decisione 3); gli altri
     non vanno dove la Bibbia non li mette (decisione 2): Ioas non scende all’accampamento
     di Madian, uno dei 300 non sente il sogno;
   - cambiano gli **appunti**: dettagli, sensazioni e attività restano di ciascuno e non si
     ripetono fra i punti di vista dello stesso capitolo (i test lo verificano); ognuno
     guarda la scena con la sua lente (Gedeone: la sua cautela e la sua fede; Geova: ciò
     che fa e perché; uno dei 300: ciò che vede e vive chi segue; il madianita: il nemico).
     Una scena può non avere un dettaglio per un ruolo, se non ce n’è uno suo e vero;
   - evitare anche le ripetizioni dentro un ruolo (un versetto citato e poi un dettaglio
     che ne ripete le parole): per questo le attività possono rivelare un `dettaglio`.
9. Il repository precedente (gioco «Segnale Remoto») è stato rimosso su richiesta.
10. **Suoni fedeli a ciò che si poteva sentire realmente** («Migliora la gestione dei
    suoni, devono essere fedeli a quello che si poteva sentire realmente»). Quindi:
    - niente musica di sottofondo né note sintetiche; si sentono vento, pioggia,
      tuoni, voci, passi, fuoco, animali, attrezzi;
    - ogni suono ha una **sorgente in scena** (oggetto, folla, attore, pioggia, luce):
      si sente dov’è, più forte e nitido da vicino, a sinistra o a destra;
    - canti e strumenti solo dove il racconto o le fonti li mettono (es. tamburelli e
      danze in Giudici 5, cetra e flauto in Genesi 4:21), e solo strumenti dell’epoca;
    - anche l’interfaccia usa suoni dell’epoca: fruscio di un rotolo, corda di cetra.
    Si fa per ogni capitolo senza scrivere codice audio: vedi «Suoni» più sotto.
11. **Salvataggi nell’account, non nel browser** («sistema di salvataggio persistente,
    indipendente per ogni utente, non nella cache locale»; scelte del committente:
    soluzione «maccheronica» con un JSON, nome utente e password senza email,
    account obbligatorio). Quindi:
    - l’archivio è uno script Google Apps Script (`archivio/Codice.gs`, un JSON per
      utente su Drive; come pubblicarlo: README, «Salvataggi»). Un JSON su GitHub
      Pages era stato scartato: non si scrive dal browser senza esporre una chiave
      che permette di modificare il sito;
    - delle password si conserva solo l’impronta (SHA-256 con sale); il dispositivo
      ricorda solo la sessione (`nei-loro-panni.sessione`: nome e chiave);
    - si salva 1,5 s dopo ogni modifica, uno alla volta, e subito quando la pagina
      viene nascosta; i progressi del vecchio salvataggio nel browser passano al
      primo account creato.
12. **Capitoli divisi come il libro** («Ho notato che alcune cose nell’episodio di Iael
    venivano da quello [il 16]. Dobbiamo dividere più nettamente i capitoli»). Ogni
    capitolo contiene solo ciò che copre il capitolo del libro, cioè i suoi «passi da
    leggere» e le pubblicazioni che cita; ciò che appartiene al capitolo vicino si
    rimanda a quello («lo racconta il capitolo 17»), non si anticipa né si ripete.
    Quando due capitoli raccontano la stessa vicenda (16 e 17: Giudici 4-5) un test
    verifica che ogni versetto citato stia nei passi del suo capitolo. Gli stessi
    personaggi possono comparire in entrambi, ciascuno con la parte di quel capitolo.
13. **Giochini nella scena legati a fatti reali** («aggiungi più giochini interattivi, ma
    sempre collegati a fatti reali… Fai uscire in questi giochini i particolari sui
    dettagli»; «approfondisci il periodo in cui stanno nell’arca, con scene interne»).
    Quindi:
    - il personaggio fa con le mani ciò che il racconto o le fonti dicono che si faceva
      (raccogliere il legname, chiudere il fasciame, stendere il catrame, portare le
      provviste): prende un oggetto (`fx carico`), lo porta dove serve, la scenografia
      cambia (`fx oggetto`, variabili con `seVar`) e il dettaglio esce da quel gesto;
    - i periodi che il testo non descrive (es. l’anno nell’arca) si possono vivere in
      scene interne, dichiarate come ricostruzione (`narra` con `ricostruzione: true`)
      e costruite solo su ciò che dicono le pubblicazioni (jw.org, wol), con la loro
      cautela (`sembra`);
    - anche la scenografia rispetta l’ordine degli eventi: per esempio l’acqua compare
      solo dopo che Geova chiude la porta (Genesi 7:16, 17).

Scelte di progetto conseguenti (applicate dal capitolo 17 in poi):

- **Personaggi negativi** (l’empio, Sisera, la madre di Sisera) si giocano come lente
  per capire il racconto: la `fedelta` dice che non sono un modello da imitare, e per
  loro non ci sono situazioni di condotta.
- **Le morti violente non si mostrano**: la scena si oscura (`dissolvi`) prima della
  scheda che le racconta, con le parole sobrie del testo. Un test lo verifica.
- **Le parole pronunciate** nelle nuvolette (`nastro`) sono solo citazioni alla
  lettera di un versetto riportato in `VERSI` (test). In più (dal riordino delle scene
  comuni, 16/11/2026):
  - chi parla è l’attore che le pronuncia nel testo; se il personaggio è impersonato, le
    dice il giocatore (`chi: 'giocatore'`), con le stesse parole che sentono gli altri ruoli;
  - le parole di Geova senza un portavoce visibile restano nel `narra`; quelle dette
    tramite un angelo o un profeta presente in scena sono nuvolette di chi le pronuncia
    (l’angelo di Ofra, Debora sotto la palma). Chi gioca Geova non dice mai nulla;
  - le parole di un gruppo senza nome (gli uomini di Ofra, i principi di Succot, gli
    uomini d’Israele) le dice un attore con lo stile `abitante`, sempre alla lettera;
  - se il testo dice che qualcuno parla ma non riporta le parole (le dame della madre di
    Sisera che le rispondono), si mostra solo il gesto (posa `parla`), senza nuvoletta;
  - un canto cantato insieme (Debora e Barac) si divide fra chi lo canta, frase per frase.
- **L’angelo** ha l’aspetto di un uomo con un bastone (stile `angelo`): la Bibbia non lo
  descrive oltre, e Gedeone capisce chi è solo quando scompare (Giudici 6:21, 22). Non è
  una raffigurazione di Geova (decisione 3).
- **Chi sta dentro** (in casa, nell’arca) vive la scena con `modo: 'osserva'`: non si fa
  camminare fuori chi il testo mette dentro (Gedeone in casa il mattino dopo, la famiglia
  di Noè sull’Ararat finché Dio non dice di uscire).

## Livelli di certezza

Ogni `Dettaglio` e ogni `narra` con un'affermazione porta `certezza` e `fonti`:

| Valore    | Etichetta          | Quando                                                              |
| --------- | ------------------ | ------------------------------------------------------------------- |
| `scritto` | È scritto          | Lo dice il testo biblico                                            |
| `numeri`  | Dai numeri         | Calcolo dagli anni/date della Bibbia o della linea del tempo        |
| `libro`   | Lo spiega il libro | Lo afferma il libro o una pubblicazione che il libro cita           |
| `sembra`  | Sembra che         | Le pubblicazioni stesse lo dicono probabile/possibile: il testo deve contenerne la cautela («sembra», «forse», «probabilmente»…) |

A parte c'è il contrassegno **Ricostruzione** (decisione 6), che non è un livello di
certezza: dice che la scena non è narrata e su quali fonti è costruita.

I test verificano fonti, collegamenti a jw.org, citazioni alla lettera, calcoli, che
ogni dettaglio `sembra` contenga una parola di cautela e le decisioni 7 e 8 (l’elenco
completo è in «Che cosa controllano i test»).

## Fonti

- Testo dei capitoli: jw.org (sopra). Il testo del libro **non va copiato**: si
  riassume con parole proprie e si collega sempre all'originale.
- Versetti: Traduzione del Nuovo Mondo, edizione per lo studio, su jw.org
  (`/it/biblioteca-digitale/bibbia/bibbia-per-lo-studio/libri/<libro>/<capitolo>/`),
  citati **alla lettera**, note in calce comprese quando utili. Ogni versetto in
  `VERSI` deve essere usato (test).
- Usa anche le pubblicazioni citate nel capitolo («Vai più a fondo», «Scopri di più»),
  le immagini descritte nel capitolo (testo alternativo) e la linea del tempo della parte.
- In un ambiente cloud di Claude Code `www.jw.org` va consentito nella rete
  dell'ambiente; altrimenti `curl` risponde 403. Da una macchina locale funziona con un
  User-Agent da browser.

## Comandi

```bash
npm install
npm run dev        # http://localhost:5173
npm run check      # controllo dei tipi + test dei contenuti (vitest)
npm run build      # sito statico in dist/
npm run e2e        # gioca per intero ogni punto di vista in Chromium (serve `npm run build` prima)
```

Varianti della prova dal vero: `SCHERMATE=e2e/schermate` salva le schermate,
`VISTA=390x844` prova a misura di telefono, `CAPITOLI=17` e `RUOLI=iael,geova`
limitano i percorsi, `BASE_URL=http://localhost:5173` usa un server già avviato. Se
Chromium manca: `npx playwright install chromium`.

**Prima di ogni commit:** `npm run check`, `npm run build`, `npm run e2e`, e guarda
alcune schermate (desktop e telefono) per verificare la grafica. Le schermate
«…-prima» sono prese mentre la scheda compare: la trasparenza è normale; quelle
«…-racconto» durante una pausa della sequenza (nuvolette, gesti). Per vedere un momento
preciso di una scena (l’acqua alta, le torce accese) conviene uno script Playwright che
carica la scena con `window.__partita.caricaScena(i)` e imposta `vars`, `varianti`,
`carichi` e `attori` della partita prima dello scatto.

## Che cosa controllano i test

`test/contenuti.test.ts` gira su ogni capitolo registrato. Controlla:

- **fonti e certezze**: ogni dettaglio e ogni `narra` con un’affermazione ha fonti; i
  dettagli `sembra` contengono una parola di cautela (sembra, forse, probabil-, è
  possibile, potrebbe, a quanto pare, evidentemente, deve aver, supporre);
- **testo biblico**: i versetti di `VERSI` sono usati tutti e citati alla lettera; il
  testo di `completa` senza `[[ ]]` è un versetto; `trova` è un passo alla lettera; le
  citazioni «» di `associa` sono alla lettera; ogni `nastro` è una citazione di `VERSI`;
- **decisione 8**: dettagli, sensazioni e id delle attività non si ripetono fra i punti
  di vista dello stesso capitolo, e nessuno resta irraggiungibile;
- **decisione 7**: niente «cammino», «a piedi», «strada degli anni» nei testi dei ruoli;
- **decisione 12**: ogni versetto citato sta nei passi del suo capitolo (16/17, 1/2);
- **coerenza delle scene**: i punti rimandano a contenuti che esistono; le scene si
  possono completare; le sequenze (`fx`) usano solo attori presenti in scena; le
  variabili di `fx var` sono dichiarate in `vars`; gli `id` di `fx oggetto` esistono fra
  gli oggetti; i `carico` sono oggetti veri del motore;
- **morti**: un `narra` che racconta una morte ha prima una `dissolvi`;
- **suoni**: suonano solo oggetti che esistono; `suono: 'notte'` se e solo se l’ambiente
  è `notte`;
- **controlli propri dei capitoli**: il messaggio di Enoc, i numeri di Genesi 5 e la
  linea del tempo, i resoconti di Giudici 4 e 5, le tribù del canto, le parole di Sisera
  e Iael, nessuna parola in bocca a Geova (capitolo 1).

`e2e/percorsi.mjs` gioca ogni punto di vista fino alla fine in Chromium (accesso
compreso, con l’archivio finto): tutti i dettagli trovati, il quaderno, il salvataggio
nell’account, i suoni attesi (`SUONI_ATTESI`, all’inizio e con `poi` alla fine della
scena), nessun errore in console.

## Struttura

Tre strati, dal più generale al più specifico: **contenuti** (lo schema e gli strumenti
comuni a tutte le pubblicazioni), **pubblicazioni** (una cartella per pubblicazione di
base, con i suoi capitoli), **motore** e **ui** (generici: non conoscono nessun libro).
Gli import usano l’alias `@/` = `src/` (vite.config.ts, tsconfig.json).

```
src/
  contenuti/                 comune a tutte le pubblicazioni
    tipi.ts                  schema: Pubblicazione, Capitolo, Ruolo, Scena, Punto, Passo, Attivita, Dettaglio, Schema…
    index.ts                 registro PUBBLICAZIONI; pubblicazione(id), capitoloDi(), tuttiICapitoli(), chiave(cap)
    passi.ts                 passiDelRuolo, dettagliDelRuolo, sensazioniDelRuolo
    fonti.ts                 b() per i versetti (aggiungere i libri biblici in LIBRI), verso(), perspicacia(), indirizzi jw.org
    scenografia.ts           o(), serie(), taglia() per comporre le scenografie
  pubblicazioni/
    coraggio/                il libro «Cammina coraggiosamente con Dio» (id: coraggio)
      index.ts               la Pubblicazione: titolo, indice, capitoli giocabili, vetrina della schermata iniziale
      indice.ts              indice dei 54 capitoli (generato da strumenti/genera-indice.mjs)
      comune.ts              capitolo(): completa ogni capitolo con l’id della pubblicazione e i personaggi
      personaggi.ts          l’aspetto (Stile) dei personaggi che compaiono nei capitoli
      capitoli/
        01-enoc/             base.ts (versetti, VITE, DETTAGLI, SENSAZIONI, STUDIO), scenari.ts,
                             un file per punto di vista (enoc, geova, matusalemme, empio), index.ts;
                             racconto.ts: la strada del messaggio (Enoc, l’empio, Geova)
        02-noe/              Genesi 6:1–8:22; 9:8-19; Ebrei 11:7; 2 Pietro 2:5 (noe, geova, moglie, figlio,
                             contemporaneo); scenari.ts: cantiere, arcaPronta, diluvio, arcaDentro (la
                             stiva, per le scene ricostruite nell’arca), ararat (altare e arcobaleno
                             possono comparire dopo, con una variabile) (e mondo dall’1);
                             racconto.ts: il cantiere, la porta e il diluvio, l’uscita, il patto
        16-barac-debora/     Giudici 4:1-16, 23, 24; 5:1-23 (debora, barac, geova, volontario, sisera);
                             scenari.ts: palma, chedes, cimaTabor, pianura, villaggio, festa (usata anche dal 17);
                             racconto.ts: la palma, Chedes, il Tabor, la pianura, il canto
        17-iael/             Giudici 4:9, 11, 17-22; 5:24-31 (iael, geova, sisera, barac, debora, madre);
                             racconto.ts: l’arrivo, la tenda, Barac, il canto, la finestra
        18-gedeone/          Giudici 6:1–7:22; 8:4-23, 28 (gedeone, geova, ioas, trecento, madianita);
                             scenari.ts: ofra (giorno o notte), harod, campoMadian (e villaggio dal 16);
                             racconto.ts: le scene comuni a tutti i ruoli (decisione 8)
  motore/                    generico
    partita.ts               ciclo di gioco, movimento, tocco sui punti, indizi, folle, sequenze, disegno
    figure.ts                persone disegnate (senza volto), pose; Stile e STILE_BASE (gli stili veri li dà la pubblicazione)
    oggetti.ts               oggetti di scena (casa, tenda, tendone, carro, sala con grata…) — aggiungerne qui
    tavolozze.ts             ambienti (colori, cielo, terreno)
    arte.ts                  piccole illustrazioni per le schede (Eden, Caino e Abele…)
    suono.ts                 suoni del mondo ricavati dalla scena, generati con Web Audio (nessun file)
  ui/                        generica
    app.ts                   il guscio: instrada gli indirizzi, strato dei pannelli, tastiera, aggiornamenti
    contesto.ts              Contesto: ciò che l’app offre a schermate e pannelli
    indirizzi.ts             #/coraggio, #/coraggio/16, #/coraggio/16/barac[/fine] (e i vecchi #/gioca/…)
    schermate/               accesso, inizio, indice (di una pubblicazione), capitolo, gioco, fine: una per file
    pannelli.ts              guida, fonti, versetto, quaderno, pausa; la barra delle pagine
    schede.ts                schede del racconto e tutte le attività
    quaderno.ts              quaderno di studio (dettagli, sensazioni, passi, domande; scarica/stampa)
    schemi.ts                disegna gli schemi di studio (i dati li dà il capitolo)
    etichette.ts             contrassegni (certezze, Ricostruzione, Per te) e verbi degli inviti
  salvataggio.ts             progressi e appunti dell’account; chiavi «pubblicazione:numero» (v2; i dati v1 si convertono)
archivio/Codice.gs           l’archivio dei salvataggi (Google Apps Script, da incollare su script.google.com)
archivio/finto.mjs           esegue Codice.gs in Node con un Google finto (test e prova dal vero)
test/contenuti.test.ts       fedeltà e coerenza dei contenuti, per ogni pubblicazione e capitolo
test/archivio.test.mjs       registrazione, accesso e salvataggio dell’archivio
test/salvataggio.test.ts     conversione dei salvataggi alla versione attuale
e2e/percorsi.mjs             prova dal vero di tutti i percorsi (accesso compreso, con l’archivio finto)
```

Dove si mette una cosa nuova:

- un **capitolo**: una cartella in `pubblicazioni/<id>/capitoli/` e una riga in
  `pubblicazioni/<id>/index.ts` (vedi «Come aggiungere un capitolo»);
- un **personaggio**: il suo aspetto in `pubblicazioni/<id>/personaggi.ts` (ci sono già
  stili generici: `abitante` per chi parla a nome di un gruppo senza nome, `dama`,
  `angelo`, `pura` per un servitore). Un personaggio non tiene in mano per sempre ciò che
  usa solo in un momento (il corno, la torcia): lo prende con `fx carico`;
- una **pubblicazione**: vedi «Come aggiungere una pubblicazione»;
- un **oggetto di scena, un ambiente, un suono**: nel motore (`oggetti.ts`,
  `tavolozze.ts`, `suono.ts`), perché valgono per tutti;
- un **tipo di attività**: lo schema in `contenuti/tipi.ts`, il disegno in `ui/schede.ts`,
  il controllo in `test/contenuti.test.ts`, la soluzione automatica in `e2e/percorsi.mjs`;
- una **schermata**: un file in `ui/schermate/`, il suo indirizzo in `ui/indirizzi.ts`
  e una riga in `App.instrada()`.

## Come si costruisce un punto di vista

Un `Ruolo` ha `scene`; ogni `Scena` ha scenografia (`oggetti`, `folle`, `attori`),
`ingresso` (passi all'arrivo) e `punti` d'interesse. Il giocatore si muove, tocca un
punto o gli si avvicina e preme E: partono i suoi `passi`, mostrati come schede.
Tenere le scene corte (2000-3000 unità) e i punti vicini: si gioca, non si cammina.

Tipi di punto: `osserva`, `ascolta`, `leggi`, `agisci`, `medita` (con segnale) ed
`esamina` (indizio: invisibile da lontano, luccica da vicino; l'HUD conta gli indizi).
Un tipico schema di scena: alcuni indizi `esamina`, poi un punto che li `richiede` e
tira le somme con un'attività.

Tipi di passo: `narra` (anche `ricostruzione: true`), `verso` (con `evidenzia`),
`dettaglio` (finisce nel quaderno), `senti` (domanda al giocatore, con appunto),
`schema`, `attivita`, `fx` (effetti di scena: pose, spostamenti degli attori,
nuvolette di parole, variabili, dissolvenze, oggetti in mano, suoni).

### Le scene comuni: `racconto.ts` (decisione 8)

Le scene che più personaggi vivono insieme si scrivono **una volta sola**, in
`racconto.ts` del capitolo, e ogni ruolo le compone. Il file ha due parti per ogni scena:

- un **palco**, `palcoX(io): Palco` (`Palco` = una `Scena` senza `id`, `titolo`, `luogo`,
  `punti`, `ingresso`): scenografia, `vars`, `folle` e `attori`. `io` è l’id del
  personaggio impersonato (`'gedeone'`, `'geova'`…): il suo attore si toglie
  (`presenti(io, […])`), perché lo muove chi gioca. Per Geova non si toglie nessuno. Se
  la scena si guarda da dentro (`modo: 'osserva'` per tutti), gli attori restano tutti,
  nascosti, e compaiono quando escono (`palcoUscita()` del capitolo 2);
- i **momenti**, un oggetto `X` con funzioni che restituiscono `Passo[]`: le voci
  (`nastro`), i gesti (`carico`, `oggetto`, `posa`), gli spostamenti (`vai`), le
  variabili, i suoni (`fx suono`). Le funzioni prendono `io`: `chi(io, id)` dà
  `'giocatore'` se l’attore è impersonato, `va(io, id, x)` non sposta chi gioca.

Il ruolo spande il palco nella scena (`...palcoCampo(io)`), aggiunge `id`, `titolo`,
`luogo`, `inizioX`, `ingresso` e `punti`, e mette i momenti nei passi dei punti insieme ai
**propri** dettagli, sensazioni e attività. Le parti che cambiano da un ruolo all’altro
restano nel ruolo: la narrazione (in seconda persona per chi vive la scena, in terza per
gli altri), le attività, gli appunti. Per cambiare un valore iniziale del palco:
`vars: { ...palcoCampo(io).vars, giare: 1 }` dopo lo spread.

Per decidere quali scene ha un ruolo: si elencano le scene del racconto e, per ognuna,
chi c’era secondo il testo. Ogni ruolo ha tutte le scene in cui c’era il suo personaggio
(Geova tutte); un ruolo può avere una sola scena (Ioas), se il testo lo mette solo lì.
Modello completo: `18-gedeone/racconto.ts`.

Strumenti di scena già pronti nel motore:

- variabili (`vars` della scena, cambiate con `fx var`): `agitazione` (la folla
  reagisce a chi parla), `visione` (sfuma verso `ambiente2`), `incalzo` (una folla
  insegue un attore), `pioggia` (nubi, scrosci; con `seVar: 'pioggia'` compaiono fango
  e acqua), `pioggiaFuori` (la pioggia si sente ma non si vede: un interno), `livello`
  (0-1: l’acqua sale con le onde; gli oggetti `galleggia: true` salgono con lei);
- `fx oggetto` cambia l’aspetto (`variante`) di un oggetto con `id` (l’arca che prende
  forma, la porta che si chiude, la lampada accesa); `fx carico` mette un oggetto in
  mano a chi gioca o a un attore (`cosa: null` lo posa). Un test verifica che l’`id`
  esista nella scena e che il carico sia un oggetto vero;
- ambiente `stiva` per gli interni di legno (con l’oggetto `stiva` come pareti);
- `modo` della scena: una scena può avere un modo diverso dal ruolo. Con `osserva` il
  personaggio non si vede e si sposta lo sguardo, per esempio quando il testo dice che
  sta dentro un luogo chiuso (Noè nell’arca fa volare corvo e colomba dalla finestra).
  Se il racconto mette il personaggio dentro, non lo si fa camminare fuori;
- variabile `animali` (0-1, di norma 1): uccelli, grilli e gufi del luogo. A 0 dove non
  c’è vita (dopo il diluvio, prima che gli animali escano dall’arca);
- oggetto `uccello` (corvo, colomba, colomba con la foglia) che va e torna dal punto in
  cui si posa;
- `fx suono`: un suono che avviene una volta, dove avviene (`corno`, `giare` in pezzi);
  oggetti `giara` (in mano), `cocci`, `altare` variante 1 (senza fuoco, non crepita);
- pose: `fermo`, `cammina`, `parla`, `pugno`, `indica`, `alza`, `proclama`,
  `sdraiato`, `coperto` (sdraiato sotto una coperta), `seduto` (per terra: l’angelo
  sotto l’albero di Ofra);
- folle: `comportamento` `vaga`/`cerca`/`insegue`, `gruppo` `rissa`/`invoca`/`danza`/
  `assalto` (fermi, corni e grida di guerra)/`fuga` (corrono e urlano); `giare` come
  `torce` e `armati`. Due folle con lo stesso `seme`, `x0`, `x1`, `n` e `comportamento:
  'fermo'` stanno negli stessi punti: sfumandone una nell’altra (`seVar`) cambia ciò che
  tengono in mano (le giare che diventano torce, gli uomini disarmati che ricevono le armi);
- oggetti per interni aperti sul davanti (`tendone`, `sala`): gli attori ci stanno dentro.

### Suoni (decisione 10)

Il motore (`motore/suono.ts`, tutto generato con Web Audio, nessun file) ricava i
suoni dalla scena: ogni decimo di secondo la partita gli passa un `Paesaggio`.

- **Luogo** = `suono` della scena: `vento` (aperto), `folla` (abitato: brusio lontano),
  `quiete`, `notte`, `pioggia`. Deve essere `notte` se e solo se l’ambiente è `notte` (test).
- **Luce** dalla tavolozza: di giorno uccelli, al crepuscolo pochi uccelli e grilli,
  di notte grilli e qualche gufo. Con la pioggia tacciono.
- **Oggetti che suonano** (`SUONI_OGGETTI`): `fuoco` e `torcia` crepitano (anche
  `altare`, tranne la variante 1 senza fuoco), `pecora` bela, `acqua` scorre (anche con
  `seVar`, es. il torrente in piena), `incudine` batte.
- **Folle**: `folla` parla a bassa voce (più forte se `reagisce` e c’è `agitazione`),
  `rissa` grida e colpi, `invoca` un’invocazione ripetuta, `danza` tamburelli, mani e
  canto di donne, `insegue` gente che corre, `assalto` corni di montone che si
  sovrappongono e grida di guerra, `fuga` passi fitti e urla; le folle `fondo` sono un
  brusio lontano; le `torce` crepitano.
- **Suoni singoli** (`fx suono`, `cosa`: `corno` o `giare`): avvengono una volta nel punto
  `x` (di norma dove sta chi li produce), più forti e centrati se sono vicini. Servono per
  ciò che accade in un istante: il corno di Gedeone che chiama a raccolta, le 300 giare
  che vanno in pezzi. `__suono.istantanea().eventi` li elenca in ordine (prova dal vero).
- **Attori** che si spostano (`fx vai`): passi. Chi gioca: passi, bagnati sotto la pioggia.
- **Variabili**: `pioggia` e `pioggiaFuori` (scrosci, gocce, tuoni oltre 0.6),
  `agitazione`, `livello` (l’acqua che sale si sente come `acqua`), `animali` (a 0
  tacciono uccelli, grilli e gufi).

Per un capitolo nuovo basta mettere in scena le cose giuste. Se serve un suono che non
c’è (es. il mare, un asino, una cetra suonata in scena), si aggiunge una ricetta in
`EVENTI`; se è continuo, il suo ritmo in `RITMI` e il tipo in `TipoSorgente` e `VOLUMI`
(e, se viene da un oggetto, la voce in `SUONI_OGGETTI`; se viene da una folla, un
`gruppo`); se avviene una volta, un nuovo valore di `fx suono` (tipo in `contenuti/tipi.ts`,
ricetta in `Suono.evento`). Poi si misura il volume rispetto agli altri. In `e2e/percorsi.mjs` si aggiungono a `SUONI_ATTESI`
le scene con sorgenti caratteristiche: la prova controlla che si sentano davvero
all’inizio della scena e, con `poi`, alla fine (sorgenti comparse e `fx suono` sentiti).

Attività (`ui/schede.ts`), tutte risolvibili, nessuna cambia la storia. **Standard
(approvato dal committente dopo la prova sul capitolo 16):** i «mini rompicapi» —
completa i versetti, associa, metti in ordine, trova, domande — in ogni punto di vista,
più di uno dove si può. Dove un punto mostra soltanto un versetto con `evidenza`, di
solito conviene un `completa` o un `trova`.

| Tipo         | Che cosa fa chi gioca                                   | Note |
| ------------ | ------------------------------------------------------- | ---- |
| `ordina`     | tocca le voci in ordine; `distrattori` da scartare      | genealogie, sequenze |
| `componi`    | ricompone un testo a pezzi                              | testo alla lettera |
| `trova`      | tocca nel testo le parti tra `[[ ]]`                    | il testo è un versetto alla lettera (test); può rivelare un `dettaglio` |
| `associa`    | unisce ogni voce alla sua coppia (una alla volta)       | es. tribù e ciò che ne dice il canto; le citazioni «» alla lettera (test) |
| `completa`   | riempie le parole mancanti di un versetto               | il testo senza `[[ ]]` = il versetto (test) |
| `classifica` | mette ogni voce in una di due categorie                 | ogni voce con fonti; può rivelare un `dettaglio` |
| `linea`      | porta il cursore su un anno della linea del tempo       | `meta` = una nascita o morte; anni a.E.V. negativi |
| `domanda`    | sceglie la risposta giusta                              | `dettaglio` oppure `spiegazione` + `fonti` |
| `condotta`   | sceglie che cosa fare in una situazione «Ricostruzione» o `narrata` | una sola opzione `fedele` con `dettaglio`; le altre con `esito` e `fonti` |

Punti `facoltativo` (bordo tratteggiato) non bloccano la scena; `richiede` ordina i
punti. La scena è completa quando tutti i punti obbligatori sono fatti; si prosegue
con il pulsante o camminando fino in fondo. Dopo l'ultima scena parte l'`epilogo`.

## Come aggiungere un capitolo (modello: `pubblicazioni/coraggio/capitoli/18-gedeone/`)

1. Scarica e leggi il capitolo, i passi biblici indicati (con le note in calce
   dell’edizione per lo studio), le pubblicazioni citate, le voci di Perspicacia dei
   personaggi e dei luoghi, e la descrizione delle immagini. I «passi da leggere» segnano
   i confini del capitolo (decisione 12): se il capitolo vicino racconta la stessa
   vicenda, leggi anche quello e lascia a lui ciò che gli appartiene.
2. Elenca le **scene del racconto** e, per ognuna, chi c’era secondo il testo; poi i
   personaggi impersonabili (incluso Geova) con la loro **lente**. Ogni ruolo avrà tutte
   le scene in cui c’era (Geova tutte), con gli stessi gesti, voci e suoni; i dettagli si
   distribuiscono fra i ruoli senza ripetizioni, ognuno con ciò che vede dalla sua lente
   (decisione 8). Cerca nelle fonti un dettaglio vero per ogni ruolo e scena; dove non
   c’è, va bene una sensazione o niente.
3. Crea `src/pubblicazioni/<id>/capitoli/<NN>-<nome>/` sul modello di `18-gedeone/`:
   `base.ts` con versetti alla lettera, le parole pronunciate (`PAROLE`, alla lettera),
   dettagli con fonti e certezza, sensazioni come domande, sezioni di studio;
   `scenari.ts` con le scenografie; `racconto.ts` con i palchi e i momenti comuni; un
   file per ogni personaggio (Geova in `modo: 'osserva'`, solo con gli atti che il
   racconto gli attribuisce) e `index.ts` che esporta `capitolo({ … })` da `../../comune`.
4. In ogni scena usa le tre forme di interattività (decisione 5): indizi da esaminare,
   attività da manipolare, situazioni di condotta dichiarate come ricostruzioni; e i
   gesti in scena legati ai fatti (decisione 13). Attenzione ai modi di dire biblici
   (camminare, correre la corsa, ecc.): sono simbolici, non vanno resi come movimento
   (decisione 7).
5. Riusa o aggiungi scenografie (`scenari.ts`), oggetti (`motore/oggetti.ts`),
   ambienti (`motore/tavolozze.ts`), illustrazioni (`motore/arte.ts`); l’aspetto dei
   personaggi nuovi va in `personaggi.ts` della pubblicazione; gli schemi di studio sono
   dati (`Schema`) nel capitolo. Una scenografia comune a più capitoli sta nel primo che
   la usa e gli altri la importano (es. `festa` del 16, usata dal 17).
6. Registralo in `capitoli` di `src/pubblicazioni/<id>/index.ts`. I test di
   `contenuti.test.ts` girano su ogni capitolo registrato; aggiungi test specifici
   (citazioni, calcoli) come per Enoc, Barac e Debora, Iael.
7. Aggiungi i suoi punti di vista a `PERCORSI` e le scene con suoni caratteristici a
   `SUONI_ATTESI` in `e2e/percorsi.mjs`; verifica le schermate (desktop e telefono).

## Come aggiungere una pubblicazione (modello: `pubblicazioni/coraggio/`)

1. Scegli un **id** breve e stabile (compare negli indirizzi e nelle chiavi dei
   salvataggi: non cambiarlo più).
2. Crea `src/pubblicazioni/<id>/` con `indice.ts` (le parti e i capitoli, con il
   collegamento a jw.org; `strumenti/genera-indice.mjs` è il modello per ricavarlo
   dall’indice del sito), `comune.ts` (con `ID` e `capitolo()`), `personaggi.ts` e
   `index.ts` con la `Pubblicazione` (titolo, `breve` come «il libro», descrizione,
   capitoli, vetrina).
3. Aggiungila a `PUBBLICAZIONI` in `src/contenuti/index.ts`: compare nella schermata
   iniziale e ha il suo indice in `#/<id>`. I test la controllano da sé.
4. Le decisioni del committente valgono anche per lei; se la pubblicazione richiede
   regole proprie, scrivile in questo file accanto a quelle esistenti.
5. In `e2e/percorsi.mjs` i percorsi sono per ora del solo libro `coraggio` (le
   chiavi di `PERCORSI` sono i numeri dei capitoli): con una seconda pubblicazione,
   portale alla forma `<id>/<numero>`.

## Note tecniche

- Coordinate di scena in unità logiche: altezza vista 540, terreno intorno a y=420.
  `x` dei punti fra 60 e `larghezza - 60`.
- `window.__partita` espone la partita in corso per la prova dal vero
  (`istantanea()`, `teletrasporta(x)`, `caricaScena(i)`); `window.__suono.istantanea()`
  dice che cosa sta suonando (`sorgenti`) e quali suoni singoli si sono sentiti (`eventi`).
- La partita parla all’interfaccia con `Ascoltatori` (`partita.ts`): schede, inviti,
  stato, passi, `paesaggio` (ciò che si sente) ed `evento` (un `fx suono`); `gioco.ts`
  li collega a schede e `Suono`.
- Una folla nascosta (`seVar` a 0) non si muove: due folle con lo stesso seme restano
  allineate solo se sono `fermo` o `assalto`.
- Toccare la scena vicino a un punto visibile ci porta e lo apre (`vaiVerso`).
- Il sito è statico (`base: './'`): funziona anche sotto un sottopercorso.
- Aggiornamenti: chi l’ha installato sulla schermata Home riapre il gioco senza
  ricaricarlo, quindi all’avvio e a ogni ritorno `App.cercaAggiornamento()` confronta lo
  script dell’`index.html` pubblicato con quello in uso e, se è cambiato, ricarica (mai
  durante un racconto: aspetta il cambio di schermata). La prova dal vero lo verifica.

## Rami e pubblicazione

- Sito pubblicato: https://br1-data.github.io/explore/
- Ramo di lavoro: `claude/funny-faraday-n6r8r2`.
- Ramo predefinito e pubblicato: `claude/funny-allen-d6a9za`. L'ambiente
  `github-pages` accetta solo questo ramo; `pages.yml` pubblica a ogni push su di esso.
- Per pubblicare, dopo che le verifiche sono passate sul ramo di lavoro, si porta il
  ramo predefinito allo stesso punto con un avanzamento rapido (mai forzato):
  `git push origin claude/funny-faraday-n6r8r2:claude/funny-allen-d6a9za`.
- `ci.yml` («Verifiche») gira su ogni push: controllo dei tipi, test, build e prova
  dal vero in Chromium.
- Per sapere com’è andata senza `gh`: `curl -s
  "https://api.github.com/repos/Br1-data/explore/actions/runs?head_sha=<sha>"` (campi
  `status` e `conclusion`); i passi falliti in `…/actions/runs/<id>/jobs`. I log
  completi richiedono l’accesso a GitHub. Si pubblica solo un commit con le verifiche
  verdi: se un commit fallisce e il successivo (che lo contiene) passa, si pubblica il
  successivo. Dopo la pubblicazione, il workflow «Pubblica su GitHub Pages» aggiorna il
  sito: si controlla che lo script indicato da `index.html` contenga un testo nuovo.
- Su Windows, i messaggi di commit su più righe si scrivono in un file e si passano con
  `git commit -F <file>`.
