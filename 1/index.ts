const text = await Deno.readTextFile("./1/input.txt");
const lines = text.trim().split("\n");

const sums = lines.reduce(
  (a, c) => {
    if (c) {
      a[a.length - 1] += +c;
    } else {
      a.push(0);
    }
    return a;
  },
  [0]
);

const sortedSums = sums.sort((a, b) => b - a);
const maxThree = sortedSums.slice(0, 3);
const sum = maxThree.reduce((a, c) => a + c);

console.log(sum);
