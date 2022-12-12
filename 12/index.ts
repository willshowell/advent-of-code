import { Coordinate } from "../utils/coordinates.ts";

const text = await Deno.readTextFile("./12/input.txt");

const getResult1 = () => {
  let start: Coordinate = [0, 0];
  let end: Coordinate = [0, 0];
  const grid = text
    .trim()
    .split("\n")
    .map((line, row) =>
      line.split("").map((char, col) => {
        if (char === "S") {
          start = [row, col];
          char = "a";
        }
        if (char === "E") {
          end = [row, col];
          char = "z";
        }
        return char.charCodeAt(0) - 96;
      })
    );

  const height = grid.length;
  const width = grid[0].length;

  const minDistanceGrid = new Array(height)
    .fill(0)
    .map((_) => new Array(width).fill(Infinity));

  minDistanceGrid[start[0]][start[1]] = 0;

  // BFS your way to the end, making sure that you mark each coord with the min distance
  // required to get there from the start
  const queue: Coordinate[] = [start];
  while (queue.length) {
    const coord = queue.shift()!;
    const [y, x] = coord;
    const neighbors = [
      [y - 1, x],
      [y + 1, x],
      [y, x - 1],
      [y, x + 1],
    ].filter((coord) => {
      const [ny, nx] = coord;
      if (ny < 0) return false;
      if (ny >= height) return false;
      if (nx < 0) return false;
      if (nx >= width) return false;
      return true;
    }) as Coordinate[];

    const currentHeight = grid[y][x];
    const distanceOfNeighbor = minDistanceGrid[y][x] + 1;
    for (const neighbor of neighbors) {
      const [ny, nx] = neighbor;
      // Only can go to neighbors whose height is at most 1 greater than current
      const neighborHeight = grid[ny][nx];
      if (neighborHeight > currentHeight + 1) {
        continue;
      }

      const existingNeighborDistance = minDistanceGrid[ny][nx];
      if (existingNeighborDistance > distanceOfNeighbor) {
        minDistanceGrid[ny][nx] = distanceOfNeighbor;
        queue.push(neighbor);
      }
    }
  }

  return minDistanceGrid[end[0]][end[1]];
};

const getResult2 = () => {
  const bottomCoords: Coordinate[] = [];
  let start: Coordinate = [0, 0];
  const grid = text
    .trim()
    .split("\n")
    .map((line, row) =>
      line.split("").map((char, col) => {
        if (char === "S") {
          char = "a";
        }
        if (char === "E") {
          start = [row, col];
          char = "z";
        }
        if (char === "a") {
          bottomCoords.push([row, col]);
        }
        return char.charCodeAt(0) - 96;
      })
    );

  const height = grid.length;
  const width = grid[0].length;

  const minDistanceGrid = new Array(height)
    .fill(0)
    .map((_) => new Array(width).fill(Infinity));

  minDistanceGrid[start[0]][start[1]] = 0;

  // BFS your way to the bottom, making sure that you mark each coord with the min distance
  // required to get there from the start
  const queue: Coordinate[] = [start];
  while (queue.length) {
    const coord = queue.shift()!;
    const [y, x] = coord;
    const neighbors = [
      [y - 1, x],
      [y + 1, x],
      [y, x - 1],
      [y, x + 1],
    ].filter((coord) => {
      const [ny, nx] = coord;
      if (ny < 0) return false;
      if (ny >= height) return false;
      if (nx < 0) return false;
      if (nx >= width) return false;
      return true;
    }) as Coordinate[];

    const currentHeight = grid[y][x];
    const distanceOfNeighbor = minDistanceGrid[y][x] + 1;
    for (const neighbor of neighbors) {
      const [ny, nx] = neighbor;
      // Only can go to neighbors whose height is at most 1 less than current
      const neighborHeight = grid[ny][nx];
      if (neighborHeight < currentHeight - 1) {
        continue;
      }

      const existingNeighborDistance = minDistanceGrid[ny][nx];
      if (existingNeighborDistance > distanceOfNeighbor) {
        minDistanceGrid[ny][nx] = distanceOfNeighbor;
        queue.push(neighbor);
      }
    }
  }

  const bottomDistances = bottomCoords.map(
    (coord) => minDistanceGrid[coord[0]][coord[1]]
  );
  return Math.min(...bottomDistances);
};

console.log(getResult2());

// try to get from S to E in minimum steps
// BFS the way there, making sure that you mark each coord with the minimum
//   required steps to get from S to that coord
