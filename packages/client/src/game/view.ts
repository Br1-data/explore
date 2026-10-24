import * as THREE from 'three';
import { WORLD, biomeAt, generateNodes, heightAt, valleyCenter } from '@segnale/shared';
import type { PlayerState, WorldNode } from '@segnale/shared';

const nodeColors: Record<string, number> = {
  scrap: 0xb9b6a8,
  crystal: 0xff79bd,
  fiber: 0x91c875,
  oxygen: 0x7bf5ed,
  fruit: 0xffd378,
  biogel: 0xe5a4ff,
  obsidian: 0x544d78,
  cryo: 0x9ae9ff,
};

/** Everything is generated locally from the same seed as the authoritative server. */
export class WorldView {
  readonly renderer: THREE.WebGLRenderer;
  readonly camera = new THREE.PerspectiveCamera(58, 1, 0.1, 500);
  readonly scene = new THREE.Scene();
  private readonly sky = new THREE.Group();
  readonly nodes: WorldNode[];
  yaw = 0;
  pitch = 0.25;
  private readonly avatars = new Map<string, THREE.Group>();
  private readonly nodeMeshes = new Map<string, THREE.Object3D>();
  private readonly chunks = new Map<string, THREE.Mesh>();
  private readonly clock = new THREE.Clock();
  private readonly cameraTarget = new THREE.Vector3();
  private initialized = false;
  private highlighted: THREE.Object3D | undefined;
  private readonly resize = () => {
    const canvas = this.renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  };

  constructor(
    private readonly seed: number,
    host: HTMLElement,
  ) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    this.renderer.setClearColor(0x102c3a);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.domElement.setAttribute('aria-label', 'Valle aliena di Kepler-Sigma');
    host.replaceChildren(this.renderer.domElement);
    this.scene.fog = new THREE.Fog(0x183c48, 65, 220);
    this.scene.add(new THREE.HemisphereLight(0xb8e7e6, 0x24372f, 2.8));
    const sun = new THREE.DirectionalLight(0xffdbba, 3.2);
    sun.position.set(-70, 120, -30);
    this.scene.add(sun);
    this.scene.add(this.sky);
    this.buildSky();
    this.buildWreck();
    this.nodes = generateNodes(seed);
    for (const node of this.nodes) {
      const mesh = this.buildNode(node);
      mesh.position.set(node.x, heightAt(seed, node.x, node.z), node.z);
      this.scene.add(mesh);
      this.nodeMeshes.set(node.id, mesh);
    }
    const beacon = new THREE.Group();
    const mast = this.mesh(new THREE.CylinderGeometry(0.3, 1.2, 16, 6), 0xa8b5b6);
    mast.position.y = 8;
    const light = this.mesh(new THREE.IcosahedronGeometry(2, 0), 0xa5ffee, true);
    light.position.y = 17;
    beacon.add(mast, light);
    beacon.position.set(
      valleyCenter(seed, WORLD.signalZ),
      heightAt(seed, valleyCenter(seed, WORLD.signalZ), WORLD.signalZ),
      WORLD.signalZ,
    );
    this.scene.add(beacon);
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  private mesh(geometry: THREE.BufferGeometry, color: number, glow = false): THREE.Mesh {
    return new THREE.Mesh(
      geometry,
      new THREE.MeshStandardMaterial({
        color,
        flatShading: true,
        roughness: 0.85,
        ...(glow ? { emissive: color, emissiveIntensity: 0.6 } : {}),
      }),
    );
  }

  private buildSky(): void {
    const planet = this.mesh(new THREE.IcosahedronGeometry(27, 3), 0x5d8d9a);
    planet.position.set(-105, 50, 190);
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(34, 46, 64),
      new THREE.MeshBasicMaterial({
        color: 0xb2c8ba,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      }),
    );
    ring.rotation.x = 1.1;
    ring.rotation.y = -0.45;
    planet.add(ring);
    // Keep the planet behind the atmospheric fog.
    planet.traverse((obj) => {
      if (obj instanceof THREE.Mesh) obj.material.fog = false;
    });
    this.sky.add(planet);
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(4, 16, 12),
      new THREE.MeshBasicMaterial({ color: 0xffe9c6, fog: false }),
    );
    sun.position.set(-100, 110, 160);
    this.sky.add(sun);
  }

  private buildWreck(): void {
    const wreck = new THREE.Group();
    const body = this.mesh(new THREE.CylinderGeometry(1.5, 2.2, 9, 6), 0xc1c5ba);
    body.rotation.z = Math.PI / 2;
    body.rotation.y = -0.35;
    body.position.y = 1.6;
    const cockpit = this.mesh(new THREE.IcosahedronGeometry(1.6, 0), 0x2c5764);
    cockpit.position.set(-4, 1.8, -1);
    const wing = this.mesh(new THREE.BoxGeometry(6, 0.35, 4), 0xb36143);
    wing.rotation.z = -0.25;
    wing.position.set(0, 0.7, 2);
    const antenna = this.mesh(new THREE.CylinderGeometry(0.06, 0.08, 4, 5), 0x9baba6);
    antenna.position.set(1, 4, 0);
    wreck.add(body, cockpit, wing, antenna);
    const x = valleyCenter(this.seed, -7) + 7;
    wreck.position.set(x, heightAt(this.seed, x, -7), -7);
    wreck.rotation.y = 0.5;
    this.scene.add(wreck);
  }

  private buildNode(node: WorldNode): THREE.Group {
    const group = new THREE.Group();
    const color = nodeColors[node.kind];
    if (node.kind === 'crystal' || node.kind === 'cryo' || node.kind === 'obsidian') {
      for (let i = 0; i < 3; i++) {
        const crystal = this.mesh(new THREE.ConeGeometry(0.3 + i * 0.07, 1.6 + i * 0.3, 5), color, true);
        crystal.position.set((i - 1) * 0.45, 0.7 + i * 0.1, (i % 2) * 0.3);
        crystal.rotation.z = (i - 1) * 0.2;
        group.add(crystal);
      }
    } else if (node.kind === 'fiber') {
      for (let i = 0; i < 4; i++) {
        const stem = this.mesh(new THREE.ConeGeometry(0.35, 1.7, 3), color);
        stem.position.set(Math.sin(i * 2) * 0.4, 0.8, Math.cos(i * 2) * 0.4);
        stem.rotation.z = Math.sin(i) * 0.3;
        group.add(stem);
      }
    } else if (node.kind === 'scrap') {
      const scrap = this.mesh(new THREE.DodecahedronGeometry(0.8, 0), color);
      scrap.scale.set(1.2, 0.55, 0.8);
      scrap.position.y = 0.35;
      const plate = this.mesh(new THREE.BoxGeometry(0.9, 0.12, 0.7), 0xb46d44);
      plate.position.set(0.2, 0.6, 0);
      plate.rotation.z = 0.4;
      group.add(scrap, plate);
    } else {
      const stem = this.mesh(new THREE.CylinderGeometry(0.12, 0.2, 0.9, 5), 0x4f7771);
      stem.position.y = 0.45;
      const bulb = this.mesh(new THREE.IcosahedronGeometry(0.65, 1), color, true);
      bulb.scale.y = node.kind === 'biogel' ? 0.45 : 1;
      bulb.position.y = 1.2;
      group.add(stem, bulb);
    }
    return group;
  }

  private makeAvatar(index: number): THREE.Group {
    const group = new THREE.Group();
    const colors = [0xef9060, 0x79c9ca, 0xbe9bdf, 0xe1cc76];
    const color = colors[index % colors.length];
    const torso = this.mesh(new THREE.BoxGeometry(0.65, 0.65, 0.4), color);
    torso.position.y = 0.95;
    const helmet = this.mesh(new THREE.IcosahedronGeometry(0.38, 1), 0xe9e6da);
    helmet.position.y = 1.55;
    const visor = this.mesh(new THREE.BoxGeometry(0.5, 0.22, 0.18), 0x183e4f);
    visor.position.set(0, 1.55, 0.3);
    const pack = this.mesh(new THREE.BoxGeometry(0.45, 0.55, 0.25), 0x849a92);
    pack.position.set(0, 1, -0.3);
    group.add(torso, helmet, visor, pack);
    for (const side of [-1, 1]) {
      const leg = this.mesh(new THREE.BoxGeometry(0.23, 0.52, 0.28), 0x354c50);
      leg.position.set(side * 0.18, 0.3, 0);
      const arm = this.mesh(new THREE.BoxGeometry(0.2, 0.6, 0.25), color);
      arm.position.set(side * 0.45, 0.95, 0);
      group.add(leg, arm);
    }
    return group;
  }

  private updateTerrain(x: number, z: number): void {
    const size = WORLD.chunkSize;
    const cx = Math.floor(x / size);
    const cz = Math.floor(z / size);
    const needed = new Set<string>();
    for (let dz = -4; dz <= 5; dz++) {
      for (let dx = -4; dx <= 4; dx++) {
        const ix = cx + dx;
        const iz = cz + dz;
        const key = `${ix},${iz}`;
        needed.add(key);
        if (this.chunks.has(key)) continue;
        const res = WORLD.chunkRes;
        const geometry = new THREE.PlaneGeometry(size, size, res, res);
        geometry.rotateX(-Math.PI / 2);
        const vertices = geometry.attributes.position;
        const colors = new Float32Array(vertices.count * 3);
        const tint = new THREE.Color();
        for (let i = 0; i < vertices.count; i++) {
          const wx = vertices.getX(i) + ix * size;
          const wz = vertices.getZ(i) + iz * size;
          vertices.setY(i, heightAt(this.seed, wx, wz));
          tint.set(biomeAt(wz).color);
          const edge = Math.abs(wx - valleyCenter(this.seed, wz));
          if (edge > WORLD.halfWidth - 15)
            tint.lerp(new THREE.Color(0x596c71), Math.min(1, (edge - WORLD.halfWidth + 15) / 35));
          const shade = 0.93 + Math.sin(wx * 0.19 + wz * 0.13) * 0.07;
          colors[i * 3] = tint.r * shade;
          colors[i * 3 + 1] = tint.g * shade;
          colors[i * 3 + 2] = tint.b * shade;
        }
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.computeVertexNormals();
        const mesh = new THREE.Mesh(
          geometry,
          new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 1 }),
        );
        mesh.position.set(ix * size, 0, iz * size);
        this.scene.add(mesh);
        this.chunks.set(key, mesh);
      }
    }
    for (const [key, mesh] of this.chunks) {
      if (!needed.has(key)) {
        this.scene.remove(mesh);
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
        this.chunks.delete(key);
      }
    }
  }

  update(local: PlayerState, players: PlayerState[], depleted: Set<string>, nearestId?: string): void {
    const dt = Math.min(this.clock.getDelta(), 0.1);
    this.updateTerrain(local.x, local.z);
    this.sky.position.set(local.x, 0, local.z);
    const ids = new Set(players.map((p) => p.id));
    for (const [id, mesh] of this.avatars) {
      if (!ids.has(id)) {
        this.scene.remove(mesh);
        mesh.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.geometry.dispose();
            (obj.material as THREE.Material).dispose();
          }
        });
        this.avatars.delete(id);
      }
    }
    for (const player of players) {
      let avatar = this.avatars.get(player.id);
      if (!avatar) {
        avatar = this.makeAvatar(this.avatars.size);
        this.avatars.set(player.id, avatar);
        this.scene.add(avatar);
      }
      const p = player.id === local.id ? local : player;
      avatar.position.set(p.x, p.y, p.z);
      avatar.rotation.y = p.yaw;
      avatar.visible = p.connected;
      avatar.rotation.z = p.hp <= 0 ? Math.PI / 2 : 0;
    }
    for (const [id, mesh] of this.nodeMeshes)
      mesh.visible =
        !depleted.has(id) &&
        mesh.position.distanceToSquared(new THREE.Vector3(local.x, local.y, local.z)) < 160 * 160;
    if (this.highlighted) this.highlighted.scale.setScalar(1);
    this.highlighted = nearestId ? this.nodeMeshes.get(nearestId) : undefined;
    this.highlighted?.scale.setScalar(1.12);
    const target = new THREE.Vector3(local.x, local.y + 1.4, local.z);
    if (!this.initialized) {
      this.cameraTarget.copy(target);
      this.initialized = true;
    }
    this.cameraTarget.lerp(target, 1 - Math.exp(-12 * dt));
    const distance = 7.5;
    this.camera.position.set(
      this.cameraTarget.x - Math.sin(this.yaw) * Math.cos(this.pitch) * distance,
      this.cameraTarget.y + Math.sin(this.pitch) * distance,
      this.cameraTarget.z - Math.cos(this.yaw) * Math.cos(this.pitch) * distance,
    );
    this.camera.position.y = Math.max(
      this.camera.position.y,
      heightAt(this.seed, this.camera.position.x, this.camera.position.z) + 0.7,
    );
    this.camera.lookAt(this.cameraTarget);
    this.renderer.render(this.scene, this.camera);
  }

  dispose(): void {
    window.removeEventListener('resize', this.resize);
    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
        materials.forEach((material: THREE.Material) => material.dispose());
      }
    });
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
