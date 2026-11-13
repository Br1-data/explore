type Figlio = Node | string | number | null | undefined | false;

/** Crea un elemento: `h('button', { class: 'x', onclick: f }, 'Testo')`. */
export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attributi?: Record<string, unknown> | null,
  ...figli: (Figlio | Figlio[])[]
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [nome, valore] of Object.entries(attributi ?? {})) {
    if (valore === null || valore === undefined || valore === false) continue;
    if (nome.startsWith('on') && typeof valore === 'function') {
      el.addEventListener(nome.slice(2), valore as EventListener);
    } else if (nome === 'class') {
      el.className = String(valore);
    } else if (valore === true) {
      el.setAttribute(nome, '');
    } else {
      el.setAttribute(nome, String(valore));
    }
  }
  for (const f of figli.flat()) {
    if (f === null || f === undefined || f === false) continue;
    el.append(f instanceof Node ? f : String(f));
  }
  return el;
}

export function svuota(el: Element): void {
  while (el.firstChild) el.removeChild(el.firstChild);
}

/** Collegamento esterno, sempre in una nuova scheda. */
export function esterno(testo: string, url: string, classe?: string): HTMLAnchorElement {
  return h('a', { href: url, target: '_blank', rel: 'noopener noreferrer', class: classe }, testo);
}

/** Mescola in modo stabile: stesso seme, stesso ordine (mai quello di partenza se evitabile). */
export function mescolaStabile<T>(voci: T[], seme: string): T[] {
  let n = 2166136261;
  for (const c of seme) n = Math.imul(n ^ c.charCodeAt(0), 16777619);
  const r = (): number => {
    n = Math.imul(n ^ (n >>> 15), 2246822507);
    n = Math.imul(n ^ (n >>> 13), 3266489909);
    return ((n ^= n >>> 16) >>> 0) / 4294967296;
  };
  const a = voci.map((v, i) => ({ v, i }));
  for (let giro = 0; giro < 4; giro++) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    if (a.length < 2 || a.some((x, i) => x.i !== i)) break;
  }
  return a.map((x) => x.v);
}

const ICONE: Record<string, string> = {
  quaderno: 'M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3Zm0 13a3 3 0 0 1 3-3h11M9 8h6',
  audio: 'M4 10v4h3l5 4V6L7 10Zm12-1a4 4 0 0 1 0 6m2.5-9a8 8 0 0 1 0 12',
  muto: 'M4 10v4h3l5 4V6L7 10Zm12 0 5 5m0-5-5 5',
};

/** Piccola icona al tratto, nel colore del testo. */
export function icona(nome: string): SVGSVGElement {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.8');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  const tratto = document.createElementNS(ns, 'path');
  tratto.setAttribute('d', ICONE[nome] ?? '');
  svg.append(tratto);
  return svg;
}
