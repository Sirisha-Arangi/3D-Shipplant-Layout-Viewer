import * as THREE from 'three';

interface Node {
  x: number;
  y: number;
  z: number;
  g: number;
  h: number;
  f: number;
  parent: Node | null;
}

export function findPathAStar3D(
  start: THREE.Vector3,
  end: THREE.Vector3,
  shipModel: THREE.Group,
  gridSize = 0.5,
  margin = 0.2
): THREE.Vector3[] {
  const bounds = { minX: -20, maxX: 20, minY: -5, maxY: 5, minZ: -10, maxZ: 10 };
  const width = Math.ceil((bounds.maxX - bounds.minX) / gridSize);
  const height = Math.ceil((bounds.maxY - bounds.minY) / gridSize);
  const depth = Math.ceil((bounds.maxZ - bounds.minZ) / gridSize);

  // Build obstacle map
  const obstacles = new Set<string>();
  shipModel.traverse(child => {
    if (child instanceof THREE.Mesh && child.userData.system) {
      child.geometry.computeBoundingBox();
      const box = child.geometry.boundingBox?.clone();
      if (box) {
        box.applyMatrix4(child.matrixWorld);
        box.expandByScalar(margin);
        for (let x = Math.floor(box.min.x / gridSize); x <= Math.ceil(box.max.x / gridSize); x++) {
          for (let y = Math.floor(box.min.y / gridSize); y <= Math.ceil(box.max.y / gridSize); y++) {
            for (let z = Math.floor(box.min.z / gridSize); z <= Math.ceil(box.max.z / gridSize); z++) {
              obstacles.add(`${x},${y},${z}`);
            }
          }
        }
      }
    }
  });

  function toGrid(v: THREE.Vector3): Node {
    return {
      x: Math.round((v.x - bounds.minX) / gridSize),
      y: Math.round((v.y - bounds.minY) / gridSize),
      z: Math.round((v.z - bounds.minZ) / gridSize),
      g: 0,
      h: 0,
      f: 0,
      parent: null,
    };
  }

  function toWorld(n: Node): THREE.Vector3 {
    return new THREE.Vector3(
      n.x * gridSize + bounds.minX,
      n.y * gridSize + bounds.minY,
      n.z * gridSize + bounds.minZ
    );
  }

  const startNode = toGrid(start);
  const endNode = toGrid(end);
  const open: Node[] = [startNode];
  const closed = new Set<string>();

  const dirs = [-1, 0, 1];
  const directions: [number, number, number][] = [];
  for (let dx of dirs) for (let dy of dirs) for (let dz of dirs) {
    if (dx !== 0 || dy !== 0 || dz !== 0) directions.push([dx, dy, dz]);
  }

  while (open.length > 0) {
    open.sort((a, b) => a.f - b.f);
    const current = open.shift()!;
    const key = `${current.x},${current.y},${current.z}`;
    closed.add(key);

    if (current.x === endNode.x && current.y === endNode.y && current.z === endNode.z) {
      const path: THREE.Vector3[] = [];
      let node: Node | null = current;
      while (node) {
        path.push(toWorld(node));
        node = node.parent;
      }
      return path.reverse();
    }

    for (const [dx, dy, dz] of directions) {
      const nx = current.x + dx;
      const ny = current.y + dy;
      const nz = current.z + dz;

      const nKey = `${nx},${ny},${nz}`;
      if (
        nx < 0 || nx >= width ||
        ny < 0 || ny >= height ||
        nz < 0 || nz >= depth ||
        obstacles.has(nKey) ||
        closed.has(nKey)
      ) continue;

      const g = current.g + Math.sqrt(dx*dx + dy*dy + dz*dz);
      const h = Math.sqrt(
        Math.pow(endNode.x - nx, 2) +
        Math.pow(endNode.y - ny, 2) +
        Math.pow(endNode.z - nz, 2)
      );
      const f = g + h;

      const existing = open.find(n => n.x === nx && n.y === ny && n.z === nz);
      if (existing && existing.f <= f) continue;

      open.push({
        x: nx, y: ny, z: nz,
        g, h, f,
        parent: current
      });
    }
  }

  console.warn("No path found with A*.");
  return [];
}
