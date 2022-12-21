const text = Deno.readTextFileSync("./19/input.txt").trim();

interface Metals {
  ore: number;
  clay: number;
  obsidian: number;
  geode: number;
}

interface Robots {
  ore: number;
  clay: number;
  obsidian: number;
  geode: number;
}

interface Blueprint {
  id: number;
  oreCost: Metals;
  clayCost: Metals;
  obsidianCost: Metals;
  geodeCost: Metals;
}

const parseBlueprint = (line: string): Blueprint => {
  const [_0, idStr] = line.match(/Blueprint (\d+):/)!;
  const [_1, oreCostStr] = line.match(/ore robot costs (\d+) ore./)!;
  const [_2, clayCostStr] = line.match(/clay robot costs (\d+) ore./)!;
  const [_3, obsOreCostStr, obsClayCostStr] = line.match(
    /obsidian robot costs (\d+) ore and (\d+) clay/
  )!;
  const [_4, geodeOreCostStr, geodeObsCostStr] = line.match(
    /geode robot costs (\d+) ore and (\d+) obsidian/
  )!;

  return {
    id: parseInt(idStr),
    oreCost: { ore: +oreCostStr, clay: 0, obsidian: 0, geode: 0 },
    clayCost: { ore: +clayCostStr, clay: 0, obsidian: 0, geode: 0 },
    obsidianCost: {
      ore: +obsOreCostStr,
      clay: +obsClayCostStr,
      obsidian: 0,
      geode: 0,
    },
    geodeCost: {
      ore: +geodeOreCostStr,
      clay: 0,
      obsidian: +geodeObsCostStr,
      geode: 0,
    },
  };
};

const canPurchase = (cost: Metals, inventory: Metals): boolean =>
  inventory.clay >= cost.clay &&
  inventory.obsidian >= cost.obsidian &&
  inventory.ore >= cost.ore;

const applyPurchase = (cost: Metals, inventory: Metals): Metals => {
  const newInventory = { ...inventory };
  newInventory.clay -= cost.clay;
  newInventory.obsidian -= cost.obsidian;
  newInventory.ore -= cost.ore;
  return newInventory;
};

const getCacheKey = (time: number, metals: Metals, robots: Robots) => {
  return [
    time,
    metals.ore,
    metals.clay,
    metals.obsidian,
    metals.geode,
    robots.ore,
    robots.clay,
    robots.obsidian,
    robots.geode,
  ].join("-");
};

const lowTierCache = new Map<string, number>();

let checks = 0;
const getMaxGeodeCount = (
  blueprint: Blueprint,
  remainingTime: number,
  metals: Metals,
  robots: Robots
): number => {
  const lowTierCacheKey =
    remainingTime === 3 || remainingTime === 4
      ? getCacheKey(remainingTime, metals, robots)
      : null;
  if (lowTierCacheKey) {
    const value = lowTierCache.get(lowTierCacheKey);
    if (value !== undefined) {
      return value;
    }
  }

  checks++;

  const oldInventory = metals;
  const newInventory: Metals = {
    ore: oldInventory.ore + robots.ore,
    clay: oldInventory.clay + robots.clay,
    obsidian: oldInventory.obsidian + robots.obsidian,
    geode: oldInventory.geode + robots.geode,
  };

  // Collect your new geodes and return
  if (remainingTime === 1) {
    return newInventory.geode;
  }

  const canPurchaseOreRobot = canPurchase(blueprint.oreCost, oldInventory);
  const canPurchaseClayRobot = canPurchase(blueprint.clayCost, oldInventory);
  const canPurchaseObsidianRobot = canPurchase(
    blueprint.obsidianCost,
    oldInventory
  );
  const canPurchaseGeodeRobot = canPurchase(blueprint.geodeCost, oldInventory);

  // If you can buy a geode robot right now but you only have 2 mins left, the optimal
  // strategy is to buy the geode now and reap its benefits for one remaining turn. If you
  // can't buy it this turn, there's no benefit to buying it next turn, so the best strategy
  // will be to just chill
  if (remainingTime === 2) {
    if (canPurchaseGeodeRobot) {
      return newInventory.geode + robots.geode + 1;
    } else {
      return newInventory.geode + robots.geode;
    }
  }

  // If you have no obsidian robots and there's less than 8 mins left,
  // just return 0 because you're screwed
  if (remainingTime < 8 && !robots.obsidian) {
    return 0;
  }

  const maxOreCost = Math.max(
    blueprint.oreCost.ore,
    blueprint.clayCost.ore,
    blueprint.obsidianCost.ore,
    blueprint.geodeCost.ore
  );
  const maxClayCost = Math.max(
    blueprint.oreCost.clay,
    blueprint.clayCost.clay,
    blueprint.obsidianCost.clay,
    blueprint.geodeCost.clay
  );
  const maxObsidianCost = Math.max(
    blueprint.oreCost.obsidian,
    blueprint.clayCost.obsidian,
    blueprint.obsidianCost.obsidian,
    blueprint.geodeCost.obsidian
  );

  // Make some pruning judgements
  // 1. you don't need more robots than your most expensive consumer
  // 2. you don't need another robot if you already have 2x your most expensive consumer
  // 3. if you can buy a geode robot, nothing else matters
  const shouldPurchaseOreRobot =
    canPurchaseOreRobot &&
    !canPurchaseGeodeRobot &&
    robots.ore < maxOreCost &&
    oldInventory.ore < maxOreCost * 2;
  const shouldPurchaseClayRobot =
    canPurchaseClayRobot &&
    !canPurchaseGeodeRobot &&
    robots.clay < maxClayCost &&
    oldInventory.clay < maxClayCost * 2;
  const shouldPurchaseObsidianRobot =
    canPurchaseObsidianRobot &&
    !canPurchaseGeodeRobot &&
    robots.obsidian < maxObsidianCost &&
    oldInventory.obsidian < maxObsidianCost * 2;
  const shouldPurchaseGeodeRobot = canPurchaseGeodeRobot;

  // If you cannot buy a geode robot, and you can accumulate more materials to a meaningful amount,
  // consider just waiting a turn and trying to make a purchase later
  const shouldDoNothingThisRound =
    !canPurchaseGeodeRobot &&
    (metals.ore < maxOreCost ||
      metals.clay < maxClayCost ||
      metals.obsidian < maxObsidianCost);

  const outcomes: number[] = [
    // There's always the possibility of just calling it quits
    newInventory.geode + robots.geode * (remainingTime - 1),
  ];

  if (shouldPurchaseGeodeRobot) {
    outcomes.push(
      getMaxGeodeCount(
        blueprint,
        remainingTime - 1,
        applyPurchase(blueprint.geodeCost, newInventory),
        { ...robots, geode: robots.geode + 1 }
      )
    );
  }

  if (shouldPurchaseObsidianRobot) {
    outcomes.push(
      getMaxGeodeCount(
        blueprint,
        remainingTime - 1,
        applyPurchase(blueprint.obsidianCost, newInventory),
        { ...robots, obsidian: robots.obsidian + 1 }
      )
    );
  }

  if (shouldPurchaseClayRobot) {
    outcomes.push(
      getMaxGeodeCount(
        blueprint,
        remainingTime - 1,
        applyPurchase(blueprint.clayCost, newInventory),
        { ...robots, clay: robots.clay + 1 }
      )
    );
  }

  if (shouldPurchaseOreRobot) {
    outcomes.push(
      getMaxGeodeCount(
        blueprint,
        remainingTime - 1,
        applyPurchase(blueprint.oreCost, newInventory),
        { ...robots, ore: robots.ore + 1 }
      )
    );
  }

  if (shouldDoNothingThisRound) {
    outcomes.push(
      getMaxGeodeCount(blueprint, remainingTime - 1, newInventory, {
        ...robots,
      })
    );
  }

  const result = Math.max(...outcomes);
  if (lowTierCacheKey) {
    lowTierCache.set(lowTierCacheKey, result);
  }
  return result;
};

const getPart1 = () => {
  const blueprints = text.split("\n").map(parseBlueprint);

  const qualities: number[] = [];
  for (const blueprint of blueprints) {
    lowTierCache.clear();
    checks = 0;
    const geodeCount = getMaxGeodeCount(
      blueprint,
      24,
      { ore: 0, clay: 0, obsidian: 0, geode: 0 },
      { ore: 1, clay: 0, obsidian: 0, geode: 0 }
    );
    console.log(`${blueprint.id}: ${geodeCount} - ${checks}`);
    qualities.push(blueprint.id * geodeCount);
  }

  const result = qualities.reduce((a, c) => a + c, 0);
  console.log(result);
};

const getPart2 = () => {
  const blueprints = text.split("\n").slice(0, 3).map(parseBlueprint);

  const qualities: number[] = [];
  for (const blueprint of blueprints) {
    lowTierCache.clear();
    checks = 0;
    const geodeCount = getMaxGeodeCount(
      blueprint,
      32,
      { ore: 0, clay: 0, obsidian: 0, geode: 0 },
      { ore: 1, clay: 0, obsidian: 0, geode: 0 }
    );
    console.log(`${blueprint.id}: ${geodeCount} - ${checks} checks`);
    qualities.push(blueprint.id * geodeCount);
  }

  const result = qualities.reduce((a, c) => a * c, 1);
  console.log(result);
};

// getPart1()

// takes 30 mins to run
getPart2();
