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
  console.log('positions', bPositions)
  let intersections = getIntersections(aPositions, bPositions)
  let sorted = intersections.sort(sortBy(1))
  return sorted[1]
}

function getWirePositions(wire) {
  let result = new Map()
  let current = [0, 0]
  let previous = current
  for (let [move, distance] of wire) {
    current = traceWire(current, move, distance)
    let [x, y] = previous
    let [xNew, yNew] = current

    result.set(`${x}:${y}`, Math.abs(x) + Math.abs(y))
    previous = current
  }
  return result
}

function traceWire([x, y], move, distance) {
  // NOOOOOOOPPEEEE
  // You have to get every position ON THE WAY, not just the start and end
  switch (move) {
    case UP:
      return [x, y + distance]
    case DOWN:
      return [x, y - distance]
    case RIGHT:
      return [x + distance, y]
    case LEFT:
      return [x - distance, y]
  }
}

function getIntersections(aPositions, bPositions) {
  return Array.from(aPositions.entries()).reduce(
    (list, [position, distance]) => {
      console.log('checking', position, bPositions.has(position))
      if (bPositions.has(position)) list.push([position, distance])
      return list
    },
    []
  )
}

function sortBy(field) {
  return function(a, b) {
    if (a[field] > b[field]) {
      return -1
    } else if (a[field] < b[field]) {
      return 1
    }
    return 0
  }
}

/* Tests */

// test(result, expected)

/* Results */

console.time('Time')
const resultA = run_a(input)
const resultB = run_b(input)
console.timeEnd('Time')

console.log('Solution to part 1:', resultA)
console.log('Solution to part 2:', resultB)
