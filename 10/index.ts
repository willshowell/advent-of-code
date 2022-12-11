const text = await Deno.readTextFile("./10/input.txt");
const lines = text.trim().split("\n");

// map cycle numbers to instruction numbers
type Instruction = {
  cycles: 1 | 2;
  add: number;
};

const instructions: Instruction[] = lines.map((line) => {
  if (line.startsWith("noop")) {
    return { cycles: 1, add: 0 };
  }

  const [_, num] = line.split(" ");
  return { cycles: 2, add: parseInt(num) };
});

let reg = 1;
const cycleValues: number[] = [];
for (const instr of instructions) {
  for (let i = 0; i < instr.cycles; i++) {
    cycleValues.push(reg);
  }
  reg += instr.add;
}

const getResult1 = () => {
  const signals = [];
  for (let i = 19; i < cycleValues.length; i += 40) {
    signals.push(cycleValues[i] * (i + 1));
  }
  const result = signals.reduce((a, c) => a + c, 0);
  console.log(result);
};

const getResult2 = () => {
  const output = [];
  for (let i = 0; i < 240; i++) {
    const crtValue = i % 40;
    const centerSpriteValue = cycleValues[i];
    const spriteValues = [
      centerSpriteValue - 1,
      centerSpriteValue,
      centerSpriteValue + 1,
    ];

    if (spriteValues.includes(crtValue)) {
      output.push("#");
    } else {
      output.push(".");
    }
  }

  console.log(output.slice(0, 40).join(""));
  console.log(output.slice(40, 80).join(""));
  console.log(output.slice(80, 120).join(""));
  console.log(output.slice(120, 160).join(""));
  console.log(output.slice(160, 200).join(""));
  console.log(output.slice(200, 240).join(""));
};

getResult2();
