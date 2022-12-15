export type Range = [number, number];

export const mergeRanges = (ranges: [number, number][]) => {
  const sorted = ranges.slice().sort((a, b) => {
    if (a[0] < b[0]) return -1;
    if (a[0] > b[0]) return 1;
    return a[1] - b[1];
  });

  const output: [number, number][] = [[sorted[0][0], sorted[0][1]]];
  for (let i = 1; i < sorted.length; i++) {
    const prev = output.at(-1)!;
    const curr = sorted[i];

    if (curr[0] <= prev[1] + 1) {
      prev[1] = Math.max(curr[1], prev[1]);
      continue;
    } else {
      output.push([curr[0], curr[1]]);
    }
  }

  return output;
};
