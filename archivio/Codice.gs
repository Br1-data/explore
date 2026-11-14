/**
 * Archivio dei salvataggi di «Nei loro panni» (Google Apps Script).
 *
 * Ogni utente è un file JSON nella cartella «Nei loro panni - salvataggi» del Drive di
 * chi pubblica lo script. La password non si conserva: solo la sua impronta (SHA-256
 * con sale). Come pubblicarlo: README, sezione «Salvataggi».
 *
 * Richieste (POST, corpo JSON in testo semplice):
 *   { azione: 'registra', utente, password, dati }   → { ok, chiave, dati }
 *   { azione: 'entra', utente, password | chiave }    → { ok, chiave, dati }
 *   { azione: 'salva', utente, chiave, dati }         → { ok }
 * Se qualcosa non va: { ok: false, errore }.
 */

function doPost(e) {
  let risposta;
  try {
    risposta = esegui(JSON.parse(e.postData.contents));
  } catch (err) {
    risposta = { ok: false, errore: 'L’archivio non ha capito la richiesta: riprova.' };
  }
  return ContentService.createTextOutput(JSON.stringify(risposta)).setMimeType(ContentService.MimeType.JSON);
}

function esegui(r) {
  const nome = String(r.utente || '').trim().toLowerCase();
  if (!/^[a-z0-9._-]{3,30}$/.test(nome)) {
    return { ok: false, errore: 'Il nome utente va da 3 a 30 caratteri: lettere, numeri, punto o trattino, senza spazi.' };
  }
  if (r.dati !== undefined && JSON.stringify(r.dati).length > 500000) {
    return { ok: false, errore: 'Salvataggio troppo grande.' };
  }
  // ponytail: un solo blocco per tutte le richieste; basta finché chi gioca insieme è poco.
  const blocco = LockService.getScriptLock();
  blocco.waitLock(20000);
  try {
    const cartella = cartellaSalvataggi();
    const trovati = cartella.getFilesByName(nome + '.json');
    const file = trovati.hasNext() ? trovati.next() : null;

    if (r.azione === 'registra') {
      if (file) return { ok: false, errore: 'Questo nome utente è già preso: scegline un altro.' };
      if (String(r.password || '').length < 4) return { ok: false, errore: 'La password deve avere almeno 4 caratteri.' };
      const sale = Utilities.getUuid();
      const u = { sale: sale, impronta: impronta(sale, r.password), chiave: Utilities.getUuid(), dati: r.dati || null };
      cartella.createFile(nome + '.json', JSON.stringify(u), 'application/json');
      return { ok: true, chiave: u.chiave, dati: u.dati };
    }

    const u = file ? JSON.parse(file.getBlob().getDataAsString()) : null;
    const valido = u && (r.chiave ? r.chiave === u.chiave : impronta(u.sale, r.password) === u.impronta);
    if (!valido) {
      return { ok: false, errore: r.chiave ? 'Accesso scaduto: entra di nuovo.' : 'Nome utente o password sbagliati.' };
    }
    if (r.azione === 'entra') return { ok: true, chiave: u.chiave, dati: u.dati };
    if (r.azione === 'salva') {
      u.dati = r.dati;
      u.aggiornato = new Date().toISOString();
      file.setContent(JSON.stringify(u));
      return { ok: true };
    }
    return { ok: false, errore: 'Azione sconosciuta.' };
  } finally {
    blocco.releaseLock();
  }
}

function impronta(sale, password) {
  const byte = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, sale + String(password || ''), Utilities.Charset.UTF_8);
  return Utilities.base64Encode(byte);
}

function cartellaSalvataggi() {
  const prop = PropertiesService.getScriptProperties();
  const id = prop.getProperty('cartella');
  if (id) return DriveApp.getFolderById(id);
  const cartella = DriveApp.createFolder('Nei loro panni - salvataggi');
  prop.setProperty('cartella', cartella.getId());
  return cartella;
}
