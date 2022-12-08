interface Node {
  y: number;
  x: number;
  value: number;
}

const text = await Deno.readTextFile("./8/input.txt");
const grid: Node[][] = text.split("\n").map((line, y) =>
  line.split("").map((char, x) => ({
    y,
    x,
    value: Number(char),
  }))
);

const height = grid.length;
const width = grid[0].length;

const getNorthNodes = (y: number, x: number) => {
  if (y === 0) return [];
  const result = [];
  for (let yy = 0; yy < y; yy++) {
    result.push(grid[yy][x]);
  }
  return result.reverse();
};

const getSouthNodes = (y: number, x: number) => {
  if (y === height - 1) return [];
  const result = [];
  for (let yy = y + 1; yy < height; yy++) {
    result.push(grid[yy][x]);
  }
  return result;
};

const getWestNodes = (y: number, x: number) => {
  if (x === 0) return [];
  return grid[y].slice(0, x).reverse();
};

const getEastNodes = (y: number, x: number) => {
  if (x === width - 1) return [];
  return grid[y].slice(x + 1);
};

const shorterThan = (node: Node) => (otherNode: Node) =>
  otherNode.value < node.value;

const getResult1 = () => {
  let tallNodes = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const currNode = grid[y][x];
      const isTallestNorth = getNorthNodes(y, x).every(shorterThan(currNode));
      const isTallestSouth = getSouthNodes(y, x).every(shorterThan(currNode));
      const isTallestWest = getWestNodes(y, x).every(shorterThan(currNode));
      const isTallestEast = getEastNodes(y, x).every(shorterThan(currNode));
      if (isTallestNorth || isTallestSouth || isTallestWest || isTallestEast) {
        tallNodes++;
      }
    }
  }
  return tallNodes;
};

const getResult2 = () => {
  const getScoreInDirection = (node: Node, neighbors: Node[]) => {
    if (neighbors.length === 0) return 0;
    const firstBlocker = neighbors.findIndex(
      (neighbor) => neighbor.value >= node.value
    );
    if (firstBlocker < 0) {
      return neighbors.length;
    } else {
      return firstBlocker + 1;
    }
  };

  const getScoreForNode = (node: Node): number => {
    const northNodes = getNorthNodes(node.y, node.x);
    const southNodes = getSouthNodes(node.y, node.x);
    const westNodes = getWestNodes(node.y, node.x);
    const eastNodes = getEastNodes(node.y, node.x);

    const northScore = getScoreInDirection(node, northNodes);
    const southScore = getScoreInDirection(node, southNodes);
    const westScore = getScoreInDirection(node, westNodes);
    const eastScore = getScoreInDirection(node, eastNodes);

    return northScore * southScore * westScore * eastScore;
  };

  let maxScore = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const score = getScoreForNode(grid[y][x]);
      if (score > maxScore) maxScore = score;
    }
  }

  return maxScore;
};

console.log(getResult1());
console.log(getResult2());
