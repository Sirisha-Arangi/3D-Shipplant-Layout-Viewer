import * as THREE from 'three';

interface Node {
  x: number;
  y: number;
  z: number;
  g: number; // Cost from start
  h: number; // Heuristic to goal
  f: number; // Total cost (g + h)
  parent: Node | null;
}

// A* pathfinding in 3D grid
export function findPath(start: THREE.Vector3, end: THREE.Vector3, shipModel: THREE.Group): Node[] {
  const gridSize = 0.5; // Grid resolution (adjust for precision vs performance)
  const gridBounds = { minX: -20, maxX: 20, minY: -5, maxY: 5, minZ: -10, maxZ: 10 }; // Ship bounds
  const gridWidth = Math.ceil((gridBounds.maxX - gridBounds.minX) / gridSize);
  const gridHeight = Math.ceil((gridBounds.maxY - gridBounds.minY) / gridSize);
  const gridDepth = Math.ceil((gridBounds.maxZ - gridBounds.minZ) / gridSize);

  // Create obstacle grid
  const obstacles = new Set<string>();
  shipModel.traverse(child => {
    if (child instanceof THREE.Mesh && child.userData.system) {
      child.geometry.computeBoundingBox();
      const box = child.geometry.boundingBox!.clone();
      box.applyMatrix4(child.matrixWorld);
      const min = box.min;
      const max = box.max;
      for (let x = Math.floor(min.x / gridSize); x <= Math.ceil(max.x / gridSize); x++) {
        for (let y = Math.floor(min.y / gridSize); y <= Math.ceil(max.y / gridSize); y++) {
          for (let z = Math.floor(min.z / gridSize); z <= Math.ceil(max.z / gridSize); z++) {
            obstacles.add(`${x},${y},${z}`);
          }
        }
      }
    }
  });

  // Convert start and end to grid coordinates
  const startNode: Node = {
    x: Math.round((start.x - gridBounds.minX) / gridSize),
    y: Math.round((start.y - gridBounds.minY) / gridSize),
    z: Math.round((start.z - gridBounds.minZ) / gridSize),
    g: 0,
    h: 0,
    f: 0,
    parent: null
  };
  const endNode: Node = {
  x: Math.round((end.x - gridBounds.minX) / gridSize),
  y: Math.round((end.y - gridBounds.minY) / gridSize),
  z: Math.round((end.z - gridBounds.minZ) / gridSize),
  g: 0,
  h: 0,
  f: 0,
  parent: null
};

  // A* algorithm
  const openList: Node[] = [startNode];
  const closedList = new Set<string>();
  const directions = [
    [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1], // 6-directional movement
    [1, 1, 0], [1, -1, 0], [-1, 1, 0], [-1, -1, 0], // Diagonal in XY
    [1, 0, 1], [1, 0, -1], [-1, 0, 1], [-1, 0, -1], // Diagonal in XZ
    [0, 1, 1], [0, 1, -1], [0, -1, 1], [0, -1, -1] // Diagonal in YZ
  ];

  while (openList.length > 0) {
    // Find node with lowest f score
    let current = openList.reduce((min, node) => (node.f < min.f ? node : min), openList[0]);
    const currentKey = `${current.x},${current.y},${current.z}`;
    closedList.add(currentKey);
    openList.splice(openList.indexOf(current), 1);

    // Check if goal reached
    if (current.x === endNode.x && current.y === endNode.y && current.z === endNode.z) {
      const path: Node[] = [];
      let node: Node | null = current;
      while (node) {
        path.push({
          x: node.x * gridSize + gridBounds.minX,
          y: node.y * gridSize + gridBounds.minY,
          z: node.z * gridSize + gridBounds.minZ,
          g: 0,
          h: 0,
          f: 0,
          parent: null
        });
        node = node.parent;
      }
      return path.reverse();
    }

    // Explore neighbors
    for (const [dx, dy, dz] of directions) {
      const neighbor: Node = {
        x: current.x + dx,
        y: current.y + dy,
        z: current.z + dz,
        g: 0,
        h: 0,
        f: 0,
        parent: current
      };
      const neighborKey = `${neighbor.x},${neighbor.y},${neighbor.z}`;

      // Skip if out of bounds, obstacle, or already closed
      if (
        neighbor.x < 0 || neighbor.x >= gridWidth ||
        neighbor.y < 0 || neighbor.y >= gridHeight ||
        neighbor.z < 0 || neighbor.z >= gridDepth ||
        obstacles.has(neighborKey) ||
        closedList.has(neighborKey)
      ) {
        continue;
      }

      // Calculate costs
      const cost = Math.sqrt(dx * dx + dy * dy + dz * dz); // Euclidean distance for diagonal moves
      neighbor.g = current.g + cost;
      neighbor.h = Math.sqrt(
        Math.pow(neighbor.x - endNode.x, 2) +
        Math.pow(neighbor.y - endNode.y, 2) +
        Math.pow(neighbor.z - endNode.z, 2)
      ) * gridSize;
      neighbor.f = neighbor.g + neighbor.h;

      // Check if neighbor is already in open list with lower f score
      const existing = openList.find(n => n.x === neighbor.x && n.y === neighbor.y && n.z === neighbor.z);
      if (existing && existing.f <= neighbor.f) {
        continue;
      }

      openList.push(neighbor);
    }
  }

  return []; // No path found
}