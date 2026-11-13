import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { DETAILS, EXPLODE, FILES, LAYERS, README_TXT } from './details.js';
import { zip } from './zip.js';

const MODEL_URL = 'modelli/carro-celeste.glb';
const UNIT = 0.01; // world units per model millimetre
/** Model millimetres (Z up) -> world (Y up). */
const toWorld = ([x, y, z]) => new THREE.Vector3(x * UNIT, z * UNIT, -y * UNIT);

const $ = (id) => document.getElementById(id);
const stage = $('stage');
const canvas = $('view');
const params = new URLSearchParams(location.search);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches || params.has('still');

const state = {
  mode: params.get('mode') === 'stampa' ? 'stampa' : 'visione',
  detail: DETAILS[0],
  rotate: !reducedMotion,
  explode: 0,
  layers: Object.fromEntries(LAYERS.map((layer) => [layer.id, true])),
};

// ------------------------------------------------------------------ renderer and scene
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
} catch {
  $('loading').textContent = 'Questo browser non riesce a mostrare la grafica 3D (WebGL non disponibile).';
  throw new Error('WebGL unavailable');
}
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.92;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(32, 1, 0.05, 80);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 0.25;
controls.maxDistance = 9;
controls.maxPolarAngle = Math.PI * 0.56;
controls.autoRotateSpeed = 0.55;

function backdrop(inner, outer) {
  const size = 512;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const gradient = g.createRadialGradient(size / 2, size * 0.46, 0, size / 2, size * 0.5, size * 0.72);
  gradient.addColorStop(0, inner);
  gradient.addColorStop(1, outer);
  g.fillStyle = gradient;
  g.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
const backdrops = {
  visione: backdrop('#232a52', '#05060c'),
  stampa: backdrop('#3a3f4c', '#15171d'),
};

const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.45;

const hemisphere = new THREE.HemisphereLight(0x9fb2ff, 0x1c1410, 0.35);
const key = new THREE.DirectionalLight(0xffffff, 0.9);
key.position.set(-2.4, 4.2, 3.2);
const fireLight = new THREE.PointLight(0xff7a2a, 0.35, 0, 2);
fireLight.position.copy(toWorld([0, 0, 30]));
const gloryLight = new THREE.PointLight(0xffd890, 0.22, 0, 2);
gloryLight.position.copy(toWorld([0, -8, 122]));
scene.add(hemisphere, key, fireLight, gloryLight);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.38, 0.55, 1.15);
composer.addPass(bloom);
composer.addPass(new OutputPass());

// ------------------------------------------------------------------ materials
const hdr = (hex, gain) => new THREE.Color(hex).multiplyScalar(gain);
const standard = (options) => new THREE.MeshStandardMaterial(options);
const physical = (options) => new THREE.MeshPhysicalMaterial(options);

const visionMaterials = {
  nube: standard({ color: 0x6d7390, roughness: 1, metalness: 0 }),
  carboni: standard({
    color: 0x1d0a06,
    roughness: 0.9,
    emissive: 0xff3a08,
    emissiveIntensity: 1.5,
    flatShading: true,
  }),
  fuoco: new THREE.MeshBasicMaterial({ vertexColors: true }),
  fuoco_trono: new THREE.MeshBasicMaterial({ vertexColors: true }),
  lampo: new THREE.MeshBasicMaterial({ color: hdr(0xcfe4ff, 2.6) }),
  crisolito: physical({
    color: 0xc6cf2e,
    metalness: 0.35,
    roughness: 0.16,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    emissive: 0x7d8a12,
    emissiveIntensity: 0.55,
  }),
  occhio: standard({ color: 0xf7f2dd, roughness: 0.25, emissive: 0xfff3c4, emissiveIntensity: 0.55 }),
  iride: standard({
    color: 0x3f8f1f,
    roughness: 0.2,
    metalness: 0.2,
    emissive: 0x9be04a,
    emissiveIntensity: 0.9,
  }),
  pupilla: standard({ color: 0x040404, roughness: 0.1 }),
  creatura: standard({
    color: 0xe89a48,
    metalness: 0.72,
    roughness: 0.3,
    emissive: 0xff5a14,
    emissiveIntensity: 0.42,
  }),
  volto: standard({
    color: 0xf4c07a,
    metalness: 0.62,
    roughness: 0.34,
    emissive: 0xff7a22,
    emissiveIntensity: 0.22,
  }),
  ali: standard({
    color: 0xfbe2a6,
    metalness: 0.45,
    roughness: 0.42,
    emissive: 0xffa640,
    emissiveIntensity: 0.2,
  }),
  rame: standard({
    color: 0xd66a34,
    metalness: 1,
    roughness: 0.14,
    emissive: 0x9a3410,
    emissiveIntensity: 0.25,
  }),
  ghiaccio: physical({
    color: 0xdaf2ff,
    metalness: 0,
    roughness: 0.04,
    clearcoat: 1,
    transparent: true,
    opacity: 0.46,
    flatShading: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    envMapIntensity: 2.2,
    emissive: 0x4a8dc8,
    emissiveIntensity: 0.12,
  }),
  zaffiro: physical({
    color: 0x1136b8,
    metalness: 0.1,
    roughness: 0.06,
    clearcoat: 1,
    flatShading: true,
    emissive: 0x0b2bb0,
    emissiveIntensity: 0.55,
    envMapIntensity: 1.6,
  }),
  elettro: standard({
    color: 0xffe3a2,
    metalness: 0.6,
    roughness: 0.25,
    emissive: 0xffc35a,
    emissiveIntensity: 1.9,
  }),
};
const RAINBOW = [0xe2222d, 0xf47a17, 0xf6d51f, 0x35b54a, 0x1f8fe0, 0x3a3fb8, 0x8433b5];
RAINBOW.forEach((hex, i) => {
  visionMaterials[`iride_${i + 1}`] = standard({
    color: hex,
    roughness: 0.35,
    emissive: hex,
    emissiveIntensity: 0.85,
    transparent: true,
    opacity: 0.9,
  });
});
const printMaterial = standard({ color: 0xd8d2c6, roughness: 0.78, metalness: 0 });

/** Flames: pale gold at the foot, deep orange at the tip, brighter than white so they bloom. */
function paintFlames(geometry) {
  geometry.computeBoundingBox();
  const { min, max } = geometry.boundingBox;
  const position = geometry.getAttribute('position');
  const colors = new Float32Array(position.count * 3);
  const foot = new THREE.Color(0xffe9a8).multiplyScalar(2.3);
  const tip = new THREE.Color(0xff4a0a).multiplyScalar(1.5);
  const c = new THREE.Color();
  for (let i = 0; i < position.count; i++) {
    const t = (position.getZ(i) - min.z) / (max.z - min.z || 1);
    c.copy(foot).lerp(tip, Math.pow(t, 0.7));
    colors.set([c.r, c.g, c.b], i * 3);
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
}

// ------------------------------------------------------------------ model
const nodes = new Map(); // glTF node name -> {object, home: Vector3}
let modelRoot = null;
const buildPlate = new THREE.Group();

function prepareModel(gltf) {
  modelRoot = gltf.scene;
  modelRoot.scale.setScalar(UNIT * 1000);
  const root = modelRoot.getObjectByName('carro_celeste');
  for (const child of root.children) nodes.set(child.name, { object: child, home: child.position.clone() });
  modelRoot.traverse((object) => {
    if (!object.isMesh) return;
    const name = object.material.name;
    if (name === 'fuoco' || name === 'fuoco_trono') paintFlames(object.geometry);
    object.userData.vision = visionMaterials[name] ?? object.material;
    object.renderOrder = name === 'ghiaccio' ? 2 : name.startsWith('iride_') ? 1 : 0;
  });
  scene.add(modelRoot);

  // A 220 mm build plate with a 10 mm grid, shown in print mode to give the scale.
  const size = 220 * UNIT;
  const grid = new THREE.GridHelper(size, 22, 0x8fa0c8, 0x4b5368);
  grid.material.transparent = true;
  grid.material.opacity = 0.55;
  const plate = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    new THREE.MeshStandardMaterial({ color: 0x20242e, roughness: 0.9 }),
  );
  plate.rotation.x = -Math.PI / 2;
  plate.position.y = -0.002;
  buildPlate.add(plate, grid);
  scene.add(buildPlate);
}

function applyMode() {
  const print = state.mode === 'stampa';
  modelRoot?.traverse((object) => {
    if (object.isMesh) object.material = print ? printMaterial : object.userData.vision;
  });
  scene.background = backdrops[state.mode];
  bloom.enabled = !print;
  fireLight.visible = gloryLight.visible = !print;
  hemisphere.intensity = print ? 1.0 : 0.35;
  key.intensity = print ? 2.2 : 0.9;
  scene.environmentIntensity = print ? 0.7 : 0.45;
  buildPlate.visible = print;
  document.body.dataset.mode = state.mode;
  for (const button of document.querySelectorAll('[data-mode-button]')) {
    button.setAttribute('aria-pressed', String(button.dataset.modeButton === state.mode));
  }
}

function applyLayers() {
  const detail = state.detail;
  for (const [name, { object }] of nodes) {
    const layer = LAYERS.find((candidate) => candidate.nodes.some((prefix) => name.startsWith(prefix)));
    let visible = layer ? state.layers[layer.id] : true;
    if (detail.solo) visible = name === detail.solo;
    else if (layer && detail.hide?.includes(layer.id)) visible = false;
    object.visible = visible;
  }
  const hint = $('caption-hint');
  if (detail.solo) hint.textContent = 'Qui è mostrata una sola creatura, isolata dal resto.';
  else if (detail.hide?.length)
    hint.textContent = 'In questa vista le ruote sono nascoste per lasciar vedere l’interno.';
  else hint.textContent = '';
  hint.hidden = !hint.textContent;
}

function applyExplode() {
  for (const [name, { object, home }] of nodes) {
    const key = Object.keys(EXPLODE).find((prefix) => name.startsWith(prefix));
    const rule = EXPLODE[key];
    let offset = [0, 0, 0];
    if (rule === 'outward') offset = [Math.sign(home.x) * 30, Math.sign(home.y) * 30, -6];
    else if (rule) offset = rule;
    object.position.set(
      home.x + offset[0] * state.explode,
      home.y + offset[1] * state.explode,
      home.z + offset[2] * state.explode,
    );
  }
}

// ------------------------------------------------------------------ camera moves
let flight = null;
function flyTo(detail, immediate) {
  const position = toWorld(detail.camera);
  const target = toWorld(detail.target);
  // On a tall screen the model needs more distance to fit across.
  const aspect = stage.clientWidth / Math.max(1, stage.clientHeight);
  if (aspect < 1)
    position
      .sub(target)
      .multiplyScalar(Math.min(2.1, 1 / aspect))
      .add(target);
  if (immediate || reducedMotion) {
    camera.position.copy(position);
    controls.target.copy(target);
    flight = null;
  } else {
    flight = {
      fromPosition: camera.position.clone(),
      fromTarget: controls.target.clone(),
      position,
      target,
      start: performance.now(),
      duration: 1100,
    };
  }
  controls.autoRotate = state.rotate && Boolean(detail.orbit);
}

function selectDetail(id, { immediate = false, updateHash = true } = {}) {
  const detail = DETAILS.find((candidate) => candidate.id === id) ?? DETAILS[0];
  state.detail = detail;
  $('caption-ref').textContent = detail.ref;
  $('caption-title').textContent = detail.title;
  $('caption-text').textContent = detail.text;
  for (const button of document.querySelectorAll('[data-detail]')) {
    const current = button.dataset.detail === detail.id;
    button.setAttribute('aria-current', current ? 'true' : 'false');
    if (current && !immediate) button.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }
  applyLayers();
  flyTo(detail, immediate);
  if (updateHash) {
    try {
      history.replaceState(
        null,
        '',
        detail === DETAILS[0] ? location.pathname + location.search : `#${detail.id}`,
      );
    } catch {
      /* the hash is a convenience only */
    }
  }
}

// ------------------------------------------------------------------ frame loop
const clock = new THREE.Clock();
let flash = 0;
function frame() {
  const t = clock.getElapsedTime();
  if (flight) {
    const k = Math.min(1, (performance.now() - flight.start) / flight.duration);
    const e = k * k * (3 - 2 * k);
    camera.position.lerpVectors(flight.fromPosition, flight.position, e);
    controls.target.lerpVectors(flight.fromTarget, flight.target, e);
    if (k === 1) flight = null;
  }
  controls.update();

  if (!reducedMotion && state.mode === 'visione') {
    const flicker = 0.86 + 0.1 * Math.sin(t * 9.1) + 0.07 * Math.sin(t * 23.7 + 1.3);
    visionMaterials.fuoco.color.setScalar(flicker);
    visionMaterials.fuoco_trono.color.setScalar(0.9 + 0.1 * Math.sin(t * 7.3 + 2));
    visionMaterials.carboni.emissiveIntensity = 1.2 + 0.5 * Math.sin(t * 2.1) + 0.2 * Math.sin(t * 6.3);
    // Lightning: mostly a faint glow, now and then a flash.
    if (Math.random() < 0.012) flash = 1;
    flash *= 0.88;
    visionMaterials.lampo.color.copy(hdr(0xcfe4ff, 1.5 + flash * 4.5));
    fireLight.intensity = 0.35 * flicker + flash * 0.5;
    visionMaterials.iride.emissiveIntensity = 0.8 + 0.3 * Math.sin(t * 1.4);
    visionMaterials.elettro.emissiveIntensity = 1.8 + 0.25 * Math.sin(t * 1.1);
  }

  if (state.mode === 'stampa') renderer.render(scene, camera);
  else composer.render();
  window.__frames = (window.__frames ?? 0) + 1;
  requestAnimationFrame(frame);
}

function resize() {
  const width = Math.max(1, stage.clientWidth);
  const height = Math.max(1, stage.clientHeight);
  renderer.setSize(width, height, false);
  composer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(stage);

// ------------------------------------------------------------------ interface
function buildInterface() {
  const list = $('details');
  for (const detail of DETAILS) {
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.detail = detail.id;
    const ref = document.createElement('span');
    ref.className = 'ref';
    ref.textContent = detail.ref.replace('Ezechiele ', '');
    const title = document.createElement('span');
    title.className = 'name';
    title.textContent = detail.title;
    button.append(ref, title);
    button.addEventListener('click', () => selectDetail(detail.id));
    item.append(button);
    list.append(item);
  }

  const layerList = $('layers');
  for (const layer of LAYERS) {
    const label = document.createElement('label');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.id = `layer-${layer.id}`;
    box.checked = true;
    box.addEventListener('change', () => {
      state.layers[layer.id] = box.checked;
      applyLayers();
    });
    label.append(box, document.createTextNode(layer.label));
    layerList.append(label);
  }

  for (const button of document.querySelectorAll('[data-mode-button]')) {
    button.addEventListener('click', () => {
      state.mode = button.dataset.modeButton;
      applyMode();
    });
  }
  const rotate = $('rotate');
  rotate.checked = state.rotate;
  rotate.addEventListener('change', () => {
    state.rotate = rotate.checked;
    controls.autoRotate = state.rotate && Boolean(state.detail.orbit);
  });
  const explode = $('explode');
  explode.addEventListener('input', () => {
    state.explode = Number(explode.value) / 100;
    applyExplode();
  });
  // Any manual move takes over from the automatic orbit and from a camera flight in progress.
  controls.addEventListener('start', () => {
    flight = null;
    controls.autoRotate = false;
  });
  for (const toggle of document.querySelectorAll('[data-toggle]')) {
    const panel = $(toggle.dataset.toggle);
    toggle.addEventListener('click', () => {
      const open = panel.hidden;
      for (const other of document.querySelectorAll('.sheet')) other.hidden = true;
      for (const other of document.querySelectorAll('[data-toggle]'))
        other.setAttribute('aria-expanded', 'false');
      panel.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
    });
  }
  window.addEventListener('hashchange', () => selectDetail(location.hash.slice(1), { updateHash: false }));
}

// ------------------------------------------------------------------ downloads
async function fetchBytes(path, onProgress) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`${path}: ${response.status}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  onProgress?.();
  return bytes;
}

async function setupDownloads() {
  const button = $('download-all');
  const status = $('download-status');
  const links = $('download-links');
  // Inside a claude.ai artifact a page cannot start a download by itself: it has to ask the
  // host. Anywhere else, plain links work.
  const hosted = typeof window.claude?.use === 'function';
  let saver = null;
  if (hosted) {
    saver = await window.claude.use('downloads').catch(() => null);
    if (!saver) {
      button.hidden = true;
      status.textContent =
        'In questa vista il download non è disponibile: i file sono nella cartella «modelli» del repository.';
      return;
    }
  } else {
    for (const file of FILES) {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = file.path;
      link.download = file.name.split('/').pop();
      link.textContent = file.label;
      const kind = document.createElement('span');
      kind.className = 'kind';
      kind.textContent = file.kind;
      item.append(link, kind);
      links.append(item);
    }
    links.hidden = false;
  }

  button.addEventListener('click', async () => {
    button.disabled = true;
    try {
      let done = 0;
      status.textContent = 'Preparo l’archivio…';
      const entries = [{ name: 'LEGGIMI.txt', data: new TextEncoder().encode(README_TXT) }];
      for (const file of FILES) {
        const data = await fetchBytes(file.path, () => {
          done++;
          status.textContent = `Preparo l’archivio… ${done} di ${FILES.length} file`;
        });
        entries.push({ name: file.name, data });
      }
      const blob = zip(entries.map((entry) => ({ ...entry, name: `carro-celeste/${entry.name}` })));
      const megabytes = (blob.size / 1048576).toFixed(1).replace('.', ',');
      if (saver) {
        await saver.save({ filename: 'carro-celeste-stampa-3d.zip', data: blob });
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'carro-celeste-stampa-3d.zip';
        document.body.append(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 60000);
      }
      status.textContent = `Archivio pronto: ${megabytes} MB.`;
    } catch (error) {
      status.textContent =
        error?.code === 'declined'
          ? 'Download annullato.'
          : 'Non sono riuscito a preparare l’archivio. Riprova tra poco.';
    } finally {
      button.disabled = false;
    }
  });
}

// ------------------------------------------------------------------ start
async function start() {
  buildInterface();
  resize();
  scene.background = backdrops[state.mode];
  const initial = DETAILS.some((detail) => detail.id === location.hash.slice(1))
    ? location.hash.slice(1)
    : 'insieme';
  selectDetail(initial, { immediate: true, updateHash: false });
  requestAnimationFrame(frame);
  setupDownloads();

  try {
    const response = await fetch(MODEL_URL);
    if (!response.ok) throw new Error(String(response.status));
    const buffer = await response.arrayBuffer();
    const gltf = await new GLTFLoader().parseAsync(buffer, '');
    prepareModel(gltf);
    applyMode();
    applyLayers();
    applyExplode();
    if (params.has('cam')) {
      const numbers = (key) => params.get(key).split(',').map(Number);
      camera.position.copy(toWorld(numbers('cam')));
      controls.target.copy(toWorld(numbers('target')));
      controls.autoRotate = false;
      if (params.has('solo'))
        for (const [name, { object }] of nodes) object.visible = name === params.get('solo');
    }
    $('loading').hidden = true;
    window.__ready = true;
  } catch {
    $('loading').textContent = 'Non sono riuscito a caricare il modello. Ricarica la pagina.';
  }
}

start();
