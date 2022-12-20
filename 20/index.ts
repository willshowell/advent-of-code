const lines = Deno.readTextFileSync("./20/input.txt").trim().split("\n");

const mixArray = (array: [number, number][]) => {
  for (let i = 0; i < array.length; i++) {
    const itemIndex = array.findIndex((item) => item[1] === i);
    const itemValue = array[itemIndex][0];

    if (!itemValue) {
      continue;
    }

    let next = (itemValue + itemIndex) % (array.length - 1);

    if (next >= array.length) {
      next = next - array.length + 1;
    } else if (next < 0) {
      next = array.length - 1 + next;
    }

    const [item] = array.splice(itemIndex, 1)!;
    array.splice(next, 0, item);
  }
};

const getAnswer = (array: [number, number][]) => {
  const currentZeroIndex = array.findIndex((item) => item[0] === 0);
  const result = [1000, 2000, 3000]
    .map((i) => (i + currentZeroIndex) % array.length)
    .map((i) => array[i][0]);

  console.log(
    result,
    result.reduce((a, c) => a + c)
  );
};

const getPart1 = () => {
  const arr = lines.map((v, i) => [+v, i] as [number, number]);

  mixArray(arr);
  getAnswer(arr);
};

const getPart2 = () => {
  const arr = lines.map((v, i) => [+v * 811589153, i] as [number, number]);

  for (let j = 0; j < 10; j++) {
    mixArray(arr);
  }

  getAnswer(arr);
};

getPart1();
getPart2();
