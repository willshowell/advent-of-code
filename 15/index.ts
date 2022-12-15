import { Coordinate, coordinateDistance } from "../utils/coordinates.ts";
import { Range, mergeRanges } from "../utils/ranges.ts";

const text = Deno.readTextFileSync("./15/input.txt");
const lines = text.split("\n").filter(Boolean);

interface Sensor {
  pos: Coordinate;
  dis: number;
}

const getSensorsAndBeacons = () => {
  const sensors: Sensor[] = [];
  const beacons: Coordinate[] = [];

  for (const line of lines) {
    const [sensorX, sensorY, beaconX, beaconY] = line
      .match(
        /^Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)$/
      )!
      .slice(1)
      .map(Number);

    const beaconPos: Coordinate = [beaconY, beaconX];
    const sensorPos: Coordinate = [sensorY, sensorX];
    const sensor: Sensor = {
      pos: sensorPos,
      dis: coordinateDistance(sensorPos, beaconPos),
    };

    sensors.push(sensor);
    beacons.push(beaconPos);
  }

  return { sensors, beacons };
};

const getCoveredRanges = (
  sensors: Sensor[],
  row: number,
  min: number,
  max: number
): Range[] => {
  const ranges: Range[] = [];
  for (const sensor of sensors) {
    const [sensorY, sensorX] = sensor.pos;
    const yDistance = Math.abs(row - sensorY);
    if (yDistance > sensor.dis) continue;

    const xRadius = sensor.dis - yDistance;
    ranges.push([
      Math.max(min, sensorX - xRadius),
      Math.min(sensorX + xRadius, max),
    ]);
  }

  return mergeRanges(ranges);
};

const getResult1 = (row: number) => {
  const { sensors, beacons } = getSensorsAndBeacons();

  const sensorAndBeaconColumns = new Set(
    sensors
      .map((s) => s.pos)
      .concat(beacons)
      .filter((pos) => pos[0] === row)
      .map((pos) => pos[1])
  );

  const columnRanges = getCoveredRanges(sensors, row, -Infinity, Infinity);
  return (
    columnRanges.map((r) => r[1] - r[0] + 1).reduce((a, c) => a + c) -
    sensorAndBeaconColumns.size
  );
};

const getResult2 = (max: number) => {
  const { sensors } = getSensorsAndBeacons();
  for (let y = 0; y <= max; y++) {
    const ranges = getCoveredRanges(sensors, y, 0, 4000000);

    // if there's more than one range, must be a gap
    if (ranges.length > 1) {
      const x = ranges[0][1] + 1;
      return x * 4000000 + y;
    }
  }

  return null;
};

console.log(getResult1(2000000));
console.log(getResult2(4000000));
