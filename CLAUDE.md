# Nei loro panni — istruzioni per riprendere il lavoro

Avventura 2D di studio sui racconti del libro **«Cammina coraggiosamente con Dio»**
(https://www.jw.org/it/biblioteca-digitale/libri/cammina-coraggiosamente-con-dio/).
Ogni capitolo del libro (54 in 3 parti) diventa un racconto da vivere nei panni di uno
dei personaggi, Geova compreso. Il gioco si chiamava «In cammino»: il nome è stato
cambiato perché spingeva a leggere alla lettera il «camminare con Dio» (decisione 7).

**Obiettivo del committente: fare in seguito tutti i 54 racconti.** Le scelte qui sotto
sono architetturali e valgono per ogni capitolo: il motore e lo schema dei contenuti
sono generici, un capitolo nuovo aggiunge solo contenuti (ed eventualmente scenografie).

**Stato:** il capitolo 1 (Enoc) è completo e giocabile con quattro punti di vista.
Gli altri 53 capitoli compaiono nell'indice come «in preparazione».
**Prossimo passo:** capitolo 2, Noè («Condannò il mondo»), con la stessa struttura.

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
     personaggio con la sua fonte, le altre mostrano come agivano gli altri.
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
8. **Ogni personaggio ha i suoi dettagli.** Nessun dettaglio, sensazione o attività si
   ripete tra i punti di vista dello stesso capitolo: ogni ruolo guarda il racconto con
   la sua lente (Enoc: la sua condotta; Geova: ciò che approva e fa; Matusalemme: i
   numeri; l'empio: il mondo e il messaggio dalla sua parte). I test lo verificano.
   Evitare anche le ripetizioni dentro un ruolo (un versetto citato e poi un dettaglio
   che ne ripete le parole): per questo le attività possono rivelare un `dettaglio`.
9. Il repository precedente (gioco «Segnale Remoto») è stato rimosso su richiesta.

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
ogni dettaglio `sembra` contenga una parola di cautela e le decisioni 7 e 8.

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
`VISTA=390x844` prova a misura di telefono, `RUOLI=enoc,geova` limita i percorsi,
`BASE_URL=http://localhost:5173` usa un server già avviato. Se Chromium manca:
`npx playwright install chromium`.

**Prima di ogni commit:** `npm run check`, `npm run build`, `npm run e2e`, e guarda
alcune schermate (desktop e telefono) per verificare la grafica. Le schermate
«…-prima» sono prese mentre la scheda compare: la trasparenza è normale.

## Struttura

```
src/
  content/
    tipi.ts              schema dei contenuti (Capitolo, Ruolo, Scena, Punto, Passo, Attivita, Dettaglio…)
    libro.ts             indice dei 54 capitoli (generato da strumenti/genera-indice.mjs)
    index.ts             registro dei capitoli giocabili: CAPITOLI = { 1: capitoloEnoc }
    capitoli/enoc/
      base.ts            versetti, VITE (linea del tempo), DETTAGLI (fonti e certezza), SENSAZIONI, STUDIO
      scenari.ts         scenografie riusabili, con larghezza a scelta (mondo, colline, altura, strada, notte, quiete)
      enoc.ts geova.ts matusalemme.ts empio.ts   un file per punto di vista
      index.ts           assembla il Capitolo
  motore/
    partita.ts           ciclo di gioco, movimento, tocco sui punti, indizi, folle, sequenze, disegno
    figure.ts            persone disegnate (senza volto) e pose
    oggetti.ts           oggetti di scena (casa, tenda, albero, idolo…) — aggiungerne qui
    tavolozze.ts         ambienti (colori, cielo, terreno)
    arte.ts              piccole illustrazioni per le schede (Eden, Caino e Abele…)
    suono.ts             audio generato con Web Audio (nessun file)
  ui/
    app.ts               schermate (inizio, libro, capitolo, gioco, fine) e tastiera
    schede.ts            schede del racconto e tutte le attività
    quaderno.ts          quaderno di studio (dettagli, sensazioni, passi, domande; scarica/stampa)
    schemi.ts            schemi di studio («poi morì» di Genesi 5)
    etichette.ts         contrassegni (certezze, Ricostruzione, Per te) e verbi degli inviti
  salvataggio.ts         progressi e appunti in localStorage (chiave `nei-loro-panni.v1`)
test/contenuti.test.ts   fedeltà e coerenza dei contenuti
e2e/percorsi.mjs         prova dal vero di tutti i percorsi
```

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
`schema`, `attivita`, `fx` (effetti di scena: pose, spostamenti, nuvolette di parole,
variabili come `agitazione`/`visione`, dissolvenze).

Attività (`ui/schede.ts`), tutte risolvibili, nessuna cambia la storia:

| Tipo         | Che cosa fa chi gioca                                   | Note |
| ------------ | ------------------------------------------------------- | ---- |
| `ordina`     | tocca le voci in ordine; `distrattori` da scartare      | genealogie, sequenze |
| `componi`    | ricompone un testo a pezzi                              | testo alla lettera |
| `trova`      | tocca nel testo le parti tra `[[ ]]`                    | ripetizioni, parole chiave |
| `completa`   | riempie le parole mancanti di un versetto               | il testo senza `[[ ]]` = il versetto (test) |
| `classifica` | mette ogni voce in una di due categorie                 | ogni voce con fonti; può rivelare un `dettaglio` |
| `linea`      | porta il cursore su un anno della linea del tempo       | `meta` = una nascita o morte; anni a.E.V. negativi |
| `domanda`    | sceglie la risposta giusta                              | `dettaglio` oppure `spiegazione` + `fonti` |
| `condotta`   | sceglie che cosa fare in una situazione «Ricostruzione» | una sola opzione `fedele` con `dettaglio`; le altre con `esito` e `fonti` |

Punti `facoltativo` (bordo tratteggiato) non bloccano la scena; `richiede` ordina i
punti. La scena è completa quando tutti i punti obbligatori sono fatti; si prosegue
con il pulsante o camminando fino in fondo. Dopo l'ultima scena parte l'`epilogo`.

## Come aggiungere un capitolo (es. Noè)

1. Scarica e leggi il capitolo, i passi biblici indicati, le pubblicazioni citate e
   la descrizione delle immagini.
2. Elenca i personaggi impersonabili (incluso Geova) e per ciascuno decidi la **lente**:
   che cosa vede e fa solo lui. Distribuisci i dettagli fra i ruoli senza ripetizioni.
3. Crea `src/content/capitoli/<nome>/` sul modello di `enoc/`: `base.ts` con versetti
   alla lettera, dettagli con fonti e certezza, sensazioni come domande, sezioni di
   studio; un file per ogni personaggio (Geova in `modo: 'osserva'`, solo con gli atti
   che il racconto gli attribuisce).
4. In ogni scena usa le tre forme di interattività (decisione 5): indizi da esaminare,
   attività da manipolare, situazioni di condotta dichiarate come ricostruzioni.
   Attenzione ai modi di dire biblici (camminare, correre la corsa, ecc.): sono
   simbolici, non vanno resi come movimento (decisione 7).
5. Riusa o aggiungi scenografie (`scenari.ts`), oggetti (`motore/oggetti.ts`),
   ambienti (`motore/tavolozze.ts`), illustrazioni (`motore/arte.ts`), schemi
   (`ui/schemi.ts`). Se servono scenografie comuni a più capitoli, spostale fuori
   dalla cartella del capitolo.
6. Registralo in `src/content/index.ts`. I test di `contenuti.test.ts` girano su ogni
   capitolo registrato; aggiungi test specifici (citazioni, calcoli) come per Enoc.
7. Aggiorna `e2e/percorsi.mjs` (oggi gioca il capitolo 1) e verifica le schermate.

## Note tecniche

- Coordinate di scena in unità logiche: altezza vista 540, terreno intorno a y=420.
  `x` dei punti fra 60 e `larghezza - 60`.
- `window.__partita` espone la partita in corso per la prova dal vero
  (`istantanea()`, `teletrasporta(x)`).
- Toccare la scena vicino a un punto visibile ci porta e lo apre (`vaiVerso`).
- Il sito è statico (`base: './'`): funziona anche sotto un sottopercorso.

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
