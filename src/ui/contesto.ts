import type { Suono } from '@/motore/suono';
import type { Salvataggio } from '@/salvataggio';

export const NOME_GIOCO = 'Nei loro panni';

/**
 * Ciò che l’app offre a schermate e pannelli (ui/schermate, ui/pannelli.ts): così
 * ognuno sta nel suo file e una schermata nuova non tocca le altre.
 */
export interface Contesto {
  readonly salvataggio: Salvataggio;
  readonly suono: Suono;
  /** Dove si montano le schermate di pagina (svuotato a ogni cambio di schermata). */
  readonly schermo: HTMLElement;
  /** Il contenitore del gioco (nascosto fuori dal racconto). */
  readonly gioco: HTMLElement;
  /** Lo strato dei pannelli sovrapposti. */
  readonly strato: HTMLElement;
  /** Va a un indirizzo (vedi indirizzi.ts); se è quello attuale, ridisegna la schermata. */
  vai(percorso: string): void;
  apriStrato(pannello: HTMLElement): void;
  chiudiStrato(): void;
  /** Una pulizia da fare quando si lascia la schermata. */
  allUscita(f: () => void): void;
  /** Ridimensiona una tela quando cambia la sua misura, finché si resta nella schermata. */
  osservaTela(tela: HTMLCanvasElement, adatta: () => void): void;
}
