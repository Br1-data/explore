# Segnale Remoto

Survival/crafting 3D low-poly sul pianeta Kepler-Sigma. Il progetto completo è in [`docs/GDD.md`](docs/GDD.md).

## Gioca nel browser

Il client contiene una **modalità solitaria interamente locale**, adatta a GitHub Pages: mondo, movimento, raccolta, crafting e sopravvivenza funzionano nel browser, senza server, account o richieste a servizi esterni. Premi **Esplora in solitaria** per iniziare una nuova spedizione. I progressi locali non vengono salvati: uscire o ricaricare la pagina avvia una nuova partita.

La **modalità co-op online per 1–4 giocatori** usa invece il server Node/WebSocket del progetto. Crea una spedizione e condividi il codice di quattro lettere o il link d’invito. Le sessioni della stessa scheda possono ricollegarsi entro 60 secondi. GitHub Pages non può eseguire questo server: il co-op si usa durante lo sviluppo, oppure collegando un server ospitato altrove.

Entrambe le modalità usano la stessa simulazione e la stessa valle procedurale a quattro biomi.

| Comando                               | Azione                                                   |
| ------------------------------------- | -------------------------------------------------------- |
| WASD / frecce                         | Muoviti                                                  |
| Mouse                                 | Camera; clic nel mondo per catturarlo, Esc per liberarlo |
| Shift                                 | Corri                                                    |
| Spazio                                | Salta                                                    |
| E / clic sinistro con mouse catturato | Raccogli la risorsa vicina                               |
| Tab                                   | Zaino e creazione                                        |
| 2                                     | Consuma una Cella O₂                                     |
| 3                                     | Mangia un Frutto lumen                                   |

Raccogli rottami e cristalli vicino al relitto. Una **Cella O₂** costa **2 Cristalli + 1 Rottame** e ripristina 50 ossigeno. I bulbi danno 40 ossigeno e ricrescono in 90 secondi; i Frutti lumen danno energia e salute e ricrescono in 120 secondi. Ossigeno ed energia si consumano nel tempo e a zero causano danni. Quando perdi tutta la salute, torna al menu per ripartire.

Il prototipo non include ancora combattimento, costruzioni, tempesta, estrazione, rianimazione, progressione permanente o app desktop. Il faro è per ora una meta esplorativa.

## Sviluppo e test

Richiede **Node.js >=22.13** e npm.

```bash
npm ci
npm run dev      # server :2567 e client Vite :5173
npm run check    # formattazione, lint, typecheck e test
npm run build    # bundle client e server
npm start        # solo server compilato; non serve i file del client
```

Apri il client Vite su `localhost:5173`. Il proxy `/ws` collega il client al server. Per cambiare porta al server, imposta `PORT` e `SERVER_PORT` allo stesso valore. Il pulsante separato **Esplora in solitaria** permette di provare il gioco senza connessione al server.

I test Playwright avviano servizi su porte dedicate e verificano il co-op con due browser, raccolta, crafting, movimento, rientro dopo il reload e il gioco locale servito come file statici sotto `/explore/`.

```bash
npx playwright install chromium
npm run e2e
# Oppure, se Chromium è già installato:
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run e2e
```

## GitHub Pages

Il workflow [Deploy to GitHub Pages](.github/workflows/pages.yml) pubblica `packages/client/dist` quando cambia il branch `claude/funny-allen-d6a9za`. Può anche essere eseguito manualmente da Actions.

Per attivarlo nel repository, apri **Settings → Pages → Build and deployment → Source → GitHub Actions**. Se l’ambiente `github-pages` richiede approvazioni o limita i branch, autorizza il branch indicato. Il job `deploy` mostra l’indirizzo del sito quando la pubblicazione è riuscita. L’indirizzo standard per questo repository è `https://br1-data.github.io/explore/`; la presenza del workflow da sola non conferma che il sito sia già online.

Senza configurazione aggiuntiva, la build pubblicata esegue il gioco locale e non apre connessioni WebSocket. La base relativa degli asset permette di servire il sito dal percorso `/explore/`.

Facoltativamente, la variabile pubblica del repository **`VITE_SERVER_URL`** può indicare l’indirizzo completo di un server online, per esempio `wss://game.example.com/ws`. Dopo averla impostata, riesegui il workflow per abilitare il co-op su quel server. Su HTTPS è richiesto `wss://`. Questa variabile è inclusa nella build del client e non deve contenere credenziali.
