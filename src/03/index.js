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
  positions are a map of X:Y -> { DISTANCE, WIRELENGTH } for easy lookup
*/

function run_a(input) {
  let [a, b] = input
  return findShortestManhattanDistance(a, b)
}

function run_b(input) {
  return findShortestIntersectionByLength(...input)
}

function findShortestManhattanDistance(a, b) {
  let aPositions = getWirePositions(a)
  let bPositions = getWirePositions(b)
  // console.log('positions', bPositions)
  let intersections = getIntersections(aPositions, bPositions)
  let sorted = intersections.sort(sortBy('distance'))
  return sorted[0].distance
}

function findShortestIntersectionByLength(a, b) {
  let aPositions = getWirePositions(a)
  let bPositions = getWirePositions(b)
  // console.log('positions', bPositions)
  let intersections = getIntersections(aPositions, bPositions)
  let sorted = intersections.sort(sortBy('wireLength'))
  return sorted[0].wireLength
}

function getWirePositions(wire) {
  let positions = new Map()
  // Steps must be tracked independently of size, since size looks up positions
  // An alternative would be to store each instance of a position
  // But I don't see any value in that for this puzzle
  // Since we only need the lookup either distance or 1st length
  positions.steps = 0
  let current = [0, 0]
  for (let [move, distance] of wire) {
    current = traceWire(positions, current, move, distance)
  }
  return positions
}

function traceWire(positions, current, move, distance) {
  let [x, y] = current
  let cursor = 0
  switch (move) {
    case UP:
      while (cursor++ < distance) {
        addPosition(positions, x, y + cursor)
      }
      return [x, y + distance]
    case DOWN:
      while (cursor++ < distance) {
        addPosition(positions, x, y - cursor)
      }
      return [x, y - distance]
    case RIGHT:
      while (cursor++ < distance) {
        addPosition(positions, x + cursor, y)
      }
      return [x + distance, y]
    case LEFT:
      while (cursor++ < distance) {
        addPosition(positions, x - cursor, y)
      }
      return [x - distance, y]
  }
}

function addPosition(positions, x, y) {
  if (x === 0 && y === 0) return
  positions.steps++
  let position = `${x}:${y}`
  let previous = positions.get(position)
  positions.set(position, {
    distance: Math.abs(x) + Math.abs(y),
    wireLength: previous ? previous.wireLength : positions.steps
  })
}

function getIntersections(aPositions, bPositions) {
  let intersections = Array.from(aPositions.entries()).reduce(
    (list, [position, { distance, wireLength }]) => {
      // console.log('checking', position, bPositions.has(position))
      if (bPositions.has(position) && !list.has(position)) {
        list.set(position, {
          position,
          distance,
          wireLength: wireLength + bPositions.get(position).wireLength
        })
      }
      return list
    },
    new Map()
  )
  return Array.from(intersections.values())
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
test(
  run_b(
    prepareInput(`R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51
U98,R91,D20,R16,D67,R40,U7,R15,U6,R7`)
  ),
  410
)

/* Results */

console.time('Time')
const resultA = run_a(input)
const resultB = run_b(input)
console.timeEnd('Time')

console.log('Solution to part 1:', resultA)
console.log('Solution to part 2:', resultB)
