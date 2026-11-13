# In cammino — istruzioni per riprendere il lavoro

Avventura 2D di studio sui racconti del libro **«Cammina coraggiosamente con Dio»**
(https://www.jw.org/it/biblioteca-digitale/libri/cammina-coraggiosamente-con-dio/).
Ogni capitolo del libro (54 in 3 parti) diventa un racconto da percorrere, scegliendo
da quale personaggio viverlo, Geova compreso.

**Stato:** il capitolo 1 (Enoc) è completo e giocabile con quattro punti di vista.
Gli altri 53 capitoli compaiono nell'indice come «in preparazione».
**Prossimo passo:** capitolo 2, Noè («Condannò il mondo»), con la stessa struttura.

Lingua del progetto: italiano (codice, commenti, testi, commit).

## Decisioni del committente (non rimetterle in discussione)

Date in risposta a domande dirette; valgono per tutti i capitoli.

1. **Avventura 2D esplorabile.** Vista laterale: il personaggio cammina negli ambienti e
   si avvicina a persone e oggetti per interagire.
2. **Fedeltà assoluta, niente di apocrifo.** «Non devi aggiungere cose apocrife. La
   narrazione dev'essere fedele. È un impersonamento, e l'obiettivo è imparare il più
   possibile dai racconti carpendo dettagli e sensazioni. È un videogioco, ma in realtà
   è un progetto di studio.» Quindi:
   - nessun episodio, dialogo, nome o pensiero inventato; dove la Bibbia tace, il gioco
     lo dice esplicitamente;
   - nessuna scelta che cambi il racconto: si osserva, si legge, si interagisce;
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
5. Il repository precedente (gioco «Segnale Remoto») è stato rimosso su richiesta.

## Livelli di certezza

Ogni `Dettaglio` e ogni `narra` con un'affermazione porta `certezza` e `fonti`:

| Valore    | Etichetta          | Quando                                                              |
| --------- | ------------------ | ------------------------------------------------------------------- |
| `scritto` | È scritto          | Lo dice il testo biblico                                            |
| `numeri`  | Dai numeri         | Calcolo dagli anni/date della Bibbia o della linea del tempo        |
| `libro`   | Lo spiega il libro | Lo afferma il libro o una pubblicazione che il libro cita           |
| `sembra`  | Sembra che         | Le pubblicazioni stesse lo dicono probabile/possibile: il testo deve contenerne la cautela («sembra», «forse», «probabilmente»…) |

I test verificano fonti, collegamenti a jw.org, citazioni alla lettera, calcoli e
che ogni dettaglio `sembra` contenga una parola di cautela.

## Fonti

- Testo dei capitoli: jw.org (sopra). Il testo del libro **non va copiato**: si
  riassume con parole proprie e si collega sempre all'originale.
- Versetti: Traduzione del Nuovo Mondo, edizione per lo studio, su jw.org
  (`/it/biblioteca-digitale/bibbia/bibbia-per-lo-studio/libri/<libro>/<capitolo>/`),
  citati **alla lettera**, note in calce comprese quando utili.
- Usa anche le pubblicazioni citate nel capitolo («Vai più a fondo», «Scopri di più»),
  le immagini descritte nel capitolo (testo alternativo) e la linea del tempo della parte.
- In un ambiente cloud di Claude Code `www.jw.org` va consentito nella rete
  dell'ambiente; altrimenti `curl` risponde 403.

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
alcune schermate (desktop e telefono) per verificare la grafica.

## Struttura

```
src/
  content/
    tipi.ts              schema dei contenuti (Capitolo, Ruolo, Scena, Punto, Passo, Dettaglio…)
    libro.ts             indice dei 54 capitoli (generato da strumenti/genera-indice.mjs)
    index.ts             registro dei capitoli giocabili: CAPITOLI = { 1: capitoloEnoc }
    capitoli/enoc/
      base.ts            versetti, DETTAGLI (con fonti e certezza), SENSAZIONI, STUDIO
      scenari.ts         scenografie riusabili (mondo, colline, altura, strada, notte, quiete…)
      enoc.ts geova.ts matusalemme.ts empio.ts   un file per punto di vista
      index.ts           assembla il Capitolo
  motore/
    partita.ts           ciclo di gioco, movimento, folle, punti d'interesse, sequenze, disegno
    figure.ts            persone disegnate (senza volto) e pose
    oggetti.ts           oggetti di scena (casa, tenda, albero, stele…) — aggiungerne qui
    tavolozze.ts         ambienti (colori, cielo, terreno)
    arte.ts              piccole illustrazioni per le schede (Eden, Caino e Abele…)
    suono.ts             audio generato con Web Audio (nessun file)
  ui/
    app.ts               schermate (inizio, libro, capitolo, gioco, fine) e tastiera
    schede.ts            schede del racconto e attività (componi, trova, ordina, domanda)
    quaderno.ts          quaderno di studio (dettagli, sensazioni, passi, domande; scarica/stampa)
    schemi.ts            schemi di studio (generazioni, due linee, vite di Genesi 5, «poi morì»)
  salvataggio.ts         progressi e appunti in localStorage
test/contenuti.test.ts   fedeltà e coerenza dei contenuti
e2e/percorsi.mjs         prova dal vero di tutti i percorsi
```

## Come si costruisce un punto di vista

Un `Ruolo` ha `scene`; ogni `Scena` ha scenografia (`oggetti`, `folle`, `attori`),
`ingresso` (passi all'arrivo) e `punti` d'interesse. Il giocatore cammina, si avvicina
a un punto (segnale colorato per tipo: osserva, ascolta, leggi, agisci, rifletti) e
preme E: partono i suoi `passi`, mostrati come schede in sequenza.

Tipi di passo: `narra`, `verso` (con `evidenzia`), `dettaglio` (finisce nel quaderno),
`senti` (domanda al giocatore, con appunto), `schema`, `attivita`, `fx` (effetti di
scena: pose, spostamenti, nuvolette di parole, variabili come `agitazione`/`visione`,
dissolvenze).

Punti `facoltativo` (bordo tratteggiato) non bloccano la scena; `richiede` ordina i
punti. La scena è completa quando tutti i punti obbligatori sono fatti; si prosegue
con il pulsante o camminando fino in fondo. Dopo l'ultima scena parte l'`epilogo`.

## Come aggiungere un capitolo (es. Noè)

1. Scarica e leggi il capitolo, i passi biblici indicati, le pubblicazioni citate e
   la descrizione delle immagini.
2. Crea `src/content/capitoli/<nome>/` sul modello di `enoc/`: `base.ts` con versetti
   alla lettera, dettagli con fonti e certezza, sensazioni come domande, sezioni di
   studio del capitolo; un file per ogni personaggio impersonabile (incluso Geova, in
   `modo: 'osserva'`, solo con gli atti che il racconto gli attribuisce).
3. Riusa o aggiungi scenografie (`scenari.ts`), oggetti (`motore/oggetti.ts`),
   ambienti (`motore/tavolozze.ts`), illustrazioni (`motore/arte.ts`), schemi
   (`ui/schemi.ts`).
4. Registralo in `src/content/index.ts`. I test di `contenuti.test.ts` girano su ogni
   capitolo registrato; aggiungi test specifici (citazioni, calcoli) come per Enoc.
5. Aggiorna `e2e/percorsi.mjs` (oggi gioca il capitolo 1) e verifica schermate.

## Note tecniche

- Coordinate di scena in unità logiche: altezza vista 540, terreno intorno a y=420.
  `x` dei punti fra 60 e `larghezza - 60`.
- `window.__incammino` espone la partita in corso per la prova dal vero
  (`istantanea()`, `teletrasporta(x)`).
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
