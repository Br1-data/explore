/** Bump whenever client and server messages change incompatibly. */
export const PROTOCOL_VERSION = 2;

export const MAX_PLAYERS = 4;

/** Server simulation rate. */
export const TICK_RATE = 20;
export const TICK_DT = 1 / TICK_RATE;

/** Fixed step of a client movement command. */
export const SIM_DT = 1 / 30;

/** Delay used when interpolating remote entities (seconds). */
export const INTERP_DELAY = 0.1;

export const WORLD = {
  zMin: -120,
  zMax: 1640,
  crashZ: 0,
  signalZ: 1560,
  /** Playable half width of the valley around its centre line. */
  halfWidth: 150,
  biomeLength: 400,
  /** Width of the colour/terrain blend between two biomes. */
  biomeBlend: 40,
  chunkSize: 40,
  /** Grid cells per chunk side for the terrain mesh (2 m cells). */
  chunkRes: 20,
};

export const DAY = {
  /** Full day/night cycle length in seconds. */
  length: 480,
  /** Fraction of the cycle that is daytime. */
  dayFraction: 5 / 8,
};

export const STORM = {
  startZ: -170,
  grace: 240,
  /** m/s once the grace period ends; reaches the signal after ~45 minutes. */
  speed: 0.65,
  damagePerSec: 6,
  o2Mult: 3,
};

export const EXTRACTION = {
  radius: 25,
  duration: 120,
  waveEvery: 15,
  bossAt: 50,
};

export const PLAYER = {
  radius: 0.45,
  height: 1.8,
  walkSpeed: 4.6,
  sprintSpeed: 7.6,
  downedSpeed: 1.0,
  jumpVel: 6.5,
  gravity: 18,
  dodgeSpeed: 13,
  dodgeTime: 0.25,
  dodgeCooldown: 1.2,
  maxSlope: 1.25,
  maxHp: 100,
  maxO2: 100,
  maxEnergy: 100,
  o2Drain: 0.4,
  energyDrain: 0.12,
  hpRegen: 1,
  regenDelay: 5,
  noO2Damage: 4,
  noEnergyDamage: 1,
  bleedOut: 30,
  reviveTime: 3,
  selfReviveTime: 5,
  reviveRange: 2.5,
  respawnDelay: 10,
  interactRange: 3,
  dodgeEnergy: 2,
};

export const CAMP = {
  radius: 18,
  stationRange: 8,
  refundRatio: 0.75,
};

/** Default seconds a disconnected player keeps their slot for a rejoin. */
export const REJOIN_GRACE = 60;
