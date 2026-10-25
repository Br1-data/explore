import * as THREE from 'three';
import type { CreatureKind, StructureKind, WorldNode } from '@segnale/shared';

/** Geometry and materials are shared by all world objects; only transforms are unique. */
export class ModelFactory {
  readonly geometries = new Map<string, THREE.BufferGeometry>();
  readonly materials = new Map<string, THREE.MeshStandardMaterial>();

  material(color: number | string, glow = 0): THREE.MeshStandardMaterial {
    const key = `${color}:${glow}`;
    let material = this.materials.get(key);
    if (!material) {
      material = new THREE.MeshStandardMaterial({
        color,
        flatShading: true,
        roughness: 0.82,
        emissive: color,
        emissiveIntensity: glow,
      });
      this.materials.set(key, material);
    }
    return material;
  }

  geometry(
    kind: 'box' | 'sphere' | 'rock' | 'cone' | 'cylinder' | 'ring',
    a = 1,
    b = 1,
    c = 1,
    segments = 6,
  ): THREE.BufferGeometry {
    const key = `${kind}:${a},${b},${c},${segments}`;
    let geometry = this.geometries.get(key);
    if (!geometry) {
      if (kind === 'box') geometry = new THREE.BoxGeometry(a, b, c);
      else if (kind === 'sphere') geometry = new THREE.SphereGeometry(a, segments * 2, segments);
      else if (kind === 'rock') geometry = new THREE.IcosahedronGeometry(a, 0);
      else if (kind === 'cone') geometry = new THREE.ConeGeometry(a, b, segments);
      else if (kind === 'ring') geometry = new THREE.TorusGeometry(a, b, 4, segments * 4);
      else geometry = new THREE.CylinderGeometry(a, b, c, segments);
      this.geometries.set(key, geometry);
    }
    return geometry;
  }

  part(
    parent: THREE.Object3D,
    kind: Parameters<ModelFactory['geometry']>[0],
    color: number | string,
    size: number[],
    position: number[] = [0, 0, 0],
    rotation: number[] = [0, 0, 0],
    glow = 0,
  ): THREE.Mesh {
    const mesh = new THREE.Mesh(
      this.geometry(kind, size[0], size[1], size[2], size[3]),
      this.material(color, glow),
    );
    mesh.position.set(position[0], position[1], position[2]);
    mesh.rotation.set(rotation[0], rotation[1], rotation[2]);
    parent.add(mesh);
    return mesh;
  }

  node(node: WorldNode): THREE.Group {
    const group = new THREE.Group();
    const colors: Record<string, number> = {
      scrap: 0x8caaa3,
      crystal: 0xf585d5,
      fiber: 0x7bd4a6,
      oxygen: 0x6be8dd,
      fruit: 0xf8ce6d,
      biogel: 0xd79aef,
      obsidian: 0x48425e,
      cryo: 0x92e3fb,
      cache: 0xe9b577,
    };
    const color = colors[node.kind];
    if (['crystal', 'cryo', 'obsidian'].includes(node.kind)) {
      this.part(group, 'rock', 0x4b656b, [0.65], [0, 0.12, 0]).scale.set(1.2, 0.3, 1);
      for (let i = 0; i < 3; i++) {
        const crystal = this.part(
          group,
          'cone',
          color,
          [0.27 + i * 0.06, 1.55 + i * 0.28, 1, 5],
          [(i - 1) * 0.37, 0.8 + i * 0.15, (i % 2) * 0.25],
          [0, i * 0.4, (i - 1) * 0.2],
          node.kind === 'obsidian' ? 0.03 : 0.22,
        );
        this.part(crystal, 'ring', 0xe6dcdf, [0.13, 0.025], [0, -0.1, 0], [Math.PI / 2, 0, 0], 0.05);
      }
    } else if (node.kind === 'fiber') {
      for (let i = 0; i < 7; i++) {
        const frond = this.part(
          group,
          'cone',
          i % 2 ? 0x88ba86 : color,
          [0.19, 1.35 + (i % 3) * 0.2, 1, 3],
          [Math.sin(i * 2.4) * 0.35, 0.65, Math.cos(i * 2.4) * 0.35],
          [Math.cos(i) * 0.3, i, Math.sin(i) * 0.3],
        );
        frond.scale.z = 0.4;
      }
    } else if (node.kind === 'scrap') {
      this.part(group, 'rock', 0x526a6b, [0.6], [0, 0.15, 0]).scale.set(1.1, 0.4, 1);
      this.part(group, 'box', color, [0.9, 0.13, 0.75], [0.1, 0.35, 0], [0.15, 0.3, 0.35]);
      this.part(group, 'box', 0xb77250, [0.7, 0.12, 0.35], [-0.1, 0.52, 0.1], [0, -0.3, -0.25]);
      this.part(group, 'ring', 0xadb1a0, [0.28, 0.05], [0.3, 0.43, 0.2], [Math.PI / 2, 0.2, 0]);
    } else if (node.kind === 'cache') {
      this.part(group, 'box', 0x364d58, [0.85, 0.5, 0.6], [0, 0.35, 0]);
      this.part(group, 'box', 0xb79c78, [0.94, 0.12, 0.67], [0, 0.66, 0]);
      this.part(group, 'box', 0x8bf2df, [0.5, 0.09, 0.03], [0, 0.42, 0.31], [0, 0, 0], 0.8);
      this.part(group, 'cylinder', 0x9fb4ab, [0.025, 0.035, 1.2], [0.32, 1.15, 0]);
      this.part(group, 'sphere', color, [0.07], [0.32, 1.78, 0], [0, 0, 0], 1);
    } else {
      this.part(group, 'cylinder', 0x476f64, [0.09, 0.17, 0.8], [0, 0.4, 0]);
      if (node.kind === 'biogel') {
        this.part(group, 'sphere', color, [0.7], [0, 0.85, 0], [0, 0, 0], 0.35).scale.set(1, 0.45, 1);
        this.part(group, 'sphere', 0xf5cdff, [0.13], [0.22, 1.1, 0.1], [0, 0, 0], 0.9);
      } else {
        this.part(group, 'sphere', color, [0.48, 1, 1, 5], [0, 1.03, 0], [0, 0, 0], 0.28).scale.set(
          0.85,
          1.15,
          0.85,
        );
        for (let i = 0; i < 3; i++)
          this.part(
            group,
            'cone',
            0x679d79,
            [0.19, 0.45, 1, 3],
            [Math.sin(i * 2.1) * 0.25, 0.35, Math.cos(i * 2.1) * 0.25],
            [0.5, i * 2.1, 0.3],
          );
      }
    }
    return group;
  }

  astronaut(index: number, suitColor?: number): THREE.Group {
    const group = new THREE.Group();
    const color = suitColor ?? [0xe99c66, 0x65c9ce, 0xb7a1dd, 0xe7cf80][index % 4];
    this.part(group, 'cylinder', color, [0.28, 0.32, 0.65], [0, 1.04, 0]).scale.z = 0.72;
    this.part(group, 'box', 0x334f59, [0.48, 0.2, 0.34], [0, 0.72, 0]);
    this.part(group, 'box', 0xe8e1c8, [0.45, 0.12, 0.05], [0, 1.15, 0.23]);
    this.part(group, 'box', 0x91d9ca, [0.13, 0.07, 0.04], [0.12, 1.03, 0.25], [0, 0, 0], 0.4);
    this.part(group, 'sphere', 0xe7e4d5, [0.36, 1, 1, 7], [0, 1.57, 0]);
    this.part(group, 'sphere', 0x163744, [0.32, 1, 1, 7], [0, 1.56, 0.15]).scale.set(1, 0.65, 0.62);
    this.part(group, 'box', 0x528c99, [0.17, 0.035, 0.02], [-0.1, 1.64, 0.35], [0, 0, -0.1], 0.25);
    for (const side of [-1, 1]) {
      this.part(group, 'cylinder', 0x99aba7, [0.1, 0.1, 0.56], [side * 0.13, 1.04, -0.32]);
      this.part(
        group,
        'cylinder',
        0x8de6ca,
        [0.105, 0.105, 0.08],
        [side * 0.13, 1.23, -0.32],
        [0, 0, 0],
        0.15,
      );
      const leg = new THREE.Group();
      leg.name = `leg${side}`;
      leg.position.set(side * 0.16, 0.73, 0);
      this.part(leg, 'cylinder', 0x425e65, [0.105, 0.12, 0.5], [0, -0.25, 0]);
      this.part(leg, 'box', 0x233e47, [0.24, 0.18, 0.36], [0, -0.63, 0.05]);
      group.add(leg);
      const arm = new THREE.Group();
      arm.name = `arm${side}`;
      arm.position.set(side * 0.37, 1.25, 0);
      this.part(arm, 'cylinder', color, [0.105, 0.1, 0.48], [0, -0.24, 0]);
      this.part(arm, 'sphere', 0x2e4850, [0.12, 1, 1, 4], [0, -0.52, 0]);
      group.add(arm);
    }
    const tool = new THREE.Group();
    tool.name = 'tool';
    tool.position.set(-0.4, 0.7, 0.2);
    this.part(tool, 'cylinder', 0xa5b6aa, [0.035, 0.035, 0.65], [0, 0.15, 0], [0.8, 0, 0]);
    this.part(tool, 'box', 0xb3d7c1, [0.4, 0.09, 0.12], [0, 0.38, 0.25], [0.8, 0, 0]);
    group.add(tool);
    const weapon = new THREE.Group();
    weapon.name = 'weapon';
    weapon.position.set(-0.36, 1.1, 0.3);
    this.part(weapon, 'box', 0x354f59, [0.17, 0.24, 0.55], [0, 0, 0]);
    this.part(weapon, 'cylinder', 0x85e8cd, [0.055, 0.075, 0.5], [0, 0.02, 0.35], [Math.PI / 2, 0, 0], 0.5);
    group.add(weapon);
    let shadowGeometry = this.geometries.get('actor-shadow');
    if (!shadowGeometry) {
      shadowGeometry = new THREE.CircleGeometry(0.53, 16);
      this.geometries.set('actor-shadow', shadowGeometry);
    }
    const shadowMaterial = this.material(0x072b32);
    shadowMaterial.transparent = true;
    shadowMaterial.opacity = 0.28;
    shadowMaterial.depthWrite = false;
    const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.015;
    shadow.name = 'shadow';
    group.add(shadow);
    group.traverse((obj) => {
      if (obj instanceof THREE.Mesh) obj.castShadow = true;
    });
    group.userData.lastX = 0;
    group.userData.lastZ = 0;
    group.userData.phase = 0;
    return group;
  }

  creature(kind: CreatureKind): THREE.Group {
    const group = new THREE.Group();
    const colors: Record<CreatureKind, number> = {
      hopper: 0x91c58b,
      crab: 0xc68bc3,
      lurker: 0x8a709e,
      sporeling: 0xccaf74,
      scorpion: 0x66575c,
      spitter: 0x9e805b,
      frostbeast: 0x9dc5d8,
      frostwing: 0xa4e4f2,
      colossus: 0x6f83a1,
    };
    const color = colors[kind];
    const scale = kind === 'colossus' ? 3 : kind === 'frostbeast' ? 1.55 : kind === 'sporeling' ? 0.55 : 1;
    const body = this.part(group, 'rock', color, [0.7], [0, 0.95, 0]);
    body.scale.set(
      kind === 'hopper' ? 0.7 : 1.15,
      kind === 'lurker' || kind === 'colossus' ? 1.6 : 0.75,
      1.15,
    );
    const head = this.part(
      group,
      'rock',
      color,
      [0.42],
      [0, kind === 'lurker' || kind === 'colossus' ? 1.55 : 0.95, 0.66],
    );
    head.rotation.x = 0.15;
    for (const side of [-1, 1])
      this.part(
        group,
        'sphere',
        0xf3d39c,
        [0.065],
        [side * 0.17, head.position.y + 0.08, 1.02],
        [0, 0, 0],
        0.8,
      );
    if (kind === 'frostwing') {
      for (const side of [-1, 1]) {
        const wing = new THREE.Group();
        wing.name = `wing${side}`;
        wing.position.set(side * 0.4, 1, 0);
        this.part(
          wing,
          'cone',
          0xc5e4e9,
          [0.7, 2.2, 1, 3],
          [side * 0.7, 0, -0.1],
          [0, 0, (-side * Math.PI) / 2],
        ).scale.z = 0.15;
        group.add(wing);
      }
    } else {
      const legCount = ['crab', 'scorpion', 'sporeling', 'spitter'].includes(kind)
        ? 6
        : kind === 'lurker' || kind === 'colossus'
          ? 2
          : 4;
      for (let i = 0; i < legCount; i++) {
        const side = i % 2 ? 1 : -1;
        const leg = new THREE.Group();
        leg.name = `limb${i}`;
        leg.position.set(side * 0.4, 0.75, (Math.floor(i / 2) - (legCount / 2 - 1) / 2) * 0.45);
        this.part(leg, 'cylinder', color, [0.07, 0.1, 0.75], [side * 0.2, -0.32, 0], [0, 0, side * 0.5]);
        this.part(leg, 'cone', 0x354e58, [0.12, 0.32], [side * 0.35, -0.69, 0], [0, 0, side * 0.1]);
        group.add(leg);
      }
    }
    if (kind === 'hopper') {
      for (const side of [-1, 1])
        this.part(group, 'cone', 0xa6d7a1, [0.13, 0.8], [side * 0.25, 1.43, 0.5], [0.2, 0, side * 0.25]);
    } else if (kind === 'crab' || kind === 'scorpion') {
      for (const side of [-1, 1]) {
        this.part(
          group,
          'cylinder',
          color,
          [0.1, 0.14, 0.8],
          [side * 0.75, 0.85, 0.65],
          [Math.PI / 3, 0, side * 0.5],
        );
        this.part(group, 'rock', kind === 'crab' ? 0xe4a7d5 : 0x887a8b, [0.27], [side * 0.9, 0.75, 1]);
      }
      if (kind === 'scorpion') {
        for (let i = 0; i < 4; i++)
          this.part(
            group,
            'rock',
            0x5b536a,
            [0.22 - i * 0.025],
            [0, 1.1 + i * 0.26, -0.6 - Math.sin(i * 0.6) * 0.5],
          );
        this.part(group, 'cone', 0xb0a2bb, [0.12, 0.5], [0, 2.18, -0.6], [1.2, 0, 0]);
      }
    }
    if (['lurker', 'sporeling'].includes(kind))
      this.part(
        group,
        'sphere',
        kind === 'lurker' ? 0xaf91bd : 0xe2bc72,
        [0.8],
        [0, kind === 'lurker' ? 1.9 : 1.4, 0],
        [0, 0, 0],
        0.08,
      ).scale.y = 0.35;
    if (kind === 'spitter')
      this.part(group, 'cylinder', 0x302e3d, [0.2, 0.3, 0.6], [0, 1.03, 1], [Math.PI / 2, 0, 0]);
    if (['crab', 'spitter', 'frostbeast', 'colossus'].includes(kind)) {
      for (let i = 0; i < 5; i++)
        this.part(
          group,
          'cone',
          kind === 'crab' ? 0xf2a2d4 : 0xa5deeb,
          [0.15 + (i % 2) * 0.08, 0.6 + (i % 2) * 0.25],
          [Math.sin(i * 2.4) * 0.52, kind === 'colossus' ? 1.8 : 1.45, Math.cos(i * 2.4) * 0.5],
          [0.2, 0, Math.sin(i) * 0.4],
          0.18,
        );
    }
    if (kind === 'colossus')
      for (const side of [-1, 1]) {
        this.part(group, 'rock', 0x52657b, [0.55], [side * 0.9, 1.7, 0]);
        const arm = this.part(
          group,
          'cylinder',
          color,
          [0.18, 0.29, 1.5],
          [side * 0.95, 0.95, 0],
          [0, 0, side * 0.13],
        );
        arm.name = `arm${side}`;
      }
    group.scale.setScalar(scale);
    group.userData.phase = 0;
    group.userData.kind = kind;
    return group;
  }

  structure(kind: StructureKind): THREE.Group {
    const group = new THREE.Group();
    const metal = 0x6f8586;
    const dark = 0x2e4852;
    if (kind === 'beacon') {
      for (let i = 0; i < 3; i++)
        this.part(
          group,
          'cylinder',
          metal,
          [0.06, 0.08, 1.6],
          [Math.sin(i * 2.1) * 0.48, 0.7, Math.cos(i * 2.1) * 0.48],
          [Math.cos(i * 2.1) * 0.5, 0, -Math.sin(i * 2.1) * 0.5],
        );
      this.part(group, 'cylinder', dark, [0.16, 0.3, 2.6], [0, 1.5, 0]);
      this.part(group, 'sphere', 0x79e5d6, [0.32], [0, 2.8, 0], [0, 0, 0], 0.8);
      this.part(group, 'ring', 0x94e8c2, [0.48, 0.035], [0, 2.45, 0], [Math.PI / 2, 0, 0], 0.4);
    } else if (kind === 'oxygenator') {
      this.part(group, 'box', dark, [1.7, 0.3, 1.3], [0, 0.2, 0]);
      for (const side of [-1, 1]) {
        this.part(group, 'cylinder', 0x9bbbb4, [0.27, 0.27, 1.4], [side * 0.48, 1, 0]);
        this.part(group, 'cylinder', 0x73d4c6, [0.28, 0.28, 0.4], [side * 0.48, 1.2, 0], [0, 0, 0], 0.18);
      }
      this.part(group, 'box', metal, [0.5, 0.85, 0.6], [0, 0.7, 0]);
      this.part(group, 'box', 0x9beacc, [0.23, 0.18, 0.025], [0, 1.04, 0.32], [0, 0, 0], 0.7);
    } else if (kind === 'workbench') {
      for (const x of [-0.7, 0.7])
        for (const z of [-0.35, 0.35]) this.part(group, 'box', dark, [0.1, 0.95, 0.1], [x, 0.48, z]);
      this.part(group, 'box', metal, [1.9, 0.16, 1], [0, 1, 0]);
      this.part(group, 'box', 0xa7b69e, [0.5, 0.25, 0.3], [-0.45, 1.2, 0]);
      this.part(group, 'box', dark, [0.55, 0.4, 0.07], [0.45, 1.35, -0.3], [-0.2, 0, 0]);
      this.part(group, 'box', 0x85d6c7, [0.43, 0.25, 0.015], [0.45, 1.36, -0.25], [-0.2, 0, 0], 0.7);
    } else if (kind === 'campfire') {
      for (let i = 0; i < 8; i++)
        this.part(
          group,
          'rock',
          0x768b87,
          [0.22],
          [Math.sin((i * Math.PI) / 4) * 0.6, 0.14, Math.cos((i * Math.PI) / 4) * 0.6],
        );
      for (let i = 0; i < 3; i++)
        this.part(group, 'cylinder', 0x644e41, [0.1, 0.14, 1], [0, 0.2, 0], [Math.PI / 2, i * 1.05, 0]);
      const flame = this.part(group, 'cone', 0xf3ad61, [0.35, 0.95, 1, 5], [0, 0.68, 0], [0, 0, 0], 1);
      flame.name = 'flame';
      this.part(flame, 'cone', 0xffe5a2, [0.18, 0.65, 1, 5], [0, -0.2, 0.05], [0, 0, 0], 1);
    } else if (kind === 'turret') {
      this.part(group, 'cylinder', metal, [0.4, 0.65, 0.25], [0, 0.15, 0]);
      this.part(group, 'cylinder', dark, [0.12, 0.18, 1.1], [0, 0.7, 0]);
      const head = new THREE.Group();
      head.name = 'turret-head';
      head.position.y = 1.3;
      this.part(head, 'box', metal, [0.8, 0.42, 0.65]);
      for (const side of [-1, 1])
        this.part(head, 'cylinder', dark, [0.07, 0.08, 0.95], [side * 0.23, 0, 0.55], [Math.PI / 2, 0, 0]);
      this.part(head, 'box', 0xf4a978, [0.2, 0.1, 0.035], [0, 0.12, 0.35], [0, 0, 0], 0.8);
      group.add(head);
    } else {
      for (const x of [-0.9, 0.9])
        this.part(group, 'cylinder', dark, [0.09, 0.12, 1.8], [x, 0.8, 0], [0, 0, -x * 0.1]);
      for (let i = 0; i < 4; i++)
        this.part(
          group,
          'box',
          i % 2 ? metal : 0x987956,
          [2.1, 0.25, 0.2],
          [0, 0.35 + i * 0.35, 0],
          [0, 0, i % 2 ? 0.04 : -0.04],
        );
    }
    return group;
  }

  wreck(): THREE.Group {
    const wreck = new THREE.Group();
    this.part(wreck, 'cylinder', 0xbcc2ad, [1.35, 1.8, 8.5], [0, 1.6, 0], [0, 0, Math.PI / 2]);
    this.part(wreck, 'cone', 0x748f92, [1.3, 2.5, 1, 8], [-5, 1.6, 0], [0, 0, Math.PI / 2]);
    this.part(wreck, 'sphere', 0x163d4c, [1], [-4.1, 2.1, 0.4]).scale.set(1.4, 0.65, 0.85);
    for (const side of [-1, 1]) {
      this.part(wreck, 'box', 0xa67752, [4.8, 0.2, 4.5], [1, 0.5, side * 2.9], [0, side * 0.3, side * 0.12]);
      this.part(wreck, 'cylinder', 0x435d63, [0.55, 0.72, 2.8], [2.3, 1.2, side * 1.5], [0, 0, Math.PI / 2]);
      this.part(
        wreck,
        'cylinder',
        0xeea77d,
        [0.34, 0.34, 0.1],
        [3.75, 1.2, side * 1.5],
        [0, 0, Math.PI / 2],
        0.7,
      );
    }
    this.part(wreck, 'box', 0xbac2a7, [1.1, 2.5, 0.2], [2, 3.1, 0], [0, 0, -0.25]);
    this.part(wreck, 'box', 0x65d3c6, [1.5, 0.06, 0.05], [-1, 2.5, 1.3], [0, 0, 0], 0.4);
    for (let i = 0; i < 7; i++) {
      this.part(
        wreck,
        'box',
        i % 2 ? 0x788a82 : 0x975f44,
        [0.8 + (i % 3) * 0.5, 0.08, 0.5],
        [Math.sin(i * 2.4) * 6, 0.15, Math.cos(i * 2.4) * 4],
        [0.1, i, 0.1],
      );
    }
    return wreck;
  }

  dispose(): void {
    for (const geometry of this.geometries.values()) geometry.dispose();
    for (const material of this.materials.values()) material.dispose();
  }
}
