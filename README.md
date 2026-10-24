# Segnale Remoto

Survival/crafting co-op in 3D low-poly, ambientato sul pianeta Kepler-Sigma.
Il progetto completo è descritto in [`docs/GDD.md`](docs/GDD.md).

## Primo traguardo: esplorazione giocabile

Il prototipo browser supporta **1–4 giocatori** in una valle procedurale con quattro biomi. Crea una spedizione e condividi il codice stanza di quattro lettere oppure il link d’invito. Ogni giocatore raccoglie risorse nel proprio zaino; il server gestisce movimento, inventario e sopravvivenza a 20 tick al secondo.

In caso di interruzione della connessione, il personaggio e il posto in stanza restano riservati per **60 secondi**. Il client tenta automaticamente di ricollegarsi usando la sessione della stessa scheda.

| Comando                               | Azione                                                              |
| ------------------------------------- | ------------------------------------------------------------------- |
| WASD / frecce                         | Muoviti                                                             |
| Mouse                                 | Orienta la camera; clic nel mondo per catturarlo, Esc per liberarlo |
| Shift                                 | Corri                                                               |
| Spazio                                | Salta                                                               |
| E / clic sinistro con mouse catturato | Raccogli la risorsa vicina                                          |
| Tab                                   | Apri o chiudi zaino e creazione                                     |
| 2                                     | Consuma una Cella O₂                                                |
| 3                                     | Mangia un Frutto lumen                                              |

Raccogli rottami e cristalli vicino al relitto, poi crea una **Cella O₂** nello zaino: costa **2 Cristalli + 1 Rottame** e ripristina 50 ossigeno. I bulbi ripristinano direttamente 40 ossigeno e ricrescono dopo 90 secondi; i Frutti lumen danno energia e salute e ricrescono dopo 120 secondi.

Salute, ossigeno ed energia sono visibili nell’interfaccia. Ossigeno ed energia si consumano nel tempo; a zero causano danni. Se perdi tutta la salute, torna al menu per avviare un’altra spedizione.

Questa prima versione non include ancora combattimento, costruzioni, tempesta, estrazione, rianimazione, progressione permanente o app desktop. Il faro è per ora una meta esplorativa.

## Sviluppo

Richiede **Node.js >=22.13** e npm. Non servono account, credenziali o servizi esterni.

```bash
npm ci
npm run dev      # server :2567 e client Vite :5173
npm run check    # formattazione, lint, typecheck e test
npm run build    # bundle client e server
npm start        # avvia soltanto il server compilato
```

Durante lo sviluppo apri il client Vite su `localhost:5173`: il proxy inoltra i WebSocket `/ws` al server, mantenendo la connessione sullo stesso origin del client. Per usare una porta server diversa, imposta `PORT` e `SERVER_PORT` allo stesso valore quando esegui `npm run dev`.

`npm start` non serve i file del client: per giocare usa `npm run dev`. Le build vengono generate nelle cartelle `dist` dei rispettivi pacchetti.

## Test nel browser

I test Playwright avviano server e client su porte dedicate (2570 e 5174) e verificano una spedizione con due browser, raccolta, crafting, movimento e rientro dopo il reload.

```bash
npx playwright install chromium
npm run e2e
```

Se Chromium è già installato nel sistema, puoi evitare il download indicando il suo percorso:

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run e2e
```
