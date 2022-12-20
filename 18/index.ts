import { CoordinateSet } from "../utils/coordinates.ts";

type ThreeDCoordinate = [number, number, number];

class ThreeDCoordinateSet {
  size = 0;
  data = new Map<number, CoordinateSet>();

  add(x: number, y: number, z: number) {
    if (this.has(x, y, z)) {
      return;
    }

    this.size += 1;

    if (this.data.has(x)) {
      const xSet = this.data.get(x)!;
      xSet?.add([y, z]);
    } else {
      const newSet = new CoordinateSet();
      newSet.add([y, z]);
      this.data.set(x, newSet);
    }
  }

  has(x: number, y: number, z: number): boolean {
    const xSet = this.data.get(x);
    if (xSet) {
      return xSet.has([y, z]);
    } else {
      return false;
    }
  }

  values(): [number, number, number][] {
    const result: [number, number, number][] = [];
    for (const [x, xSet] of this.data.entries()) {
      for (const [y, z] of xSet.values()) {
        result.push([x, y, z]);
      }
    }
    return result;
  }
}

const lines = Deno.readTextFileSync("./18/input.txt").split("\n");

const getSurfaceAreaOfPoint = (
  point: [number, number, number],
  set: ThreeDCoordinateSet
): number => {
  const [x, y, z] = point;

  let result = 0;
  if (!set.has(x + 1, y, z)) result++;
  if (!set.has(x - 1, y, z)) result++;
  if (!set.has(x, y + 1, z)) result++;
  if (!set.has(x, y - 1, z)) result++;
  if (!set.has(x, y, z + 1)) result++;
  if (!set.has(x, y, z - 1)) result++;
  return result;
};

const getSurfaceAreaOfPointTouchingExteriorPoint = (
  point: [number, number, number],
  exteriorPoints: ThreeDCoordinateSet
): number => {
  const [x, y, z] = point;

  let result = 0;
  if (exteriorPoints.has(x + 1, y, z)) result++;
  if (exteriorPoints.has(x - 1, y, z)) result++;
  if (exteriorPoints.has(x, y + 1, z)) result++;
  if (exteriorPoints.has(x, y - 1, z)) result++;
  if (exteriorPoints.has(x, y, z + 1)) result++;
  if (exteriorPoints.has(x, y, z - 1)) result++;
  return result;
};

const getPart1 = () => {
  const pointSet = new ThreeDCoordinateSet();
  lines.forEach((line) => {
    const [x, y, z] = line.split(",").map(Number);
    pointSet.add(x, y, z);
  });

  let result = 0;
  for (const point of pointSet.values()) {
    result += getSurfaceAreaOfPoint(point, pointSet);
  }

  console.log(result);
};

const getPart2 = () => {
  const lavaPoints = new ThreeDCoordinateSet();
  lines.forEach((line) => {
    const [x, y, z] = line.split(",").map(Number);
    lavaPoints.add(x, y, z);
  });

  // Get the surrounding boundary of the lava points, increase the
  // boundary by 1, to ensure the entire lava is surrounded
  const allPoints = lavaPoints.values();
  const xPoints = allPoints.map((p) => p[0]);
  const yPoints = allPoints.map((p) => p[1]);
  const zPoints = allPoints.map((p) => p[2]);
  const minX = Math.min(...xPoints) - 1;
  const maxX = Math.max(...xPoints) + 1;
  const minY = Math.min(...yPoints) - 1;
  const maxY = Math.max(...yPoints) + 1;
  const minZ = Math.min(...zPoints) - 1;
  const maxZ = Math.max(...zPoints) + 1;

  // Get a list of all negative points
  const notLavaPoints = new ThreeDCoordinateSet();
  for (let z = minZ; z <= maxZ; z++) {
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        if (!lavaPoints.has(x, y, z)) {
          notLavaPoints.add(x, y, z);
        }
      }
    }
  }

  // Use one of the negative points and do a BFS island search, marking
  // points that can be touched as exterior facing. Any negative point
  // that can't be reached must be interior
  const exteriorEmptyPoints = new ThreeDCoordinateSet();
  exteriorEmptyPoints.add(minX, minY, minZ);

  const queue: ThreeDCoordinate[] = [[minX, minY, minZ]];
  while (queue.length) {
    const [x, y, z] = queue.shift()!;

    const neighbors: ThreeDCoordinate[] = [];
    if (x > minX) neighbors.push([x - 1, y, z]);
    if (x < maxX) neighbors.push([x + 1, y, z]);
    if (y > minY) neighbors.push([x, y - 1, z]);
    if (y < maxY) neighbors.push([x, y + 1, z]);
    if (z > minZ) neighbors.push([x, y, z - 1]);
    if (z < maxZ) neighbors.push([x, y, z + 1]);

    const unseenNeighbors = neighbors.filter(
      ([nx, ny, nz]) => !exteriorEmptyPoints.has(nx, ny, nz)
    );

    const unseenEmptyNeighbors = unseenNeighbors.filter(
      ([nx, ny, nz]) => !lavaPoints.has(nx, ny, nz)
    );

    for (const neighbor of unseenEmptyNeighbors) {
      const [nx, ny, nz] = neighbor;
      exteriorEmptyPoints.add(nx, ny, nz);
      queue.push(neighbor);
    }
  }

  // getSurfaceAreaOfPointTouchingExteriorPoint
  let result = 0;
  for (const point of lavaPoints.values()) {
    result += getSurfaceAreaOfPointTouchingExteriorPoint(
      point,
      exteriorEmptyPoints
    );
  }

  console.log(result);
};

// getPart1();
getPart2();
