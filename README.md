# Nei loro panni

Avventura 2D di studio sui racconti del libro
[«Cammina coraggiosamente con Dio»](https://www.jw.org/it/biblioteca-digitale/libri/cammina-coraggiosamente-con-dio/).
Si sceglie un capitolo e il personaggio nei cui panni viverlo, Geova compreso: si
indagano le scene, si sceglie come comportarsi, si lavora sul testo biblico.

**Gioca:** https://br1-data.github.io/explore/ (browser, anche da telefono).

Progetto di studio personale, non ufficiale. Le citazioni bibliche vengono dalla
Traduzione del Nuovo Mondo; il testo del libro non è riprodotto ma riassunto e
collegato all'originale su jw.org.

## Che cosa c'è

- **L'indice completo**: i 54 capitoli del libro, divisi nelle tre parti.
- **Capitolo 1, Enoc**, giocabile da quattro punti di vista, ognuno con i suoi dettagli:
  - **Enoc**: la sua condotta in un mondo violento, che cosa voleva dire camminare con
    Dio, l’incarico di profeta, il pericolo, la conferma di essere gradito a Dio;
  - **Geova**: non raffigurato; si compiono gli atti che il racconto gli attribuisce:
    affidare l’incarico, dare la forza, confermare, sottrarre Enoc al pericolo;
  - **Matusalemme**: che cosa rivelano i numeri di Genesi 5, sulla linea del tempo;
  - **Uno degli empi**: il loro mondo e il messaggio, dalla parte di chi lo ascoltò.
- **Capitolo 2, Noè** (Genesi 6:1–8:22; 9:8-19; Ebrei 11:7; 2 Pietro 2:5), da cinque punti di vista:
  Noè (integro in un mondo violento, costruttore e predicatore), Geova (il giudizio, il tempo
  stabilito, la porta chiusa prima della pioggia, l’acqua che sale e solleva l’arca, il patto
  dell’arcobaleno), la moglie di Noè (porta nell’arca le provviste e il foraggio, gli
  scherni), uno dei figli (raccoglie il legname, chiude il fasciame, stende il catrame; le
  date del diluvio) e uno dei contemporanei (il mondo che non si accorse di nulla). Noè, la
  moglie e il figlio vivono anche l’anno nell’arca, in scene interne dichiarate come
  ricostruzioni (La Torre di Guardia 15/11/2001 e 1/8/2013, Perspicacia «Arca»).
- **Capitolo 16, Barac e Debora** (Giudici 4:1-16, 23, 24; 5:1-23), da cinque punti di vista:
  - **Debora**: profetessa e giudice sotto la palma, il comando di Geova trasmesso a
    Barac, «Verrò senz’altro», il segnale sul Tabor, il canto e le tribù;
  - **Barac**: la condizione posta a Debora (fede, non debolezza), il Tabor, la scelta
    di scendere nella pianura, l’inseguimento;
  - **Geova**: non raffigurato; risponde al grido del popolo, comanda tramite Debora,
    va davanti a Barac, getta nello scompiglio l’esercito di Sisera;
  - **Uno dei 10.000**: il paese oppresso, la chiamata a offrirsi, la battaglia sotto
    la pioggia;
  - **Sisera**: il nemico che contava sui suoi carri, fino alla disfatta.
- **Capitolo 17, Iael** (Giudici 4:17-22; 5:24-31), da sei punti di vista:
  - **Iael**: da che parte sta ciascuno, che cosa fare quando Sisera arriva alla sua
    tenda, il coraggio di agire da sola, il canto che la chiama benedetta;
  - **Geova**: non raffigurato; consegna Sisera nelle mani di una donna e ispira il canto;
  - **Sisera**: la fuga e il rifugio in cui credeva di essere al sicuro;
  - **Barac**: arriva alla tenda e vede adempiersi la profezia di Debora;
  - **Debora**: la lode a Iael, senza invidia;
  - **La madre di Sisera**: l’attesa vana alla finestra, come la descrive il canto.
- **Capitolo 18, Gedeone** (Giudici 6:1–7:22; 8:4-23, 28), da cinque punti di vista: Gedeone
  (il grano nel torchio, l’altare di Baal di notte, il rifiuto di regnare), Geova (il profeta,
  i segni, i 300, il sogno), Ioas (il padre che lo difese), uno dei 300 (Harod, corni giare e
  torce, l’inseguimento) e un soldato madianita (il sogno del pane d’orzo).
- **229 dettagli** (84 + 40 + 46 + 34 + 25), ognuno con la sua fonte e un contrassegno che dice quanto
  è certo: *È scritto*, *Dai numeri*, *Lo spiega il libro*, *Sembra che*.
- **Tre modi di giocare**:
  - *indizi* da trovare ed esaminare nella scena;
  - *situazioni di condotta*: momenti del racconto, o scene tipiche del tempo segnate
    «Ricostruzione», in cui scegli che cosa fare e scopri che cosa fece il personaggio
    secondo le fonti;
  - *attività sul testo*: ricomporre il messaggio di Enoc, completare i versetti,
    ricostruire le genealogie, classificare, usare la linea del tempo.
- **Quaderno di studio**: dettagli scoperti, riflessioni personali, passi biblici
  e domande del capitolo; si può scaricare o stampare. Si salva nell’account.
- **Account obbligatorio** (nome utente e password): progressi e quaderno stanno
  nell’archivio dei salvataggi, non nel browser, e si ritrovano su ogni dispositivo.

## Comandi di gioco

| Comando                       | Azione                                   |
| ----------------------------- | ---------------------------------------- |
| ← → oppure A D                | Muoviti (o sposta lo sguardo, per Geova) |
| Clic o tocco sulla scena      | Vai lì; su un segnale o un indizio, aprilo |
| E, Invio, Spazio              | Interagisci, continua                    |
| Q                             | Quaderno di studio                       |
| Esc                           | Chiudi o metti in pausa                  |

Sul telefono compaiono i pulsanti ‹ › in basso.

## Sviluppo

Richiede Node.js 20 o successivo.

```bash
npm install
npm run dev        # http://localhost:5173
npm run check      # controllo dei tipi e test dei contenuti
npm run build      # sito statico in dist/
npm run e2e        # gioca tutti i percorsi in Chromium (dopo la build)
```

## Salvataggi

L’archivio è uno script Google (`archivio/Codice.gs`) che tiene un file JSON per
utente in una cartella del Drive di chi lo pubblica; delle password conserva solo
un’impronta. Per pubblicarlo:

1. Su [script.google.com](https://script.google.com) crea un **Nuovo progetto**
   (per esempio «Nei loro panni – archivio»).
2. Sostituisci il contenuto di `Codice.gs` con quello di `archivio/Codice.gs` e salva.
3. **Distribuisci → Nuovo deployment**, tipo **App web**: «Esegui come» **Io**,
   «Chi ha accesso» **Chiunque**. Premi **Distribuisci**.
4. Autorizza con il tuo account. Google avvisa che l’app non è verificata (è tua):
   **Avanzate → Vai a … (non sicuro) → Consenti**. Serve Drive per creare la
   cartella «Nei loro panni - salvataggi».
5. Copia l’**URL dell’app web** (finisce con `/exec`) in `URL_ARCHIVIO`, in
   `src/salvataggio.ts`.

Per aggiornare lo script senza cambiare indirizzo: **Distribuisci → Gestisci
deployment → modifica → Versione: nuova versione**. I salvataggi si vedono (e si
possono cancellare) nella cartella su Drive: un file `<nome utente>.json` per utente.

Per lo sviluppo, le decisioni di progetto e come aggiungere i prossimi capitoli,
vedi [`CLAUDE.md`](CLAUDE.md).
