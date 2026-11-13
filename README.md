# In cammino

Avventura 2D di studio sui racconti del libro
[«Cammina coraggiosamente con Dio»](https://www.jw.org/it/biblioteca-digitale/libri/cammina-coraggiosamente-con-dio/).
Si sceglie un capitolo e il personaggio da cui viverlo, Geova compreso, e si
percorre il racconto per notarne i dettagli e immedesimarsi.

**Gioca:** https://br1-data.github.io/explore/ (browser, anche da telefono).

Progetto di studio personale, non ufficiale. Le citazioni bibliche vengono dalla
Traduzione del Nuovo Mondo; il testo del libro non è riprodotto ma riassunto e
collegato all'originale su jw.org.

## Che cosa c'è

- **L'indice completo**: i 54 capitoli del libro, divisi nelle tre parti.
- **Capitolo 1, Enoc**, giocabile da quattro punti di vista:
  - **Enoc**: sei tappe, da un mondo violento ai trecento anni di cammino,
    l'incarico di profeta, la strada affollata, il pericolo, la conferma di
    essere gradito a Dio;
  - **Geova**: non raffigurato; si compiono gli atti che il racconto gli
    attribuisce: affidare l'incarico, dare la forza, confermare, prendere Enoc;
  - **Matusalemme**: gli anni di Genesi 5 percorsi a piedi;
  - **Uno degli empi**: il racconto dalla parte di chi ascoltò il messaggio.
- **77 dettagli**, ognuno con la sua fonte e un contrassegno che dice quanto è
  certo: *È scritto*, *Dai numeri*, *Lo spiega il libro*, *Sembra che*.
- **Attività sul testo**: ricomporre il messaggio di Enoc, trovare le parole che
  ritornano, mettere in ordine gli anni.
- **Quaderno di studio**: dettagli scoperti, riflessioni personali, passi biblici
  e domande del capitolo; si può scaricare o stampare. Resta nel browser.

## Comandi di gioco

| Comando                       | Azione                                   |
| ----------------------------- | ---------------------------------------- |
| ← → oppure A D                | Cammina (o sposta lo sguardo, per Geova) |
| Clic o tocco sulla scena      | Vai in quel punto                        |
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
