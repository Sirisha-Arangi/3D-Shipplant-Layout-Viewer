import * as THREE from 'three';

interface BoxObstacle {
  box: THREE.Box3;
}

function getObstacleBoxes(shipModel: THREE.Group): BoxObstacle[] {
  const obstacles: BoxObstacle[] = [];

  shipModel.traverse(child => {
    if (child instanceof THREE.Mesh && child.userData.system) {
      child.geometry.computeBoundingBox();
      const box = child.geometry.boundingBox?.clone();
      if (box) {
        box.applyMatrix4(child.matrixWorld);
        box.expandByScalar(0.2); // buffer zone
        obstacles.push({ box });
      }
    }
  });

  return obstacles;
}

function isInsideObstacle(point: THREE.Vector3, obstacles: BoxObstacle[]): boolean {
  return obstacles.some(ob => ob.box.containsPoint(point));
}

function steerAround(point: THREE.Vector3, obstacle: THREE.Box3): THREE.Vector3 {
  const center = obstacle.getCenter(new THREE.Vector3());
  const offset = new THREE.Vector3().subVectors(point, center).normalize().multiplyScalar(1.0);
  return point.clone().add(offset);
}

function lineIntersectsObstacle(p1: THREE.Vector3, p2: THREE.Vector3, obstacles: BoxObstacle[]): boolean {
  const dir = new THREE.Vector3().subVectors(p2, p1).normalize();
  const dist = p1.distanceTo(p2);
  const raycaster = new THREE.Raycaster(p1, dir, 0.01, dist - 0.01);
  return obstacles.some(ob => raycaster.ray.intersectsBox(ob.box));
}

// 🔧 Optional: simplify path by removing unnecessary midpoints
function simplifyPath(path: THREE.Vector3[], obstacles: BoxObstacle[]): THREE.Vector3[] {
  if (path.length <= 2) return path;

  const simplified: THREE.Vector3[] = [path[0]];
  let currentIndex = 0;

  while (currentIndex < path.length - 1) {
    let nextIndex = path.length - 1;
    while (nextIndex > currentIndex + 1) {
      const from = path[currentIndex];
      const to = path[nextIndex];
      if (!lineIntersectsObstacle(from, to, obstacles)) {
        break;
      }
      nextIndex--;
    }
    simplified.push(path[nextIndex]);
    currentIndex = nextIndex;
  }

  return simplified;
}

export function findPathHybrid(
  rawStart: THREE.Vector3,
  rawEnd: THREE.Vector3,
  shipModel: THREE.Group,
  stepSize: number = 0.7 // Adjustable
): THREE.Vector3[] {
  const obstacles = getObstacleBoxes(shipModel);

  let start = rawStart.clone();
  let end = rawEnd.clone();

  for (const ob of obstacles) {
    if (ob.box.containsPoint(start)) start = steerAround(start, ob.box);
    if (ob.box.containsPoint(end)) end = steerAround(end, ob.box);
  }

  const path: THREE.Vector3[] = [];
  const maxSteps = 300;
  let current = start.clone();

  for (let step = 0; step < maxSteps; step++) {
    path.push(current.clone());

    const dir = end.clone().sub(current).normalize();
    const next = current.clone().addScaledVector(dir, stepSize);

    const hitObstacle = obstacles.find(ob => ob.box.containsPoint(next));
    if (hitObstacle) {
      current = steerAround(next, hitObstacle.box);
      continue;
    }

    if (next.distanceTo(end) < stepSize * 1.1) {
      path.push(end.clone());
      break;
    }

    current = next;
  }

  const smoothed = simplifyPath(path, obstacles);
  return smoothed;
}
