export type ItemKind = 'resource' | 'tool' | 'weapon' | 'consumable' | 'upgrade' | 'key';

export interface ToolStats {
  /** Multiplier applied to node damage. */
  gather: number;
  /** Damage to creatures. */
  damage: number;
  /** Seconds between swings. */
  cooldown: number;
  range: number;
}

export interface WeaponStats {
  damage: number;
  cooldown: number;
  range: number;
  /** Battery spent per shot (battery is 0..100 and recharges over time). */
  cost: number;
}

export interface ConsumableStats {
  energy?: number;
  hp?: number;
  o2?: number;
}

export interface ItemDef {
  id: string;
  name: string;
  kind: ItemKind;
  desc: string;
  /** UI glyph and colour (no emoji, so it renders on every platform). */
  glyph: string;
  color: string;
  tier?: number;
  tool?: ToolStats;
  weapon?: WeaponStats;
  consumable?: ConsumableStats;
}

const defs: ItemDef[] = [
  {
    id: 'scrap',
    name: 'Rottami',
    kind: 'resource',
    desc: 'Lamiere e cavi dal relitto.',
    glyph: '▣',
    color: '#9aa4ad',
  },
  {
    id: 'crystal',
    name: 'Cristalli',
    kind: 'resource',
    desc: 'Cristalli rosa che vibrano.',
    glyph: '◆',
    color: '#ff7ad9',
  },
  {
    id: 'fiber',
    name: 'Fibra',
    kind: 'resource',
    desc: 'Fibra vegetale resistente.',
    glyph: '≋',
    color: '#8fdc6a',
  },
  {
    id: 'biogel',
    name: 'Biogel',
    kind: 'resource',
    desc: 'Gel luminoso dei funghi.',
    glyph: '●',
    color: '#ffb340',
  },
  {
    id: 'obsidian',
    name: 'Vetro nero',
    kind: 'resource',
    desc: 'Schegge di vetro vulcanico.',
    glyph: '▲',
    color: '#6a5acd',
  },
  {
    id: 'cryo',
    name: 'Criogel',
    kind: 'resource',
    desc: 'Ghiaccio che non si scioglie.',
    glyph: '❄',
    color: '#7fe8ff',
  },
  {
    id: 'meat',
    name: 'Carne aliena',
    kind: 'consumable',
    desc: 'Commestibile... più o meno. Meglio cotta.',
    glyph: '◖',
    color: '#d9546b',
    consumable: { energy: 8 },
  },
  {
    id: 'fruit',
    name: 'Frutto lumen',
    kind: 'consumable',
    desc: 'Dolce e luminoso.',
    glyph: '❀',
    color: '#ffe66d',
    consumable: { energy: 18, hp: 5 },
  },
  {
    id: 'ration',
    name: 'Razione cotta',
    kind: 'consumable',
    desc: 'Un pasto vero.',
    glyph: '◉',
    color: '#e8a15c',
    consumable: { energy: 40, hp: 10 },
  },
  {
    id: 'medkit',
    name: 'Medikit',
    kind: 'consumable',
    desc: 'Cura 50. Da a terra: tieni premuto E per rialzarti.',
    glyph: '✚',
    color: '#ff5a5a',
    consumable: { hp: 50 },
  },
  {
    id: 'oxycell',
    name: 'Cella O₂',
    kind: 'consumable',
    desc: 'Ricarica 50 di ossigeno.',
    glyph: 'O₂',
    color: '#5ad1ff',
    consumable: { o2: 50 },
  },
  {
    id: 'tool1',
    name: 'Multi-attrezzo',
    kind: 'tool',
    desc: 'Taglia, scava, colpisce.',
    glyph: '⚒',
    color: '#c9d1d9',
    tier: 1,
    tool: { gather: 1, damage: 10, cooldown: 0.5, range: 2.8 },
  },
  {
    id: 'tool2',
    name: 'Multi-attrezzo Mk2',
    kind: 'tool',
    desc: 'Lama al cristallo.',
    glyph: '⚒',
    color: '#ff9be6',
    tier: 2,
    tool: { gather: 1.6, damage: 16, cooldown: 0.44, range: 3 },
  },
  {
    id: 'tool3',
    name: 'Multi-attrezzo Mk3',
    kind: 'tool',
    desc: 'Filo di vetro nero.',
    glyph: '⚒',
    color: '#a99bff',
    tier: 3,
    tool: { gather: 2.4, damage: 24, cooldown: 0.38, range: 3.2 },
  },
  {
    id: 'blaster',
    name: 'Blaster',
    kind: 'weapon',
    desc: 'Arma a energia. La batteria si ricarica da sola.',
    glyph: '⌁',
    color: '#5af0b4',
    tier: 1,
    weapon: { damage: 14, cooldown: 0.35, range: 60, cost: 9 },
  },
  {
    id: 'blaster2',
    name: 'Blaster a fusione',
    kind: 'weapon',
    desc: 'Colpi pesanti al criogel.',
    glyph: '⌁',
    color: '#7fe8ff',
    tier: 2,
    weapon: { damage: 26, cooldown: 0.4, range: 70, cost: 11 },
  },
  {
    id: 'tank',
    name: 'Serbatoio esteso',
    kind: 'upgrade',
    desc: 'Ossigeno massimo +50.',
    glyph: '⬭',
    color: '#5ad1ff',
  },
  {
    id: 'filter',
    name: 'Filtro spore',
    kind: 'upgrade',
    desc: 'Immunità alle nubi di spore.',
    glyph: '⛆',
    color: '#c38bff',
  },
  {
    id: 'thermal',
    name: 'Modulo termico',
    kind: 'upgrade',
    desc: 'Immunità al freddo dei Picchi.',
    glyph: '♨',
    color: '#ff8c5a',
  },
  {
    id: 'uplink',
    name: 'Modulo di uplink',
    kind: 'key',
    desc: 'Riattiva il faro di estrazione.',
    glyph: '⌬',
    color: '#ffffff',
  },
];

export const ITEMS: Record<string, ItemDef> = Object.fromEntries(defs.map((d) => [d.id, d]));
export const ITEM_LIST: readonly ItemDef[] = defs;

export const RESOURCE_IDS = defs.filter((d) => d.kind === 'resource' || d.id === 'meat').map((d) => d.id);

/** Order of the hotbar: the first six owned entries become slots 1-6. */
export const HOTBAR_ORDER = [
  'tool3',
  'tool2',
  'tool1',
  'blaster2',
  'blaster',
  'medkit',
  'ration',
  'fruit',
  'oxycell',
  'meat',
];

export function itemName(id: string): string {
  return ITEMS[id]?.name ?? id;
}
