const text = await Deno.readTextFile("./13/input.txt");
const pairs = text
  .split("\n\n")
  .map((pair) => pair.split("\n").map((x) => JSON.parse(x)));

const packets = text
  .split("\n")
  .filter(Boolean)
  .map((x) => JSON.parse(x));

type NestedArray = Array<NestedArray | number>;
type NumberOrArray = number | NestedArray;

// returns -1 if a < b
const compare = (a: NumberOrArray, b: NumberOrArray): number => {
  if (typeof a === "number" && typeof b === "number") {
    if (a < b) return -1;
    if (b < a) return 1;
    return 0;
  } else if (Array.isArray(a) && Array.isArray(b)) {
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
      if (a[i] === b[i]) {
        continue;
      }
      const result = compare(a[i], b[i]);
      if (result !== 0) {
        return result;
      }
    }
    if (a.length < b.length) {
      return -1;
    } else if (b.length < a.length) {
      return 1;
    }
  } else if (Array.isArray(a)) {
    return compare(a, [b]);
  } else if (Array.isArray(b)) {
    return compare([a], b);
  }

  return 0;
};

const getResult1 = () => {
  return pairs
    .map((pair, index) => {
      const [a, b] = pair;
      if (compare(a, b) === -1) return index + 1;
      else return 0;
    })
    .reduce((a, c) => a + c, 0);
};

const getResult2 = () => {
  const divider1 = [[2]];
  const divider2 = [[6]];
  const sorted = packets.slice().concat([divider1, divider2]).sort(compare);
  const index1 = sorted.findIndex((item) => item === divider1) + 1;
  const index2 = sorted.findIndex((item) => item === divider2) + 1;
  return index1 * index2;
};

console.log(getResult1());
console.log(getResult2());
