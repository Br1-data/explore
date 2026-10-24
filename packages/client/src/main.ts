import {
  ITEMS,
  INTERP_DELAY,
  MAX_PLAYERS,
  PLAYER,
  PROTOCOL_VERSION,
  TICK_DT,
  WORLD,
  biomeAt,
  createPlayer,
  forwardXZ,
  heightAt,
  valleyCenter,
  lerpAngle,
  rightXZ,
  stepPlayer,
} from '@segnale/shared';
import type { ClientMessage, MoveInput, PlayerState, ServerMessage, WorldNode } from '@segnale/shared';
import { WorldView } from './game/view';
import './style.css';

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
  <div id="world"></div><div class="vignette"></div>
  <header class="topbar">
    <a class="brand" href="./" aria-label="Segnale Remoto, menu principale"><span class="brand-mark">⌁</span><span>SEGNALE<span class="brand-light"> REMOTO</span><small>KEPLER–SIGMA / AURORA–7</small></span></a>
    <div id="session" hidden><span class="live-dot"></span><span id="connection-label">CONNESSO</span><button id="share" class="room-button" title="Copia il link d’invito">STANZA <strong id="room-code"></strong><span>→</span></button><button id="leave" class="quiet">Esci</button></div>
    <span id="build-label" class="build-label">DIARIO DI BORDO <b>001</b></span>
  </header>
  <main id="lobby" class="lobby">
    <div class="eyebrow"><span></span> IL PRIMO PASSO È SOPRAVVIVERE</div>
    <h1>Lontani da casa.<br><em>Insieme, verso est.</em></h1>
    <p class="intro">Un pianeta sconosciuto. Un segnale all’orizzonte.<br>Esplora, raccogli e tieni d’occhio l’ossigeno.<br>Il tuo equipaggio conta su di te.</p>
    <form id="join-form" class="boarding" autocomplete="off">
      <label for="name">IL TUO NOMINATIVO</label>
      <input id="name" name="name" maxlength="20" placeholder="Astronauta" required value="Astronauta" />
      <button id="create" class="primary" type="button">Nuova spedizione <span>→</span></button>
      <div class="divider"><span>OPPURE RAGGIUNGI IL TUO EQUIPAGGIO</span></div>
      <div class="join-row"><label class="sr-only" for="code">Codice stanza</label><input id="code" name="code" maxlength="4" pattern="[A-Za-z]{4}" placeholder="CODICE" aria-label="Codice stanza" /><button id="join" class="secondary" type="submit">Unisciti →</button></div>
      <p id="lobby-error" class="form-error" role="alert"></p>
      <p class="boarding-note"><span class="live-dot"></span> 1–4 astronauti <span>·</span> Co-op online <span>·</span> Nessun account</p>
    </form>
    <div class="prototype-note"><span>PRIMO CONTATTO</span> Prototipo esplorativo · raccolta e sopravvivenza</div>
  </main>
  <aside id="landing-info" class="landing-info"><span class="coordinate">K–Σ / SETTORE 01</span><strong>Prateria<br>Cristallina</strong><p>Ultima posizione nota dell’Aurora–7</p><div class="landing-line"></div><span class="small-caps">IL SEGNALE È ANCORA LÀ FUORI.</span></aside>
  <section id="hud" hidden aria-label="Dati della spedizione">
    <div class="destination"><span class="eyebrow">ROTTA DI ESPLORAZIONE / EST</span><strong id="biome-name">Prateria Cristallina</strong><span id="distance">Faro a 1.560 m</span><div class="route"><span id="route-progress"></span><i></i></div><small>Il faro è una meta esplorativa. Estrazione in arrivo.</small></div>
    <div id="crew" class="crew" aria-label="Equipaggio"></div>
    <div class="compass"><span>O</span><i></i><strong id="heading">E</strong><i></i><span>E</span></div>
    <div id="interaction" class="interaction" hidden><kbd>E</kbd><div><strong id="node-name"></strong><span>Raccogli</span></div></div>
    <div class="vitals"><div class="vitals-heading"><span class="live-dot"></span><strong id="player-name"></strong><span>VITALI</span></div>
      <div class="vital oxygen"><span>O₂</span><div><div id="o2-bar"></div></div><b id="o2-value">100</b></div>
      <div class="vital health"><span>+</span><div><div id="hp-bar"></div></div><b id="hp-value">100</b></div>
      <div class="vital energy"><span>ϟ</span><div><div id="energy-bar"></div></div><b id="energy-value">100</b></div>
    </div>
    <div class="quickbar"><button id="tool-slot" class="slot active" title="Multi-attrezzo"><kbd>1</kbd><span>⚒</span><small>ATTREZZO</small></button><button id="use-cell" class="slot" title="Usa una cella d’ossigeno"><kbd>2</kbd><span>O₂</span><small id="cell-count">0 CELLE</small></button><button id="use-fruit" class="slot" title="Mangia un Frutto lumen"><kbd>3</kbd><span>✳</span><small id="fruit-count">0 FRUTTI</small></button><button id="open-inventory" class="inventory-shortcut"><kbd>TAB</kbd><span>Zaino<br><small>e creazione</small></span></button></div>
    <div class="controls"><span><kbd>W A S D</kbd> Movimento</span><span><kbd>SHIFT</kbd> Corsa</span><span><kbd>SPAZIO</kbd> Salto</span><span><kbd>E</kbd> Raccogli</span><span><kbd>ESC</kbd> Libera il mouse</span></div>
    <button id="capture" class="capture"><span>＋</span> Clicca nel mondo per orientare la visuale</button>
  </section>
  <section id="inventory" class="panel" hidden aria-label="Zaino e creazione"><div class="panel-heading"><div><span class="eyebrow">EQUIPAGGIAMENTO / AURORA–7</span><h2>Il tuo zaino</h2></div><button id="close-inventory" class="close" aria-label="Chiudi zaino">×</button></div><p class="panel-copy">Raccogli materiali nel mondo per preparare il viaggio.</p><div id="inventory-items" class="inventory-items"></div><div class="recipe"><span class="recipe-icon">O₂</span><div><h3>Cella d’ossigeno</h3><p>Ripristina 50 O₂. Da portare sempre con sé.</p><small id="recipe-cost">2 Cristalli + 1 Rottame</small></div><button id="craft" class="secondary">Crea cella</button></div><div class="panel-footer"><kbd>TAB</kbd> Chiudi lo zaino · Le risorse sono personali</div></section>
  <section id="downed" class="panel end-panel" hidden><span class="eyebrow">TELEMETRIA INTERROTTA</span><h2>Ossigeno esaurito.</h2><p>La tua esplorazione finisce qui. Nella prossima spedizione cerca i bulbi d’ossigeno e porta con te qualche cella.</p><p class="muted">Rianimazione e respawn arriveranno nei prossimi aggiornamenti.</p><button id="restart" class="primary">Torna al menu →</button></section>
  <div id="toast" class="toast" role="status" hidden></div>
  <footer id="lobby-footer"><span>01 / SCHIANTO</span><span>PROTOTIPO IN SVILUPPO <i></i> MONDO PROCEDURALE</span><span>ESPLORA. RESPIRA. RIPARTI.</span></footer>
`;

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const worldHost = $('world');
const keys = new Set<string>();
let view: WorldView;
let graphicsReady = false;
let socket: WebSocket | undefined;
let playerId = '';
let room = '';
let seed = 42;
let local: PlayerState | undefined;
let players: PlayerState[] = [];
let depleted = new Set<string>();
let pending: MoveInput[] = [];
let seq = 0;
let nearest: WorldNode | undefined;
let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
let reconnectStarted = 0;
let intentionalClose = false;
let playing = false;
let jump = false;
let inventoryOpen = false;
let toastTimeout: ReturnType<typeof setTimeout>;
let snapshots: { at: number; players: PlayerState[] }[] = [];
let token: string;
try {
  token = sessionStorage.getItem('segnale-token') ?? crypto.randomUUID();
  sessionStorage.setItem('segnale-token', token);
  $('name').setAttribute('value', localStorage.getItem('segnale-name') ?? 'Astronauta');
} catch {
  token = crypto.randomUUID();
}
const initialRoom = new URL(location.href).searchParams.get('room');
if (initialRoom && /^[a-z]{4}$/i.test(initialRoom))
  $('code').setAttribute('value', initialRoom.toUpperCase());

function toast(message: string): void {
  $('toast').textContent = message;
  $('toast').hidden = false;
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    $('toast').hidden = true;
  }, 3500);
}

function send(message: ClientMessage): boolean {
  if (socket?.readyState !== WebSocket.OPEN || socket.bufferedAmount > 64 * 1024) return false;
  socket.send(JSON.stringify(message));
  return true;
}

function setInventory(open: boolean): void {
  inventoryOpen = open && playing && (local?.hp ?? 0) > 0;
  $('inventory').hidden = !inventoryOpen;
  keys.clear();
  jump = false;
  if (inventoryOpen) document.exitPointerLock();
}

function leave(): void {
  intentionalClose = true;
  clearTimeout(reconnectTimer);
  socket?.close();
  socket = undefined;
  playing = false;
  playerId = '';
  room = '';
  local = undefined;
  players = [];
  pending = [];
  snapshots = [];
  depleted.clear();
  keys.clear();
  setInventory(false);
  document.exitPointerLock();
  for (const id of ['hud', 'session', 'downed']) $(id).hidden = true;
  for (const id of ['lobby', 'landing-info', 'build-label', 'lobby-footer']) $(id).hidden = false;
  $('lobby-error').textContent = '';
  setBusy(false);
  const url = new URL(location.href);
  url.searchParams.delete('room');
  history.replaceState(null, '', url);
  resetView(42);
}

function setBusy(busy: boolean): void {
  for (const id of ['create', 'join']) $<HTMLButtonElement>(id).disabled = busy;
  $('create').firstChild!.textContent = busy ? 'Collegamento in corso… ' : 'Nuova spedizione ';
}

function connect(requestedRoom?: string, reconnect = false): void {
  if (!graphicsReady) return;
  const name = $<HTMLInputElement>('name').value.trim();
  if (!name) {
    $<HTMLInputElement>('name').reportValidity();
    return;
  }
  if (!reconnect) {
    intentionalClose = false;
    reconnectStarted = 0;
    $('lobby-error').textContent = '';
    setBusy(true);
  }
  try {
    localStorage.setItem('segnale-name', name);
  } catch {
    /* Storage is optional. */
  }
  const url = new URL('/ws', location.href);
  url.protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
  const current = new WebSocket(url);
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
    if (message.type === 'error') {
      if (!welcomed) {
        const error = message.message;
        leave();
        $('lobby-error').textContent = error;
      } else toast(message.message);
      return;
    }
    if (message.type === 'welcome') {
      welcomed = true;
      playing = true;
      playerId = message.playerId;
      room = message.room;
      seed = message.seed;
      pending = [];
      snapshots = [];
      keys.clear();
      reconnectStarted = 0;
      if (!reconnect) {
        local = undefined;
        if (!resetView(seed)) {
          leave();
          return;
        }
      }
      for (const id of ['lobby', 'landing-info', 'build-label', 'lobby-footer']) $(id).hidden = true;
      $('hud').hidden = false;
      $('session').hidden = false;
      $('connection-label').textContent = 'CONNESSO';
      $('room-code').textContent = room;
      const url = new URL(location.href);
      url.searchParams.set('room', room);
      history.replaceState(null, '', url);
      toast(
        reconnect
          ? 'Collegamento ristabilito. Bentornato a bordo.'
          : 'Atterraggio riuscito. Raccogli rottami e cristalli vicino al relitto.',
      );
      return;
    }
    if (message.type === 'snapshot') {
      players = message.players;
      depleted = new Set(message.depleted);
      const authoritative = players.find((p) => p.id === playerId);
      if (authoritative) {
        seq = Math.max(seq, authoritative.lastSeq + 1);
        pending = pending.filter((input) => input.seq > authoritative.lastSeq);
        local = { ...authoritative, inventory: { ...authoritative.inventory } };
        if (local.hp > 0) for (const input of pending) stepPlayer(local, input, TICK_DT, seed);
      }
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
      $('lobby-error').textContent = 'Questa sessione è stata aperta in un’altra finestra.';
      return;
    }
    if ((welcomed || reconnect) && room) {
      reconnectStarted ||= Date.now();
      if (Date.now() - reconnectStarted < 55_000) {
        $('connection-label').textContent = 'RICONNESSIONE…';
        toast('Segnale perso. Provo a ricollegare la spedizione…');
        reconnectTimer = setTimeout(() => connect(room, true), 1500);
        return;
      }
    }
    leave();
    $('lobby-error').textContent =
      welcomed || reconnect
        ? 'Connessione persa. Puoi rientrare con il codice stanza.'
        : 'Server non raggiungibile. Verifica che sia avviato e riprova.';
  });
}

function resetView(nextSeed: number): boolean {
  graphicsReady = false;
  view?.dispose();
  try {
    view = new WorldView(nextSeed, worldHost);
    graphicsReady = true;
  } catch {
    $('lobby-error').textContent =
      'La grafica 3D richiede WebGL. Abilita l’accelerazione grafica e ricarica la pagina.';
    setBusy(false);
    $<HTMLButtonElement>('create').disabled = true;
    $<HTMLButtonElement>('join').disabled = true;
    return false;
  }
  view.renderer.domElement.addEventListener('click', () => {
    if (!playing || inventoryOpen || (local?.hp ?? 0) <= 0) return;
    if (document.pointerLockElement) gather();
    else
      view.renderer.domElement
        .requestPointerLock()
        ?.catch(() => toast('Puoi orientare la visuale trascinando il mouse.'));
  });
  // Drag to look is also available when pointer lock is unavailable.
  let dragging = false;
  view.renderer.domElement.addEventListener('pointerdown', () => {
    dragging = true;
  });
  view.renderer.domElement.addEventListener('pointerup', () => {
    dragging = false;
  });
  view.renderer.domElement.addEventListener('pointerleave', () => {
    dragging = false;
  });
  view.renderer.domElement.addEventListener('pointermove', (event) => {
    if (dragging && !document.pointerLockElement && playing) look(event.movementX, event.movementY);
  });
  return true;
}

function look(dx: number, dy: number): void {
  if (!graphicsReady || inventoryOpen) return;
  view.yaw -= dx * 0.003;
  // Keep the network yaw in a small finite range, even after many rotations.
  view.yaw = Math.atan2(Math.sin(view.yaw), Math.cos(view.yaw));
  view.pitch = Math.max(0.08, Math.min(1.15, view.pitch + dy * 0.003));
}

document.addEventListener('mousemove', (event) => {
  if (document.pointerLockElement && playing) look(event.movementX, event.movementY);
});
document.addEventListener('pointerlockchange', () => {
  $('capture').hidden = !!document.pointerLockElement || inventoryOpen;
});
function gather(): void {
  if (nearest && local && local.hp > 0 && !inventoryOpen) send({ type: 'gather', nodeId: nearest.id });
}
function consume(itemId: 'oxycell' | 'fruit'): void {
  if (playing && local && local.hp > 0) send({ type: 'consume', itemId });
}

$('create').addEventListener('click', () => {
  if ($<HTMLInputElement>('name').checkValidity()) connect();
  else $<HTMLInputElement>('name').reportValidity();
});
$('join-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const code = $<HTMLInputElement>('code').value.trim().toUpperCase();
  if (!/^[A-Z]{4}$/.test(code)) {
    $('lobby-error').textContent = 'Inserisci un codice stanza di 4 lettere.';
    return;
  }
  connect(code);
});
$('code').addEventListener('input', () => {
  $<HTMLInputElement>('code').value = $<HTMLInputElement>('code').value.toUpperCase();
});
for (const id of ['leave', 'restart']) $(id).addEventListener('click', leave);
$('share').addEventListener('click', () => {
  const url = new URL(location.href);
  url.searchParams.set('room', room);
  navigator.clipboard
    ?.writeText(url.href)
    .then(() => toast('Link copiato. Invitalo al tuo equipaggio!'))
    .catch(() => toast(`Condividi il codice stanza: ${room}`));
  if (!navigator.clipboard) toast(`Condividi il codice stanza: ${room}`);
});
$('open-inventory').addEventListener('click', () => setInventory(!inventoryOpen));
$('close-inventory').addEventListener('click', () => setInventory(false));
$('craft').addEventListener('click', () => send({ type: 'craft', itemId: 'oxycell' }));
$('use-cell').addEventListener('click', () => consume('oxycell'));
$('use-fruit').addEventListener('click', () => consume('fruit'));
$('tool-slot').addEventListener('click', () =>
  toast('Multi-attrezzo pronto. Avvicinati a una risorsa e premi E.'),
);
$('capture').addEventListener('click', () => view.renderer.domElement.requestPointerLock()?.catch(() => {}));

window.addEventListener('keydown', (event) => {
  if (!playing || event.target instanceof HTMLInputElement) return;
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
  if (event.code === 'Tab' && !event.repeat) {
    setInventory(!inventoryOpen);
    return;
  }
  if (event.code === 'Escape') {
    setInventory(false);
    keys.clear();
    return;
  }
  if (inventoryOpen) return;
  keys.add(event.code);
  if (event.repeat) return;
  if (event.code === 'Space') jump = true;
  if (event.code === 'KeyE') gather();
  if (event.code === 'Digit2') consume('oxycell');
  if (event.code === 'Digit3') consume('fruit');
});
window.addEventListener('keyup', (event) => keys.delete(event.code));
window.addEventListener('blur', () => {
  keys.clear();
  jump = false;
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    keys.clear();
    jump = false;
  }
});

setInterval(() => {
  if (!local || !playing || socket?.readyState !== WebSocket.OPEN || local.hp <= 0) return;
  const forward = forwardXZ(view.yaw);
  const right = rightXZ(view.yaw);
  const vertical =
    Number(keys.has('KeyW') || keys.has('ArrowUp')) - Number(keys.has('KeyS') || keys.has('ArrowDown'));
  const horizontal =
    Number(keys.has('KeyD') || keys.has('ArrowRight')) - Number(keys.has('KeyA') || keys.has('ArrowLeft'));
  const input: MoveInput = {
    seq: seq++,
    moveX: forward.x * vertical + right.x * horizontal,
    moveZ: forward.z * vertical + right.z * horizontal,
    yaw: view.yaw,
    sprint: keys.has('ShiftLeft') || keys.has('ShiftRight'),
    jump,
  };
  const magnitude = Math.hypot(input.moveX, input.moveZ);
  if (magnitude > 1) {
    input.moveX /= magnitude;
    input.moveZ /= magnitude;
  }
  jump = false;
  if (send({ type: 'input', input })) {
    pending.push(input);
    // Bound prediction under a stalled connection; snapshots will correct position.
    if (pending.length > 20) pending.shift();
    stepPlayer(local, input, TICK_DT, seed);
  }
}, TICK_DT * 1000);

function updateHud(): void {
  if (!local) return;
  $('player-name').textContent = local.name;
  $('biome-name').textContent = biomeAt(local.z).name;
  const distance = Math.round(
    Math.hypot(local.x - valleyCenter(seed, WORLD.signalZ), WORLD.signalZ - local.z),
  );
  $('distance').textContent =
    distance < 25 ? 'Zona del faro raggiunta' : `Faro a ${distance.toLocaleString('it-IT')} m`;
  $('route-progress').style.width = `${Math.max(0, Math.min(100, (local.z / WORLD.signalZ) * 100))}%`;
  for (const [stat, value] of [
    ['o2', local.o2],
    ['hp', local.hp],
    ['energy', local.energy],
  ] as const) {
    $(`${stat}-bar`).style.width = `${Math.max(0, value)}%`;
    $(`${stat}-value`).textContent = `${Math.ceil(value)}`;
    $(`${stat}-value`).classList.toggle('danger', value < 25);
  }
  $('cell-count').textContent = `${local.inventory.oxycell ?? 0} CELLE`;
  $('fruit-count').textContent = `${local.inventory.fruit ?? 0} FRUTTI`;
  $<HTMLButtonElement>('use-cell').disabled = !(local.inventory.oxycell > 0);
  $<HTMLButtonElement>('use-fruit').disabled = !(local.inventory.fruit > 0);
  const craftable = local.inventory.crystal >= 2 && local.inventory.scrap >= 1;
  $<HTMLButtonElement>('craft').disabled = !craftable;
  $('recipe-cost').textContent =
    `${local.inventory.crystal ?? 0}/2 Cristalli + ${local.inventory.scrap ?? 0}/1 Rottame`;
  const inventory = $('inventory-items');
  inventory.replaceChildren();
  for (const [id, count] of Object.entries(local.inventory)) {
    if (count <= 0) continue;
    const def = ITEMS[id];
    const item = document.createElement('div');
    item.className = 'inventory-item';
    const glyph = document.createElement('span');
    glyph.textContent = def?.glyph ?? '◇';
    glyph.style.color = def?.color ?? '#fff';
    const name = document.createElement('strong');
    name.textContent = def?.name ?? id;
    const amount = document.createElement('b');
    amount.textContent = `×${count}`;
    item.append(glyph, name, amount);
    inventory.append(item);
  }
  const crew = $('crew');
  crew.replaceChildren();
  const count = document.createElement('span');
  count.className = 'small-caps';
  count.textContent = `EQUIPAGGIO ${players.filter((p) => p.connected).length}/${MAX_PLAYERS}`;
  crew.append(count);
  for (const player of players) {
    const entry = document.createElement('div');
    entry.className = 'crew-member';
    const dot = document.createElement('i');
    dot.className = player.hp <= 0 ? 'crew-dot down' : player.connected ? 'crew-dot' : 'crew-dot offline';
    const name = document.createElement('span');
    name.textContent = `${player.name}${player.id === playerId ? ' (tu)' : ''}`;
    const state = document.createElement('small');
    state.textContent = !player.connected
      ? 'OFFLINE'
      : player.hp <= 0
        ? 'A TERRA'
        : `${Math.ceil(player.o2)} O₂`;
    entry.append(dot, name, state);
    crew.append(entry);
  }
  $('downed').hidden = local.hp > 0;
  if (local.hp <= 0) {
    setInventory(false);
    document.exitPointerLock();
    keys.clear();
  }
}

function remotePlayers(now: number): PlayerState[] {
  const at = now - INTERP_DELAY * 1000;
  let a = snapshots[0];
  let b = snapshots[snapshots.length - 1];
  for (let i = 1; i < snapshots.length; i++) {
    if (snapshots[i].at >= at) {
      a = snapshots[i - 1];
      b = snapshots[i];
      break;
    }
  }
  if (!a || !b || a === b) return players;
  const t = Math.max(0, Math.min(1, (at - a.at) / (b.at - a.at)));
  return b.players.map((p) => {
    if (p.id === playerId) return p;
    const old = a.players.find((previous) => previous.id === p.id);
    return old
      ? {
          ...p,
          x: old.x + (p.x - old.x) * t,
          y: old.y + (p.y - old.y) * t,
          z: old.z + (p.z - old.z) * t,
          yaw: lerpAngle(old.yaw, p.yaw, t),
        }
      : p;
  });
}

resetView(42);
const previewPlayer = createPlayer('preview', '', 42);
previewPlayer.z = 2;
let lastFrame = performance.now();
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
    rendered.x += (local.x - rendered.x) * blend;
    rendered.y += (local.y - rendered.y) * blend;
    rendered.z += (local.z - rendered.z) * blend;
    rendered.yaw = local.yaw;
    rendered.hp = local.hp;
    let closest = PLAYER.interactRange;
    nearest = undefined;
    if (local.hp > 0 && !inventoryOpen)
      for (const node of view.nodes) {
        if (depleted.has(node.id)) continue;
        const distance = Math.hypot(
          node.x - local.x,
          heightAt(seed, node.x, node.z) - local.y,
          node.z - local.z,
        );
        if (distance <= closest) {
          nearest = node;
          closest = distance;
        }
      }
    $('interaction').hidden = !nearest || inventoryOpen;
    if (nearest)
      $('node-name').textContent =
        nearest.kind === 'oxygen' ? 'Bulbo d’ossigeno · +40 O₂' : (ITEMS[nearest.kind]?.name ?? nearest.kind);
    $('capture').hidden = !!document.pointerLockElement || inventoryOpen || local.hp <= 0;
    $('heading').textContent = `${Math.round(((((view.yaw * 180) / Math.PI) % 360) + 360) % 360)}°`;
    view.update(rendered, remotePlayers(now), depleted, nearest?.id);
  } else if (!playing) {
    rendered = undefined;
    view.yaw = -0.3;
    view.pitch = 0.25;
    view.update(previewPlayer, [], new Set());
  }
}
requestAnimationFrame(frame);
