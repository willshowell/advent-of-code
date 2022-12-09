export type Coordinate = [number, number];

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
