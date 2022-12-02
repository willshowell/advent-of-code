type Turn = ["A" | "B" | "C", "X" | "Y" | "Z"];

const text = await Deno.readTextFile("./2/input.txt");
const lines = text.trim().split("\n");
const turns = lines.map((line) => line.split(" ")) as Turn[];

const outcomeMappedToTurns = turns.map(([them, result]) => {
  const you = {
    A: { X: "Z", Y: "X", Z: "Y" },
    B: { X: "X", Y: "Y", Z: "Z" },
    C: { X: "Y", Y: "Z", Z: "X" },
  }[them][result];

  return [them, you] as Turn;
});

const roundResults = outcomeMappedToTurns.map(([them, you]) => {
  const outcomePoints = {
    A: { X: 3, Y: 6, Z: 0 },
    B: { X: 0, Y: 3, Z: 6 },
    C: { X: 6, Y: 0, Z: 3 },
  }[them][you];
  const shapePoints = { X: 1, Y: 2, Z: 3 }[you];
  return outcomePoints + shapePoints;
});

const sum = roundResults.reduce((a, c) => a + c, 0);

console.log(sum);
