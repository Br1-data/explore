export type StructureKind = 'beacon' | 'oxygenator' | 'workbench' | 'campfire' | 'turret' | 'barricade';
export interface StructureState {
  id: string;
  kind: StructureKind;
  x: number;
  z: number;
  yaw: number;
  hp: number;
  ownerId: string;
  /** Actual paid materials, preserved so dismantling refunds cannot mint resources. */
  paidCost?: Record<string, number>;
}
export type CreatureKind =
  | 'hopper'
  | 'crab'
  | 'lurker'
  | 'sporeling'
  | 'scorpion'
  | 'spitter'
  | 'frostbeast'
  | 'frostwing'
  | 'colossus';
export interface CreatureState {
  id: string;
  kind: CreatureKind;
  x: number;
  z: number;
  yaw: number;
  hp: number;
  state: 'idle' | 'chase' | 'attack' | 'flee';
}
export interface CapsuleState {
  id: string;
  x: number;
  z: number;
  inventory: Record<string, number>;
}
export interface RunState {
  phase: 'exploring' | 'extracting' | 'won' | 'lost';
  elapsed: number;
  stormZ: number;
  extraction: number;
  research: number;
  kills: number;
  biomes: number[];
  reason?: string;
}
export interface GameEvent {
  id: number;
  kind: 'hit' | 'gather' | 'craft' | 'build' | 'damage' | 'shot' | 'revive' | 'extract' | 'death';
  x: number;
  z: number;
  playerId?: string;
  text?: string;
}
export interface WorldState {
  structures: StructureState[];
  creatures: CreatureState[];
  capsules: CapsuleState[];
  run: RunState;
  events: GameEvent[];
}
export interface ProfileData {
  research: number;
  unlocks: string[];
  runs: number;
  wins: number;
}
