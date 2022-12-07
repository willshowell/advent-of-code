const text = await Deno.readTextFile("./6/input.txt");
const input = text.trim();

const dedupe = <T>(arr: T[]): T[] => Array.from(new Set(arr));
const isUnique = <T>(arr: T[]): boolean => dedupe(arr).length === arr.length;

const findAnswer = (buffer: string[], amt: number): number => {
  for (let i = amt; i < buffer.length; i++) {
    const prev = buffer.slice(i - amt, i);
    if (isUnique(prev)) {
      return i;
    }
  }
  return -1;
};

const result1 = findAnswer(input.split(""), 4);
const result2 = findAnswer(input.split(""), 14);

console.log(result2);
