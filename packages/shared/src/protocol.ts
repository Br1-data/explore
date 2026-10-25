import type { MoveInput, PlayerState } from './player';
import type { ProfileData, StructureKind, WorldState } from './game-types';
import { ITEMS } from './items';
import { RECIPES } from './catalog';

export type ClientMessage =
  | { type: 'join'; version: number; name: string; token: string; room?: string }
  | { type: 'input'; input: MoveInput }
  | { type: 'gather'; nodeId: string }
  | { type: 'craft'; itemId: string }
  | { type: 'consume'; itemId: string }
  | { type: 'equip'; itemId: string }
  | { type: 'build'; kind: StructureKind; x: number; z: number; yaw: number }
  | { type: 'dismantle'; structureId: string }
  | { type: 'attack'; targetId?: string }
  | { type: 'interact'; targetId: string }
  | { type: 'transfer'; targetId: string; itemId: string; amount: number }
  | { type: 'chat'; text: string }
  | { type: 'unlock'; perkId: string };

export type ServerMessage =
  | { type: 'welcome'; playerId: string; room: string; seed: number }
  | {
      type: 'snapshot';
      tick: number;
      players: PlayerState[];
      depleted: string[];
      elapsed: number;
      world?: WorldState;
    }
  | { type: 'error'; message: string }
  | { type: 'profile'; profile: ProfileData }
  | { type: 'chat'; playerName: string; text: string };

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function finite(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}
function identifier(value: unknown): value is string {
  return typeof value === 'string' && /^[A-Za-z0-9_-]{1,80}$/.test(value);
}

/** All actions are requests. Inventory, position, damage and research remain authoritative. */
export function parseClientMessage(value: unknown): ClientMessage | null {
  if (!record(value)) return null;
  switch (value.type) {
    case 'join': {
      if (
        !Number.isSafeInteger(value.version) ||
        typeof value.name !== 'string' ||
        value.name.trim().length < 1 ||
        value.name.length > 24 ||
        typeof value.token !== 'string' ||
        !/^[A-Za-z0-9_-]{8,128}$/.test(value.token) ||
        (value.room !== undefined && (typeof value.room !== 'string' || !/^[A-Z]{4}$/.test(value.room)))
      )
        return null;
      return {
        type: 'join',
        version: value.version as number,
        name: value.name.trim(),
        token: value.token,
        ...(value.room === undefined ? {} : { room: value.room as string }),
      };
    }
    case 'input': {
      const i = value.input;
      if (
        !record(i) ||
        !Number.isSafeInteger(i.seq) ||
        (i.seq as number) < 0 ||
        !finite(i.moveX) ||
        Math.abs(i.moveX) > 1 ||
        !finite(i.moveZ) ||
        Math.abs(i.moveZ) > 1 ||
        !finite(i.yaw) ||
        Math.abs(i.yaw) > Math.PI * 1000 ||
        typeof i.sprint !== 'boolean' ||
        typeof i.jump !== 'boolean' ||
        (i.interact !== undefined && typeof i.interact !== 'boolean') ||
        (i.dodge !== undefined && typeof i.dodge !== 'boolean')
      )
        return null;
      return {
        type: 'input',
        input: {
          seq: i.seq as number,
          moveX: i.moveX,
          moveZ: i.moveZ,
          yaw: i.yaw,
          sprint: i.sprint,
          jump: i.jump,
          ...(i.interact === undefined ? {} : { interact: i.interact }),
          ...(i.dodge === undefined ? {} : { dodge: i.dodge }),
        },
      };
    }
    case 'gather':
      return typeof value.nodeId === 'string' && /^node-\d{1,6}$/.test(value.nodeId)
        ? { type: 'gather', nodeId: value.nodeId }
        : null;
    case 'craft':
      return typeof value.itemId === 'string' && Object.hasOwn(RECIPES, value.itemId)
        ? { type: 'craft', itemId: value.itemId }
        : null;
    case 'consume':
      return typeof value.itemId === 'string' &&
        Object.hasOwn(ITEMS, value.itemId) &&
        ITEMS[value.itemId].consumable
        ? { type: 'consume', itemId: value.itemId }
        : null;
    case 'equip':
      return typeof value.itemId === 'string' &&
        Object.hasOwn(ITEMS, value.itemId) &&
        ['tool', 'weapon', 'consumable'].includes(ITEMS[value.itemId].kind)
        ? { type: 'equip', itemId: value.itemId }
        : null;
    case 'build':
      if (
        !['beacon', 'oxygenator', 'workbench', 'campfire', 'turret', 'barricade'].includes(
          String(value.kind),
        ) ||
        !finite(value.x) ||
        !finite(value.z) ||
        !finite(value.yaw) ||
        Math.abs(value.x) > 10000 ||
        Math.abs(value.z) > 10000 ||
        Math.abs(value.yaw) > Math.PI * 1000
      )
        return null;
      return { type: 'build', kind: value.kind as StructureKind, x: value.x, z: value.z, yaw: value.yaw };
    case 'dismantle':
      return identifier(value.structureId) ? { type: 'dismantle', structureId: value.structureId } : null;
    case 'attack':
      return value.targetId === undefined
        ? { type: 'attack' }
        : identifier(value.targetId)
          ? { type: 'attack', targetId: value.targetId }
          : null;
    case 'interact':
      return identifier(value.targetId) ? { type: 'interact', targetId: value.targetId } : null;
    case 'transfer':
      return identifier(value.targetId) &&
        typeof value.itemId === 'string' &&
        Object.hasOwn(ITEMS, value.itemId) &&
        Number.isSafeInteger(value.amount) &&
        (value.amount as number) > 0 &&
        (value.amount as number) <= 9999
        ? { type: 'transfer', targetId: value.targetId, itemId: value.itemId, amount: value.amount as number }
        : null;
    case 'chat':
      return typeof value.text === 'string' && value.text.trim().length > 0 && value.text.length <= 200
        ? { type: 'chat', text: value.text.trim() }
        : null;
    case 'unlock':
      return identifier(value.perkId) ? { type: 'unlock', perkId: value.perkId } : null;
    default:
      return null;
  }
}
