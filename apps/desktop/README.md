# App desktop

Il wrapper Electron usa lo stesso client e la stessa simulazione della versione browser. I file del gioco vengono inclusi nell'app: la modalità solitaria non richiede un server o una connessione Internet.

Dalla radice del repository, con Node.js >=22.13:

```bash
npm ci
npm run desktop:dev       # compila il client e apre l'app
npm run desktop:build     # crea una cartella eseguibile per il sistema corrente
npm run desktop:package   # crea gli archivi/installatori per il sistema corrente
```

Al primo utilizzo Electron scarica il proprio runtime da GitHub mantenendo la verifica dei checksum. In reti aziendali puoi usare il supporto ufficiale al proxy con `ELECTRON_GET_USE_PROXY=1`; configura la CA attendibile del sistema se richiesta. Non disabilitare la verifica TLS.

I risultati vengono scritti in `apps/desktop/out/`. I target previsti sono AppImage e tar.gz su Linux, NSIS e portable su Windows, DMG e ZIP su macOS. Per rilasci Windows/macOS usa il relativo sistema di compilazione e configura firma e notarizzazione: i certificati non sono inclusi nel repository.

Per collegare il client desktop allo stesso server co-op dei giocatori browser, imposta l'URL completo prima della compilazione:

```bash
VITE_SERVER_URL=wss://game.example.com/ws npm run desktop:dev
```

Senza questa variabile il client usa la modalità locale. I dati locali dell'app sono separati da quelli del sito web.

La finestra esegue il gioco con `contextIsolation`, sandbox e controlli di sicurezza web attivi; Node.js non è disponibile alla pagina. I link HTTPS si aprono nel browser predefinito, mentre nuove finestre, webview e navigazioni arbitrarie sono bloccati.
