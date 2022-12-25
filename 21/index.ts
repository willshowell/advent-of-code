const text = Deno.readTextFileSync("./21/input.txt").trim();
const lines = text.split("\n");

type Operation = "+" | "-" | "*" | "/";
interface Node {
  key: string;
  value?: number;
  op1?: string;
  op2?: string;
  operation?: Operation;
}

const parseLine = (line: string): Node => {
  const [key, remainder] = line.split(": ");
  if (remainder.match(/^\d+$/)) {
    return { key, value: +remainder };
  }

  const [op1, operation, op2] = remainder.split(" ") as [
    string,
    Operation,
    string
  ];
  return { key, op1, op2, operation };
};

const parseInput = (): Map<string, Node> => {
  const map = new Map<string, Node>();
  for (const line of lines) {
    const node = parseLine(line);
    map.set(node.key, node);
  }
  return map;
};

const getValueForNode1 = (map: Map<string, Node>, node: Node): number => {
  if (node.value !== undefined) {
    return node.value;
  }

  const op1Node = map.get(node.op1!)!;
  const op2Node = map.get(node.op2!)!;

  const op1Val = getValueForNode1(map, op1Node);
  const op2Val = getValueForNode1(map, op2Node);

  let value = 0;
  if (node.operation === "*") {
    value = op1Val * op2Val;
  } else if (node.operation === "+") {
    value = op1Val + op2Val;
  } else if (node.operation === "-") {
    value = op1Val - op2Val;
  } else {
    value = op1Val / op2Val;
  }

  node.value = value;
  return value;
};

const evaluateKnownNodesForPart2 = (
  map: Map<string, Node>,
  node: Node
): number | undefined => {
  if (node.key === "humn") {
    return undefined;
  }

  if (node.value !== undefined) {
    return node.value;
  }

  const op1Node = map.get(node.op1!)!;
  const op2Node = map.get(node.op2!)!;

  const op1Val = evaluateKnownNodesForPart2(map, op1Node);
  const op2Val = evaluateKnownNodesForPart2(map, op2Node);

  if (op1Val === undefined || op2Val === undefined) {
    node.value = undefined;
    return undefined;
  }

  let value = 0;
  if (node.operation === "*") {
    value = op1Val * op2Val;
  } else if (node.operation === "+") {
    value = op1Val + op2Val;
  } else if (node.operation === "-") {
    value = op1Val - op2Val;
  } else {
    value = op1Val / op2Val;
  }

  node.value = value;
  return value;
};

const getHumanValue = (
  map: Map<string, Node>,
  nodeKey: string,
  leftNode: Node,
  rightNode: Node,
  operation: Operation,
  mustEqual: number
): number => {
  if (nodeKey === "humn") {
    return mustEqual;
  }

  if (leftNode.value === undefined) {
    const nextLeftNode = map.get(leftNode.op1!)!;
    const nextRightNode = map.get(leftNode.op2!)!;
    const nextOperation = leftNode.operation!;

    let nextMustEqual = mustEqual;
    if (operation === "/") nextMustEqual *= rightNode.value!;
    if (operation === "*") nextMustEqual /= rightNode.value!;
    if (operation === "+") nextMustEqual -= rightNode.value!;
    if (operation === "-") nextMustEqual += rightNode.value!;

    return getHumanValue(
      map,
      leftNode.key,
      nextLeftNode,
      nextRightNode,
      nextOperation,
      nextMustEqual
    );
  } else if (rightNode.value === undefined) {
    const nextLeftNode = map.get(rightNode.op1!)!;
    const nextRightNode = map.get(rightNode.op2!)!;
    const nextOperation = rightNode.operation!;

    let nextMustEqual = mustEqual;
    if (operation === "/") nextMustEqual = leftNode.value! / mustEqual;
    if (operation === "*") nextMustEqual /= leftNode.value!;
    if (operation === "+") nextMustEqual -= leftNode.value!;
    if (operation === "-") nextMustEqual = leftNode.value! - mustEqual;

    return getHumanValue(
      map,
      rightNode.key,
      nextLeftNode,
      nextRightNode,
      nextOperation,
      nextMustEqual
    );
  }

  console.log("Not good");
  return 0;
};

const getPart1 = () => {
  const allNodes = parseInput();

  const rootNode = allNodes.get("root")!;
  const rootValue = getValueForNode1(allNodes, rootNode);
  console.log(rootValue);
};

const getPart2 = () => {
  const allNodes = parseInput();

  // Set the 'humn' node to unknown
  const humanNode = allNodes.get("humn")!;
  humanNode.value = undefined;

  const rootNode = allNodes.get("root")!;
  evaluateKnownNodesForPart2(allNodes, rootNode);

  const leftNode = allNodes.get(rootNode.op1!)!;
  const rightNode = allNodes.get(rootNode.op2!)!;
  const humanValue = getHumanValue(
    allNodes,
    "root",
    leftNode,
    rightNode,
    "-",
    0
  );

  console.log(humanValue);
};

getPart2();
