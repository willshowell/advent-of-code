const text = await Deno.readTextFile("./4/input.txt");
const lines = text.trim().split("\n");
const assignments = lines.map((line) =>
  line.split(",").map((x) => x.split("-").map(Number))
);

const rangesHeavyOverlap = (a: number[], b: number[]): boolean => {
  return (a[0] <= b[0] && a[1] >= b[1]) || (b[0] <= a[0] && b[1] >= a[1]);
};

const rangesSoftOverlap = (a: number[], b: number[]): boolean => {
  if (a[1] > b[0]) {
    return b[1] >= a[0];
  }

  if (b[1] > a[0]) {
    return a[1] >= b[0];
  }

  return true;
};

const assignmentsWithHeavyOverlap = assignments.filter(([left, right]) =>
  rangesHeavyOverlap(left, right)
);

const assignmentsWithSoftOverlap = assignments.filter(([left, right]) =>
  rangesSoftOverlap(left, right)
);

console.log(assignmentsWithSoftOverlap.length);
