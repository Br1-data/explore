# Segnale Remoto — Game Design Document

> Titolo provvisorio. Survival/crafting co-op in 3D low-poly per 2-4 amici, giocabile da browser e da PC con cross-play.

## 1. Visione

L'astronave da ricognizione _Aurora-7_ precipita su **Kepler-Sigma**, un pianeta alieno mai esplorato. L'equipaggio (da 1 a 4 giocatori) sopravvive allo schianto, ma il pianeta è ostile: l'aria non è respirabile, le creature locali sono territoriali e da ovest avanza una **tempesta ionica** che spazza via tutto ciò che incontra.

A est, oltre quattro biomi sempre più pericolosi, i sensori captano un **segnale di soccorso**: un vecchio faro di estrazione che, riattivato, può chiamare una navetta di recupero. L'unica via d'uscita è attraversare il pianeta insieme, accampandosi, costruendo, combattendo e aiutandosi a vicenda.

**Pilastri del design**

1. **Insieme o niente:** chi cade a terra va rianimato dai compagni e la run fallisce solo se cadono tutti. Le risorse si possono passare tra giocatori.
2. **Sempre in movimento:** la tempesta impedisce di restare fermi. Si costruisce un campo, lo si sfrutta e poi si riparte.
3. **Sessioni da serata tra amici:** una run dura 30-60 minuti, con una conclusione chiara (vittoria o sconfitta) e sblocchi permanenti per la volta successiva.
4. **Facile da avviare:** basta un link e un codice stanza, si gioca dal browser senza installare nulla.

## 2. Panoramica

|             |                                                                                  |
| ----------- | -------------------------------------------------------------------------------- |
| Genere      | Survival/crafting co-op, run-based con meta-progressione                         |
| Giocatori   | 1-4 per stanza (pensato per 2-4)                                                 |
| Piattaforme | Browser (Chrome, Edge, Firefox) e PC desktop (Windows, macOS, Linux), cross-play |
| Visuale     | 3D low-poly a flat shading, terza persona                                        |
| Durata run  | 30-60 minuti                                                                     |
| Rete        | Server autoritativo online; stanze con codice di 4 lettere                       |
| Lingua      | Italiano                                                                         |

## 3. Loop di gioco

### 3.1 Loop della run (30-60 min)

```
Schianto ─▶ Esplora il bioma ─▶ Raccogli e crea ─▶ Monta il campo ─▶ Prosegui verso est
               ▲                                                          │
               └──────────────── tempesta alle spalle ◀───────────────────┘
                                         │
                  Crea il Modulo di uplink ─▶ Attiva il faro ─▶ Difendi 120 s ─▶ Estrazione!
```

1. **Schianto:** si parte al relitto dell'_Aurora-7_, dove si trovano molti rottami. Il primo campo si monta qui.
2. **Esplorazione:** il mondo è una lunga valle tortuosa che va da ovest (lo schianto) a est (il segnale). Pareti rocciose ripide delimitano la valle.
3. **Raccolta e crafting:** si colpiscono i nodi con il multi-attrezzo e si creano attrezzi, armi, consumabili e potenziamenti.
4. **Accampamento:** il Faro di campo fa da punto di rinascita e intorno si costruiscono generatore d'ossigeno, banco da lavoro, falò, torrette e barricate.
5. **Tempesta:** dopo 4 minuti di tregua la tempesta ionica avanza verso est. Dentro la tempesta si perde salute rapidamente, e le strutture e le capsule rimaste indietro vengono distrutte.
6. **Uplink:** per riattivare il faro di estrazione serve il **Modulo di uplink**, che richiede i materiali rari di tutti e quattro i biomi. È questo che spinge ad attraversarli tutti davvero.
7. **Estrazione:** attivato il faro parte un conto alla rovescia di 120 s, che avanza solo se almeno un giocatore in piedi resta nel raggio del faro. Nel frattempo ondate di creature attaccano, e a metà arriva il _Colosso del Segnale_. Allo zero la navetta recupera i giocatori: **vittoria**.

**Sconfitta:** la run fallisce se tutti i giocatori sono a terra o morti nello stesso momento, oppure se la tempesta raggiunge il faro di estrazione.

### 3.2 Loop della sessione (meta)

```
Run ─▶ Dati di Ricerca ─▶ Laboratorio (sblocchi permanenti) ─▶ Run successiva più forte/varia
```

## 4. Mondo

### 4.1 Struttura

- La valle si sviluppa lungo l'asse **Z** da circa −100 m (schianto) a 1600 m (segnale a ~1560 m). La sua linea centrale serpeggia lungo X seguendo una curva generata dal seed.
- La larghezza utile è di circa ±150 m dalla linea centrale, oltre la quale le pareti salgono in modo invalicabile.
- Il terreno è una heightmap procedurale (simplex noise con seed diverso a ogni run), suddivisa in chunk da 40 m.
- C'è un ciclo giorno/notte di **8 minuti** (5 di giorno e 3 di notte). Di notte le creature sono più numerose e aggressive e l'aggro arriva più lontano.

### 4.2 Biomi

| #   | Bioma                    | Z         | Pericolo ambientale                               | Risorsa rara | Palette                              |
| --- | ------------------------ | --------- | ------------------------------------------------- | ------------ | ------------------------------------ |
| 1   | **Prateria Cristallina** | 0-400     | nessuno (zona tutorial)                           | Cristalli    | erba turchese, cristalli rosa        |
| 2   | **Giungla Fungina**      | 400-800   | nubi di spore (danno lento)                       | Biogel       | suolo viola, funghi giganti luminosi |
| 3   | **Distese di Vetro**     | 800-1200  | calore diurno (energia ×2)                        | Vetro nero   | sabbia ambra, schegge nere           |
| 4   | **Picchi Ghiacciati**    | 1200-1600 | freddo (danno senza Modulo termico o falò vicino) | Criogel      | neve bianco-azzurra, geodi ciano     |

Ogni bioma ha 3 **Cache dati** da trovare (+Dati di Ricerca) e la densità di creature aumenta da un bioma all'altro.

### 4.3 Nodi del mondo

| Nodo             | Interazione | Resa                               | Biomi                       |
| ---------------- | ----------- | ---------------------------------- | --------------------------- |
| Rottame          | colpire     | Rottami                            | tutti (molti allo schianto) |
| Cristalli        | colpire     | Cristalli                          | 1, 2                        |
| Arbusto fibroso  | colpire     | Fibra                              | 1, 2, 3                     |
| Albero-lancia    | colpire     | Fibra (tanta)                      | 1, 2                        |
| Fungo luminoso   | colpire     | Biogel                             | 2 (raro in 1, 3)            |
| Scaglia di vetro | colpire     | Vetro nero                         | 3                           |
| Geode criogenico | colpire     | Criogel                            | 4                           |
| Cespuglio lumen  | [E]         | Frutto lumen (ricresce in 120 s)   | 1, 2                        |
| Bulbo d'ossigeno | [E]         | +40 O₂ (ricresce in 90 s)          | tutti, più raro avanzando   |
| Cache dati       | [E]         | +5 Dati di Ricerca a tutto il team | tutti                       |

## 5. Personaggio

### 5.1 Statistiche

| Stat         | Max                     | Consumo                            | Ricarica                                                            | A zero                    |
| ------------ | ----------------------- | ---------------------------------- | ------------------------------------------------------------------- | ------------------------- |
| **Salute**   | 100                     | danni, ambiente                    | +1/s se Energia > 50 e nessun danno negli ultimi 5 s; cibo; medikit | a terra                   |
| **Ossigeno** | 100 (150 con Serbatoio) | 0,4/s (×3 nella tempesta)          | Generatore O₂, Bulbo, Cella O₂                                      | −4 salute/s               |
| **Energia**  | 100                     | 0,12/s (×2 correndo, ×2 al calore) | cibo                                                                | −1 salute/s, niente corsa |

### 5.2 Comandi (PC/browser)

| Tasto         | Azione                                                                     |
| ------------- | -------------------------------------------------------------------------- |
| WASD          | muoversi                                                                   |
| Mouse         | camera (pointer lock, clic per catturarla)                                 |
| Spazio        | salto                                                                      |
| Shift         | corsa                                                                      |
| Q             | schivata (0,3 s di invulnerabilità, ricarica di 1,2 s)                     |
| Clic sinistro | usare l'oggetto attivo (colpire/raccogliere, sparare, consumare)           |
| E             | interagire; tenere premuto per rianimare                                   |
| X             | smontare la struttura puntata                                              |
| 1-6 / rotella | selezionare l'oggetto nella hotbar                                         |
| Tab           | inventario e crafting                                                      |
| B             | menu di costruzione (R ruota, clic sinistro conferma, clic destro annulla) |
| Invio         | chat                                                                       |
| Esc           | menu / rilascio del mouse                                                  |

### 5.3 Andare a terra, rianimare, morire

- A 0 di salute si va **a terra**: ci si può solo trascinare lentamente e c'è un timer di 30 s.
- Un compagno vicino (2,5 m) che tiene premuto **E** per 3 s ti rianima con il 30% di salute. Con il perk _Primo soccorso_ bastano 2 s.
- Chi ha un **Medikit** può rianimarsi da solo tenendo premuto E per 5 s, consumandolo.
- Se il timer scade si **muore**: a terra resta una _capsula_ con il 50% delle risorse e si rinasce dopo 10 s all'ultimo Faro di campo ancora in piedi, oppure accanto a un compagno.
- Se tutti sono a terra o morti nello stesso momento, la run è persa.

## 6. Oggetti e crafting

Gli oggetti con ★ richiedono un **Banco da lavoro** entro 8 m; quelli con 🔥 un **Falò** entro 8 m.

### 6.1 Risorse

Rottami, Cristalli, Fibra, Biogel, Vetro nero, Criogel, Carne aliena (cade dalle creature).

### 6.2 Ricette

| Oggetto              | Tipo          | Costo                                                     | Effetto                       |
| -------------------- | ------------- | --------------------------------------------------------- | ----------------------------- |
| Multi-attrezzo       | attrezzo      | (iniziale)                                                | raccolta ×1, danno 10         |
| Multi-attrezzo Mk2 ★ | attrezzo      | 6 Rottami, 4 Cristalli                                    | raccolta ×1,6, danno 16       |
| Multi-attrezzo Mk3 ★ | attrezzo      | 6 Rottami, 4 Vetro nero, 2 Biogel                         | raccolta ×2,4, danno 24       |
| Blaster ★            | arma          | 8 Rottami, 5 Cristalli                                    | 14 danni a distanza, batteria |
| Blaster a fusione ★  | arma          | 6 Rottami, 5 Vetro nero, 2 Criogel                        | 26 danni a distanza           |
| Cella O₂             | consumabile   | 2 Cristalli, 1 Rottame                                    | +50 O₂                        |
| Razione cotta 🔥     | consumabile   | 2 Carne, 1 Fibra                                          | +40 Energia, +10 Salute       |
| Medikit ★            | consumabile   | 2 Biogel, 2 Fibra                                         | +50 Salute, auto-rianimazione |
| Serbatoio esteso ★   | potenziamento | 5 Rottami, 3 Biogel                                       | O₂ massimo +50                |
| Filtro spore         | potenziamento | 4 Fibra, 2 Biogel                                         | immunità alle spore           |
| Modulo termico ★     | potenziamento | 4 Rottami, 3 Vetro nero, 2 Cristalli                      | immunità al freddo            |
| Modulo di uplink ★   | chiave        | 5 Rottami, 3 Cristalli, 3 Biogel, 3 Vetro nero, 3 Criogel | attiva il faro di estrazione  |

Consumabili: Frutto lumen (+18 Energia, +5 Salute) e Carne aliena cruda (+8 Energia).

## 7. Accampamenti

Un **campo** è l'area di 18 m attorno a un _Faro di campo_. Alcune strutture si possono costruire solo dentro un campo.

| Struttura       | Costo                  | Richiede campo | Effetto                                                          |
| --------------- | ---------------------- | -------------- | ---------------------------------------------------------------- |
| Faro di campo   | 4 Rottami, 2 Cristalli | no             | punto di rinascita (vale l'ultimo costruito), definisce il campo |
| Generatore O₂   | 5 Rottami, 3 Cristalli | sì             | +12 O₂/s entro 8 m                                               |
| Banco da lavoro | 6 Rottami, 3 Fibra     | sì             | sblocca le ricette ★ entro 8 m                                   |
| Falò            | 4 Fibra                | no             | calore e luce entro 8 m, ricette 🔥                              |
| Torretta        | 8 Rottami, 4 Cristalli | sì             | spara alle creature entro 16 m                                   |
| Barricata       | 2 Rottami, 2 Fibra     | no             | blocca il passaggio, 150 PS                                      |

- **Piazzamento:** un'anteprima fantasma segue il terreno davanti al giocatore; è verde se la posizione è valida e rossa se non lo è.
- **Smontaggio:** puntando una struttura e premendo X si recupera il 75% dei materiali.
- Le strutture raggiunte dalla tempesta vengono distrutte.

## 8. Creature

| Creatura                | Bioma      | Comportamento                  | PS  | Danno | Bottino            |
| ----------------------- | ---------- | ------------------------------ | --- | ----- | ------------------ |
| Saltaspore              | 1, 2       | passiva, fugge                 | 30  | —     | Carne              |
| Granchio cristallo      | 1          | neutrale (reagisce se colpito) | 60  | 8     | Cristalli, Carne   |
| Lurker fungino          | 2          | ostile, mischia                | 70  | 12    | Biogel, Carne      |
| Sporello                | 2          | ostile, veloce, in gruppo      | 25  | 5     | Biogel             |
| Scorpione di vetro      | 3          | ostile, mischia corazzata      | 110 | 16    | Vetro nero, Carne  |
| Sputavetro              | 3          | ostile, a distanza             | 60  | 10    | Vetro nero, Biogel |
| Brinatore               | 4          | ostile, grande                 | 160 | 20    | Criogel, Carne     |
| Ala di brina            | 4          | ostile, volante                | 50  | 9     | Criogel            |
| **Colosso del Segnale** | estrazione | boss                           | 900 | 30    | —                  |

L'IA è a stati (vagare → inseguire → attaccare → fuggire) e gira sul server. Le creature compaiono a 60-100 m dai giocatori e spariscono oltre i 150 m. Di notte la popolazione è ×1,5 e l'aggro ×1,5.

## 9. Meta-progressione: il Laboratorio

A fine run ogni giocatore riceve **Dati di Ricerca (DR)**:

| Fonte                               | DR          |
| ----------------------------------- | ----------- |
| Ogni bioma raggiunto oltre il primo | +10         |
| Ogni 2 creature uccise dal team     | +1          |
| Cache dati trovate (team)           | +5 ciascuna |
| Vittoria                            | +50         |

I DR si spendono nel **Laboratorio** (menu principale) per sbloccare in modo permanente:

| Sblocco           | Costo    | Effetto                           |
| ----------------- | -------- | --------------------------------- |
| Polmoni d'acciaio | 30       | O₂ massimo +25                    |
| Mani esperte      | 30       | raccolta +25%                     |
| Scorta iniziale   | 25       | si parte con 10 Rottami e 5 Fibra |
| Corazza leggera   | 40       | Salute massima +15                |
| Metabolismo lento | 40       | consumo di Energia −25%           |
| Primo soccorso    | 35       | rianimazione in 2 s               |
| Ingegnere         | 60       | strutture −25% del costo          |
| Blaster di serie  | 80       | si parte con il Blaster           |
| Colori tuta       | 10 l'uno | cosmetico                         |

I profili si salvano sul server, identificati da un token generato dal browser.

## 10. Multiplayer

- Il **server autoritativo** è Node.js con WebSocket e gira a 20 tick/s. I client inviano solo input e azioni.
- **Predizione lato client:** il movimento del proprio personaggio è simulato in locale con la stessa funzione del server (`stepPlayer`, nel pacchetto `shared`) e riconciliato a ogni snapshot.
- **Interpolazione:** gli altri giocatori e le creature vengono disegnati con 100 ms di ritardo, interpolando tra due snapshot.
- **Mondo deterministico:** terreno e nodi derivano dal seed della run, quindi il server invia solo le _variazioni_ (nodi esauriti, strutture, capsule).
- **Stanze:** codice di 4 lettere oppure link `?room=CODE`. Si entra anche a run in corso, fino a 4 giocatori. Chi si disconnette può rientrare entro 60 s con lo stesso token e ritrovare il proprio personaggio.
- **Cross-play:** l'app desktop (Electron) usa lo stesso client e lo stesso server della versione browser.

## 11. Direzione artistica e audio

- **Low-poly a flat shading** con colori per vertice e nessuna texture: tutte le mesh sono generate da codice.
- Nel cielo c'è un gigante gassoso con anelli, il sole è pallido e di notte compaiono due lune e le stelle. La nebbia ha il colore dell'orizzonte.
- Gli astronauti hanno tute colorate (arancione di base), visore riflettente e bombole sulla schiena.
- La tempesta è un muro viola traslucido animato, con lampi.
- Gli effetti sonori sono procedurali (sintesi tipo zzfx) e non servono file audio.

## 12. Architettura tecnica (sintesi)

```
packages/shared   dati di gioco, generazione del mondo, fisica del movimento, protocollo
packages/server   Node + ws: stanze, simulazione, IA, profili (SQLite)
packages/client   Vite + Three.js: rendering, input, UI DOM, netcode client
apps/desktop      wrapper Electron (Windows/macOS/Linux)
```

## 13. Fuori scope (per ora)

Console, mobile touch, voice chat (si usa Discord), mondo persistente tra sessioni, PvP.
