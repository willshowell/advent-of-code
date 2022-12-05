const text = await Deno.readTextFile("./3/input.txt");
const lines = text.trim().split("\n");

const getValueForLetter = (letter: string) => {
  if (letter.toUpperCase() !== letter) {
    return letter.charCodeAt(0) - 96;
  }

  return letter.charCodeAt(0) - 64 + 26;
};

const findFirstLetterCommonToStrings = (charStrings: string[]) => {
  const [firstString, ...otherStrings] = charStrings.map((s) => s.split(""));

  return firstString.reduce((a, c) => {
    const isCommonLetter = otherStrings.every((otherString) =>
      otherString.includes(c)
    );

    if (isCommonLetter && !a.includes(c)) {
      a.push(c);
    }

    return a;
  }, [] as string[])[0];
};

const values1 = lines.map((line) => {
  const firstChars = line.slice(0, line.length / 2);
  const secondChars = line.slice(line.length / 2, line.length);

  const commonLetter = findFirstLetterCommonToStrings([
    firstChars,
    secondChars,
  ]);

  return getValueForLetter(commonLetter);
});

const values2 = lines
  .reduce((a, c, i) => {
    if (i % 3 === 0) {
      const index = Math.floor(i / 3);
      a[index] = [lines[i], lines[i + 1], lines[i + 2]];
    }

    return a;
  }, [] as string[][])
  .map(findFirstLetterCommonToStrings)
  .map(getValueForLetter);

const sum = values2.reduce((a, c) => a + c, 0);

console.log(sum);
