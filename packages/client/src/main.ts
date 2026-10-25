import {
  CAMP,
  CREATURES,
  DAY,
  EXTRACTION,
  HOTBAR_ORDER,
  ITEMS,
  MAX_PLAYERS,
  PERKS,
  PLAYER,
  PROTOCOL_VERSION,
  RECIPES,
  STORM,
  STRUCTURES,
  TICK_DT,
  WORLD,
  biomeAt,
  createPlayer,
  forwardXZ,
  heightAt,
  lerpAngle,
  rightXZ,
  stepPlayer,
  valleyCenter,
} from '@segnale/shared';
import type {
  ClientMessage,
  CreatureState,
  MoveInput,
  PlayerState,
  ProfileData,
  ServerMessage,
  StructureKind,
  StructureState,
  WorldNode,
  WorldState,
} from '@segnale/shared';
import { WorldView } from './game/view';
import { GameAudio } from './game/audio';
import { resolveServerEndpoint } from './server-url';
import { LocalTransport } from './local-transport';
import type { GameTransport } from './local-transport';
import { clearLocalSave, hasLocalSave, loadLocalProfile, purchaseLocalPerk } from './profile';
import { template } from './ui/template';
import './style.css';

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = template;
const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const text = (id: string, value: string) => {
  if ($(id).textContent !== value) $(id).textContent = value;
};
const safe = (value: string): string =>
  value.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );
const formatTime = (seconds: number): string =>
  `${Math.floor(Math.max(0, seconds) / 60)}:${Math.floor(Math.max(0, seconds) % 60)
    .toString()
    .padStart(2, '0')}`;
const emptyWorld = (): WorldState => ({
  structures: [],
  creatures: [],
  capsules: [],
  run: {
    phase: 'exploring',
    elapsed: 0,
    stormZ: STORM.startZ,
    extraction: 0,
    research: 0,
    kills: 0,
    biomes: [0],
  },
  events: [],
});
const worldHost = $('world');
const endpoint = resolveServerEndpoint(import.meta.env.VITE_SERVER_URL, location.href, import.meta.env.DEV);
const defaultLocalMode = endpoint.url === null && endpoint.reason === 'missing';
const audio = new GameAudio();
const keys = new Set<string>();
let view: WorldView;
let graphicsReady = false;
let socket: GameTransport | undefined;
let localMode = false;
let playerId = '';
let room = '';
let seed = 42;
let local: PlayerState | undefined;
let players: PlayerState[] = [];
let world = emptyWorld();
let depleted = new Set<string>();
let pending: MoveInput[] = [];
let seq = 0;
let snapshots: { at: number; players: PlayerState[] }[] = [];
let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
let reconnectStarted = 0;
let intentionalClose = false;
let playing = false;
let jump = false;
let dodge = false;
let paused = false;
let panel: 'inventory' | 'build-menu' | 'laboratory' | 'help' | null = null;
let placementKind: StructureKind | null = null;
let placementYaw = 0;
let placementPoint = { x: 0, z: 0, valid: false };
let nearestNode: WorldNode | undefined;
let nearestStructure: StructureState | undefined;
let nearestCreature: CreatureState | undefined;
let interaction:
  | { id: string; kind: 'node' | 'capsule' | 'revive' | 'extraction'; title: string; detail: string }
  | undefined;
let profile: ProfileData = loadLocalProfile();
let toastTimer: ReturnType<typeof setTimeout>;
let resultShown = false;
let eventCursor = 0;
let firstSnapshot = true;
let previousHp = 100;
let inventorySignature = '';
let crewSignature = '';
let preventPauseOnRelease = false;
let wasPointerLocked = false;
let muted = false;
let token: string;
try {
  token =
    localStorage.getItem('segnale-player-token') ??
    sessionStorage.getItem('segnale-token') ??
    crypto.randomUUID();
  localStorage.setItem('segnale-player-token', token);
  sessionStorage.setItem('segnale-token', token);
  $<HTMLInputElement>('name').value = localStorage.getItem('segnale-name') ?? 'Astronauta';
  muted = localStorage.getItem('segnale-muted') === '1';
} catch {
  token = crypto.randomUUID();
}
audio.setMuted(muted);
$('server-notice').hidden = endpoint.url !== null || defaultLocalMode;
$('online-join').hidden = defaultLocalMode;
$('solo').hidden = defaultLocalMode;
if (defaultLocalMode) text('boarding-note', 'Un esploratore · Salvataggio automatico · Nessun account');
const initialRoom = new URL(location.href).searchParams.get('room');
if (initialRoom && /^[a-z]{4}$/i.test(initialRoom))
  $<HTMLInputElement>('code').value = initialRoom.toUpperCase();

function toast(message: string): void {
  text('toast', message);
  $('toast').hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    $('toast').hidden = true;
  }, 4200);
}
function releaseMouse(): void {
  preventPauseOnRelease = true;
  document.exitPointerLock();
  setTimeout(() => {
    preventPauseOnRelease = false;
  }, 150);
}
function send(message: ClientMessage): boolean {
  if (socket?.readyState !== WebSocket.OPEN || socket.bufferedAmount > 64 * 1024) return false;
  socket.send(JSON.stringify(message));
  return true;
}
function neutralInput(): void {
  keys.clear();
  jump = false;
  dodge = false;
  if (!local || !playing) return;
  send({
    type: 'input',
    input: {
      seq: seq++,
      moveX: 0,
      moveZ: 0,
      yaw: view.yaw,
      sprint: false,
      jump: false,
      interact: false,
      dodge: false,
    },
  });
}
function showPanel(next: typeof panel): void {
  for (const id of ['inventory', 'build-menu', 'laboratory', 'help']) $(id).hidden = id !== next;
  panel = next;
  neutralInput();
  if (next) releaseMouse();
  if (next === 'inventory') renderInventory(true);
  if (next === 'build-menu') renderBuildings();
  if (next === 'laboratory') renderLaboratory();
}
function setPaused(next: boolean): void {
  if (!playing || resultShown) return;
  paused = next;
  neutralInput();
  showPanel(null);
  placementKind = null;
  $('placement').hidden = true;
  view.setPlacement(null);
  $('pause-menu').hidden = !next;
  if (socket instanceof LocalTransport) socket.pause(next);
  if (next) {
    releaseMouse();
    text(
      'pause-detail',
      localMode
        ? 'La spedizione è in pausa. I progressi sono salvati automaticamente in questo browser.'
        : 'La partita online continua: raggiungi un posto sicuro prima di fermarti.',
    );
    text('pause-leave', localMode ? 'Salva e torna al menu' : 'Lascia la stanza');
  }
}
function setBusy(busy: boolean): void {
  for (const id of ['create', 'join'])
    $<HTMLButtonElement>(id).disabled =
      busy || !graphicsReady || (endpoint.url === null && !defaultLocalMode);
  for (const id of ['solo', 'continue-resume']) $<HTMLButtonElement>(id).disabled = busy || !graphicsReady;
  $('create').firstChild!.textContent = busy
    ? 'Preparazione in corso… '
    : defaultLocalMode
      ? 'Esplora in solitaria '
      : 'Nuova spedizione ';
}
function updateLobby(): void {
  $('continue-resume').hidden = !hasLocalSave();
  text('lobby-research', `${profile.research} DR`);
  renderLaboratory();
}
function leave(): void {
  intentionalClose = true;
  clearTimeout(reconnectTimer);
  socket?.close();
  socket = undefined;
  playing = false;
  paused = false;
  local = undefined;
  players = [];
  playerId = '';
  room = '';
  pending = [];
  snapshots = [];
  depleted.clear();
  keys.clear();
  world = emptyWorld();
  resultShown = false;
  inventorySignature = '';
  crewSignature = '';
  placementKind = null;
  showPanel(null);
  releaseMouse();
  for (const id of ['hud', 'session', 'downed', 'result', 'pause-menu', 'chat-form', 'placement'])
    $(id).hidden = true;
  for (const id of ['lobby', 'landing-info', 'build-label', 'lobby-footer']) $(id).hidden = false;
  text('lobby-error', '');
  const url = new URL(location.href);
  url.searchParams.delete('room');
  history.replaceState(null, '', url);
  resetView(42);
  profile = loadLocalProfile();
  updateLobby();
  setBusy(false);
}
function connect(
  requestedRoom?: string,
  reconnect = false,
  mode: 'local' | 'online' = defaultLocalMode ? 'local' : 'online',
  resume = false,
): void {
  if (!graphicsReady || (mode === 'online' && endpoint.url === null)) return;
  const name = $<HTMLInputElement>('name').value.trim();
  if (!name) {
    $<HTMLInputElement>('name').reportValidity();
    return;
  }
  audio.unlock();
  if (!reconnect) {
    localMode = mode === 'local';
    intentionalClose = false;
    reconnectStarted = 0;
    text('lobby-error', '');
    setBusy(true);
    if (localMode && !resume) clearLocalSave();
  }
  try {
    localStorage.setItem('segnale-name', name);
  } catch {
    /* Storage is optional. */
  }
  const current: GameTransport = localMode ? new LocalTransport({ resume }) : new WebSocket(endpoint.url!);
  socket = current;
  let welcomed = false;
  current.addEventListener('open', () => {
    send({
      type: 'join',
      version: PROTOCOL_VERSION,
      token,
      name,
      ...(requestedRoom ? { room: requestedRoom } : {}),
    });
  });
  current.addEventListener('message', (event) => {
    if (socket !== current) return;
    let message: ServerMessage;
    try {
      message = JSON.parse(event.data) as ServerMessage;
    } catch {
      return;
    }
    if (message.type === 'profile') {
      profile = message.profile;
      updateLobby();
      return;
    }
    if (message.type === 'chat') {
      appendChat(message.playerName, message.text);
      return;
    }
    if (message.type === 'error') {
      if (!welcomed) {
        const error = message.message;
        leave();
        text('lobby-error', error);
      } else toast(message.message);
      return;
    }
    if (message.type === 'welcome') {
      welcomed = true;
      playing = true;
      paused = false;
      resultShown = false;
      firstSnapshot = true;
      playerId = message.playerId;
      room = localMode ? '' : message.room;
      seed = message.seed;
      pending = [];
      snapshots = [];
      keys.clear();
      reconnectStarted = 0;
      eventCursor = 0;
      world = emptyWorld();
      inventorySignature = '';
      crewSignature = '';
      if (!reconnect) {
        local = undefined;
        if (!resetView(seed)) {
          leave();
          return;
        }
      }
      for (const id of ['lobby', 'landing-info', 'build-label', 'lobby-footer', 'pause-menu', 'result'])
        $(id).hidden = true;
      $('hud').hidden = false;
      $('session').hidden = false;
      text('connection-label', localMode ? 'MODALITÀ LOCALE' : 'CONNESSO');
      $('share').hidden = localMode;
      text('room-code', room);
      const url = new URL(location.href);
      if (localMode) url.searchParams.delete('room');
      else url.searchParams.set('room', room);
      history.replaceState(null, '', url);
      toast(
        reconnect
          ? 'Collegamento ristabilito. Bentornato a bordo.'
          : resume
            ? 'Diario recuperato. La spedizione riprende da qui.'
            : 'Aurora–7 a terra. Recupera rottami e cristalli, poi costruisci il primo campo con B.',
      );
      return;
    }
    if (message.type === 'snapshot') {
      players = message.players;
      depleted = new Set(message.depleted);
      world = message.world ?? { ...world, run: { ...world.run, elapsed: message.elapsed } };
      const authoritative = players.find((p) => p.id === playerId);
      if (authoritative) {
        seq = Math.max(seq, authoritative.lastSeq + 1);
        pending = pending.filter((input) => input.seq > authoritative.lastSeq);
        local = { ...authoritative, inventory: { ...authoritative.inventory } };
        if (local.status !== 'dead') for (const input of pending) stepPlayer(local, input, TICK_DT, seed);
        if (!firstSnapshot && local.hp < previousHp) flashDamage();
        previousHp = local.hp;
      }
      for (const event of world.events) {
        if (!firstSnapshot && event.id > eventCursor) {
          audio.play(event.kind);
          if (event.text && (!event.playerId || event.playerId === playerId)) toast(event.text);
        }
        eventCursor = Math.max(eventCursor, event.id);
      }
      firstSnapshot = false;
      snapshots.push({ at: performance.now(), players: message.players });
      snapshots = snapshots.slice(-8);
      updateHud();
    }
  });
  current.addEventListener('close', (event) => {
    if (socket !== current || intentionalClose) return;
    keys.clear();
    jump = false;
    if (event.code === 4001) {
      leave();
      text('lobby-error', 'La sessione è stata aperta in un’altra finestra.');
      return;
    }
    if (!localMode && (welcomed || reconnect) && room) {
      reconnectStarted ||= Date.now();
      if (Date.now() - reconnectStarted < 55_000) {
        text('connection-label', 'RICONNESSIONE…');
        toast('Segnale perso. Provo a ricollegare la spedizione…');
        reconnectTimer = setTimeout(() => connect(room, true, 'online'), 1500);
        return;
      }
    }
    leave();
    text(
      'lobby-error',
      welcomed || reconnect
        ? 'Connessione persa. Puoi rientrare con il codice stanza.'
        : 'Server non raggiungibile. Riprova tra poco.',
    );
  });
}
function resetView(nextSeed: number): boolean {
  graphicsReady = false;
  view?.dispose();
  try {
    view = new WorldView(nextSeed, worldHost);
    graphicsReady = true;
  } catch {
    text('lobby-error', 'La grafica 3D richiede WebGL. Abilita l’accelerazione grafica e ricarica.');
    setBusy(false);
    return false;
  }
  const canvas = view.renderer.domElement;
  let dragging = false;
  canvas.addEventListener('pointerdown', (event) => {
    if (event.button === 0) dragging = true;
  });
  canvas.addEventListener('pointerup', () => {
    dragging = false;
  });
  canvas.addEventListener('pointerleave', () => {
    dragging = false;
  });
  canvas.addEventListener('pointermove', (event) => {
    if (dragging && !document.pointerLockElement && playing && !panel && !paused)
      look(event.movementX, event.movementY);
  });
  canvas.addEventListener('click', () => {
    if (!canAct()) return;
    audio.unlock();
    if (placementKind) {
      placeStructure();
      return;
    }
    if (document.pointerLockElement) useActive();
    else canvas.requestPointerLock()?.catch(() => toast('Puoi orientare la visuale trascinando il mouse.'));
  });
  canvas.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    cancelPlacement();
  });
  canvas.addEventListener(
    'wheel',
    (event) => {
      if (!canAct()) return;
      event.preventDefault();
      const slots = hotbarItems();
      const index = Math.max(0, slots.indexOf(local!.activeItem));
      equip(slots[(index + (event.deltaY > 0 ? 1 : slots.length - 1)) % slots.length]);
    },
    { passive: false },
  );
  return true;
}
function look(dx: number, dy: number): void {
  if (!graphicsReady || panel || paused) return;
  view.yaw = Math.atan2(Math.sin(view.yaw - dx * 0.003), Math.cos(view.yaw - dx * 0.003));
  view.pitch = Math.max(0.05, Math.min(1.15, view.pitch + dy * 0.003));
}
function canAct(): boolean {
  return (
    !!local &&
    playing &&
    !paused &&
    !panel &&
    !resultShown &&
    local.status === 'alive' &&
    $('chat-form').hidden
  );
}
function equip(itemId?: string): void {
  if (itemId && local?.inventory[itemId]) send({ type: 'equip', itemId });
}
function useActive(): void {
  if (!canAct() || !local) return;
  const def = ITEMS[local.activeItem];
  if (def?.consumable) send({ type: 'consume', itemId: def.id });
  else if (def?.weapon)
    send({ type: 'attack', ...(nearestCreature ? { targetId: nearestCreature.id } : {}) });
  else if (def?.tool) {
    if (
      nearestCreature &&
      (!nearestNode ||
        Math.hypot(nearestCreature.x - local.x, nearestCreature.z - local.z) <
          Math.hypot(nearestNode.x - local.x, nearestNode.z - local.z))
    )
      send({ type: 'attack', targetId: nearestCreature.id });
    else if (nearestNode) send({ type: 'gather', nodeId: nearestNode.id });
    else send({ type: 'attack' });
  }
}
function interact(): void {
  if (!local || paused || panel || resultShown) return;
  if (local.status === 'downed') return;
  if (!interaction) return;
  if (interaction.kind === 'node') send({ type: 'gather', nodeId: interaction.id });
  else if (interaction.kind !== 'revive') send({ type: 'interact', targetId: interaction.id });
}
function cancelPlacement(): void {
  placementKind = null;
  $('placement').hidden = true;
  view?.setPlacement(null);
}
function placeStructure(): void {
  if (!placementKind || !local) return;
  if (!placementPoint.valid) {
    toast('Posizione non valida. Controlla materiali, spazio e raggio del campo.');
    return;
  }
  send({ type: 'build', kind: placementKind, x: placementPoint.x, z: placementPoint.z, yaw: placementYaw });
}
function costs(
  cost: Record<string, number>,
  inventory: Record<string, number> = local?.inventory ?? {},
): string {
  return Object.entries(cost)
    .map(
      ([id, amount]) =>
        `${inventory[id] ?? 0}/${amount} ${id === 'scrap' && amount === 1 ? 'Rottame' : (ITEMS[id]?.name ?? id)}`,
    )
    .join(' + ');
}
function affordable(cost: Record<string, number>): boolean {
  return !!local && Object.entries(cost).every(([id, amount]) => (local!.inventory[id] ?? 0) >= amount);
}
function structureCost(kind: StructureKind): Record<string, number> {
  return Object.fromEntries(
    Object.entries(STRUCTURES[kind].cost).map(([id, amount]) => [
      id,
      local?.perks.includes('engineer') ? Math.ceil(amount * 0.75) : amount,
    ]),
  );
}
function stationNearby(kind: StructureKind): boolean {
  return (
    !!local &&
    world.structures.some(
      (s) => s.kind === kind && s.hp > 0 && Math.hypot(s.x - local!.x, s.z - local!.z) <= CAMP.stationRange,
    )
  );
}
function hotbarItems(): string[] {
  return local ? HOTBAR_ORDER.filter((id) => (local!.inventory[id] ?? 0) > 0).slice(0, 6) : [];
}
function renderInventory(force = false): void {
  if (!local) return;
  const signature = JSON.stringify([
    local.inventory,
    local.activeItem,
    local.perks,
    stationNearby('workbench'),
    stationNearby('campfire'),
    local.status,
    players
      .filter(
        (p) =>
          p.id !== playerId &&
          p.connected &&
          Math.hypot(p.x - local!.x, p.z - local!.z) <= PLAYER.interactRange,
      )
      .map((p) => p.id),
  ]);
  if (!force && signature === inventorySignature) return;
  inventorySignature = signature;
  $('inventory-items').innerHTML = Object.entries(local.inventory)
    .filter(([, count]) => count > 0)
    .map(([id, count]) => {
      const def = ITEMS[id];
      return `<div class="inventory-item ${local!.activeItem === id ? 'equipped' : ''}"><span style="color:${def?.color ?? '#fff'}">${def?.glyph ?? '◇'}</span><div><strong>${safe(def?.name ?? id)}</strong><small>${safe(def?.desc ?? '')}</small></div><b>×${count}</b>${def?.consumable ? `<button class="small-button" data-consume="${id}">Usa</button>` : def?.tool || def?.weapon ? `<button class="small-button" data-equip="${id}">${local!.activeItem === id ? 'Attivo' : 'Equipaggia'}</button>` : ''}</div>`;
    })
    .join('');
  $('recipes').innerHTML = Object.values(RECIPES)
    .map((recipe) => {
      const def = ITEMS[recipe.id];
      const station = recipe.station ? stationNearby(recipe.station) : true;
      const have = affordable(recipe.cost);
      const upgradeOwned = def?.kind === 'upgrade' && local!.inventory[recipe.id] > 0;
      const buttonId = recipe.id === 'oxycell' ? 'id="craft"' : '';
      return `<article class="recipe ${station ? '' : 'station-locked'}"><span class="recipe-icon" style="color:${def?.color ?? '#fff'}">${def?.glyph ?? '◇'}</span><div><h3>${safe(def?.name ?? recipe.id)}</h3><p>${safe(def?.desc ?? '')}</p><small ${recipe.id === 'oxycell' ? 'id="recipe-cost"' : ''}>${safe(costs(recipe.cost))}</small><span class="station-requirement ${station ? 'ready' : ''}">${recipe.station ? (station ? `${recipe.station === 'workbench' ? 'Banco da lavoro' : 'Falò'} nel raggio` : `Richiede ${recipe.station === 'workbench' ? 'Banco da lavoro' : 'Falò'} entro 8 m`) : 'Creazione manuale'}</span></div><button ${buttonId} class="secondary" data-craft="${recipe.id}" ${!have || !station || upgradeOwned || local!.status !== 'alive' ? 'disabled' : ''}>${upgradeOwned ? 'Installato' : recipe.id === 'oxycell' ? 'Crea cella' : 'Crea'}</button></article>`;
    })
    .join('');
  text(
    'station-status',
    [stationNearby('workbench') ? 'Banco collegato' : '', stationNearby('campfire') ? 'Falò acceso' : '']
      .filter(Boolean)
      .join(' · ') || 'Nessuna stazione vicina',
  );
  const slots = hotbarItems();
  $('hotbar').innerHTML = Array.from({ length: 6 }, (_, i) => {
    const id = slots[i];
    const def = id ? ITEMS[id] : undefined;
    return `<button class="slot ${local!.activeItem === id ? 'active' : ''}" data-equip="${id ?? ''}" ${id ? `title="${safe(def?.name ?? id)} · Clic seleziona, clic nel mondo usa"` : 'disabled'}><kbd>${i + 1}</kbd><span style="color:${def?.color ?? '#698580'}">${def?.glyph ?? '·'}</span><small>${id ? `${local!.inventory[id]} ${def?.kind === 'tool' || def?.kind === 'weapon' ? '' : '×'}` : ''}</small></button>`;
  }).join('');
  text('cell-count', `${local.inventory.oxycell ?? 0} CELLE`);
  text('fruit-count', `${local.inventory.fruit ?? 0} FRUTTI`);
  const nearby = players.filter(
    (p) =>
      p.id !== playerId && p.connected && Math.hypot(p.x - local!.x, p.z - local!.z) <= PLAYER.interactRange,
  );
  $('transfer-section').hidden = localMode || !nearby.length;
  $('transfer-player').innerHTML = nearby
    .map((p) => `<option value="${safe(p.id)}">${safe(p.name)}</option>`)
    .join('');
  $('transfer-item').innerHTML = Object.entries(local.inventory)
    .filter(([id, amount]) => amount > 0 && ['resource', 'consumable'].includes(ITEMS[id]?.kind))
    .map(([id]) => `<option value="${id}">${safe(ITEMS[id].name)}</option>`)
    .join('');
  if (panel === 'build-menu') renderBuildings();
}
function renderBuildings(): void {
  $('build-options').innerHTML = Object.values(STRUCTURES)
    .map(
      (def) =>
        `<button class="build-option" data-build="${def.id}" ${!local || !affordable(structureCost(def.id)) ? 'disabled' : ''}><span class="build-glyph">${{ beacon: '⌁', oxygenator: 'O₂', workbench: '⚒', campfire: '♨', turret: '⌖', barricade: '▥' }[def.id]}</span><div><strong>${safe(def.name)}</strong><p>${safe(def.desc)}</p><small>${safe(costs(structureCost(def.id)))}</small><span>${def.requiresCamp ? 'Dentro un campo' : 'Piazzabile fuori dal campo'}</span></div><b>+</b></button>`,
    )
    .join('');
}
function renderLaboratory(): void {
  text('lab-balance', `${profile.research}`);
  text('lobby-research', `${profile.research} DR`);
  text(
    'lab-note',
    playing && !localMode
      ? 'I tuoi sblocchi online si applicano alla prossima spedizione sul server.'
      : 'Gli sblocchi si applicano alla prossima spedizione e rimangono salvati in questo browser.',
  );
  $('perk-options').innerHTML = Object.values(PERKS)
    .map((perk) => {
      const owned = profile.unlocks.includes(perk.id);
      return `<article class="perk-option ${owned ? 'owned' : ''}"><div><h3>${safe(perk.name)}</h3><p>${safe(perk.desc)}</p></div><button class="secondary" data-unlock="${perk.id}" ${owned || profile.research < perk.cost ? 'disabled' : ''}>${owned ? 'Sbloccato ✓' : `${perk.cost} DR`}</button></article>`;
    })
    .join('');
}
function updateObjective(): void {
  if (!local) return;
  const uplink = RECIPES.uplink;
  let title = 'Attraversa i quattro biomi';
  let detail = 'Raccogli Cristalli, Biogel, Vetro nero e Criogel per il Modulo di uplink.';
  if (world.run.phase === 'extracting') {
    title = 'Difendi il faro';
    detail = 'Rimani nel perimetro e respingi le ondate fino all’arrivo della navetta.';
  } else if (local.inventory.uplink > 0) {
    title = 'Raggiungi il faro a est';
    detail = 'Il Modulo di uplink è pronto. Premi E al faro per avviare il recupero.';
  } else if (uplink && affordable(uplink.cost)) {
    title = 'Crea il Modulo di uplink';
    detail = 'Torna a un Banco da lavoro: hai tutti i materiali per chiamare i soccorsi.';
  } else if (!world.structures.some((s) => s.kind === 'beacon')) {
    title = 'Monta il primo campo';
    detail = 'Raccogli 4 Rottami e 2 Cristalli. Premi B e piazza un Faro di campo.';
  } else if (!world.structures.some((s) => s.kind === 'workbench')) {
    title = 'Prepara il Banco da lavoro';
    detail = 'Nel campo, piazza un banco: costa 6 Rottami e 3 Fibra. Sblocca armi e attrezzi.';
  } else if (!world.structures.some((s) => s.kind === 'oxygenator')) {
    title = 'Ricarica il tuo ossigeno';
    detail = 'Un Generatore O₂ nel campo ripristina 12 ossigeno al secondo entro 8 metri.';
  }
  text('objective-title', title);
  text('objective-detail', detail);
}
function updateHud(): void {
  if (!local) return;
  text('player-name', local.name);
  text('biome-name', biomeAt(local.z).name);
  const distance = Math.round(
    Math.hypot(local.x - valleyCenter(seed, WORLD.signalZ), WORLD.signalZ - local.z),
  );
  text(
    'distance',
    distance < EXTRACTION.radius ? 'Zona del faro' : `Faro a ${distance.toLocaleString('it-IT')} m`,
  );
  $('route-progress').style.width = `${Math.max(0, Math.min(100, (local.z / WORLD.signalZ) * 100))}%`;
  for (const [stat, value, max] of [
    ['o2', local.o2, local.maxO2 ?? 100],
    ['hp', local.hp, local.maxHp ?? 100],
    ['energy', local.energy, 100],
  ] as const) {
    $(`${stat}-bar`).style.width = `${Math.max(0, Math.min(100, (value / max) * 100))}%`;
    text(`${stat}-value`, `${Math.ceil(value)}`);
    $(`${stat}-value`).classList.toggle('danger', value < max * 0.25);
  }
  text('active-item-name', ITEMS[local.activeItem]?.name ?? 'Multi-attrezzo');
  text('battery-value', ITEMS[local.activeItem]?.weapon ? `BAT ${Math.ceil(local.battery)}%` : '');
  const inStorm = local.z <= world.run.stormZ;
  text(
    'hazard-label',
    inStorm
      ? 'NELLA TEMPESTA'
      : local.z >= 1200 && !local.inventory.thermal && !stationNearby('campfire')
        ? 'FREDDO'
        : local.z >= 400 && local.z < 800 && !local.inventory.filter
          ? 'SPORE'
          : 'VITALI',
  );
  $('storm-status').classList.toggle('danger-zone', inStorm);
  text(
    'storm-time',
    world.run.elapsed < STORM.grace
      ? `TEMPESTA IN ${formatTime(STORM.grace - world.run.elapsed)}`
      : 'TEMPESTA IN AVANZAMENTO',
  );
  text(
    'storm-distance',
    world.run.elapsed < STORM.grace
      ? 'Prepara il campo prima di partire'
      : inStorm
        ? 'Esci dalla tempesta. Muoviti verso est!'
        : `${Math.round(local.z - world.run.stormZ)} m alle tue spalle`,
  );
  const dayTime = world.run.elapsed % DAY.length;
  text(
    'day-status',
    `${dayTime < DAY.length * DAY.dayFraction ? 'GIORNO' : 'NOTTE'} · ${formatTime(world.run.elapsed)}`,
  );
  text('structure-count', `${world.structures.length} STRUTTURE · ${world.run.research} DR`);
  updateObjective();
  renderInventory();
  const crewKey = players
    .map((p) => `${p.id}:${p.connected}:${p.status}:${Math.ceil(p.o2)}:${p.name}`)
    .join('|');
  if (crewKey !== crewSignature) {
    crewSignature = crewKey;
    $('crew').innerHTML =
      `<span class="small-caps">EQUIPAGGIO ${players.filter((p) => p.connected).length}/${localMode ? 1 : MAX_PLAYERS}</span>${players.map((p) => `<div class="crew-member"><i class="crew-dot ${!p.connected ? 'offline' : p.status !== 'alive' ? 'down' : ''}"></i><span>${safe(p.name)}${p.id === playerId ? ' (tu)' : ''}</span><small>${!p.connected ? 'OFFLINE' : p.status === 'downed' ? 'A TERRA' : p.status === 'dead' ? 'RITORNO…' : `${Math.ceil(p.o2)} O₂`}</small></div>`).join('')}`;
  }
  const isDown = local.status === 'downed' || local.status === 'dead';
  $('downed').hidden = !isDown || resultShown;
  if (isDown) {
    text('downed-title', local.status === 'dead' ? 'Ritorno al campo' : 'Sei a terra');
    text(
      'downed-detail',
      local.status === 'dead'
        ? `Rientro tra ${Math.max(0, Math.ceil(local.respawnAt - world.run.elapsed))} s`
        : `${Math.max(0, Math.ceil(local.downedUntil - world.run.elapsed))} s · ${local.inventory.medkit > 0 ? 'Tieni premuto E per usare il Medikit' : 'Un compagno può rianimarti tenendo premuto E'}`,
    );
    $('revive-progress').style.width =
      `${Math.min(100, (local.reviveProgress * 100) / (local.inventory.medkit > 0 ? PLAYER.selfReviveTime : PLAYER.reviveTime))}%`;
  }
  $('extraction-status').hidden = world.run.phase !== 'extracting';
  if (world.run.phase === 'extracting') {
    text('extraction-time', formatTime(EXTRACTION.duration - world.run.extraction));
    $('extraction-progress').style.width = `${(world.run.extraction / EXTRACTION.duration) * 100}%`;
    text(
      'extraction-detail',
      distance > EXTRACTION.radius
        ? 'Rientra nel perimetro. Il conto alla rovescia è fermo.'
        : 'Mantieni la posizione. La navetta è in arrivo.',
    );
  }
  if (world.run.phase === 'won' || world.run.phase === 'lost') showResult();
}
function flashDamage(): void {
  $('damage-flash').classList.remove('flash');
  void $('damage-flash').offsetWidth;
  $('damage-flash').classList.add('flash');
}
function showResult(): void {
  if (!resultShown) {
    resultShown = true;
    paused = false;
    neutralInput();
    showPanel(null);
    cancelPlacement();
    releaseMouse();
    $('pause-menu').hidden = true;
    $('downed').hidden = true;
    $('result').hidden = false;
  }
  const won = world.run.phase === 'won';
  text('result-eyebrow', won ? 'AURORA–7 / EQUIPAGGIO RECUPERATO' : 'AURORA–7 / SEGNALE PERSO');
  text('result-title', won ? 'Estrazione riuscita.' : 'La spedizione è finita.');
  text(
    'result-detail',
    world.run.reason ??
      (won
        ? 'La navetta ha agganciato il segnale. Questa volta, si torna a casa.'
        : 'Il pianeta ha avuto la meglio. La ricerca raccolta servirà alla prossima spedizione.'),
  );
  text('result-research', `${world.run.research}`);
  text('result-kills', `${world.run.kills}`);
  text('result-time', formatTime(world.run.elapsed));
}
function appendChat(name: string, message: string): void {
  const line = document.createElement('p');
  const author = document.createElement('strong');
  author.textContent = name;
  line.append(author, document.createTextNode(` ${message}`));
  $('chat-log').append(line);
  while ($('chat-log').children.length > 6) $('chat-log').firstElementChild?.remove();
}
function remotePlayers(now: number): PlayerState[] {
  const at = now - 100;
  let a = snapshots[0];
  let b = snapshots[snapshots.length - 1];
  for (let i = 1; i < snapshots.length; i++)
    if (snapshots[i].at >= at) {
      a = snapshots[i - 1];
      b = snapshots[i];
      break;
    }
  if (!a || !b || a === b) return players;
  const t = Math.max(0, Math.min(1, (at - a.at) / (b.at - a.at)));
  return b.players.map((p) => {
    const old = a.players.find((previous) => previous.id === p.id);
    return p.id === playerId || !old
      ? p
      : {
          ...p,
          x: old.x + (p.x - old.x) * t,
          y: old.y + (p.y - old.y) * t,
          z: old.z + (p.z - old.z) * t,
          yaw: lerpAngle(old.yaw, p.yaw, t),
        };
  });
}
function selectTargets(): void {
  if (!local) return;
  nearestNode = undefined;
  nearestStructure = undefined;
  nearestCreature = undefined;
  interaction = undefined;
  let closest = PLAYER.interactRange;
  for (const node of view.nodes) {
    if (depleted.has(node.id)) continue;
    const distance = Math.hypot(node.x - local.x, heightAt(seed, node.x, node.z) - local.y, node.z - local.z);
    if (distance <= closest) {
      nearestNode = node;
      closest = distance;
      interaction = {
        id: node.id,
        kind: 'node',
        title:
          node.kind === 'oxygen'
            ? 'Bulbo d’ossigeno · +40 O₂'
            : node.kind === 'cache'
              ? 'Cache dati · +5 DR'
              : (ITEMS[node.kind]?.name ?? node.kind),
        detail: node.kind === 'cache' ? 'Recupera i dati di ricerca' : 'Raccogli',
      };
    }
  }
  for (const capsule of world.capsules)
    if (Math.hypot(capsule.x - local.x, capsule.z - local.z) <= PLAYER.interactRange)
      interaction = {
        id: capsule.id,
        kind: 'capsule',
        title: 'Capsula di recupero',
        detail: 'Recupera i materiali rimasti',
      };
  for (const player of players)
    if (
      player.id !== playerId &&
      player.connected &&
      player.status === 'downed' &&
      Math.hypot(player.x - local.x, player.z - local.z) <= PLAYER.reviveRange
    )
      interaction = {
        id: player.id,
        kind: 'revive',
        title: `Rianima ${player.name}`,
        detail: 'Tieni premuto E per 3 secondi',
      };
  const extractionDistance = Math.hypot(local.x - valleyCenter(seed, WORLD.signalZ), local.z - WORLD.signalZ);
  if (extractionDistance <= EXTRACTION.radius && world.run.phase === 'exploring')
    interaction = {
      id: 'extraction',
      kind: 'extraction',
      title: 'Faro di estrazione',
      detail: local.inventory.uplink > 0 ? 'Attiva il Modulo di uplink' : 'Serve un Modulo di uplink',
    };
  let structureDistance = PLAYER.interactRange;
  for (const structure of world.structures) {
    const distance = Math.hypot(structure.x - local.x, structure.z - local.z);
    if (distance < structureDistance) {
      nearestStructure = structure;
      structureDistance = distance;
    }
  }
  const weaponRange = ITEMS[local.activeItem]?.weapon?.range ?? ITEMS[local.activeItem]?.tool?.range ?? 3;
  let creatureDistance = weaponRange;
  const f = forwardXZ(view.yaw);
  for (const creature of world.creatures) {
    const dx = creature.x - local.x;
    const dz = creature.z - local.z;
    const distance = Math.hypot(dx, dz);
    if (
      creature.hp > 0 &&
      distance < creatureDistance &&
      (dx * f.x + dz * f.z) / Math.max(0.01, distance) > (weaponRange > 10 ? 0.94 : 0.35)
    ) {
      nearestCreature = creature;
      creatureDistance = distance;
    }
  }
  $('interaction').hidden = !interaction || !!panel || paused || resultShown || local.status !== 'alive';
  if (interaction) {
    text('node-name', interaction.title);
    text('interaction-detail', interaction.detail);
  }
  $('target-health').hidden = !nearestCreature || !!panel || paused;
  if (nearestCreature) {
    text('target-name', CREATURES[nearestCreature.kind].name);
    $('target-hp').style.width = `${(nearestCreature.hp / CREATURES[nearestCreature.kind].hp) * 100}%`;
  }
  $('crosshair').classList.toggle('targeted', !!nearestCreature);
  if (nearestStructure && !interaction) {
    $('interaction').hidden = !!panel || paused || resultShown;
    text('node-name', STRUCTURES[nearestStructure.kind].name);
    text('interaction-detail', `${Math.ceil(nearestStructure.hp)} PS · X per smontare`);
    text('interaction-key', 'X');
  } else text('interaction-key', 'E');
}
function updatePlacement(): void {
  if (!placementKind || !local) {
    $('placement').hidden = true;
    return;
  }
  const f = forwardXZ(view.yaw);
  const x = local.x + f.x * 4;
  const z = local.z + f.z * 4;
  const camp = world.structures.some(
    (s) => s.kind === 'beacon' && Math.hypot(s.x - x, s.z - z) <= CAMP.radius,
  );
  const space = !world.structures.some((s) => Math.hypot(s.x - x, s.z - z) < 2.8);
  const inValley =
    Math.abs(x - valleyCenter(seed, z)) <= WORLD.halfWidth - 4 && z >= WORLD.zMin && z <= WORLD.zMax;
  const ground = heightAt(seed, x, z);
  const slope = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ].every(([dx, dz]) => Math.abs(heightAt(seed, x + dx, z + dz) - ground) <= 0.75);
  const valid =
    affordable(structureCost(placementKind)) &&
    (!STRUCTURES[placementKind].requiresCamp || camp) &&
    space &&
    inValley &&
    slope &&
    z > world.run.stormZ;
  placementPoint = { x, z, valid };
  view.setPlacement(placementKind, x, z, placementYaw, valid);
  $('placement').hidden = false;
  text('placement-name', STRUCTURES[placementKind].name);
  text(
    'placement-valid',
    valid
      ? 'Posizione valida · Clic per costruire'
      : !affordable(structureCost(placementKind))
        ? 'Materiali insufficienti'
        : !camp && STRUCTURES[placementKind].requiresCamp
          ? 'Richiede un Faro di campo entro 18 m'
          : !space
            ? 'Troppo vicino a un’altra struttura'
            : 'Terreno non valido',
  );
  $('placement').classList.toggle('invalid', !valid);
}
function drawMap(): void {
  if (!local) return;
  const canvas = $<HTMLCanvasElement>('minimap');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const w = canvas.width,
    h = canvas.height,
    scale = 1.3;
  const px = (x: number) => w / 2 - (x - local!.x) * scale;
  const py = (z: number) => h / 2 - (z - local!.z) * scale;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#10282bbd';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = '#aac7b51a';
  ctx.lineWidth = 1;
  for (let i = 0; i < w; i += 25) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, h);
    ctx.stroke();
  }
  for (let i = 0; i < h; i += 25) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(w, i);
    ctx.stroke();
  }
  ctx.strokeStyle = '#8aa69a55';
  ctx.lineWidth = 2;
  for (const side of [-1, 1]) {
    ctx.beginPath();
    for (let iz = -100; iz <= 100; iz += 5) {
      const z = local.z + iz;
      const x = valleyCenter(seed, z) + side * WORLD.halfWidth;
      if (iz === -100) ctx.moveTo(px(x), py(z));
      else ctx.lineTo(px(x), py(z));
    }
    ctx.stroke();
  }
  const dot = (x: number, z: number, color: string, r = 2) => {
    const sx = px(x),
      sy = py(z);
    if (sx < 0 || sx > w || sy < 0 || sy > h) return;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
    ctx.fill();
  };
  for (const node of view.nodes)
    if (!depleted.has(node.id))
      dot(
        node.x,
        node.z,
        node.kind === 'oxygen' ? '#7ce8d6' : node.kind === 'cache' ? '#f0ce7a' : '#809b8b66',
        node.kind === 'oxygen' || node.kind === 'cache' ? 2.5 : 1,
      );
  for (const s of world.structures) dot(s.x, s.z, '#f0b480', 3);
  for (const c of world.creatures)
    if (c.hp > 0) dot(c.x, c.z, CREATURES[c.kind].hostile ? '#ed8e7d' : '#b3bfaa', 2);
  for (const p of players) if (p.connected && p.id !== playerId) dot(p.x, p.z, '#d1eac6', 3);
  ctx.fillStyle = '#b57bd433';
  const stormY = py(world.run.stormZ);
  ctx.fillRect(0, Math.max(0, stormY), w, Math.max(0, h - stormY));
  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.rotate(-view.yaw);
  ctx.fillStyle = '#f4d4a3';
  ctx.beginPath();
  ctx.moveTo(0, -6);
  ctx.lineTo(4, 4);
  ctx.lineTo(0, 2);
  ctx.lineTo(-4, 4);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = '#bdd0be';
  ctx.font = '8px system-ui';
  ctx.fillText('EST ↑', 8, 14);
  ctx.fillText('50 m', w - 30, h - 8);
}

// Delegated controls keep recipe buttons stable while authoritative state changes.
app.addEventListener('click', (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button');
  if (!button || button.disabled) return;
  if (button.dataset.craft) send({ type: 'craft', itemId: button.dataset.craft });
  if (button.dataset.consume) send({ type: 'consume', itemId: button.dataset.consume });
  if (button.dataset.equip) equip(button.dataset.equip);
  if (button.dataset.build) {
    placementKind = button.dataset.build as StructureKind;
    placementYaw = 0;
    showPanel(null);
    toast('Scegli una posizione nel mondo. R ruota, clic conferma.');
  }
  if (button.dataset.unlock) {
    if (playing && !localMode) send({ type: 'unlock', perkId: button.dataset.unlock });
    else {
      const result = purchaseLocalPerk(button.dataset.unlock);
      profile = result.profile;
      if (result.error) toast(result.error);
      else audio.play('ui');
      renderLaboratory();
      updateLobby();
    }
  }
});
$('create').addEventListener('click', () => connect());
$('solo').addEventListener('click', () => connect(undefined, false, 'local'));
$('continue-resume').addEventListener('click', () => connect(undefined, false, 'local', true));
$('join-form').addEventListener('submit', (event) => {
  event.preventDefault();
  if (defaultLocalMode) {
    connect(undefined, false, 'local');
    return;
  }
  const code = $<HTMLInputElement>('code').value.trim().toUpperCase();
  if (!/^[A-Z]{4}$/.test(code)) {
    text('lobby-error', 'Inserisci un codice stanza di 4 lettere.');
    return;
  }
  connect(code, false, 'online');
});
$('code').addEventListener('input', () => {
  $<HTMLInputElement>('code').value = $<HTMLInputElement>('code').value.toUpperCase();
});
for (const id of ['leave', 'restart', 'pause-leave']) $(id).addEventListener('click', leave);
$('share').addEventListener('click', () => {
  const url = new URL(location.href);
  url.searchParams.set('room', room);
  const invite = location.protocol === 'file:' ? room : url.href;
  navigator.clipboard
    ?.writeText(invite)
    .then(() =>
      toast(
        location.protocol === 'file:'
          ? 'Codice stanza copiato. Condividilo con il tuo equipaggio.'
          : 'Link copiato. Il tuo equipaggio può raggiungerti.',
      ),
    )
    .catch(() => toast(`Codice stanza: ${room}`));
  if (!navigator.clipboard) toast(`Codice stanza: ${room}`);
});
$('open-inventory').addEventListener('click', () => {
  if (local && !resultShown) showPanel(panel === 'inventory' ? null : 'inventory');
});
$('close-inventory').addEventListener('click', () => showPanel(null));
$('open-building').addEventListener('click', () => {
  if (canAct()) showPanel('build-menu');
});
$('close-building').addEventListener('click', () => showPanel(null));
for (const id of ['open-help', 'objective-guide', 'pause-help'])
  $(id).addEventListener('click', () => showPanel('help'));
$('close-help').addEventListener('click', () => showPanel(null));
$('open-lab').addEventListener('click', () => {
  audio.unlock();
  profile = loadLocalProfile();
  showPanel('laboratory');
});
$('close-lab').addEventListener('click', () => showPanel(null));
$('pause-button').addEventListener('click', () => setPaused(true));
$('resume').addEventListener('click', () => setPaused(false));
$('mute').addEventListener('click', () => {
  muted = !muted;
  audio.setMuted(muted);
  text('mute', `Audio: ${muted ? 'disattivato' : 'attivo'}`);
  try {
    localStorage.setItem('segnale-muted', muted ? '1' : '0');
  } catch {
    /* Optional preference. */
  }
});
$('capture').addEventListener('click', () => {
  if (!paused && !panel) view.renderer.domElement.requestPointerLock()?.catch(() => {});
});
$('transfer').addEventListener('click', () =>
  send({
    type: 'transfer',
    targetId: $<HTMLSelectElement>('transfer-player').value,
    itemId: $<HTMLSelectElement>('transfer-item').value,
    amount: 1,
  }),
);
$('chat-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const input = $<HTMLInputElement>('chat-input');
  const message = input.value.trim();
  if (message && !localMode) send({ type: 'chat', text: message });
  input.value = '';
  $('chat-form').hidden = true;
  input.blur();
});
document.addEventListener('mousemove', (event) => {
  if (document.pointerLockElement && playing) look(event.movementX, event.movementY);
});
document.addEventListener('pointerlockchange', () => {
  const locked = !!document.pointerLockElement;
  if (
    !locked &&
    wasPointerLocked &&
    !preventPauseOnRelease &&
    playing &&
    !panel &&
    !resultShown &&
    !placementKind
  )
    setPaused(true);
  wasPointerLocked = locked;
});
window.addEventListener('keydown', (event) => {
  if (!playing || event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) {
    if (event.code === 'Escape' && !$('chat-form').hidden) {
      $('chat-form').hidden = true;
      $<HTMLInputElement>('chat-input').blur();
    }
    return;
  }
  if (
    [
      'Tab',
      'Space',
      'KeyW',
      'KeyA',
      'KeyS',
      'KeyD',
      'ArrowUp',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
    ].includes(event.code)
  )
    event.preventDefault();
  audio.unlock();
  if (event.code === 'Escape' && !event.repeat) {
    if (placementKind) cancelPlacement();
    else if (panel) showPanel(null);
    else setPaused(!paused);
    return;
  }
  if (resultShown || paused) return;
  if (event.code === 'Tab' && !event.repeat) {
    cancelPlacement();
    showPanel(panel === 'inventory' ? null : 'inventory');
    return;
  }
  if (event.code === 'KeyB' && !event.repeat && local?.status === 'alive') {
    cancelPlacement();
    showPanel(panel === 'build-menu' ? null : 'build-menu');
    return;
  }
  if (panel) return;
  if (event.code === 'Enter' && !event.repeat && !localMode) {
    neutralInput();
    releaseMouse();
    $('chat-form').hidden = false;
    $<HTMLInputElement>('chat-input').focus();
    return;
  }
  keys.add(event.code);
  if (event.repeat) return;
  if (event.code === 'Space') jump = true;
  if (event.code === 'KeyQ') dodge = true;
  if (event.code === 'KeyE') interact();
  if (event.code === 'KeyR' && placementKind) placementYaw += Math.PI / 2;
  if (event.code === 'KeyX' && nearestStructure)
    send({ type: 'dismantle', structureId: nearestStructure.id });
  if (/^Digit[1-6]$/.test(event.code)) equip(hotbarItems()[Number(event.code.slice(-1)) - 1]);
});
window.addEventListener('keyup', (event) => keys.delete(event.code));
window.addEventListener('blur', () => {
  neutralInput();
  if (localMode && playing && !resultShown) setPaused(true);
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    neutralInput();
    if (localMode && playing && !resultShown) setPaused(true);
  }
});
setInterval(() => {
  if (
    !local ||
    !playing ||
    paused ||
    resultShown ||
    socket?.readyState !== WebSocket.OPEN ||
    local.status === 'dead'
  )
    return;
  const f = forwardXZ(view.yaw),
    r = rightXZ(view.yaw);
  const blocked = !!panel || !$('chat-form').hidden;
  const v = blocked
    ? 0
    : Number(keys.has('KeyW') || keys.has('ArrowUp')) - Number(keys.has('KeyS') || keys.has('ArrowDown'));
  const h = blocked
    ? 0
    : Number(keys.has('KeyD') || keys.has('ArrowRight')) - Number(keys.has('KeyA') || keys.has('ArrowLeft'));
  const input: MoveInput = {
    seq: seq++,
    moveX: f.x * v + r.x * h,
    moveZ: f.z * v + r.z * h,
    yaw: view.yaw,
    sprint: !blocked && (keys.has('ShiftLeft') || keys.has('ShiftRight')),
    jump: !blocked && jump,
    interact: !blocked && keys.has('KeyE'),
    dodge: !blocked && dodge,
  };
  const magnitude = Math.hypot(input.moveX, input.moveZ);
  if (magnitude > 1) {
    input.moveX /= magnitude;
    input.moveZ /= magnitude;
  }
  jump = false;
  dodge = false;
  if (send({ type: 'input', input })) {
    pending.push(input);
    if (pending.length > 20) pending.shift();
    stepPlayer(local, input, TICK_DT, seed);
  }
}, TICK_DT * 1000);

resetView(42);
setBusy(false);
updateLobby();
text('mute', `Audio: ${muted ? 'disattivato' : 'attivo'}`);
const previewPlayer = createPlayer('preview', '', 42);
let lastFrame = performance.now(),
  lastSelection = 0;
let rendered: PlayerState | undefined;
function frame(now: number): void {
  requestAnimationFrame(frame);
  if (!graphicsReady) return;
  const dt = Math.min((now - lastFrame) / 1000, 0.1);
  lastFrame = now;
  if (local && playing) {
    if (!rendered || rendered.id !== local.id || Math.hypot(rendered.x - local.x, rendered.z - local.z) > 10)
      rendered = { ...local };
    const blend = 1 - Math.exp(-24 * dt);
    const old = { x: rendered.x, y: rendered.y, z: rendered.z };
    Object.assign(rendered, local);
    rendered.x = old.x + (local.x - old.x) * blend;
    rendered.y = old.y + (local.y - old.y) * blend;
    rendered.z = old.z + (local.z - old.z) * blend;
    if (now - lastSelection > 90) {
      selectTargets();
      updatePlacement();
      drawMap();
      lastSelection = now;
    }
    $('capture').hidden =
      !!document.pointerLockElement ||
      !!panel ||
      paused ||
      resultShown ||
      local.status !== 'alive' ||
      !!placementKind;
    $('crosshair').hidden = !!panel || paused || resultShown;
    text('heading', `${Math.round(((view.yaw * 180) / Math.PI + 360) % 360)}° E`);
    view.update(
      rendered,
      remotePlayers(now),
      depleted,
      nearestCreature?.id ?? nearestNode?.id ?? nearestStructure?.id,
      world,
    );
  } else if (!playing) {
    rendered = undefined;
    view.yaw = -0.32 + Math.sin(now * 0.000035) * 0.035;
    view.pitch = 0.2;
    view.update(previewPlayer, [], new Set());
  }
}
requestAnimationFrame(frame);
