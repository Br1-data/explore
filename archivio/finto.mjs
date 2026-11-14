// Esegue Codice.gs in Node con un Google finto (Drive in memoria): per i test e per
// la prova dal vero, che così usa il vero codice dell'archivio senza toccare Google.
import { createHash, randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';

export function archivioFinto() {
  const file = new Map();
  const voce = (nome) => ({
    getBlob: () => ({ getDataAsString: () => file.get(nome) }),
    setContent: (testo) => file.set(nome, testo),
  });
  const cartella = {
    getId: () => 'cartella',
    getFilesByName: (nome) => {
      const trovati = file.has(nome) ? [voce(nome)] : [];
      return { hasNext: () => trovati.length > 0, next: () => trovati.shift() };
    },
    createFile: (nome, testo) => file.set(nome, testo),
  };
  const proprieta = new Map();
  const google = {
    ContentService: { MimeType: { JSON: 'json' }, createTextOutput: (testo) => ({ setMimeType: () => testo }) },
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
    PropertiesService: {
      getScriptProperties: () => ({ getProperty: (k) => proprieta.get(k) ?? null, setProperty: (k, v) => proprieta.set(k, v) }),
    },
    DriveApp: { createFolder: () => cartella, getFolderById: () => cartella },
    Utilities: {
      getUuid: randomUUID,
      DigestAlgorithm: { SHA_256: 'sha256' },
      Charset: { UTF_8: 'utf8' },
      computeDigest: (_algoritmo, testo) => createHash('sha256').update(testo, 'utf8').digest(),
      base64Encode: (byte) => Buffer.from(byte).toString('base64'),
    },
  };
  const codice = readFileSync(new URL('./Codice.gs', import.meta.url), 'utf8');
  const doPost = new Function(...Object.keys(google), `${codice}\nreturn doPost;`)(...Object.values(google));
  return {
    /** I file salvati, per nome (`<utente>.json`). */
    file,
    /** Come una richiesta POST all'app web: testo in entrata, testo JSON in uscita. */
    richiesta: (corpo) => doPost({ postData: { contents: corpo } }),
  };
}
