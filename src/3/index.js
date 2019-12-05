const { test, readInput } = require('../utils')

const UP = 'U'
const DOWN = 'D'
const RIGHT = 'R'
const LEFT = 'L'

const prepareInput = rawInput =>
  rawInput
    // Split by wire (line)
    .split('\n')
    // Line is CSV of [DIRECTION][DISTANCE], e.g. [ 'U', 413 ]
    .map(line => line.split(',').map(l => [l[0], parseFloat(l.substring(1))]))

const input = prepareInput(readInput())

function run_a(input) {
  let [a, b] = input
  return findShortestManhattanDistance(a, b)
}

function run_b(input) {
  return
}

function findShortestManhattanDistance(a, b) {
  /*
    Find all the points the intersections

    ...........
    .+-----+...
    .|.....|...
    .|..+--X-+.
    .|..|..|.|.
    .|.-X--+.|.
    .|..|....|.
    .|.......|.
    .o-------+.
    ...........

    An intersections is any grid-space that both wires touch
    positions are a map of X:Y -> DISTANCE for easy lookup
  */
  let aPositions = getWirePositions(a)
  let bPositions = getWirePositions(b)
  // console.log('positions', bPositions)
  let intersections = getIntersections(aPositions, bPositions)
  let sorted = intersections.sort(sortBy(1))
  return sorted[0][1]
}

function getWirePositions(wire) {
  // return wire.reduce((positions, [move, distance]) => {}, new Map())
  let positions = new Map()
  let current = [0, 0]
  for (let [move, distance] of wire) {
    current = traceWire(positions, current, move, distance)
  }
  return positions
}

function traceWire(positions, current, move, distance) {
  let [x, y] = current
  let cursor = distance
  switch (move) {
    case UP:
      while (cursor--) {
        addPosition(positions, x, y + cursor)
      }
      return [x, y + distance]
    case DOWN:
      while (cursor--) {
        addPosition(positions, x, y - cursor)
      }
      return [x, y - distance]
    case RIGHT:
      while (cursor--) {
        addPosition(positions, x + cursor, y)
      }
      return [x + distance, y]
    case LEFT:
      while (cursor--) {
        addPosition(positions, x - cursor, y)
      }
      return [x - distance, y]
  }
}

function addPosition(positions, x, y) {
  if (x === 0 && y === 0) return
  positions.set(`${x}:${y}`, Math.abs(x) + Math.abs(y))
}

function getIntersections(aPositions, bPositions) {
  let intersections = Array.from(aPositions.entries()).reduce(
    (list, [position, distance]) => {
      // console.log('checking', position, bPositions.has(position))
      if (bPositions.has(position) && !list.has(position))
        list.set(position, distance)
      return list
    },
    new Map()
  )
  return Array.from(intersections.entries())
}

function sortBy(field) {
  return function(a, b) {
    if (a[field] > b[field]) {
      return 1
    } else if (a[field] < b[field]) {
      return -1
    }
    return 0
  }
}

/* Tests */

test(
  run_a(
    prepareInput(`R75,D30,R83,U83,L12,D49,R71,U7,L72
U62,R66,U55,R34,D71,R55,D58,R83`)
  ),
  159
)
test(
  run_b(
    prepareInput(`R75,D30,R83,U83,L12,D49,R71,U7,L72
U62,R66,U55,R34,D71,R55,D58,R83`)
  ),
  610
)

/* Results */

console.time('Time')
const resultA = run_a(input)
const resultB = run_b(input)
console.timeEnd('Time')

console.log('Solution to part 1:', resultA)
console.log('Solution to part 2:', resultB)
