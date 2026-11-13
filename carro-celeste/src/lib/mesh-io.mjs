// Writers for the two delivery formats: binary STL (printing) and binary glTF (web viewer).
import { Buffer } from 'node:buffer';

/** Plain triangle soup description of a Manifold: {positions: Float32Array, indices: Uint32Array}. */
export function meshData(solid) {
  const mesh = solid.getMesh();
  const n = mesh.numProp;
  const count = mesh.vertProperties.length / n;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = mesh.vertProperties[i * n];
    positions[i * 3 + 1] = mesh.vertProperties[i * n + 1];
    positions[i * 3 + 2] = mesh.vertProperties[i * n + 2];
  }
  return { positions, indices: Uint32Array.from(mesh.triVerts) };
}

export function writeBinaryStl(solid, title) {
  const { positions, indices } = meshData(solid);
  const triangles = indices.length / 3;
  const buffer = Buffer.alloc(84 + triangles * 50);
  buffer.write(title.slice(0, 79), 0, 'ascii');
  buffer.writeUInt32LE(triangles, 80);
  let o = 84;
  for (let t = 0; t < triangles; t++) {
    const a = indices[t * 3] * 3;
    const b = indices[t * 3 + 1] * 3;
    const c = indices[t * 3 + 2] * 3;
    const ux = positions[b] - positions[a];
    const uy = positions[b + 1] - positions[a + 1];
    const uz = positions[b + 2] - positions[a + 2];
    const vx = positions[c] - positions[a];
    const vy = positions[c + 1] - positions[a + 1];
    const vz = positions[c + 2] - positions[a + 2];
    let nx = uy * vz - uz * vy;
    let ny = uz * vx - ux * vz;
    let nz = ux * vy - uy * vx;
    const l = Math.hypot(nx, ny, nz) || 1;
    nx /= l;
    ny /= l;
    nz /= l;
    buffer.writeFloatLE(nx, o);
    buffer.writeFloatLE(ny, o + 4);
    buffer.writeFloatLE(nz, o + 8);
    o += 12;
    for (const i of [a, b, c]) {
      buffer.writeFloatLE(positions[i], o);
      buffer.writeFloatLE(positions[i + 1], o + 4);
      buffer.writeFloatLE(positions[i + 2], o + 8);
      o += 12;
    }
    o += 2;
  }
  return buffer;
}

/**
 * Vertex normals with a crease angle: faces meeting at less than `creaseDeg` are shaded
 * smoothly, sharper edges stay crisp. Returns de-duplicated {positions, normals, indices}.
 */
export function creasedGeometry({ positions, indices }, creaseDeg) {
  const triangles = indices.length / 3;
  const faceNormals = new Float32Array(triangles * 3);
  const faceWeights = new Float32Array(triangles);
  for (let t = 0; t < triangles; t++) {
    const a = indices[t * 3] * 3;
    const b = indices[t * 3 + 1] * 3;
    const c = indices[t * 3 + 2] * 3;
    const ux = positions[b] - positions[a];
    const uy = positions[b + 1] - positions[a + 1];
    const uz = positions[b + 2] - positions[a + 2];
    const vx = positions[c] - positions[a];
    const vy = positions[c + 1] - positions[a + 1];
    const vz = positions[c + 2] - positions[a + 2];
    const nx = uy * vz - uz * vy;
    const ny = uz * vx - ux * vz;
    const nz = ux * vy - uy * vx;
    const l = Math.hypot(nx, ny, nz);
    faceWeights[t] = l;
    if (l > 0) {
      faceNormals[t * 3] = nx / l;
      faceNormals[t * 3 + 1] = ny / l;
      faceNormals[t * 3 + 2] = nz / l;
    }
  }
  const vertexCount = positions.length / 3;
  const start = new Uint32Array(vertexCount + 1);
  for (let i = 0; i < indices.length; i++) start[indices[i] + 1]++;
  for (let v = 0; v < vertexCount; v++) start[v + 1] += start[v];
  const fill = start.slice(0, vertexCount);
  const incident = new Uint32Array(indices.length);
  for (let i = 0; i < indices.length; i++) incident[fill[indices[i]]++] = (i / 3) | 0;

  const cosCrease = Math.cos((creaseDeg * Math.PI) / 180);
  const outPositions = [];
  const outNormals = [];
  const outIndices = new Uint32Array(indices.length);
  const lookup = new Map();
  for (let i = 0; i < indices.length; i++) {
    const v = indices[i];
    const f = (i / 3) | 0;
    const fx = faceNormals[f * 3];
    const fy = faceNormals[f * 3 + 1];
    const fz = faceNormals[f * 3 + 2];
    let nx = 0;
    let ny = 0;
    let nz = 0;
    for (let k = start[v]; k < start[v + 1]; k++) {
      const g = incident[k];
      const gx = faceNormals[g * 3];
      const gy = faceNormals[g * 3 + 1];
      const gz = faceNormals[g * 3 + 2];
      if (g === f || fx * gx + fy * gy + fz * gz >= cosCrease) {
        nx += gx * faceWeights[g];
        ny += gy * faceWeights[g];
        nz += gz * faceWeights[g];
      }
    }
    const l = Math.hypot(nx, ny, nz) || 1;
    nx /= l;
    ny /= l;
    nz /= l;
    const key = `${v}|${Math.round(nx * 512)}|${Math.round(ny * 512)}|${Math.round(nz * 512)}`;
    let index = lookup.get(key);
    if (index === undefined) {
      index = outPositions.length / 3;
      lookup.set(key, index);
      outPositions.push(positions[v * 3], positions[v * 3 + 1], positions[v * 3 + 2]);
      outNormals.push(nx, ny, nz);
    }
    outIndices[i] = index;
  }
  return {
    positions: Float32Array.from(outPositions),
    normals: Float32Array.from(outNormals),
    indices: outIndices,
  };
}

/**
 * Minimal binary glTF 2.0 writer.
 * meshes: [{name, material, geometry: {positions, normals, indices}}]
 * materials: [{name, color: [r,g,b,a], metallic, roughness, emissive: [r,g,b]}]
 * instances: [{name, mesh: meshName, translation, rotationZDeg}] in model space (mm, Z up).
 * A root node converts to glTF conventions (metres, Y up).
 */
export function writeGlb({ meshes, materials, instances, extras }) {
  const chunks = [];
  const bufferViews = [];
  const accessors = [];
  let offset = 0;
  const pushView = (typed, target) => {
    const bytes = Buffer.from(typed.buffer, typed.byteOffset, typed.byteLength);
    const padded = Buffer.alloc(Math.ceil(bytes.length / 4) * 4);
    bytes.copy(padded);
    chunks.push(padded);
    bufferViews.push({ buffer: 0, byteOffset: offset, byteLength: bytes.length, target });
    offset += padded.length;
    return bufferViews.length - 1;
  };
  const bounds = (array) => {
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < array.length; i += 3) {
      for (let k = 0; k < 3; k++) {
        if (array[i + k] < min[k]) min[k] = array[i + k];
        if (array[i + k] > max[k]) max[k] = array[i + k];
      }
    }
    return { min, max };
  };

  const materialIndex = new Map(materials.map((m, i) => [m.name, i]));
  const meshIndex = new Map();
  const gltfMeshes = meshes.map((mesh, i) => {
    meshIndex.set(mesh.name, i);
    const primitives = mesh.primitives.map(({ material, geometry }) => {
      const { positions, normals, indices } = geometry;
      const position = accessors.length;
      accessors.push({
        bufferView: pushView(positions, 34962),
        componentType: 5126,
        count: positions.length / 3,
        type: 'VEC3',
        ...bounds(positions),
      });
      const normal = accessors.length;
      accessors.push({
        bufferView: pushView(normals, 34962),
        componentType: 5126,
        count: normals.length / 3,
        type: 'VEC3',
      });
      const index = accessors.length;
      accessors.push({
        bufferView: pushView(indices, 34963),
        componentType: 5125,
        count: indices.length,
        type: 'SCALAR',
      });
      return {
        attributes: { POSITION: position, NORMAL: normal },
        indices: index,
        material: materialIndex.get(material),
      };
    });
    return { name: mesh.name, primitives };
  });

  const nodes = instances.map((instance) => {
    const half = ((instance.rotationZDeg ?? 0) * Math.PI) / 360;
    return {
      name: instance.name,
      mesh: meshIndex.get(instance.mesh),
      translation: instance.translation ?? [0, 0, 0],
      rotation: [0, 0, Math.sin(half), Math.cos(half)],
      ...(instance.extras ? { extras: instance.extras } : {}),
    };
  });
  // Root: millimetres with Z up -> metres with Y up.
  const s = Math.SQRT1_2;
  nodes.push({
    name: 'carro_celeste',
    children: instances.map((_, i) => i),
    rotation: [-s, 0, 0, s],
    scale: [0.001, 0.001, 0.001],
  });

  const json = {
    asset: { version: '2.0', generator: 'carro-celeste/src/build.mjs' },
    scene: 0,
    scenes: [{ name: 'Carro celeste', nodes: [nodes.length - 1] }],
    nodes,
    meshes: gltfMeshes,
    materials: materials.map((m) => ({
      name: m.name,
      pbrMetallicRoughness: {
        baseColorFactor: m.color,
        metallicFactor: m.metallic ?? 0,
        roughnessFactor: m.roughness ?? 0.6,
      },
      emissiveFactor: m.emissive ?? [0, 0, 0],
      ...(m.color[3] < 1 ? { alphaMode: 'BLEND' } : {}),
    })),
    accessors,
    bufferViews,
    buffers: [{ byteLength: offset }],
    ...(extras ? { extras } : {}),
  };

  const jsonBytes = Buffer.from(JSON.stringify(json), 'utf8');
  const jsonChunk = Buffer.alloc(Math.ceil(jsonBytes.length / 4) * 4, 0x20);
  jsonBytes.copy(jsonChunk);
  const bin = Buffer.concat(chunks);
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(12 + 8 + jsonChunk.length + 8 + bin.length, 8);
  const jsonHeader = Buffer.alloc(8);
  jsonHeader.writeUInt32LE(jsonChunk.length, 0);
  jsonHeader.writeUInt32LE(0x4e4f534a, 4);
  const binHeader = Buffer.alloc(8);
  binHeader.writeUInt32LE(bin.length, 0);
  binHeader.writeUInt32LE(0x004e4942, 4);
  return Buffer.concat([header, jsonHeader, jsonChunk, binHeader, bin]);
}
