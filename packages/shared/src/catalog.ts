import type { CreatureKind, StructureKind } from './game-types';

export interface RecipeDef {
  id: string;
  cost: Record<string, number>;
  station: 'workbench' | 'campfire' | null;
}

/** Costs and station requirements from the game design document. */
export const RECIPES: Record<string, RecipeDef> = {
  tool2: { id: 'tool2', cost: { scrap: 6, crystal: 4 }, station: 'workbench' },
  tool3: { id: 'tool3', cost: { scrap: 6, obsidian: 4, biogel: 2 }, station: 'workbench' },
  blaster: { id: 'blaster', cost: { scrap: 8, crystal: 5 }, station: 'workbench' },
  blaster2: { id: 'blaster2', cost: { scrap: 6, obsidian: 5, cryo: 2 }, station: 'workbench' },
  oxycell: { id: 'oxycell', cost: { crystal: 2, scrap: 1 }, station: null },
  ration: { id: 'ration', cost: { meat: 2, fiber: 1 }, station: 'campfire' },
  medkit: { id: 'medkit', cost: { biogel: 2, fiber: 2 }, station: 'workbench' },
  tank: { id: 'tank', cost: { scrap: 5, biogel: 3 }, station: 'workbench' },
  filter: { id: 'filter', cost: { fiber: 4, biogel: 2 }, station: null },
  thermal: { id: 'thermal', cost: { scrap: 4, obsidian: 3, crystal: 2 }, station: 'workbench' },
  uplink: {
    id: 'uplink',
    cost: { scrap: 5, crystal: 3, biogel: 3, obsidian: 3, cryo: 3 },
    station: 'workbench',
  },
};

export interface StructureDef {
  id: StructureKind;
  name: string;
  cost: Record<string, number>;
  requiresCamp: boolean;
  hp: number;
  desc: string;
}

export const STRUCTURES: Record<StructureKind, StructureDef> = {
  beacon: {
    id: 'beacon',
    name: 'Faro di campo',
    cost: { scrap: 4, crystal: 2 },
    requiresCamp: false,
    hp: 250,
    desc: 'Definisce un campo di 18 m e il punto di rinascita dell’equipaggio.',
  },
  oxygenator: {
    id: 'oxygenator',
    name: 'Generatore O₂',
    cost: { scrap: 5, crystal: 3 },
    requiresCamp: true,
    hp: 200,
    desc: 'Ripristina 12 ossigeno al secondo entro 8 m. Richiede un campo.',
  },
  workbench: {
    id: 'workbench',
    name: 'Banco da lavoro',
    cost: { scrap: 6, fiber: 3 },
    requiresCamp: true,
    hp: 180,
    desc: 'Permette di creare attrezzatura avanzata entro 8 m. Richiede un campo.',
  },
  campfire: {
    id: 'campfire',
    name: 'Falò',
    cost: { fiber: 4 },
    requiresCamp: false,
    hp: 100,
    desc: 'Fornisce calore e luce e permette di cucinare entro 8 m.',
  },
  turret: {
    id: 'turret',
    name: 'Torretta',
    cost: { scrap: 8, crystal: 4 },
    requiresCamp: true,
    hp: 250,
    desc: 'Difende automaticamente il campo dalle creature entro 16 m.',
  },
  barricade: {
    id: 'barricade',
    name: 'Barricata',
    cost: { scrap: 2, fiber: 2 },
    requiresCamp: false,
    hp: 150,
    desc: 'Una protezione con 150 punti struttura. Blocca le creature.',
  },
};

export interface CreatureDef {
  id: CreatureKind;
  name: string;
  hp: number;
  damage: number;
  speed: number;
  range: number;
  cooldown: number;
  hostile: boolean;
  loot: Record<string, number>;
  color: string;
}

export const CREATURES: Record<CreatureKind, CreatureDef> = {
  hopper: {
    id: 'hopper',
    name: 'Saltaspore',
    hp: 30,
    damage: 0,
    speed: 5,
    range: 1.8,
    cooldown: 1.2,
    hostile: false,
    loot: { meat: 2 },
    color: '#c5bf80',
  },
  crab: {
    id: 'crab',
    name: 'Granchio cristallo',
    hp: 60,
    damage: 8,
    speed: 2.4,
    range: 2.1,
    cooldown: 1.4,
    hostile: false,
    loot: { crystal: 2, meat: 1 },
    color: '#ed8fc1',
  },
  lurker: {
    id: 'lurker',
    name: 'Lurker fungino',
    hp: 70,
    damage: 12,
    speed: 3.4,
    range: 2.2,
    cooldown: 1.2,
    hostile: true,
    loot: { biogel: 2, meat: 1 },
    color: '#aa83ce',
  },
  sporeling: {
    id: 'sporeling',
    name: 'Sporello',
    hp: 25,
    damage: 5,
    speed: 5.8,
    range: 1.6,
    cooldown: 0.8,
    hostile: true,
    loot: { biogel: 1 },
    color: '#dda35d',
  },
  scorpion: {
    id: 'scorpion',
    name: 'Scorpione di vetro',
    hp: 110,
    damage: 16,
    speed: 3,
    range: 2.6,
    cooldown: 1.5,
    hostile: true,
    loot: { obsidian: 2, meat: 1 },
    color: '#595377',
  },
  spitter: {
    id: 'spitter',
    name: 'Sputavetro',
    hp: 60,
    damage: 10,
    speed: 2.8,
    range: 20,
    cooldown: 2,
    hostile: true,
    loot: { obsidian: 2, biogel: 1 },
    color: '#967d60',
  },
  frostbeast: {
    id: 'frostbeast',
    name: 'Brinatore',
    hp: 160,
    damage: 20,
    speed: 2.8,
    range: 3,
    cooldown: 1.6,
    hostile: true,
    loot: { cryo: 2, meat: 2 },
    color: '#a5d4df',
  },
  frostwing: {
    id: 'frostwing',
    name: 'Ala di brina',
    hp: 50,
    damage: 9,
    speed: 6,
    range: 2.2,
    cooldown: 1,
    hostile: true,
    loot: { cryo: 1 },
    color: '#85bad4',
  },
  colossus: {
    id: 'colossus',
    name: 'Colosso del Segnale',
    hp: 900,
    damage: 30,
    speed: 2.5,
    range: 4.5,
    cooldown: 2.2,
    hostile: true,
    loot: {},
    color: '#8375ad',
  },
};

export interface PerkDef {
  id: string;
  name: string;
  cost: number;
  desc: string;
}

export const PERKS: Record<string, PerkDef> = {
  lungs: { id: 'lungs', name: 'Polmoni d’acciaio', cost: 30, desc: 'Ossigeno massimo +25.' },
  hands: { id: 'hands', name: 'Mani esperte', cost: 30, desc: 'Resa della raccolta +25%.' },
  supplies: {
    id: 'supplies',
    name: 'Scorta iniziale',
    cost: 25,
    desc: 'Inizi ogni spedizione con 10 Rottami e 5 Fibra.',
  },
  armor: { id: 'armor', name: 'Corazza leggera', cost: 40, desc: 'Salute massima +15.' },
  metabolism: { id: 'metabolism', name: 'Metabolismo lento', cost: 40, desc: 'Consumo di energia −25%.' },
  medic: { id: 'medic', name: 'Primo soccorso', cost: 35, desc: 'Rianimi i compagni in 2 secondi.' },
  engineer: { id: 'engineer', name: 'Ingegnere', cost: 60, desc: 'Le strutture costano il 25% in meno.' },
  blaster: {
    id: 'blaster',
    name: 'Blaster di serie',
    cost: 80,
    desc: 'Inizi ogni spedizione con un Blaster.',
  },
  suit_teal: {
    id: 'suit_teal',
    name: 'Tuta turchese',
    cost: 10,
    desc: 'Una livrea turchese per il tuo astronauta.',
  },
  suit_violet: {
    id: 'suit_violet',
    name: 'Tuta ametista',
    cost: 10,
    desc: 'Una livrea viola per il tuo astronauta.',
  },
  suit_gold: {
    id: 'suit_gold',
    name: 'Tuta ambra',
    cost: 10,
    desc: 'Una livrea dorata per il tuo astronauta.',
  },
};
