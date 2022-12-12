const text = await Deno.readTextFile("./11/input.txt");
const groups = text
  .trim()
  .split("\n\n")
  .map((lines) => lines.split("\n").map((line) => line.trim()));

type Monkey = {
  id: number;
  items: number[];
  operation: (old: number) => number;
  testDivisibleBy: number;
  divisibleTrueMonkey: number;
  divisibleFalseMonkey: number;
  totalInspections: number;
};

const getMonkeys = (groups: string[][]): Monkey[] =>
  groups.map((group) => {
    const id = parseInt(group[0].match(/^Monkey (\d+):$/)![1]);
    const itemsStr = group[1].split("Starting items: ")[1];
    const items = itemsStr.split(", ").map(Number);
    const operationCondition = group[2].split("new = old")[1];
    const operation = eval(`old => old${operationCondition}`);
    const testDivisibleBy = parseInt(group[3].split("by ")[1]);
    const divisibleTrueMonkey = parseInt(group[4].split("monkey ")[1]);
    const divisibleFalseMonkey = parseInt(group[5].split("monkey ")[1]);

    return {
      id,
      items,
      operation,
      testDivisibleBy,
      divisibleTrueMonkey,
      divisibleFalseMonkey,
      totalInspections: 0,
    };
  });

const getResult1 = () => {
  const monkeys = getMonkeys(groups);

  // do 20 rounds
  for (let i = 0; i < 20; i++) {
    for (const monkey of monkeys) {
      const itemsToCheck = monkey.items.slice();
      for (const item of itemsToCheck) {
        monkey.totalInspections++;
        let newLevel = monkey.operation(item);
        newLevel = Math.floor(newLevel / 3);
        const nextMonkey =
          newLevel % monkey.testDivisibleBy === 0
            ? monkey.divisibleTrueMonkey
            : monkey.divisibleFalseMonkey;
        monkeys.at(nextMonkey)?.items.push(newLevel);
      }
      for (let i = 0; i < itemsToCheck.length; i++) {
        monkey.items.shift();
      }
    }
  }

  // get top 2 total inspections and multiply
  const totalInspections = monkeys
    .map((m) => m.totalInspections)
    .sort((a, b) => b - a);
  return totalInspections.slice(0, 2).reduce((a, c) => a * c, 1);
};

const getResult2 = () => {
  const monkeys = getMonkeys(groups);
  const maxFactor = monkeys
    .map((m) => m.testDivisibleBy)
    .reduce((a, c) => a * c, 1);
  for (let i = 0; i < 10000; i++) {
    for (const monkey of monkeys) {
      const itemsToCheck = monkey.items.slice();
      for (const item of itemsToCheck) {
        monkey.totalInspections++;
        const newLevel = monkey.operation(item);
        const nextMonkey =
          newLevel % monkey.testDivisibleBy === 0
            ? monkey.divisibleTrueMonkey
            : monkey.divisibleFalseMonkey;
        monkeys.at(nextMonkey)?.items.push(newLevel % maxFactor);
      }
      for (let i = 0; i < itemsToCheck.length; i++) {
        monkey.items.shift();
      }
    }
  }

  // get top 2 total inspections and multiply
  const totalInspections = monkeys
    .map((m) => m.totalInspections)
    .sort((a, b) => b - a);
  return totalInspections.slice(0, 2).reduce((a, c) => a * c, 1);
};

console.log(getResult1());
console.log(getResult2());
