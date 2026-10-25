# Segnale Remoto

Survival/crafting 3D low-poly sul pianeta Kepler-Sigma. Dallo schianto dell’Aurora–7 al faro di estrazione: quattro biomi, risorse da gestire e una tempesta alle spalle. Il design di riferimento è in [`docs/GDD.md`](docs/GDD.md).

## Giocare

La **modalità solitaria** funziona interamente nel browser, anche su [GitHub Pages](https://br1-data.github.io/explore/), senza account, backend o servizi esterni. Premi **Esplora in solitaria** per iniziare; **Continua spedizione** riprende la partita salvata nello stesso browser.

La **modalità co-op online per 1–4 giocatori** usa il server Node/WebSocket del repository. Crea una stanza e condividi il codice di quattro lettere o il link d’invito. Il personaggio rimane riservato per 60 secondi dopo una disconnessione. Browser e app desktop possono collegarsi allo stesso server. GitHub Pages ospita solo il client: per il co-op serve un server esterno oppure il server di sviluppo locale.

Le due modalità usano le stesse regole di simulazione a 20 tick al secondo.

## Una spedizione completa

1. **Recupera il materiale al relitto.** Rottami, cristalli e fibra permettono di creare il primo campo. I bulbi ricaricano l’ossigeno; il Frutto lumen recupera energia e salute.
2. **Costruisci il campo.** Il Faro di campo definisce un’area di 18 m. Generatore O₂, Banco da lavoro e Torrette richiedono quel perimetro; Falò e Barricate possono essere costruiti anche fuori. Il generatore ricarica l’ossigeno entro 8 m, il banco sblocca ricette avanzate e il falò permette di cucinare e protegge dal freddo. Smontando recuperi il 75% del costo effettivamente pagato, arrotondato per difetto.
3. **Preparati e attraversa i biomi.** Migliora il multi-attrezzo, crea armi, celle O₂, razioni e medikit. La Giungla Fungina contiene spore, le Distese di Vetro consumano più energia di giorno e i Picchi Ghiacciati richiedono protezione termica o un falò vicino. Il ciclo giorno/notte dura 8 minuti; di notte aumentano popolazione e distanza di avvistamento delle creature.
4. **Non farti raggiungere.** Dopo 4 minuti la tempesta avanza da ovest, danneggia gli astronauti, triplica il consumo di ossigeno e distrugge strutture e capsule rimaste indietro.
5. **Riattiva il faro.** Il Modulo di uplink richiede materiali di tutti e quattro i biomi e un Banco da lavoro. Al faro a est, premi E per attivarlo. Difendi la zona per 120 secondi: il conto avanza solo se almeno un astronauta in piedi rimane entro 25 m. Arrivano ondate e, a metà, il Colosso del Segnale.

Il gioco comprende tutte le ricette e le sei strutture del documento di design, nove tipi di creature con comportamenti e bottini distinti, combattimento con batteria ricaricabile e schivata. La mappa, il diario obiettivi e l’interfaccia mostrano risorse, pericoli e stato dell’estrazione.

A zero salute si finisce a terra. Un compagno vicino può rianimarti tenendo E per 3 secondi; un Medikit permette di rianimarti da solo tenendo E per 5 secondi. Dopo 30 secondi a terra muori, lasci una capsula con metà delle risorse e puoi rinascere dopo 10 secondi all’ultimo faro ancora disponibile o accanto a un compagno. Se non resta nessuno in piedi e nessuno può usare un Medikit per rialzarsi, la spedizione termina. Si perde anche se la tempesta raggiunge il faro di estrazione.

## Comandi

| Comando                                    | Azione                                                            |
| ------------------------------------------ | ----------------------------------------------------------------- |
| WASD / frecce                              | Muoviti                                                           |
| Mouse                                      | Camera; clic nel mondo per catturarlo                             |
| Shift                                      | Corri                                                             |
| Spazio                                     | Salta                                                             |
| Q                                          | Schiva: breve invulnerabilità e ricarica di 1,2 s                 |
| 1–6 / rotella                              | Seleziona l’oggetto nella barra rapida                            |
| Clic sinistro con mouse catturato          | Usa l’oggetto attivo: attrezzo, arma o consumabile                |
| E                                          | Raccogli/interagisci, recupera una capsula, attiva il faro        |
| E premuto                                  | Rianima un compagno vicino o usa un Medikit quando sei a terra    |
| Tab                                        | Zaino, ricette, equipaggiamento, consumabili e scambio di risorse |
| B                                          | Apri il menu costruzioni                                          |
| R durante il piazzamento                   | Ruota la struttura                                                |
| Clic / tasto destro durante il piazzamento | Costruisci / annulla                                              |
| X                                          | Smonta la struttura vicina                                        |
| Invio                                      | Chat dell’equipaggio online                                       |
| Esc                                        | Chiudi il pannello o apri la pausa e libera il mouse              |

In solitaria, la pausa e il passaggio a un’altra scheda fermano la simulazione. Online il mondo continua: cerca un riparo prima di allontanarti. Aprire zaino o costruzioni non ferma la partita.

## Salvataggi e Laboratorio

La partita solitaria viene salvata ogni 5 secondi e quando metti in pausa, esci o lasci la pagina. Il salvataggio include mondo, strutture, inventario e avanzamento della run. **Continua spedizione** lo riprende; iniziare una nuova spedizione sostituisce quella precedente. I dati rimangono nel browser: cancellare i dati del sito li elimina e, se l’archiviazione del browser è bloccata, non possono essere garantiti tra sessioni.

Le cache, i biomi raggiunti, le creature eliminate e la vittoria assegnano Dati di Ricerca a fine run. Nel **Laboratorio** puoi acquistare gli otto potenziamenti permanenti e tre colori della tuta. Gli sblocchi si applicano alla spedizione successiva. Il risultato di una run viene accreditato una sola volta.

La modalità locale conserva ricerca e sblocchi nel browser. Il server online li conserva in SQLite in `data/profiles.sqlite`; il percorso si può cambiare con `PROFILE_DB`. I profili locali, quelli del server e quelli dell’app desktop sono separati.

## Sviluppo e verifiche

Richiede **Node.js >=22.13** e npm. Per il browser è necessario WebGL; i comandi di gioco sono pensati per tastiera e mouse.

```bash
npm ci
npm run dev      # server :2567 e client Vite :5173
npm run check    # formattazione, lint, typecheck e test di simulazione/server
npm run build    # bundle client e server
npm start        # solo server compilato; non serve i file del client
```

Apri il client Vite su `localhost:5173`. Il proxy `/ws` collega il client al server. Per cambiare porta al server, imposta `PORT` e `SERVER_PORT` allo stesso valore. Il pulsante **Esplora in solitaria** permette di provare il gioco locale anche durante lo sviluppo.

I test coprono regole di crafting e costruzione, combattimento, pericoli, rianimazione, salvataggi e profili. Una suite di integrazione attraversa i quattro biomi, prepara l’uplink e completa la difesa del faro con ondate e boss attivi. I test Playwright verificano il co-op con due browser e il client locale servito come soli file statici sotto `/explore/`, compresi laboratorio, costruzione e ripresa della partita.

```bash
npx playwright install chromium
npm run e2e
# Se Chromium è già installato:
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run e2e
```

## App desktop

Il wrapper Electron include lo stesso client e supporta la modalità locale e il collegamento al server co-op.

```bash
npm run desktop:dev       # compila e avvia l’app
npm run desktop:build     # cartella eseguibile per il sistema corrente
npm run desktop:package   # archivi/installatori per il sistema corrente
```

Output in `apps/desktop/out/`. I target configurati sono AppImage/tar.gz per Linux, NSIS/portable per Windows e DMG/ZIP per macOS. I pacchetti devono essere costruiti e verificati sul rispettivo sistema; firma e notarizzazione richiedono certificati esterni. Vedi [`apps/desktop/README.md`](apps/desktop/README.md).

## GitHub Pages

Il workflow [Deploy to GitHub Pages](.github/workflows/pages.yml) pubblica `packages/client/dist` a ogni aggiornamento del branch `claude/funny-allen-d6a9za`. È eseguibile anche manualmente da Actions. Nel repository, **Settings → Pages → Source** deve essere impostato su **GitHub Actions**; il job `deploy` riporta l’indirizzo della pubblicazione riuscita.

Senza configurazione aggiuntiva, la build pubblicata usa la modalità solitaria e non apre connessioni WebSocket. La base relativa degli asset supporta il percorso `/explore/`.

Per collegare un server co-op, imposta la variabile pubblica del repository **`VITE_SERVER_URL`** con il suo indirizzo completo, per esempio `wss://game.example.com/ws`, e riesegui il workflow. Su HTTPS è richiesto `wss://`. La variabile entra nella build del client e non deve contenere credenziali. La stessa variabile può essere impostata prima della build desktop per consentire il cross-play con il browser.

Mobile touch, console, voice chat e mondi persistenti tra spedizioni rimangono fuori dallo scope del progetto.
