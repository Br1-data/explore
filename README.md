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
    Dio, l'incarico di profeta, il pericolo, la conferma di essere gradito a Dio;
  - **Geova**: non raffigurato; si compiono gli atti che il racconto gli attribuisce:
    affidare l'incarico, dare la forza, confermare, sottrarre Enoc al pericolo;
  - **Matusalemme**: che cosa rivelano i numeri di Genesi 5, sulla linea del tempo;
  - **Uno degli empi**: il loro mondo e il messaggio, dalla parte di chi lo ascoltò.
- **84 dettagli**, ognuno con la sua fonte e un contrassegno che dice quanto è certo:
  *È scritto*, *Dai numeri*, *Lo spiega il libro*, *Sembra che*.
- **Tre modi di giocare**:
  - *indizi* da trovare ed esaminare nella scena;
  - *situazioni di condotta*: scene tipiche del tempo, segnate «Ricostruzione», in cui
    scegli che cosa fare e scopri che cosa fece il personaggio secondo le fonti;
  - *attività sul testo*: ricomporre il messaggio di Enoc, completare i versetti,
    ricostruire le genealogie, classificare, usare la linea del tempo.
- **Quaderno di studio**: dettagli scoperti, riflessioni personali, passi biblici
  e domande del capitolo; si può scaricare o stampare. Resta nel browser.

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

Per lo sviluppo, le decisioni di progetto e come aggiungere i prossimi capitoli,
vedi [`CLAUDE.md`](CLAUDE.md).
