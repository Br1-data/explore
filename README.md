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
- **Capitolo 17, Iael**, giocabile da sei punti di vista:
  - **Iael**: da che parte sta ciascuno, che cosa fare quando Sisera arriva alla sua
    tenda, il coraggio di agire da sola, il canto che la chiama benedetta;
  - **Geova**: non raffigurato; risponde al grido del popolo, getta nello scompiglio
    l’esercito di Sisera presso le acque di Meghiddo, lo consegna nelle mani di una donna;
  - **Sisera**: il nemico che contava sui suoi carri e sulle alleanze;
  - **Barac**: l’inseguimento e la profezia di Debora che si adempie;
  - **Debora**: il canto di vittoria, le tribù, la lode a Iael senza invidia;
  - **La madre di Sisera**: l’attesa vana alla finestra, come la descrive il canto.
- **141 dettagli** (84 + 57), ognuno con la sua fonte e un contrassegno che dice quanto
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
