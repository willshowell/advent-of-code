const text = Deno.readTextFileSync("./17/input.txt");
const instructions = text.split("");

type Grid = boolean[][];
const GRID_WIDTH = 7;

interface Rock {
  height: number;
  canMoveLeft: (grid: Grid, y: number, x: number) => boolean;
  canMoveRight: (grid: Grid, y: number, x: number) => boolean;
  canMoveDown: (grid: Grid, y: number, x: number) => boolean;
  addToGrid: (grid: Grid, y: number, x: number) => void;
}

class Rock1 implements Rock {
  height = 1;
  canMoveLeft(grid: Grid, y: number, x: number) {
    if (x === 0) return false;
    return !grid[y][x - 1];
  }
  canMoveRight(grid: Grid, y: number, x: number) {
    if (x === GRID_WIDTH - 4) return false;
    return !grid[y][x + 4];
  }
  canMoveDown(grid: Grid, y: number, x: number) {
    if (y === 0) return false;
    const rowBelow = grid[y - 1];
    const squaresBelow = rowBelow.slice(x, x + 4);
    return squaresBelow.every((square) => square === false);
  }
  addToGrid(grid: Grid, y: number, x: number) {
    grid[y][x] = true;
    grid[y][x + 1] = true;
    grid[y][x + 2] = true;
    grid[y][x + 3] = true;
  }
}

class Rock2 implements Rock {
  height = 3;
  canMoveLeft(grid: Grid, y: number, x: number) {
    if (x === 0) return false;
    return !grid[y][x] && !grid[y + 1][x - 1] && !grid[y + 2][x];
  }
  canMoveRight(grid: Grid, y: number, x: number) {
    if (x === GRID_WIDTH - 3) return false;
    return !grid[y][x + 2] && !grid[y + 1][x + 3] && !grid[y + 2][x + 2];
  }
  canMoveDown(grid: Grid, y: number, x: number) {
    if (y === 0) return false;
    return !grid[y][x] && !grid[y - 1][x + 1] && !grid[y][x + 2];
  }
  addToGrid(grid: Grid, y: number, x: number) {
    grid[y][x + 1] = true;
    grid[y + 1][x] = true;
    grid[y + 1][x + 1] = true;
    grid[y + 1][x + 2] = true;
    grid[y + 2][x + 1] = true;
  }
}

class Rock3 implements Rock {
  height = 3;
  canMoveLeft(grid: Grid, y: number, x: number) {
    if (x === 0) return false;
    return !grid[y][x - 1] && !grid[y + 1][x + 1] && !grid[y + 2][x + 2];
  }
  canMoveRight(grid: Grid, y: number, x: number) {
    if (x === GRID_WIDTH - 3) return false;
    return !grid[y][x + 3] && !grid[y + 1][x + 3] && !grid[y + 2][x + 3];
  }
  canMoveDown(grid: Grid, y: number, x: number) {
    if (y === 0) return false;
    const rowBelow = grid[y - 1];
    const squaresBelow = rowBelow.slice(x, x + 3);
    return squaresBelow.every((square) => square === false);
  }
  addToGrid(grid: Grid, y: number, x: number) {
    grid[y][x] = true;
    grid[y][x + 1] = true;
    grid[y][x + 2] = true;
    grid[y + 1][x + 2] = true;
    grid[y + 2][x + 2] = true;
  }
}

class Rock4 implements Rock {
  height = 4;
  canMoveLeft(grid: Grid, y: number, x: number) {
    if (x === 0) return false;
    return (
      !grid[y][x - 1] &&
      !grid[y + 1][x - 1] &&
      !grid[y + 2][x - 1] &&
      !grid[y + 3][x - 1]
    );
  }
  canMoveRight(grid: Grid, y: number, x: number) {
    if (x === GRID_WIDTH - 1) return false;
    return (
      !grid[y][x + 1] &&
      !grid[y + 1][x + 1] &&
      !grid[y + 2][x + 1] &&
      !grid[y + 3][x + 1]
    );
  }
  canMoveDown(grid: Grid, y: number, x: number) {
    if (y === 0) return false;
    const squareBelow = grid[y - 1][x];
    return !squareBelow;
  }
  addToGrid(grid: Grid, y: number, x: number) {
    grid[y][x] = true;
    grid[y + 1][x] = true;
    grid[y + 2][x] = true;
    grid[y + 3][x] = true;
  }
}

class Rock5 implements Rock {
  height = 2;
  canMoveLeft(grid: Grid, y: number, x: number) {
    if (x === 0) return false;
    return !grid[y][x - 1] && !grid[y + 1][x - 1];
  }
  canMoveRight(grid: Grid, y: number, x: number) {
    if (x === GRID_WIDTH - 2) return false;
    return !grid[y][x + 2] && !grid[y + 1][x + 2];
  }
  canMoveDown(grid: Grid, y: number, x: number) {
    if (y === 0) return false;
    const rowBelow = grid[y - 1];
    return rowBelow[x] === false && rowBelow[x + 1] === false;
  }
  addToGrid(grid: Grid, y: number, x: number) {
    grid[y][x] = true;
    grid[y + 1][x] = true;
    grid[y + 1][x + 1] = true;
    grid[y][x + 1] = true;
  }
}

const getStructureHeight = (grid: Grid) => {
  for (let y = grid.length - 1; y >= 0; y--) {
    const row = grid[y];
    if (row.some((square) => square === true)) {
      return y + 1;
    }
  }
  return 0;
};

const getPart1 = () => {
  const grid: Grid = [];
  const addRow = () => grid.push(new Array(7).fill(false));
  const logGrid = (top?: number) =>
    console.log(
      grid
        .slice(top ? grid.length - top : 0)
        .map((row) => row.map((s) => (s ? "#" : ".")).join(""))
        .reverse()
        .join("\n")
    );

  let i = 0;
  let rockType = 0;
  for (let r = 0; r < 2022; r++) {
    // get rock class
    let rock: Rock;
    if (rockType === 0) rock = new Rock1();
    else if (rockType === 1) rock = new Rock2();
    else if (rockType === 2) rock = new Rock3();
    else if (rockType === 3) rock = new Rock4();
    else if (rockType === 4) rock = new Rock5();
    else throw Error("Invalid rock type");

    const gridHeight = grid.length;
    const structureHeight = getStructureHeight(grid);
    const requiredRows = structureHeight + 3 + rock.height;
    const rowsToAdd = requiredRows - gridHeight;
    for (let j = 0; j < rowsToAdd; j++) {
      addRow();
    }

    let y = structureHeight + 3;
    let x = 2;
    while (true) {
      let readyForNextRock = false;
      const char = instructions[i];
      if (char === ">") {
        if (rock.canMoveRight(grid, y, x)) {
          x++;
        }
      } else if (char === "<") {
        if (rock.canMoveLeft(grid, y, x)) {
          x--;
        }
      } else {
        throw Error("Invalid character");
      }

      if (rock.canMoveDown(grid, y, x)) {
        y--;
      } else {
        rock.addToGrid(grid, y, x);
        readyForNextRock = true;
      }

      i += 1;
      if (i === instructions.length) {
        i = 0;
      }

      if (readyForNextRock) {
        break;
      }
    }

    // add new rows based on the height of the rock
    rockType = (rockType + 1) % 5;
  }

  logGrid(10);
  console.log(getStructureHeight(grid));
};

getPart1();

// Part 2 calculations:
// In trying to figure out part 2, I noticed that the top of the grid often looked the
// same. I narrowed it down to intervals of 35 rocks where that was the case. Then I
// was able to see that the height could be determined by
//
//    rocks = n * 35 (rocks must interval of 35)
//    height = 53 * n + 7
//
// There numbers are still magic to me - I'm not sure where they come from.
// Of course 35 is not a factor of 1000000000000, so I had to take the leftover and
// calculate on a lower scale what the solution is and then add that to the height.
//
//
// Math for the sample data:
//   rocks = n * 35 + m
//   height = 53 * n + 7 + fn(m)
// and so,
//   1000000000000 = n * 35 + m -> n=28571428571 m=15
//   h = 53 * 28571428571 + 7 + fn(15)
//   fn(15) = 18 because soln(50) - soln(35) = 18
// therefore answer is 53 * 28571428571 + 7 + 18 = 1514285714288
//
// Math for the real data:
//   rocks = n * 1740 + m
//   height = 30 + 2754 * n + fn(m)
// and so,
//   1000000000000 = n * 1740 + m -> n=574712643 m=1180
//   h = 2754 * 574712643 + 30 + fn(m)
//   fn(m) = 1849 because soln(2920) - soln(1740) = 4633 - 2784
// therefore answer is 2754 * 574712643 + 30 + 1849 = 1582758620701
