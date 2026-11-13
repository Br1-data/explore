# Istruzioni per riprendere il lavoro

Questo file serve a chi (persona o agente) riprende il modello del carro celeste da dove è stato lasciato. Va aggiornato a ogni sessione di lavoro e cancellato quando il lavoro è finito.

## La richiesta

L’utente ha chiesto, a partire da Ezechiele 1:1-28 (Traduzione del Nuovo Mondo, edizione per lo studio):

> In un branch dedicato, crea un modello 3d (apribile da web ma anche scaricabile come modello per stampante 3d) del carro celeste, con tutti i dettagli.

- Branch di lavoro: `claude/vigilant-euler-ylyomq`. Non aprire una pull request se l’utente non la chiede.
- Tutto vive in `carro-celeste/`. Il resto del repository è un gioco che non c’entra: le uniche modifiche fuori cartella sono in `eslint.config.js` e `.prettierignore`, per far passare la CI.
- L’utente scrive in italiano: testi dell’interfaccia, README e messaggi di commit rivolti a lui vanno in italiano. Commenti nel codice in inglese, come nel resto del repository.

## Stato attuale

Funziona ed è verificato:

- `npm run build:model` genera in circa 15 secondi il modello in un pezzo unico, il kit in cinque parti e il GLB a colori. Lo script si ferma con un errore se un file non è un unico solido connesso: tutti e sei gli STL passano il controllo.
- Il visualizzatore (`index.html` + `web/app.bundle.js`) carica il GLB e lo mostra. Le immagini in `docs/` sono catture reali fatte con Chromium senza interfaccia grafica.
- `npm run format:check` e `npm run lint` dalla radice del repository passano.

Non ancora fatto o non ancora controllato:

- **Nessun Artifact pubblicato**: l’utente non ha ancora un link per aprire il modello dal web. È il primo punto da chiudere (vedi più sotto).
- Del visualizzatore sono state guardate solo la vista d’insieme a 1280 × 800 e le viste isolate di una creatura. Non sono stati provati: vista di stampa, cursore «Separa le parti», pannelli «Parti» e «Scarica», download dello ZIP, larghezza da telefono, gli altri undici punti di vista dell’elenco.
- Le ali ripiegate sono state cambiate nell’ultimo passaggio (`ALA_RIPIEGATA` in `src/parts/ali.mjs`) e **non sono state riguardate** dopo la modifica: `docs/anteprima-creatura.png` mostra la versione precedente.

## Come si lavora

```bash
cd carro-celeste
```

```bash
npm install
```

```bash
npm run build
```

Il ciclo usato finora è: modifica di una parte, `npm run build:model`, cattura di alcune viste, correzione.

```bash
SHOT_DIR=/tmp/viste SHOT_NOUI=1 SHOT_SIZE=700x700 node scripts/dev/screenshot.cjs "fronte=solo=cherubino_4&cam=95,-95,48&target=25,-25,35" "testa=solo=cherubino_4&cam=52,-52,54&target=25,-25,52"
```

- `cam` e `target` sono in millimetri del modello, Z in alto. `solo=<nodo>` mostra un solo nodo del GLB (`base`, `fuoco`, `ruota_1…4`, `cherubino_1…4`, `distesa`, `trono`, `figura`, `arcobaleno`). `mode=stampa` apre la vista di stampa. Senza `SHOT_NOUI` la cattura include l’interfaccia.
- `scripts/dev/contact-sheet.py` affianca più catture in un’unica immagine.
- `node scripts/debug-parts.mjs` elenca triangoli e pezzi di ogni parte.
- Lo script di cattura usa `playwright`, già installato nelle sessioni cloud di Claude Code. Chromium senza GPU rende WebGL via SwiftShader: è lento ma fedele.
- Dopo ogni modifica a `web/src/` serve `npm run build:web`: la pagina carica il file compilato, non i sorgenti.
- Prima del commit: `npx prettier --write carro-celeste` e `npm run lint` dalla radice (serve `npm ci --ignore-scripts` nella radice, una volta).

## Com’è fatto

| Percorso              | Contenuto                                                                                                 |
| --------------------- | --------------------------------------------------------------------------------------------------------- |
| `src/params.mjs`      | Tutte le misure, in millimetri                                                                            |
| `src/lib/kernel.mjs`  | Involucro di Manifold (`manifold-3d`): unione, sistemi di riferimento, `clean()`                          |
| `src/lib/sdf.mjs`     | Campi di distanza per le parti organiche (facce, corpi, mani), convertiti in solidi con `toSolid()`       |
| `src/lib/mesh-io.mjs` | Scrittura di STL binario e GLB, normali con angolo di piega                                               |
| `src/parts/*.mjs`     | Una parte per file: `base`, `fuoco`, `ruota`, `ali`, `testa`, `cherubino`, `distesa`, `trono`             |
| `src/build.mjs`       | Assembla, controlla, esporta; contiene anche la tavolozza dei materiali del GLB                           |
| `web/src/main.js`     | Visualizzatore three.js: materiali per nome, bloom, volo della camera, livelli, vista di stampa, download |
| `web/src/details.js`  | Elenco dei dettagli per versetto con le posizioni della camera, livelli, file scaricabili                 |
| `web/src/zip.js`      | Scrittura di uno ZIP senza compressione, nel browser                                                      |
| `index.html`          | Pagina completa; carica `web/app.bundle.js` e legge `modelli/carro-celeste.glb` con percorsi relativi     |

Convenzioni geometriche, da non cambiare senza motivo:

- Millimetri, Z in alto. Il terreno su cui poggiano le ruote è `z = 4` (faccia superiore della base). Il trono guarda verso `-Y`.
- Ruote con l’asse in `(±45, ±45)`, raggio esterno 41. Ogni ruota è fatta di due cerchi uguali, uno nel piano X-Z e uno nel piano Y-Z: da ognuno dei quattro lati il carro mostra due ruote affiancate. Le ruote affondano 1,5 mm nella base e nella distesa, così l’unione è robusta.
- Creature in `(±25, ±25)`, dentro il quadrato delle ruote, ognuna accanto alla propria ruota e rivolta in diagonale verso l’esterno. Nel sistema locale della creatura la faccia d’uomo guarda `+Y` e la destra è `+X`: leone a `+X`, toro a `-X`, aquila a `-Y`.
- Le due ali spiegate di ogni creatura stanno nei piani verticali `x = ±25` e `y = ±25` e le punte si sovrappongono di 1,4 mm con quelle delle vicine: le otto ali formano un quadrato chiuso attorno al fuoco. La lunghezza dell’ala è calcolata in `cherubino.mjs` perché le punte si incontrino; se si sposta una creatura si adatta da sola.
- Quattro braccia sulle diagonali del corpo, una mano per lato (v. 8). Le due ali ripiegate pendono sui fianchi (vv. 11, 23).
- La distesa è un disco di raggio 80 con la faccia superiore a faccette irregolari; base e parte inferiore sono piatte.
- La figura sul trono è volutamente senza lineamenti (v. 27 e il capitolo 3 del libro _Pura adorazione_: la figura non si distingue nei dettagli). È un nodo a parte (`figura`), che nel visualizzatore si può nascondere.

## Trappole già incontrate

- **`extrude` di Manifold 3.2.1**: passare `1` come `scaleTop` produce un cuneo con metà del volume. Va passato `[1, 1]`.
- **Frammenti dopo le booleane**: restano schegge e cavità chiuse (pezzi di volume negativo in `decompose()`). `clean()` li elimina; le parti da `toSolid()` e `ala()` passano già di lì.
- **`Manifold.levelSet`** vuole valori positivi all’interno; `sdf.mjs` usa la convenzione opposta e inverte il segno in `toSolid()`.
- **`rotate([x, y, z])`** applica X, poi Y, poi Z. Per altri ordini servono chiamate separate.
- **Ogni faccia della testa** è confinata al proprio spicchio di 90° (`wedge` in `testa.mjs`): criniera, corna e orecchie non possono allargarsi oltre le diagonali, altrimenti invadono le facce vicine.
- **`wol.jw.org`** è nell’elenco dei domini dell’ambiente `explore` (aggiunto in questa sessione con l’approvazione dell’utente) ma risponde con una verifica anti-bot: non va aggirata. Lo stesso testo, con le note in calce, si legge su `www.jw.org/it/biblioteca-digitale/bibbia/bibbia-per-lo-studio/libri/ezechiele/1/`; i capitoli del libro sono sotto `www.jw.org/it/biblioteca-digitale/libri/pura-adorazione/cieli/`.
- **Testo biblico**: nell’interfaccia i versetti sono riassunti con parole proprie e citati per numero. Non riportare il testo della traduzione per esteso.

## Cosa resta da fare, in ordine

1. **Alleggerire le mesh.** Il pezzo unico ha 331.684 triangoli (16,6 MB), il kit 1 ne ha 197.938 (9,9 MB). Obiettivo: pezzo unico sotto i 10 MB, cioè circa 200.000 triangoli. Per l’Artifact il limite è rigido: 15 MB per file binario. Dove stanno i triangoli, per singola copia: creatura circa 75.000 (corpo SDF, testa, braccia), ruota circa 28.000 (quasi tutti negli occhi). Leve: tolleranza di `simplify` in `toSolid()` (testa: 0,05 → circa 10.000 triangoli, 0,08 → circa 6.000), `quality.edge` in `build.mjs`, segmenti degli occhi in `ruota.mjs`, segmenti delle piume in `ali.mjs`. Controllare a schermo che le facce restino leggibili.
2. **Pubblicare l’Artifact** così l’utente apre il modello dal web. Vincoli già verificati:
   - la pagina va scritta senza `<!doctype>`, `<html>`, `<head>`, `<body>`: partire da `index.html` e tenere `<title>`, il `<meta name="claude:viewport-fit-sides">`, il `<link>` ai font, lo `<style>` e il contenuto del `<body>`;
   - `web/app.bundle.js` e i file di `modelli/` si pubblicano accanto alla pagina con il parametro `files`, agli stessi percorsi relativi;
   - un Artifact non può avviare download da solo: serve la capacità `downloads` (`capabilities: {downloads: true}`), che accetta solo alcune estensioni. **`.stl` e `.glb` non sono ammesse, `.zip` sì**: per questo il pulsante «Scarica tutto (ZIP)» costruisce l’archivio nel browser. `main.js` gestisce già i due casi (`window.claude.use('downloads')` dentro un Artifact, link diretti altrove);
   - non è verificato che `files` accetti i tipi `model/stl` e `model/gltf-binary`. Se li rifiuta, incorporare i binari in file `.js` come base64 (massimo 16 MB per file di testo);
   - dopo la pubblicazione, provare il download una volta e dire all’utente che cosa è stato provato.
3. **Rifinire le facce** (`src/parts/testa.mjs`, vedi `docs/anteprima-facce.png`). Uomo, leone e toro si riconoscono. **L’aquila no**: il becco sporge poco e la testa sembra un secondo leone; va allungato e incurvato, con arcate più marcate. Un corno del toro spunta accanto alla fronte dell’uomo: accorciarlo o portarlo più avanti. Gli occhi delle quattro facce sono poco definiti.
4. **Riguardare le ali ripiegate** dopo l’ultima modifica e aggiornare `docs/anteprima-creatura.png`.
5. **Provare il visualizzatore per intero**: tutte le dodici viste di `details.js` (le posizioni della camera sono state scritte a tavolino), vista di stampa, separazione delle parti, pannelli, download, larghezza 400 px. Nella vista d’insieme il modello finisce sotto la didascalia: spostare il centro ottico con `camera.setViewOffset` in `resize()` (a destra dell’indice e sopra la didascalia su desktop, verso l’alto su telefono).
6. **Aggiornare README e questo file**, sostituire le anteprime in `docs/`, togliere l’avviso «Lavoro in corso».
7. Facoltativo: occhi anche su corpo, mani e ali delle creature (Ezechiele 10:12); pubblicazione su GitHub Pages. Il workflow attuale pubblica il gioco dal branch `claude/funny-allen-d6a9za`: non va toccato senza chiedere all’utente.
