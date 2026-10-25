import * as THREE from 'three';
import {
  DAY,
  WORLD,
  BIOMES,
  biomeAt,
  generateNodes,
  hashInts,
  heightAt,
  mulberry32,
  valleyCenter,
} from '@segnale/shared';
import type { CreatureState, PlayerState, StructureKind, WorldNode, WorldState } from '@segnale/shared';
import { ModelFactory } from './models';

interface TerrainChunk {
  terrain: THREE.Mesh;
  props: THREE.Group;
}
interface NodeBatch {
  mesh: THREE.InstancedMesh;
  parts: { node: THREE.Group; matrix: THREE.Matrix4 }[];
}
interface Effect {
  mesh: THREE.Mesh;
  age: number;
  duration: number;
  velocity: THREE.Vector3;
}
interface Placement {
  kind: StructureKind;
  x: number;
  z: number;
  yaw: number;
  valid: boolean;
}

/** Seeded scenery is local; only gameplay changes travel over the network. */
export class WorldView {
  readonly renderer: THREE.WebGLRenderer;
  readonly camera = new THREE.PerspectiveCamera(58, 1, 0.1, 700);
  readonly scene = new THREE.Scene();
  readonly nodes: WorldNode[];
  yaw = 0;
  pitch = 0.22;
  private readonly factory = new ModelFactory();
  private readonly avatars = new Map<string, THREE.Group>();
  private readonly creatures = new Map<string, THREE.Group>();
  private readonly structures = new Map<string, THREE.Group>();
  private readonly capsules = new Map<string, THREE.Group>();
  private readonly nodeMeshes = new Map<string, THREE.Group>();
  private readonly nodeBatches: NodeBatch[] = [];
  private readonly chunks = new Map<string, TerrainChunk>();
  private readonly propModels = new Map<string, THREE.Group>();
  private readonly clock = new THREE.Clock();
  private readonly cameraTarget = new THREE.Vector3();
  private readonly sky = new THREE.Group();
  private readonly sun = new THREE.DirectionalLight(0xffdcac, 2.7);
  private readonly ambient = new THREE.HemisphereLight(0xb7dad6, 0x263e42, 2.2);
  private readonly fog = new THREE.Fog(0x789ba1, 85, 195);
  private readonly stars: THREE.Points;
  private readonly moons = new THREE.Group();
  private readonly skyMaterial: THREE.ShaderMaterial;
  private readonly storm = new THREE.Group();
  private readonly stormMaterial = new THREE.MeshBasicMaterial({
    color: 0x9a6bd4,
    transparent: true,
    opacity: 0.44,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  private readonly lightning = new THREE.Group();
  private readonly highlight: THREE.Mesh;
  private readonly effects: Effect[] = [];
  private readonly beacon = new THREE.Group();
  private readonly rescue = new THREE.Group();
  private readonly temporary = new THREE.Object3D();
  private readonly tint = new THREE.Color();
  private readonly uniqueGeometries = new Set<THREE.BufferGeometry>();
  private readonly uniqueMaterials = new Set<THREE.Material>();
  private readonly terrainMaterial = new THREE.MeshStandardMaterial({
    vertexColors: true,
    flatShading: true,
    roughness: 1,
  });
  private lastChunk = '';
  private initialized = false;
  private elapsed = 0;
  private cullingTimer = 0;
  private lowQuality = false;
  private slowFrameTime = 0;
  private lastEvent = -1;
  private placement: Placement | null = null;
  private ghost: THREE.Group | undefined;
  private ghostKind: StructureKind | undefined;
  private ghostMaterials: THREE.MeshStandardMaterial[] = [];
  private readonly resize = () => {
    const canvas = this.renderer.domElement;
    const width = Math.max(1, canvas.clientWidth);
    const height = Math.max(1, canvas.clientHeight);
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  };

  constructor(
    private readonly seed: number,
    host: HTMLElement,
  ) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    const context = this.renderer.getContext();
    const debug = context.getExtension('WEBGL_debug_renderer_info');
    const gpu = debug ? String(context.getParameter(debug.UNMASKED_RENDERER_WEBGL)) : '';
    this.lowQuality = /swiftshader|llvmpipe|software/i.test(gpu);
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, this.lowQuality ? 0.8 : 1.5));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.renderer.shadowMap.enabled = !this.lowQuality;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.domElement.setAttribute('aria-label', 'Valle aliena di Kepler-Sigma');
    host.replaceChildren(this.renderer.domElement);
    this.scene.fog = this.fog;
    this.scene.add(this.ambient, this.sun, this.sun.target, this.sky, this.storm, this.beacon, this.rescue);
    this.sun.castShadow = !this.lowQuality;
    this.sun.shadow.mapSize.set(1024, 1024);
    this.sun.shadow.camera.left = -35;
    this.sun.shadow.camera.right = 35;
    this.sun.shadow.camera.top = 35;
    this.sun.shadow.camera.bottom = -35;
    this.sun.shadow.camera.near = 10;
    this.sun.shadow.camera.far = 220;
    this.sun.shadow.bias = -0.0007;
    this.sun.shadow.normalBias = 0.04;
    this.skyMaterial = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: {
        zenith: { value: new THREE.Color('#316279') },
        horizon: { value: new THREE.Color('#8fbbb6') },
      },
      vertexShader:
        'varying vec3 vDirection; void main(){vDirection=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
      fragmentShader:
        'varying vec3 vDirection;uniform vec3 zenith;uniform vec3 horizon;void main(){float h=pow(max(0.0,normalize(vDirection).y),0.55);gl_FragColor=vec4(mix(horizon,zenith,h),1.0);}',
    });
    const skySphere = new THREE.SphereGeometry(550, 24, 12);
    this.uniqueGeometries.add(skySphere);
    this.uniqueMaterials.add(this.skyMaterial);
    this.sky.add(new THREE.Mesh(skySphere, this.skyMaterial));
    this.stars = this.buildSky();
    this.buildStorm();
    this.buildBeacon();
    this.buildRescue();
    const wreck = this.factory.wreck();
    const wreckX = valleyCenter(seed, -9) + 8;
    wreck.position.set(wreckX, heightAt(seed, wreckX, -9), -9);
    wreck.rotation.set(0.03, 0.45, -0.08);
    this.scene.add(wreck);
    this.nodes = generateNodes(seed);
    for (const node of this.nodes) {
      const model = this.factory.node(node);
      model.position.set(node.x, heightAt(seed, node.x, node.z), node.z);
      model.rotation.y = (hashInts(seed, Number(node.id.slice(5))) % 100) / 15;
      this.nodeMeshes.set(node.id, model);
    }
    this.buildNodeBatches();
    const ringGeometry = new THREE.RingGeometry(0.72, 0.77, 40);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xd1ffdd,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    this.uniqueGeometries.add(ringGeometry);
    this.uniqueMaterials.add(ringMaterial);
    this.highlight = new THREE.Mesh(ringGeometry, ringMaterial);
    this.highlight.rotation.x = -Math.PI / 2;
    this.highlight.visible = false;
    this.scene.add(this.highlight);
    this.uniqueMaterials.add(this.terrainMaterial);
    this.uniqueMaterials.add(this.stormMaterial);
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  /** Keep input responsive on software rasterizers and older GPUs. Near scenery
   * and all gameplay entities remain present; only distant detail is reduced. */
  private updateQuality(frameTime: number): void {
    if (this.lowQuality || document.hidden || frameTime <= 0 || frameTime > 1) return;
    this.slowFrameTime =
      frameTime > 0.05 ? this.slowFrameTime + frameTime : Math.max(0, this.slowFrameTime - frameTime * 2);
    if (this.slowFrameTime < 2) return;
    this.lowQuality = true;
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 0.8));
    this.resize();
    this.renderer.shadowMap.enabled = false;
    this.sun.castShadow = false;
    // Rebuild once at the coarser distant terrain detail level. Shared models
    // and the astronaut's contact shadow are preserved.
    for (const chunk of this.chunks.values()) {
      this.scene.remove(chunk.terrain, chunk.props);
      chunk.terrain.geometry.dispose();
      chunk.props.traverse((object) => {
        if (object instanceof THREE.InstancedMesh) object.dispose();
      });
    }
    this.chunks.clear();
    this.lastChunk = '';
    this.cullingTimer = 0;
  }

  /** Static resources share a few draw calls instead of submitting every part separately. */
  private buildNodeBatches(): void {
    const buckets = new Map<
      string,
      { geometry: THREE.BufferGeometry; material: THREE.Material; parts: NodeBatch['parts'] }
    >();
    for (const node of this.nodeMeshes.values()) {
      node.updateMatrixWorld(true);
      node.traverse((part) => {
        if (!(part instanceof THREE.Mesh)) return;
        const material = part.material as THREE.Material;
        const key = `${part.geometry.uuid}:${material.uuid}`;
        let bucket = buckets.get(key);
        if (!bucket) {
          bucket = { geometry: part.geometry, material, parts: [] };
          buckets.set(key, bucket);
        }
        bucket.parts.push({ node, matrix: part.matrixWorld.clone() });
      });
    }
    for (const bucket of buckets.values()) {
      const mesh = new THREE.InstancedMesh(bucket.geometry, bucket.material, bucket.parts.length);
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      // The instance list is explicitly distance-culled every 160 ms. Its
      // changing bounds should not trigger another full world traversal.
      mesh.frustumCulled = false;
      mesh.count = 0;
      this.nodeBatches.push({ mesh, parts: bucket.parts });
      this.scene.add(mesh);
    }
  }

  private updateNodeBatches(): void {
    for (const { mesh, parts } of this.nodeBatches) {
      let count = 0;
      for (const part of parts) if (part.node.visible) mesh.setMatrixAt(count++, part.matrix);
      mesh.count = count;
      mesh.visible = count > 0;
      mesh.instanceMatrix.needsUpdate = true;
    }
  }

  setPlacement(kind: StructureKind | null, x = 0, z = 0, yaw = 0, valid = false): void {
    this.placement = kind ? { kind, x, z, yaw, valid } : null;
    if (!kind) {
      if (this.ghost) this.ghost.visible = false;
      return;
    }
    if (this.ghostKind !== kind) {
      if (this.ghost) this.scene.remove(this.ghost);
      this.ghostMaterials.forEach((material) => material.dispose());
      this.ghostMaterials = [];
      this.ghost = this.factory.structure(kind);
      this.ghost.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          const material = (object.material as THREE.MeshStandardMaterial).clone();
          material.transparent = true;
          material.opacity = 0.5;
          material.depthWrite = false;
          object.material = material;
          this.ghostMaterials.push(material);
        }
      });
      this.ghostKind = kind;
      this.scene.add(this.ghost);
    }
    this.ghost!.visible = true;
    this.ghost!.position.set(x, heightAt(this.seed, x, z), z);
    this.ghost!.rotation.y = yaw;
    for (const material of this.ghostMaterials) {
      material.color.set(valid ? 0x81f7b8 : 0xf07c78);
      material.emissive.copy(material.color);
      material.emissiveIntensity = 0.2;
    }
  }

  private buildSky(): THREE.Points {
    const planetGeometry = new THREE.SphereGeometry(46, 48, 24);
    const positions = planetGeometry.attributes.position;
    const colors = new Float32Array(positions.count * 3);
    for (let i = 0; i < positions.count; i++) {
      const latitude = positions.getY(i) / 46;
      this.tint.setHSL(0.105 + Math.sin(latitude * 26) * 0.015, 0.2, 0.49 + Math.sin(latitude * 23) * 0.07);
      colors[i * 3] = this.tint.r;
      colors[i * 3 + 1] = this.tint.g;
      colors[i * 3 + 2] = this.tint.b;
    }
    planetGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const planetMaterial = new THREE.MeshBasicMaterial({ vertexColors: true, fog: false });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    planet.position.set(-210, 125, 350);
    planet.rotation.z = -0.28;
    this.uniqueGeometries.add(planetGeometry);
    this.uniqueMaterials.add(planetMaterial);
    for (const [inner, outer, opacity] of [
      [60, 66, 0.45],
      [68, 81, 0.63],
      [83, 86, 0.3],
    ]) {
      const geometry = new THREE.RingGeometry(inner, outer, 80);
      const material = new THREE.MeshBasicMaterial({
        color: 0xcac5aa,
        side: THREE.DoubleSide,
        transparent: true,
        opacity,
        fog: false,
        depthWrite: false,
      });
      const ring = new THREE.Mesh(geometry, material);
      ring.rotation.x = 1.1;
      ring.rotation.y = -0.2;
      planet.add(ring);
      this.uniqueGeometries.add(geometry);
      this.uniqueMaterials.add(material);
    }
    this.sky.add(planet);
    const starPositions: number[] = [];
    const rng = mulberry32(hashInts(this.seed, 501));
    for (let i = 0; i < 550; i++) {
      const theta = rng() * Math.PI * 2;
      const h = rng() * 0.95 + 0.04;
      const horizontal = Math.sqrt(1 - h * h);
      starPositions.push(Math.cos(theta) * horizontal * 490, h * 490, Math.sin(theta) * horizontal * 490);
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0xe0f7ee,
      size: 0.8,
      transparent: true,
      opacity: 0,
      fog: false,
      depthWrite: false,
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    this.uniqueGeometries.add(starGeometry);
    this.uniqueMaterials.add(starMaterial);
    this.sky.add(stars, this.moons);
    for (let i = 0; i < 2; i++) {
      const moon = new THREE.Mesh(
        this.factory.geometry('sphere', i ? 7 : 13, 1, 1, 8),
        new THREE.MeshBasicMaterial({ color: i ? 0xc5baaf : 0x8badbc, fog: false }),
      );
      moon.position.set(i ? 210 : 105, i ? 170 : 90, i ? 240 : 360);
      this.uniqueMaterials.add(moon.material);
      this.moons.add(moon);
    }
    return stars;
  }

  private buildStorm(): void {
    for (let i = 0; i < 3; i++) {
      const geometry = new THREE.PlaneGeometry(800, 145, 1, 1);
      const material =
        i === 0
          ? this.stormMaterial
          : new THREE.MeshBasicMaterial({
              color: i === 1 ? 0x58447c : 0x9e80c5,
              transparent: true,
              opacity: i === 1 ? 0.22 : 0.12,
              side: THREE.DoubleSide,
              depthWrite: false,
            });
      const plane = new THREE.Mesh(geometry, material);
      plane.position.set(0, 55, -i * 5);
      this.storm.add(plane);
      this.uniqueGeometries.add(geometry);
      this.uniqueMaterials.add(material);
    }
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xe8baff, transparent: true, opacity: 0.95 });
    this.uniqueMaterials.add(lineMaterial);
    for (let i = 0; i < 9; i++) {
      const rng = mulberry32(hashInts(this.seed, i, 112));
      const vertices: number[] = [];
      const x = (rng() - 0.5) * 350;
      for (let j = 0; j < 8; j++) vertices.push(x + (rng() - 0.5) * 12, 75 - j * 11, 0.1);
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      this.uniqueGeometries.add(geometry);
      this.lightning.add(new THREE.Line(geometry, lineMaterial));
    }
    this.storm.add(this.lightning);
  }

  private buildBeacon(): void {
    const f = this.factory;
    const x = valleyCenter(this.seed, WORLD.signalZ);
    this.beacon.position.set(x, heightAt(this.seed, x, WORLD.signalZ), WORLD.signalZ);
    f.part(this.beacon, 'cylinder', 0x455c67, [3.7, 4.7, 0.5], [0, 0.25, 0], [0, 0, 0]);
    f.part(this.beacon, 'cylinder', 0x9eaaa2, [0.35, 1.1, 15], [0, 7.8, 0], [0, 0, 0]);
    for (let i = 0; i < 3; i++)
      f.part(
        this.beacon,
        'cylinder',
        0x4d6974,
        [0.12, 0.16, 11],
        [Math.sin(i * 2.1) * 2, 5, Math.cos(i * 2.1) * 2],
        [Math.cos(i * 2.1) * 0.35, 0, -Math.sin(i * 2.1) * 0.35],
      );
    f.part(this.beacon, 'cone', 0xb4c4bc, [2.3, 1.3, 1, 12], [0, 13.2, 0], [Math.PI, 0, 0]);
    f.part(this.beacon, 'sphere', 0xa3f8da, [0.65], [0, 14.5, 0], [0, 0, 0], 1);
    f.part(this.beacon, 'ring', 0xa2e9c7, [2, 0.06], [0, 11.5, 0], [Math.PI / 2, 0, 0], 0.6).name =
      'beacon-ring';
    f.part(this.beacon, 'box', 0x243f4c, [0.85, 1.3, 0.45], [0, 0.95, -2.2]);
    f.part(this.beacon, 'box', 0xa0ead0, [0.65, 0.4, 0.03], [0, 1.24, -2.45], [0, 0, 0], 0.65);
  }

  private buildRescue(): void {
    const f = this.factory;
    f.part(this.rescue, 'cylinder', 0xd0d5bf, [1.2, 1.9, 7], [0, 0, 0], [Math.PI / 2, 0, 0]);
    f.part(this.rescue, 'sphere', 0x1c4b60, [1], [0, 0.5, 2.2]).scale.set(1.1, 0.6, 1.8);
    for (const side of [-1, 1]) {
      f.part(this.rescue, 'box', 0xb1baa9, [3, 0.22, 3.2], [side * 2.4, -0.5, -1], [0, 0, side * 0.1]);
      f.part(
        this.rescue,
        'cylinder',
        0x557781,
        [0.55, 0.55, 2.7],
        [side * 2.1, -0.3, -1],
        [Math.PI / 2, 0, 0],
      );
      const jet = f.part(
        this.rescue,
        'cone',
        0x87e8e2,
        [0.38, 2.5],
        [side * 2.1, -1.6, -1],
        [Math.PI, 0, 0],
        1,
      );
      jet.name = `jet${side}`;
    }
    this.rescue.visible = false;
  }

  private propModel(biome: number, type: 'grass' | 'tree' | 'rock'): THREE.Group {
    const key = `${biome}:${type}`;
    const cached = this.propModels.get(key);
    if (cached) return cached;
    const group = new THREE.Group();
    const f = this.factory;
    if (type === 'grass') {
      for (let i = 0; i < 3; i++) {
        const colors = [0x4a9d80, 0x9783b6, 0xbfb586, 0xd6e6df];
        f.part(
          group,
          'cone',
          colors[biome],
          [0.12, 0.5 + i * 0.15, 1, 3],
          [(i - 1) * 0.15, 0.3, (i % 2) * 0.1],
          [0, i * 1.4, (i - 1) * 0.22],
        ).scale.z = 0.35;
      }
    } else if (type === 'rock') {
      f.part(group, 'rock', [0x5b7f76, 0x655b7b, 0x5d5363, 0x9bbdc7][biome], [1], [0, 0.35, 0]).scale.set(
        1.3,
        0.7,
        0.8,
      );
      if (biome === 2 || biome === 3)
        for (let i = 0; i < 3; i++)
          f.part(
            group,
            'cone',
            biome === 2 ? 0x3a3546 : 0x9de1f0,
            [0.25, 2.4 + i * 0.6, 1, 4],
            [(i - 1) * 0.55, 1 + i * 0.3, (i % 2) * 0.2],
            [0.1, i * 0.6, (i - 1) * 0.13],
            biome === 3 ? 0.08 : 0,
          );
    } else if (biome === 0) {
      f.part(group, 'cylinder', 0x496e65, [0.1, 0.27, 4.2], [0, 2.1, 0]);
      for (let i = 0; i < 3; i++) {
        const branch = f.part(
          group,
          'cone',
          i % 2 ? 0x72b18b : 0x4b9478,
          [0.9 - i * 0.15, 2.6, 1, 4],
          [Math.sin(i * 2.1) * 0.35, 3 + i * 0.7, Math.cos(i * 2.1) * 0.35],
          [0.15, i * 1.5, 0.12],
        );
        branch.scale.z = 0.7;
      }
      f.part(group, 'cone', 0x90c5a1, [0.3, 1.8, 1, 4], [0, 5.3, 0]);
    } else if (biome === 1) {
      f.part(group, 'cylinder', 0x817398, [0.2, 0.45, 4.1], [0, 2, 0]);
      f.part(group, 'sphere', 0x977bb2, [2.3, 1, 1, 7], [0, 4.2, 0], [0, 0, 0], 0.06).scale.y = 0.35;
      f.part(group, 'cylinder', 0xd9b57e, [1.8, 1.7, 0.08, 12], [0, 4.07, 0], [0, 0, 0], 0.3);
      for (let i = 0; i < 4; i++)
        f.part(
          group,
          'sphere',
          0xd8b6ef,
          [0.12],
          [Math.sin(i * 1.6) * 1.3, 4.7, Math.cos(i * 1.6) * 1.2],
          [0, 0, 0],
          0.35,
        );
    } else if (biome === 2) {
      for (let i = 0; i < 4; i++)
        f.part(
          group,
          'cone',
          i % 2 ? 0x50495e : 0x35313e,
          [0.6 - i * 0.05, 5 + i * 0.5, 1, 4],
          [Math.sin(i * 2.3) * 1.1, 2.5, Math.cos(i * 2.3) * 1.1],
          [Math.sin(i) * 0.1, i * 0.5, Math.cos(i) * 0.15],
        );
    } else {
      f.part(group, 'cylinder', 0x7799aa, [0.1, 0.3, 4.5], [0, 2.25, 0]);
      for (let i = 0; i < 4; i++)
        f.part(
          group,
          'cone',
          i % 2 ? 0xc5dbda : 0x9fc2c7,
          [1.65 - i * 0.32, 2, 1, 5],
          [0, 1.8 + i * 0.9, 0],
          [0, i * 0.7, 0],
        );
    }
    group.updateMatrixWorld(true);
    this.propModels.set(key, group);
    return group;
  }

  private decorateChunk(ix: number, iz: number): THREE.Group {
    const group = new THREE.Group();
    const rng = mulberry32(hashInts(this.seed, ix, iz, 777));
    const biome = biomeAt(iz * WORLD.chunkSize).id;
    const buckets = new Map<
      string,
      { geometry: THREE.BufferGeometry; material: THREE.Material; matrices: THREE.Matrix4[] }
    >();
    const add = (type: 'grass' | 'tree' | 'rock', x: number, z: number, scale: number) => {
      const model = this.propModel(biome, type);
      this.temporary.position.set(x, heightAt(this.seed, x, z), z);
      this.temporary.rotation.set(0, rng() * Math.PI * 2, 0);
      this.temporary.scale.setScalar(scale);
      this.temporary.updateMatrix();
      model.traverse((part) => {
        if (!(part instanceof THREE.Mesh)) return;
        const key = `${part.geometry.uuid}:${(part.material as THREE.Material).uuid}`;
        let bucket = buckets.get(key);
        if (!bucket) {
          bucket = { geometry: part.geometry, material: part.material as THREE.Material, matrices: [] };
          buckets.set(key, bucket);
        }
        bucket.matrices.push(new THREE.Matrix4().multiplyMatrices(this.temporary.matrix, part.matrixWorld));
      });
    };
    for (let i = 0; i < 70; i++) {
      const x = (ix + rng() - 0.5) * WORLD.chunkSize;
      const z = (iz + rng() - 0.5) * WORLD.chunkSize;
      const offset = Math.abs(x - valleyCenter(this.seed, z));
      if (offset > WORLD.halfWidth + 12 || Math.hypot(x - valleyCenter(this.seed, 0), z) < 9) continue;
      const type = i < 5 ? 'tree' : i < 11 ? 'rock' : 'grass';
      // Leave a clear visual trail through every biome.
      if (type === 'tree' && offset < 7) continue;
      if (type === 'grass' && (offset < 3 || (biome === 2 && i % 3))) continue;
      add(type, x, z, type === 'tree' ? 0.65 + rng() * 0.8 : 0.6 + rng() * 0.8);
    }
    if (biome === 1) {
      const minX = (ix - 0.5) * WORLD.chunkSize;
      const minZ = (iz - 0.5) * WORLD.chunkSize;
      const material = this.factory.material(0xae88c8, 0.05);
      material.transparent = true;
      material.opacity = 0.12;
      material.depthWrite = false;
      for (let gx = Math.ceil(minX / 12); gx * 12 < minX + WORLD.chunkSize; gx++) {
        for (let gz = Math.ceil(minZ / 12); gz * 12 < minZ + WORLD.chunkSize; gz++) {
          if (hashInts(this.seed, gx, gz) % 7 !== 0) continue;
          const x = gx * 12 + 6;
          const z = gz * 12 + 6;
          if (Math.abs(x - valleyCenter(this.seed, z)) > WORLD.halfWidth) continue;
          const cloud = new THREE.Mesh(this.factory.geometry('sphere', 1, 1, 1, 5), material);
          cloud.scale.set(7.5, 1.3, 7.5);
          cloud.position.set(x, heightAt(this.seed, x, z) + 0.9, z);
          group.add(cloud);
        }
      }
    }
    for (const bucket of buckets.values()) {
      const mesh = new THREE.InstancedMesh(bucket.geometry, bucket.material, bucket.matrices.length);
      bucket.matrices.forEach((matrix, index) => mesh.setMatrixAt(index, matrix));
      mesh.instanceMatrix.needsUpdate = true;
      mesh.computeBoundingSphere();
      mesh.receiveShadow = true;
      group.add(mesh);
    }
    return group;
  }

  private updateTerrain(x: number, z: number): void {
    const size = WORLD.chunkSize;
    const cx = Math.round(x / size);
    const cz = Math.round(z / size);
    const current = `${cx},${cz}`;
    if (current === this.lastChunk) return;
    this.lastChunk = current;
    const needed = new Set<string>();
    const radius = this.lowQuality ? 3 : 4;
    for (let dz = -radius; dz <= radius + 1; dz++)
      for (let dx = -radius; dx <= radius; dx++) {
        const ix = cx + dx;
        const iz = cz + dz;
        const key = `${ix},${iz}`;
        needed.add(key);
        if (this.chunks.has(key)) continue;
        const resolution = this.lowQuality ? Math.max(8, WORLD.chunkRes / 2) : WORLD.chunkRes;
        const geometry = new THREE.PlaneGeometry(size, size, resolution, resolution);
        geometry.rotateX(-Math.PI / 2);
        const vertices = geometry.attributes.position;
        const colors = new Float32Array(vertices.count * 3);
        for (let i = 0; i < vertices.count; i++) {
          const wx = vertices.getX(i) + ix * size;
          const wz = vertices.getZ(i) + iz * size;
          const y = heightAt(this.seed, wx, wz);
          vertices.setY(i, y);
          const biome = biomeAt(wz);
          this.tint.set(biome.color);
          const boundary = (biome.id + 1) * WORLD.biomeLength;
          if (biome.id < 3 && wz > boundary - WORLD.biomeBlend)
            this.tint.lerp(
              new THREE.Color(BIOMES[biome.id + 1].color),
              (wz - boundary + WORLD.biomeBlend) / WORLD.biomeBlend,
            );
          const offset = Math.abs(wx - valleyCenter(this.seed, wz));
          if (offset > WORLD.halfWidth - 22)
            this.tint.lerp(new THREE.Color(0x536770), Math.min(1, (offset - WORLD.halfWidth + 22) / 38));
          if (offset < 3.2) this.tint.lerp(new THREE.Color(biome.id === 3 ? 0x94acb1 : 0x788c73), 0.3);
          const shade = 0.94 + Math.sin(wx * 0.17 + wz * 0.1) * 0.035 + Math.cos(wz * 0.37) * 0.025;
          colors[i * 3] = this.tint.r * shade;
          colors[i * 3 + 1] = this.tint.g * shade;
          colors[i * 3 + 2] = this.tint.b * shade;
        }
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.computeVertexNormals();
        const terrain = new THREE.Mesh(geometry, this.terrainMaterial);
        terrain.position.set(ix * size, 0, iz * size);
        terrain.receiveShadow = true;
        const props = this.decorateChunk(ix, iz);
        this.scene.add(terrain, props);
        this.chunks.set(key, { terrain, props });
      }
    for (const [key, chunk] of this.chunks)
      if (!needed.has(key)) {
        this.scene.remove(chunk.terrain, chunk.props);
        chunk.terrain.geometry.dispose();
        chunk.props.traverse((object) => {
          if (object instanceof THREE.InstancedMesh) object.dispose();
        });
        this.chunks.delete(key);
      }
  }

  private lighting(local: PlayerState, elapsed: number, dt: number): void {
    const cycle = (elapsed / DAY.length) % 1;
    const daylight =
      cycle < DAY.dayFraction
        ? Math.max(
            0.1,
            Math.sin(((cycle * DAY.length + 35) / (DAY.length * DAY.dayFraction + 70)) * Math.PI) * 0.75 +
              0.25,
          )
        : 0;
    const biome = biomeAt(local.z).id;
    const dayFog = [0x8caeac, 0x887c9b, 0xc9b28d, 0xadccd3][biome];
    const targetFog = new THREE.Color(0x17283c).lerp(new THREE.Color(dayFog), daylight);
    this.fog.color.lerp(targetFog, 1 - Math.exp(-dt * 0.8));
    this.fog.near = this.lowQuality ? 55 : 75;
    this.fog.far = this.lowQuality ? 130 : 190;
    this.skyMaterial.uniforms.horizon.value.copy(this.fog.color);
    this.skyMaterial.uniforms.zenith.value
      .set(0x101a34)
      .lerp(new THREE.Color(biome === 1 ? 0x655775 : 0x467b92), daylight);
    this.sun.intensity = 0.12 + daylight * 2.6;
    this.ambient.intensity = 0.8 + daylight * 1.5;
    this.sun.color.set(daylight > 0.3 ? 0xffdfb6 : 0xa7b9dc);
    this.sun.position.set(local.x - 60, local.y + 100, local.z - 35);
    this.sun.target.position.set(local.x, local.y, local.z);
    (this.stars.material as THREE.PointsMaterial).opacity = (1 - daylight) * 0.88;
    this.moons.visible = daylight < 0.45;
    this.sky.position.set(local.x, local.y, local.z);
  }

  private syncAvatars(local: PlayerState, players: PlayerState[], dt: number): void {
    const ids = new Set(players.map((player) => player.id));
    for (const [id, avatar] of this.avatars)
      if (!ids.has(id)) {
        this.scene.remove(avatar);
        this.avatars.delete(id);
      }
    for (const player of players) {
      const p = player.id === local.id ? local : player;
      let avatar = this.avatars.get(p.id);
      if (!avatar) {
        const suits: Record<string, number> = {
          suit_teal: 0x65c9ce,
          suit_violet: 0xb7a1dd,
          suit_gold: 0xe7cf80,
        };
        const suit = p.perks?.filter((id) => Object.hasOwn(suits, id)).at(-1);
        avatar = this.factory.astronaut(this.avatars.size, suit ? suits[suit] : undefined);
        this.avatars.set(p.id, avatar);
        this.scene.add(avatar);
        avatar.userData.lastX = p.x;
        avatar.userData.lastZ = p.z;
      }
      const speed =
        Math.hypot(p.x - avatar.userData.lastX, p.z - avatar.userData.lastZ) / Math.max(0.005, dt);
      avatar.userData.lastX = p.x;
      avatar.userData.lastZ = p.z;
      avatar.userData.phase += Math.min(speed, 12) * dt * 2.3;
      avatar.position.set(p.x, p.y, p.z);
      avatar.rotation.y = p.yaw;
      avatar.visible = p.connected && p.status !== 'dead';
      const downed = p.status === 'downed' || p.hp <= 0;
      avatar.rotation.z = downed ? Math.PI / 2 : 0;
      if (downed) avatar.position.y += 0.3;
      const swing = Math.sin(avatar.userData.phase) * Math.min(0.6, speed * 0.1);
      avatar.getObjectByName('leg-1')!.rotation.x = swing;
      avatar.getObjectByName('leg1')!.rotation.x = -swing;
      avatar.getObjectByName('arm-1')!.rotation.x = -swing * 0.7;
      avatar.getObjectByName('arm1')!.rotation.x = swing * 0.7;
      const armed = p.activeItem?.startsWith('blaster');
      avatar.getObjectByName('weapon')!.visible = !!armed;
      avatar.getObjectByName('tool')!.visible = !armed && (!p.activeItem || p.activeItem.startsWith('tool'));
      if (armed) {
        avatar.getObjectByName('arm-1')!.rotation.x = -1.1;
        avatar.getObjectByName('arm1')!.rotation.x = -0.6;
      }
      const shadow = avatar.getObjectByName('shadow')!;
      shadow.visible = p.y <= heightAt(this.seed, p.x, p.z) + 0.1;
    }
  }

  private animateCreature(model: THREE.Group, creature: CreatureState, dt: number): void {
    const data = model.userData;
    const speed =
      data.lastX === undefined
        ? 0
        : Math.hypot(creature.x - data.lastX, creature.z - data.lastZ) / Math.max(0.005, dt);
    data.lastX = creature.x;
    data.lastZ = creature.z;
    data.phase += dt * (2 + Math.min(speed, 10) * 2);
    const flying = creature.kind === 'frostwing';
    model.position.set(
      creature.x,
      heightAt(this.seed, creature.x, creature.z) +
        (flying
          ? 2.1 + Math.sin(this.elapsed * 2) * 0.3
          : Math.abs(Math.sin(data.phase)) * Math.min(0.1, speed * 0.02)),
      creature.z,
    );
    model.rotation.y = creature.yaw;
    for (const child of model.children) {
      if (child.name.startsWith('limb'))
        child.rotation.x =
          Math.sin(data.phase + Number(child.name.slice(4)) * 1.4) * Math.min(0.5, speed * 0.2);
      if (child.name.startsWith('wing'))
        child.rotation.z = Math.sin(data.phase * 2) * 0.5 * (child.name.endsWith('-1') ? -1 : 1);
    }
    model.rotation.x = creature.state === 'attack' ? Math.sin(this.elapsed * 17) * 0.12 : 0;
  }

  private syncWorld(world: WorldState | undefined, dt: number): void {
    if (!world) {
      this.storm.visible = false;
      return;
    }
    const creatureIds = new Set(world.creatures.map((c) => c.id));
    for (const [id, model] of this.creatures)
      if (!creatureIds.has(id)) {
        this.scene.remove(model);
        this.creatures.delete(id);
      }
    for (const creature of world.creatures) {
      let model = this.creatures.get(creature.id);
      if (!model) {
        model = this.factory.creature(creature.kind);
        this.creatures.set(creature.id, model);
        this.scene.add(model);
      }
      this.animateCreature(model, creature, dt);
    }
    const structureIds = new Set(world.structures.map((s) => s.id));
    for (const [id, model] of this.structures)
      if (!structureIds.has(id)) {
        this.scene.remove(model);
        this.structures.delete(id);
      }
    for (const structure of world.structures) {
      let model = this.structures.get(structure.id);
      if (!model) {
        model = this.factory.structure(structure.kind);
        this.structures.set(structure.id, model);
        this.scene.add(model);
      }
      model.position.set(structure.x, heightAt(this.seed, structure.x, structure.z), structure.z);
      model.rotation.y = structure.yaw;
      const flame = model.getObjectByName('flame');
      if (flame) {
        flame.scale.setScalar(0.95 + Math.sin(this.elapsed * 13) * 0.08);
        flame.rotation.y = this.elapsed * 0.4;
      }
      const turret = model.getObjectByName('turret-head');
      if (turret && world.creatures.length) {
        const nearest = world.creatures.reduce((best, creature) =>
          Math.hypot(creature.x - structure.x, creature.z - structure.z) <
          Math.hypot(best.x - structure.x, best.z - structure.z)
            ? creature
            : best,
        );
        turret.rotation.y = Math.atan2(nearest.x - structure.x, nearest.z - structure.z) - structure.yaw;
      }
    }
    const capsuleIds = new Set(world.capsules.map((c) => c.id));
    for (const [id, model] of this.capsules)
      if (!capsuleIds.has(id)) {
        this.scene.remove(model);
        this.capsules.delete(id);
      }
    for (const capsule of world.capsules) {
      let model = this.capsules.get(capsule.id);
      if (!model) {
        model = new THREE.Group();
        this.factory.part(model, 'box', 0xa3b5a3, [0.85, 0.55, 0.65], [0, 0.35, 0]);
        this.factory.part(model, 'box', 0xeeac76, [0.9, 0.13, 0.7], [0, 0.66, 0]);
        this.factory.part(model, 'sphere', 0xffcf8d, [0.09], [0, 0.83, 0], [0, 0, 0], 0.9);
        this.capsules.set(capsule.id, model);
        this.scene.add(model);
      }
      model.position.set(capsule.x, heightAt(this.seed, capsule.x, capsule.z), capsule.z);
    }
    this.storm.visible = true;
    this.storm.position.set(valleyCenter(this.seed, world.run.stormZ), 0, world.run.stormZ);
    this.stormMaterial.opacity = 0.43 + Math.sin(this.elapsed * 0.9) * 0.07;
    this.lightning.visible = Math.sin(this.elapsed * 1.7) > 0.94 || Math.sin(this.elapsed * 5.7) > 0.985;
    this.lightning.children.forEach((bolt, i) => {
      bolt.visible = (Math.floor(this.elapsed * 3) + i) % 3 === 0;
    });
    const ring = this.beacon.getObjectByName('beacon-ring');
    if (ring) {
      ring.rotation.z = this.elapsed * 0.5;
      ring.scale.setScalar(world.run.phase === 'extracting' ? 1 + Math.sin(this.elapsed * 2) * 0.12 : 1);
    }
    this.rescue.visible = world.run.phase === 'won';
    if (this.rescue.visible)
      this.rescue.position.set(
        this.beacon.position.x,
        this.beacon.position.y + 8 + Math.sin(this.elapsed) * 0.3,
        this.beacon.position.z - 10,
      );
    for (const event of world.events) {
      if (event.id <= this.lastEvent) continue;
      this.lastEvent = event.id;
      const color =
        event.kind === 'damage' || event.kind === 'death'
          ? 0xf49078
          : event.kind === 'hit'
            ? 0xffcb84
            : event.kind === 'gather'
              ? 0xa5efce
              : 0x9bdff3;
      const count = event.kind === 'shot' ? 3 : 7;
      for (let i = 0; i < count; i++) {
        const particle = new THREE.Mesh(
          this.factory.geometry('rock', event.kind === 'shot' ? 0.07 : 0.055),
          this.factory.material(color, 0.75),
        );
        particle.position.set(event.x, heightAt(this.seed, event.x, event.z) + 0.8, event.z);
        this.scene.add(particle);
        const phase = (i / count) * Math.PI * 2 + event.id;
        this.effects.push({
          mesh: particle,
          age: 0,
          duration: 0.65,
          velocity: new THREE.Vector3(Math.sin(phase) * 1.8, 1 + (i % 3) * 0.4, Math.cos(phase) * 1.8),
        });
      }
    }
  }

  update(
    local: PlayerState,
    players: PlayerState[],
    depleted: Set<string>,
    nearestId?: string,
    world?: WorldState,
  ): void {
    const frameTime = this.clock.getDelta();
    this.updateQuality(frameTime);
    const dt = Math.min(frameTime, 0.1);
    this.elapsed += dt;
    const runElapsed = world?.run.elapsed ?? 45;
    this.updateTerrain(local.x, local.z);
    this.lighting(local, runElapsed, dt);
    this.syncAvatars(local, players, dt);
    this.syncWorld(world, dt);
    this.cullingTimer -= dt;
    if (this.cullingTimer <= 0) {
      this.cullingTimer = 0.16;
      for (const [id, mesh] of this.nodeMeshes)
        mesh.visible =
          !depleted.has(id) &&
          Math.hypot(mesh.position.x - local.x, mesh.position.z - local.z) < (this.lowQuality ? 120 : 155);
      this.updateNodeBatches();
      for (const chunk of this.chunks.values())
        chunk.props.visible =
          Math.hypot(chunk.terrain.position.x - local.x, chunk.terrain.position.z - local.z) <
          (this.lowQuality ? 110 : 155);
    }
    const selected = nearestId
      ? (this.nodeMeshes.get(nearestId) ??
        this.creatures.get(nearestId) ??
        this.structures.get(nearestId) ??
        this.capsules.get(nearestId))
      : undefined;
    this.highlight.visible = !!selected && !this.placement;
    if (selected) {
      this.highlight.position.set(
        selected.position.x,
        heightAt(this.seed, selected.position.x, selected.position.z) + 0.035,
        selected.position.z,
      );
      this.highlight.scale.setScalar(
        this.structures.has(nearestId!) ? 1.8 : this.creatures.has(nearestId!) ? 1.3 : 1,
      );
      this.highlight.rotation.z = this.elapsed * 0.4;
    }
    for (let i = this.effects.length - 1; i >= 0; i--) {
      const effect = this.effects[i];
      effect.age += dt;
      effect.mesh.position.addScaledVector(effect.velocity, dt);
      effect.velocity.y -= dt * 3;
      effect.mesh.scale.setScalar(Math.max(0, 1 - effect.age / effect.duration));
      if (effect.age >= effect.duration) {
        this.scene.remove(effect.mesh);
        this.effects.splice(i, 1);
      }
    }
    const target = new THREE.Vector3(local.x, local.y + 1.4, local.z);
    if (!this.initialized) {
      this.cameraTarget.copy(target);
      this.initialized = true;
    }
    this.cameraTarget.lerp(target, 1 - Math.exp(-12 * dt));
    const desiredDistance = 7.2;
    const direction = new THREE.Vector3(
      -Math.sin(this.yaw) * Math.cos(this.pitch),
      Math.sin(this.pitch),
      -Math.cos(this.yaw) * Math.cos(this.pitch),
    );
    let distance = desiredDistance;
    for (let d = 0.8; d <= desiredDistance; d += 0.4) {
      const point = this.cameraTarget.clone().addScaledVector(direction, d);
      if (point.y < heightAt(this.seed, point.x, point.z) + 0.5) {
        distance = Math.max(0.8, d - 0.4);
        break;
      }
      if (
        world?.structures.some(
          (s) =>
            s.kind !== 'campfire' &&
            Math.hypot(s.x - point.x, s.z - point.z) < 0.65 &&
            point.y < heightAt(this.seed, s.x, s.z) + 1.8,
        )
      ) {
        distance = Math.max(0.8, d - 0.4);
        break;
      }
    }
    this.camera.position.copy(this.cameraTarget).addScaledVector(direction, distance);
    this.camera.lookAt(this.cameraTarget);
    this.renderer.render(this.scene, this.camera);
  }

  dispose(): void {
    window.removeEventListener('resize', this.resize);
    for (const chunk of this.chunks.values()) {
      chunk.terrain.geometry.dispose();
      chunk.props.traverse((object) => {
        if (object instanceof THREE.InstancedMesh) object.dispose();
      });
    }
    for (const batch of this.nodeBatches) batch.mesh.dispose();
    for (const geometry of this.uniqueGeometries) geometry.dispose();
    for (const material of this.uniqueMaterials) material.dispose();
    for (const material of this.ghostMaterials) material.dispose();
    this.factory.dispose();
    this.sun.shadow.map?.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
    this.scene.clear();
  }
}
