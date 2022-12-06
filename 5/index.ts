const text = await Deno.readTextFile("./5/input.txt");
const lines = text.split("\n");

const indexOfBlank = lines.findIndex((line) => !line.trim());
const drawing = lines.slice(0, indexOfBlank);
const instructions = lines.slice(indexOfBlank + 1);

const grid = drawing.map((row) => {
  const rowChars = [...row.split(""), " "];
  const values = rowChars.reduce((a, _, i) => {
    if (i % 4 === 0) {
      const val = rowChars[i + 1];
      a.push(val);
    }
    return a;
  }, [] as string[]);
  return values;
});

const stacks: Record<string, string[]> = {};
for (let i = 0; i < grid[0].length; i++) {
  const label = grid.at(-1)![i];
  const arr = [];
  for (let j = grid.length - 2; j >= 0; j--) {
    if (grid[j][i] !== " ") {
      arr.push(grid[j][i]);
    }
  }
  stacks[label] = arr;
}

const execute1 = (start: string, end: string, amount: number) => {
  for (let i = 0; i < amount; i++) {
    const val = stacks[start].pop()!;
    stacks[end].push(val);
  }
};

const execute2 = (start: string, end: string, amount: number) => {
  const startStack = stacks[start];
  const vals = startStack.splice(startStack.length - amount, amount);
  stacks[end].push(...vals);
};

for (const instr of instructions) {
  const [_, amount, start, end] = instr.match(
    /^move (\d+) from (\d+) to (\d+)$/
  ) as string[];
  execute2(start, end, +amount);
}

const result = Object.values(stacks)
  .map((val) => val.at(-1)!)
  .join("");

console.log(result);
