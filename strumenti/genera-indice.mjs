// Rigenera src/pubblicazioni/coraggio/indice.ts dall'indice del libro su jw.org.
//
// Uso:
//   curl -L -o indice.html "https://www.jw.org/it/biblioteca-digitale/libri/cammina-coraggiosamente-con-dio/"
//   node strumenti/genera-indice.mjs indice.html src/pubblicazioni/coraggio/indice.ts
//
// Dalla pagina prende solo gli indirizzi dei capitoli; nomi e titoli sono scritti qui sotto.
import { readFileSync, writeFileSync } from 'node:fs';

const [, , ingresso, uscita] = process.argv;
const BASE = '/it/biblioteca-digitale/libri/cammina-coraggiosamente-con-dio/';

const PARTI = [
  {
    numero: 1,
    titolo: 'Dal tempo dei patriarchi a quello dei giudici',
    periodo: 'Circa 2.200 anni, da Enoc a Samuele',
    capitoli: [
      ['Enoc', 'Camminò con Dio'],
      ['Noè', 'Condannò il mondo'],
      ['Sara', 'Non si guardò indietro'],
      ['Abraamo', 'Il primo uomo che combatté una guerra di Geova'],
      ['Abraamo', 'Affrontò la sua prova più grande'],
      ['Rebecca', 'Lasciò le sue certezze'],
      ['Giacobbe', 'Con coraggio protesse la sua famiglia'],
      ['Giuseppe', 'Non cedette alla tentazione'],
      ['Sifra, Pua, Amram, Iochebed e Miriam', '“Per fede Mosè [...] fu nascosto”'],
      ['Mosè', 'Fece la scelta giusta'],
      ['Mosè', '“Va’ dal faraone”'],
      ['Caleb', 'Rimase leale al suo Dio'],
      ['Giosuè', 'Seguì istruzioni insolite'],
      ['Raab', 'Si schierò dalla parte di Geova'],
      ['Naomi e Rut', 'Affrontarono insieme le difficoltà'],
      ['Barac e Debora', '“Verrò senz’altro”'],
      ['Iael', '“Benedetta fra le donne”'],
      ['Gedeone', 'Coraggioso e cauto'],
      ['Iefte e sua figlia', 'Tennero fede a un voto con spirito di sacrificio'],
      ['Sansone', 'Ritrovò il coraggio in un momento difficile'],
      ['Samuele', 'Trasmise con coraggio un messaggio di Geova'],
    ],
  },
  {
    numero: 2,
    titolo: 'Dal periodo dei re alla ricostruzione di Gerusalemme',
    periodo: 'Da Gionatan alla ricostruzione di Gerusalemme',
    capitoli: [
      ['Gionatan', 'Ebbe bisogno di coraggio per mostrare lealtà'],
      ['Davide', 'Affrontò un gigante'],
      ['Abigail', 'Intervenne in una situazione delicata'],
      ['Davide', 'Ebbe il coraggio di fare ciò che è giusto'],
      ['Natan', 'Corresse un re'],
      ['Mefiboset', 'Le difficoltà non lo inasprirono'],
      ['Asa', 'Completamente devoto a Geova “per tutta la sua vita”'],
      ['Elia', '“Il mio Dio è Geova”'],
      ['La vedova di Sarepta', 'Mostrò coraggio in una situazione disperata'],
      ['La ragazzina israelita', 'Parlò del suo Dio in un paese straniero'],
      ['Eliseo', '“O Geova, ti prego, apri i suoi occhi”'],
      ['Ieoiada', 'Protesse il legittimo erede al trono'],
      ['Ezechia', '“Si tenne stretto a Geova”'],
      ['Manasse', 'Ebbe il coraggio di cambiare'],
      ['Giosia', 'Aiutò il popolo a tornare da Geova'],
      ['Daniele', '“Non si sarebbe contaminato”'],
      ['I tre ebrei', '“Spensero la violenza del fuoco”'],
      ['Ester', '“Se dovrò morire, morirò”'],
      ['Neemia', 'Ricostruì le mura'],
    ],
  },
  {
    numero: 3,
    titolo: 'Ai giorni del Messia e dei suoi discepoli',
    periodo: 'Il I secolo, da Zaccaria ed Elisabetta all’apostolo Giovanni',
    capitoli: [
      ['Zaccaria ed Elisabetta', '“Giusti agli occhi di Dio”'],
      ['Maria', 'Ebbe il coraggio di dire di sì'],
      ['Giuseppe', 'Fu un marito e un padre coraggioso'],
      ['Giovanni Battista', '“Non c’è nessuno maggiore di [lui]”'],
      ['Pietro', '“Sono un peccatore”'],
      ['Maria Maddalena', '“Ho visto il Signore!”'],
      ['Maria, sorella di Lazzaro', '“Ha fatto quello che poteva”'],
      ['Stefano', 'Un “uomo pieno di fede e spirito santo”'],
      ['Pietro', 'Diventò una roccia'],
      ['Saulo di Tarso', 'Cambiò radicalmente'],
      ['Barnaba', '“Figlio di conforto”'],
      ['Marco', '“Mi è utile nel ministero”'],
      ['Paolo', '“Ora vi esorto a farvi coraggio”'],
      ['L’apostolo Giovanni', 'Ebbe coraggio in tempi bui'],
    ],
  },
];

const html = readFileSync(ingresso, 'utf8');
const main = /<main\b[\s\S]*?<\/main>/.exec(html)?.[0] ?? html;
const visti = new Set();
const indirizzi = [];
for (const m of main.matchAll(/<a\b[^>]*href="([^"#]+)"/g)) {
  const href = m[1].replace(/&amp;/g, '&');
  if (!href.startsWith(BASE)) continue;
  const resto = href.slice(BASE.length).split('/').filter(Boolean);
  if (resto.length !== 2 || resto[1].startsWith('linea-tempo')) continue;
  if (visti.has(href)) continue;
  visti.add(href);
  indirizzi.push(href);
}
if (indirizzi.length !== 54) {
  console.error(`Attesi 54 capitoli, trovati ${indirizzi.length}`);
  console.error(indirizzi.join('\n'));
  process.exit(1);
}

const righe = [];
righe.push("import type { ParteIndice } from '@/contenuti/tipi';", '');
righe.push(
  '/**',
  ' * Indice del libro «Cammina coraggiosamente con Dio» (54 capitoli in 3 parti).',
  ' * Solo numeri, nomi e titoli dei capitoli, con il collegamento al testo su jw.org.',
  ' */',
);
righe.push("export const URL_LIBRO = 'https://www.jw.org/it/biblioteca-digitale/libri/cammina-coraggiosamente-con-dio/';", '');
righe.push('export const PARTI: ParteIndice[] = [');
let n = 0;
for (const p of PARTI) {
  righe.push('  {', `    numero: ${p.numero},`, `    titolo: ${JSON.stringify(p.titolo)},`, `    periodo: ${JSON.stringify(p.periodo)},`, '    capitoli: [');
  for (const [nome, titolo] of p.capitoli) {
    const url = `https://www.jw.org${indirizzi[n]}`;
    n++;
    righe.push(`      { numero: ${n}, nome: ${JSON.stringify(nome)}, titolo: ${JSON.stringify(titolo)}, url: ${JSON.stringify(url)} },`);
  }
  righe.push('    ],', '  },');
}
righe.push('];', '', 'export const TOTALE_CAPITOLI = PARTI.reduce((n, p) => n + p.capitoli.length, 0);', '');
writeFileSync(uscita, righe.join('\n'), 'utf8');

// Riepilogo per un controllo a vista: numero, nome e ultima parte dell'indirizzo.
n = 0;
for (const p of PARTI) for (const [nome] of p.capitoli) console.log(String(n + 1).padStart(2), nome.padEnd(38), decodeURIComponent(indirizzi[n++].split('/').filter(Boolean).pop()));
