import { Coordinate, CoordinateSet } from "../utils/coordinates.ts";

type Direction = "R" | "U" | "L" | "D";

const text = await Deno.readTextFile("./9/input.txt");
const lines = text.trim().split("\n");
const instructions: [Direction, number][] = lines.map((line) => {
  const [dir, amtStr] = line.split(" ");
  return [dir as Direction, +amtStr];
});

const addCoordinates = (a: Coordinate, b: Coordinate): Coordinate => [
  a[0] + b[0],
  a[1] + b[1],
];

const getNewHeadPosition = (oldPos: Coordinate, dir: Direction): Coordinate => {
  let movement: Coordinate = [0, 0];

  if (dir === "R") movement = [0, 1];
  if (dir === "U") movement = [1, 0];
  if (dir === "L") movement = [0, -1];
  if (dir === "D") movement = [-1, 0];

  return addCoordinates(oldPos, movement);
};

const getNewFollowerPosition = (
  oldPos: Coordinate,
  leaderPos: Coordinate
): Coordinate => {
  const yOffset = leaderPos[0] - oldPos[0];
  const xOffset = leaderPos[1] - oldPos[1];

  // If leader and follower are touching already, do nothing
  if (Math.abs(yOffset) < 2 && Math.abs(xOffset) < 2) {
    return oldPos;
  }

  // If leader is inline with follower, move in that direction
  if (yOffset === 0) {
    const xMovement = xOffset > 1 ? 1 : -1;
    return addCoordinates(oldPos, [0, xMovement]);
  } else if (xOffset === 0) {
    const yMovement = yOffset > 1 ? 1 : -1;
    return addCoordinates(oldPos, [yMovement, 0]);
  }

  // The leader must be diagonal to the follower, move diagonally
  const yMovement = yOffset > 0 ? 1 : -1;
  const xMovement = xOffset > 0 ? 1 : -1;
  return addCoordinates(oldPos, [yMovement, xMovement]);
};

const simulateInstructions = (knotCount: number) => {
  const knots = new Array(knotCount).fill(0).map((_) => [0, 0]) as Coordinate[];
  const tailVisitedSet = new CoordinateSet();
  tailVisitedSet.add(knots.at(-1)!);

  for (const instruction of instructions) {
    const [dir, amount] = instruction;
    for (let i = 0; i < amount; i++) {
      // Move the head knot
      knots[0] = getNewHeadPosition(knots[0], dir);

      // Move all other knots
      for (let k = 1; k < knots.length; k++) {
        knots[k] = getNewFollowerPosition(knots[k], knots[k - 1]);
      }

      // Log the tail's position
      tailVisitedSet.add(knots.at(-1)!);
    }
  }

  return tailVisitedSet.entries().length;
};

const result1 = simulateInstructions(2);
const result2 = simulateInstructions(10);

console.log(result1);
console.log(result2);
