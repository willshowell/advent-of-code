import {
  Coordinate,
  coordinatesAreSame,
  CoordinateSet,
  Grid,
} from "../utils/coordinates.ts";

const text = await Deno.readTextFile("./14/input.txt");
const paths = text.split("\n").filter(Boolean);

// . is empty
// # is rock
// o is sand

const getCoordinatesInPath = (path: string): Coordinate[] => {
  const points = path.split(" -> ").map((pointString) => {
    const [x, y] = pointString.split(",");
    return [Number(y), Number(x)];
  });

  const coordinates = new CoordinateSet();

  for (let p = 0; p < points.length - 1; p++) {
    const start = points[p];
    const end = points[p + 1];

    if (start[0] === end[0]) {
      const y = start[0];
      const minX = Math.min(start[1], end[1]);
      const maxX = Math.max(start[1], end[1]);
      for (let x = minX; x <= maxX; x++) {
        coordinates.add([y, x]);
      }
    } else {
      // assume x is same for start and end
      const x = start[1];
      const minY = Math.min(start[0], end[0]);
      const maxY = Math.max(start[0], end[0]);
      for (let y = minY; y <= maxY; y++) {
        coordinates.add([y, x]);
      }
    }
  }

  return coordinates.entries();
};

const findRestingPosition = (
  grid: Grid<string>,
  start: Coordinate
): Coordinate | null => {
  let coordinate = start;

  while (grid.isWithinGridBoundary(coordinate)) {
    const [y, x] = coordinate;

    let nextPosition: Coordinate | null = null;
    const coordinateBelow: Coordinate = [y + 1, x];
    const coordinateDiagLeft: Coordinate = [y + 1, x - 1];
    const coordinateDiagRight: Coordinate = [y + 1, x + 1];

    if (
      grid.isOutsideGridBoundary(coordinateBelow) ||
      grid.at(coordinateBelow) === "."
    ) {
      nextPosition = coordinateBelow;
    } else if (
      grid.isOutsideGridBoundary(coordinateDiagLeft) ||
      grid.at(coordinateDiagLeft) === "."
    ) {
      nextPosition = coordinateDiagLeft;
    } else if (
      grid.isOutsideGridBoundary(coordinateDiagRight) ||
      grid.at(coordinateDiagRight) === "."
    ) {
      nextPosition = coordinateDiagRight;
    }

    if (nextPosition === null) {
      return coordinate;
    } else {
      coordinate = nextPosition;
    }
  }

  return null;
};

const getResult1 = () => {
  // build a grid
  const grid = new Grid(510, 510, ".");

  // set starting position
  const startingPosition: Coordinate = [0, 500];
  grid.set(startingPosition, "+");

  // populate rock
  for (const path of paths) {
    const coordinates = getCoordinatesInPath(path);
    coordinates.forEach((coordinate) => grid.set(coordinate, "#"));
  }

  // simulate sand
  let result = 0;
  while (true) {
    const sandPosition = findRestingPosition(grid, startingPosition);
    if (sandPosition) {
      grid.set(sandPosition, "o");
      result++;
    } else {
      break;
    }
  }

  // console.log(grid.toString(0, 180, 420, 510));

  return result;
};

const getResult2 = () => {
  const GRID_WIDTH = 1000;

  const allRockCoordinates = new CoordinateSet();
  for (const path of paths) {
    getCoordinatesInPath(path).forEach((coordinate) =>
      allRockCoordinates.add(coordinate)
    );
  }

  const maxY = Math.max(...allRockCoordinates.entries().map((c) => c[0]));

  // build a grid
  const grid = new Grid(maxY + 3, GRID_WIDTH, ".");

  // set starting position
  const startingPosition: Coordinate = [0, 500];
  grid.set(startingPosition, "+");

  // populate rock walls
  allRockCoordinates
    .entries()
    .forEach((coordinate) => grid.set(coordinate, "#"));

  // populate rock bottom
  for (let x = 0; x < GRID_WIDTH; x++) {
    grid.set([maxY + 2, x], "#");
  }

  // simulate sand
  let result = 0;
  while (true) {
    const sandPosition = findRestingPosition(grid, startingPosition);

    if (!sandPosition) {
      break;
    } else if (coordinatesAreSame(sandPosition, startingPosition)) {
      grid.set(startingPosition, "o");
      result++;
      break;
    } else {
      grid.set(sandPosition, "o");
      result++;
    }
  }

  // console.log(grid.toString(0, grid.height, 300, 500));

  return result;
};

console.log(getResult1());
console.log(getResult2());
