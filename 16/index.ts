const lines = Deno.readTextFileSync("./16/input.txt").split("\n");

interface Valve {
  key: string;
  flow: number;
  neighbors: string[];
}

type ValveMap = Map<string, Valve>;

interface Operation {
  valve: string;
  flow: number;
  timeRemaining: number;
}

const parseInput = (): ValveMap => {
  const map: ValveMap = new Map();

  for (const line of lines) {
    const reg = new RegExp(
      /^Valve (\w+) has flow rate=(-?\d+); tunnel(?:s?) lead(?:s?) to valve(?:s?) ([\w,\s]+)$/
    );
    const [_, key, flowStr, neighborsStr] = line.match(reg)!;
    map.set(key, {
      key,
      flow: parseInt(flowStr),
      neighbors: neighborsStr.trim().split(", "),
    });
  }

  return map;
};

// set enumeration from https://stackoverflow.com/a/64844881
const enumerateSets = (values: string[]): string[][] => {
  const subsets = [[]] as string[][];
  for (const val of values) {
    const last = subsets.length - 1;
    for (let i = 0; i <= last; i++) {
      subsets.push([...subsets[i], val]);
    }
  }

  return subsets;
};

const calculateValueOfPath = (path: Operation[]): number =>
  path.reduce((a, c) => a + c.flow * c.timeRemaining, 0);

const calculateBestPath = (
  valves: ValveMap,
  currentValveKey: string,
  timeRemaining: number,
  unopenedValves: Set<string>,
  getDistanceFn: (s: string, e: string) => number
): Operation[] => {
  if (timeRemaining <= 0) {
    return [];
  }

  const currentValve = valves.get(currentValveKey)!;
  const openCurrentValveOperation: Operation = {
    valve: currentValve.key,
    flow: currentValve.flow,
    timeRemaining,
  };

  const possibleResults: Operation[][] = [];
  for (const nextValve of unopenedValves.values()) {
    const distanceToNextValve = getDistanceFn(currentValveKey, nextValve);

    const timeToOpenNextValve = distanceToNextValve + 1;
    if (timeToOpenNextValve <= timeRemaining) {
      const nextUnopenedValves = new Set(unopenedValves);
      nextUnopenedValves.delete(nextValve);

      const resultOfGoingToNextValve = calculateBestPath(
        valves,
        nextValve,
        timeRemaining - timeToOpenNextValve,
        nextUnopenedValves,
        getDistanceFn
      );

      possibleResults.push([
        openCurrentValveOperation,
        ...resultOfGoingToNextValve,
      ]);
    }
  }

  // if there were no candidates for next valves, there's nothing to do
  // but open the current valve and wait for time to expire
  if (!possibleResults.length) {
    return [openCurrentValveOperation];
  }

  const possibleResultsAsValues = possibleResults.map(calculateValueOfPath);
  const maxValue = Math.max(...possibleResultsAsValues);
  const resultIndex = possibleResultsAsValues.findIndex((v) => v === maxValue);
  return possibleResults[resultIndex];
};

const computeSingleDistanceMap = (
  start: string,
  valves: ValveMap
): Map<string, number> => {
  const map = new Map<string, number>();
  for (const valve of valves.keys()) {
    map.set(valve, Infinity);
  }
  map.set(start, 0);

  const queue: string[] = [start];
  while (queue.length) {
    const curr = queue.shift()!;
    const currDistance = map.get(curr)!;

    const { neighbors } = valves.get(curr)!;
    for (const neighbor of neighbors) {
      const neighborDistance = map.get(neighbor)!;
      if (currDistance + 1 < neighborDistance) {
        map.set(neighbor, currDistance + 1);
        queue.push(neighbor);
      }
    }
  }

  return map;
};

const computeDistanceMap = (valves: ValveMap) => {
  const map = new Map<string, Map<string, number>>();

  for (const valve of valves.values()) {
    map.set(valve.key, computeSingleDistanceMap(valve.key, valves));
  }

  return (start: string, end: string) => map.get(start)!.get(end)!;
};

const getResult1 = () => {
  // parse input
  const valves = parseInput();

  // pre-compute distance map from each valve to each other valve
  const getDistanceFn = computeDistanceMap(valves);

  // determine starting valves to consider for opening
  const valvesOfValue = Array.from(valves.values())
    .filter((v) => v.flow > 0)
    .map((v) => v.key);
  const unopenedValves = new Set(valvesOfValue);

  // DFS to the best path
  const path = calculateBestPath(
    valves,
    "AA",
    30,
    unopenedValves,
    getDistanceFn
  );

  // convert path to a value
  const result = calculateValueOfPath(path);
  console.log(result);
};

const getResult2 = () => {
  // parse input
  const valves = parseInput();

  // pre-compute distance map from each valve to each other valve
  const getDistanceFn = computeDistanceMap(valves);

  // determine all valves that can be opened
  const valvesOfValue = Array.from(valves.values())
    .filter((v) => v.flow > 0)
    .map((v) => v.key);

  // create every possible subset of the valves. let person a
  // try and consume the subset while person b (elephant) consumes
  // the inverse subset
  const subsets = enumerateSets(valvesOfValue);

  // calculate the maximum value from the subsets
  let maxSum = 0;
  for (const subset of subsets) {
    const valvesForA = new Set(subset);
    const valvesForB = new Set(valvesOfValue);
    subset.forEach((x) => valvesForB.delete(x));

    const bestPathForA = calculateBestPath(
      valves,
      "AA",
      26,
      valvesForA,
      getDistanceFn
    );

    const bestPathForB = calculateBestPath(
      valves,
      "AA",
      26,
      valvesForB,
      getDistanceFn
    );

    const valueForA = calculateValueOfPath(bestPathForA);
    const valueForB = calculateValueOfPath(bestPathForB);
    const valueForThisSet = valueForA + valueForB;

    maxSum = Math.max(maxSum, valueForThisSet);
  }

  console.log(maxSum);
};

// getResult1()
getResult2();
