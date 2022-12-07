const text = await Deno.readTextFile("./7/input.txt");
const lines = text.split("\n");

interface LsCommand {
  dir: string;
  results: string[];
}

interface GraphNode {
  dir: string;
  ownSize: number;
  totalSize?: number;
  childrenDirs: string[];
}

// Parse the input into an array of ls commands
const lsCommands: LsCommand[] = [];
let currentPath: string[] = [];
for (const line of lines) {
  if (line.startsWith("$ cd")) {
    if (line.endsWith("/")) currentPath = [""];
    else if (line.endsWith("..")) currentPath.pop();
    else currentPath.push(line.split("$ cd ")[1]);
  } else if (line.startsWith("$ ls")) {
    lsCommands.push({
      dir: currentPath.join("/"),
      results: [],
    });
  } else {
    lsCommands.at(-1)!.results.push(line);
  }
}

// Convert the ls commands to a graph
let adjMap: Record<string, GraphNode> = {};
for (const command of lsCommands) {
  const { dir, results } = command;
  const ownSize = results
    .filter((result) => !result.startsWith("dir"))
    .map((result) => parseInt(result, 10))
    .reduce((a, c) => a + c, 0);
  const childrenDirs = results
    .filter((result) => result.startsWith("dir"))
    .map((result) => `${dir}/${result.split(" ")[1]}`);

  const node: GraphNode = { dir, ownSize, childrenDirs };
  adjMap[dir] = node;
}

// Compute the total size of each directory, recursive dfs style
const computeSizeOfNode = (dirName: string): number => {
  const node = adjMap[dirName];
  if (node.totalSize !== undefined) {
    return node.totalSize;
  }

  let sumOfChildrenNodes = 0;
  for (const childDir of node.childrenDirs) {
    sumOfChildrenNodes += computeSizeOfNode(childDir);
  }

  node.totalSize = node.ownSize + sumOfChildrenNodes;
  return node.totalSize;
};

computeSizeOfNode("");

const result1 = Object.values(adjMap)
  .map((node) => node.totalSize!)
  .filter((size) => size <= 100000)
  .reduce((a, c) => a + c, 0);

const currentUnusedSpace = 70000000 - adjMap[""].totalSize!;
const spaceToClear = 30000000 - currentUnusedSpace;

const result2 = Object.values(adjMap)
  .map((node) => node.totalSize!)
  .filter((size) => size >= spaceToClear)
  .sort((a, b) => a - b)[0];

console.log(result1);
console.log(result2);
