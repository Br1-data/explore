import { NOME_GIOCO, type Contesto } from '../contesto';
import { h } from '../dom';

/** Si gioca con un account: i progressi stanno nell’archivio, non nel browser. */
export function schermoAccesso(cx: Contesto, avviso: string | null, entrato: () => void): void {
  cx.schermo.className = 'schermo schermo--inizio';
  const campo = (etichetta: string, attributi: Record<string, unknown>): [HTMLLabelElement, HTMLInputElement] => {
    const input = h('input', { class: 'appunto', required: true, ...attributi });
    return [h('label', null, etichetta, input), input];
  };
  const [etNome, nome] = campo('Nome utente', { name: 'utente', autocomplete: 'username', autocapitalize: 'none', spellcheck: 'false', minlength: 3, maxlength: 30 });
  const [etPassword, password] = campo('Password', { name: 'password', type: 'password', autocomplete: 'current-password', minlength: 4 });
  const messaggio = h('p', { class: 'accesso__avviso', role: 'alert' }, avviso ?? '');
  const entra = h('button', { class: 'bottone bottone--primario bottone--grande', type: 'submit', value: 'entra' }, 'Entra');
  const crea = h('button', { class: 'bottone bottone--grande', type: 'submit', value: 'crea' }, 'Crea un account');
  const modulo = h(
    'form',
    { class: 'inizio accesso' },
    h('p', { class: 'occhiello' }, 'Avventura di studio'),
    h('h1', { class: 'inizio__titolo' }, NOME_GIOCO),
    h('p', { class: 'inizio__testo' }, 'Entra con il tuo account: progressi e appunti si salvano lì e li ritrovi su ogni dispositivo.'),
    h('div', { class: 'accesso__campi' }, etNome, etPassword),
    messaggio,
    h('div', { class: 'inizio__azioni' }, entra, crea),
  );
  modulo.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nuovo = (e.submitter as HTMLButtonElement | null)?.value === 'crea';
    entra.disabled = crea.disabled = true;
    messaggio.textContent = nuovo ? 'Creo il tuo account…' : 'Apro i tuoi progressi…';
    const errore = await cx.salvataggio.entra(nome.value, password.value, nuovo);
    entra.disabled = crea.disabled = false;
    messaggio.textContent = errore ?? '';
    if (!errore) entrato();
  });
  cx.schermo.append(modulo);
}
