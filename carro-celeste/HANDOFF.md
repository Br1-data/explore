# Istruzioni per riprendere il lavoro

Questo file serve a chi (persona o agente) riprende il modello del carro celeste da dove è stato lasciato. Va aggiornato a ogni sessione di lavoro e cancellato quando il lavoro è finito.

## La richiesta

L’utente ha chiesto, a partire da Ezechiele 1:1-28 (Traduzione del Nuovo Mondo, edizione per lo studio):

> In un branch dedicato, crea un modello 3d (apribile da web ma anche scaricabile come modello per stampante 3d) del carro celeste, con tutti i dettagli.

- Branch di lavoro: `claude/vigilant-euler-ylyomq`. Non aprire una pull request se l’utente non la chiede.
- Tutto vive in `carro-celeste/`. Il resto del repository è un gioco che non c’entra: le uniche modifiche fuori cartella sono in `eslint.config.js` e `.prettierignore`, per far passare la CI.
- L’utente scrive in italiano: testi dell’interfaccia, README e messaggi di commit rivolti a lui vanno in italiano. Commenti nel codice in inglese, come nel resto del repository.

## Stato attuale

Fatto e verificato:

- `npm run build:model` genera in circa 15 secondi il modello in un pezzo unico (235 × 180 × 148 mm, circa 260.000 triangoli, 13 MB), il kit in cinque parti e il GLB a colori. Lo script si ferma con un errore se un file non è un unico solido connesso: tutti e sei gli STL passano il controllo.
- **Pianta rettangolare**, chiesta dall’utente perché il carro somigli all’illustrazione del capitolo 3 del libro _Pura adorazione_: ruote ai vertici di un rettangolo 148 × 90 mm, cerchi a fascia con file di occhi, distesa a lastra rettangolare spessa 6 mm. Le illustrazioni di riferimento sono `https://cms-imgp.jw-cdn.org/img/p/1102017163/univ/art/1102017163_univ_cnt_6_md.jpg` (carro), `…_cnt_7_md.jpg` (ruote), `…_cnt_8_md.jpg` (una ruota), `…_cnt_9_md.jpg` (arcobaleno); l’host è nell’elenco dell’ambiente `explore`.
- Visualizzatore provato con Chromium: vista d’insieme, le dodici viste di dettaglio, vista di stampa, separazione delle parti, pannelli, larghezza da telefono (400 px), download dello ZIP (archivio integro, otto file).
- **Artifact pubblicato**: <https://claude.ai/artifact/2By3PSNDFpRXZT5756A5QW>, privato, con la capacità `downloads`. Per ripubblicarlo: `node scripts/dev/pack-for-artifact.mjs <cartella>` e poi lo strumento Artifact con `file_path` = `<cartella>/carro-celeste.html`, `root` = `<cartella>`, `files` = l’elenco in `<cartella>/files.json` (più `web/app.bundle.js` copiato in `<cartella>/web/`), `url` = il link qui sopra, `capabilities: {downloads: true}`.
- `npm run format:check` e `npm run lint` dalla radice del repository passano.

Non verificato:

- Il download dentro l’Artifact vero: la pagina è stata provata in locale con un sostituto di `window.claude.use('downloads')`. La conferma di salvataggio la mostra claude.ai e si può provare solo aprendo il link.

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
- Ruote con l’asse in `(±74, ±45)`, raggio esterno 41. Ogni ruota è fatta di due cerchi uguali a fascia (10 mm di larghezza, 3,4 di spessore), uno nel piano X-Z e uno nel piano Y-Z: da ognuno dei quattro lati il carro mostra due ruote affiancate. Le ruote affondano 1,5 mm nella base e nella distesa, così l’unione è robusta.
- Creature in `(±36, ±25)`, dentro il rettangolo delle ruote, ognuna accanto alla propria ruota e rivolta in diagonale verso l’esterno. Nel sistema locale della creatura la faccia d’uomo guarda `+Y` e la destra è `+X`: leone a `+X`, toro a `-X`, aquila a `-Y`.
- Le due ali spiegate di ogni creatura stanno nei piani verticali `x = ±36` e `y = ±25` e le punte si sovrappongono di 1,4 mm con quelle delle vicine: le otto ali formano un rettangolo chiuso attorno al fuoco. Sul lato lungo l’ala è più lunga e meno inclinata; per questo esistono due serie di ali (`aliA`, `aliB`) che si alternano da una creatura all’altra. Le lunghezze sono calcolate in `cherubino.mjs` perché le punte si incontrino; se si sposta una creatura si adattano da sole.
- Quattro braccia sulle diagonali del corpo, una mano per lato (v. 8). Le due ali ripiegate pendono sui fianchi (vv. 11, 23).
- La distesa è una lastra di 204 × 136 × 6 mm con la faccia superiore a faccette irregolari; la faccia inferiore è piatta.
- La figura sul trono è volutamente senza lineamenti (v. 27 e il capitolo 3 del libro _Pura adorazione_: la figura non si distingue nei dettagli). È un nodo a parte (`figura`), che nel visualizzatore si può nascondere.

## Trappole già incontrate

- **`extrude` di Manifold 3.2.1**: passare `1` come `scaleTop` produce un cuneo con metà del volume. Va passato `[1, 1]`.
- **Frammenti dopo le booleane**: restano schegge e cavità chiuse (pezzi di volume negativo in `decompose()`). `clean()` li elimina; le parti da `toSolid()` e `ala()` passano già di lì.
- **`Manifold.levelSet`** vuole valori positivi all’interno; `sdf.mjs` usa la convenzione opposta e inverte il segno in `toSolid()`.
- **`rotate([x, y, z])`** applica X, poi Y, poi Z. Per altri ordini servono chiamate separate.
- **Ogni faccia della testa** è confinata al proprio spicchio di 90° (`wedge` in `testa.mjs`): criniera, corna e orecchie non possono allargarsi oltre le diagonali, altrimenti invadono le facce vicine.
- **Un Artifact non serve file `.stl` o `.glb`** e non può avviare download da solo. Per questo i modelli vengono pubblicati compressi come testo base64 (`*.gz.b64.txt`) e il pulsante «Scarica tutto (ZIP)» costruisce l’archivio nel browser e lo consegna con la capacità `downloads`, che fra le estensioni ammesse ha `.zip` ma non `.stl`. `main.js` sceglie da solo fra file compressi (dentro un Artifact) e file normali (altrove).
- **`wol.jw.org`** è nell’elenco dei domini dell’ambiente `explore` (aggiunto in questa sessione con l’approvazione dell’utente) ma risponde con una verifica anti-bot: non va aggirata. Lo stesso testo, con le note in calce, si legge su `www.jw.org/it/biblioteca-digitale/bibbia/bibbia-per-lo-studio/libri/ezechiele/1/`; i capitoli del libro sono sotto `www.jw.org/it/biblioteca-digitale/libri/pura-adorazione/cieli/`.
- **Testo biblico**: nell’interfaccia i versetti sono riassunti con parole proprie e citati per numero. Non riportare il testo della traduzione per esteso.

## Rifiniture possibili

1. **Facce** (`src/parts/testa.mjs`, vedi `docs/anteprima-facce.png`). Uomo, leone e toro si riconoscono; l’aquila ha il becco ma vista di fronte resta la meno leggibile. Le superfici sono un po’ sfaccettate per via della semplificazione (`toSolid`, tolleranza 0,06): abbassarla migliora l’aspetto e aumenta i triangoli.
2. **Peso dei file.** Il pezzo unico è 13 MB. Dove stanno i triangoli, per singola copia: creatura circa 28.000, ruota circa 25.000 (quasi tutti negli occhi). Leve: tolleranza di `simplify` in `toSolid()`, `quality.edge` in `build.mjs`, numero e segmenti degli occhi in `ruota.mjs`.
3. **Occhi anche sulle creature** (corpo, mani, ali), come in Ezechiele 10:12.
4. **Nell’illustrazione del libro** la lastra sporge molto oltre le ruote e le ruote non la toccano. Nel modello la lastra poggia sulle ruote perché si possa stampare; se l’utente vuole la versione «sospesa» per il solo visualizzatore, si può alzare la distesa nel GLB lasciando invariati gli STL.
5. **GitHub Pages.** Il workflow attuale pubblica il gioco dal branch `claude/funny-allen-d6a9za`: non va toccato senza chiedere all’utente.
