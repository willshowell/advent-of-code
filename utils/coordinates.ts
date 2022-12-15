export type Coordinate = [number, number];

export const coordinatesAreSame = (a: Coordinate, b: Coordinate): boolean =>
  a[0] === b[0] && a[1] === b[1];

export const coordinateDistance = (a: Coordinate, b: Coordinate): number => {
  const dy = Math.abs(a[0] - b[0]);
  const dx = Math.abs(a[1] - b[1]);
  return dy + dx;
};

export class CoordinateSet {
  private data = new Map<number, Set<number>>();

  constructor(coordinates?: Iterable<Coordinate>) {
    if (coordinates) {
      for (const coord of coordinates) {
        this.add(coord);
      }
    }
  }

  add([first, second]: Coordinate) {
    if (!this.data.has(first)) {
      this.data.set(first, new Set<number>());
    }

    this.data.get(first)?.add(second);
  }

  has([first, second]: Coordinate) {
    return this.data.has(first) && this.data.get(first)!.has(second);
  }

  entries(): Coordinate[] {
    const result: Coordinate[] = [];
    for (const [first, secondSet] of this.data.entries()) {
      for (const second of secondSet) {
        result.push([first, second]);
      }
    }
    return result;
  }
}

export class Grid<T> {
  private data: T[][];

  constructor(
    public height: number,
    public width: number,
    fill: T | (() => T)
  ) {
    this.data = new Array(height)
      .fill(0)
      .map((_) => new Array(width).fill(fill));
  }

  at(coord: Coordinate): T {
    return this.data[coord[0]][coord[1]];
  }

  set(coord: Coordinate, value: T) {
    this.data[coord[0]][coord[1]] = value;
  }

  isWithinGridBoundary(coord: Coordinate): boolean {
    return !this.isOutsideGridBoundary(coord);
  }

  isOutsideGridBoundary(coord: Coordinate): boolean {
    if (coord[0] < 0 || coord[0] >= this.height) return true;
    if (coord[1] < 0 || coord[1] >= this.width) return true;
    return false;
  }

  toString(startY = 0, endY = this.height, startX = 0, endX = this.width) {
    const sliced = this.data
      .slice(startY, endY)
      .map((row) => row.slice(startX, endX));
    return sliced.map((row) => row.join("")).join("\n");
  }
}
