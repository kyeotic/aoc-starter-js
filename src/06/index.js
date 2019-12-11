const { test, readInput } = require('../utils')

const prepareInput = rawInput => rawInput.split('\n').map(l => l.split(')'))

const input = prepareInput(readInput())

function run_a(input) {
  return getOrbitChecksum(createOrbitGraph(input))
}

function run_b(input) {
  return plotOrbitalTransfer(createOrbitGraph(input), 'YOU', 'SAN')
}

function getOrbitChecksum(graph) {
  let center = graph.get('COM')
  center.distance = 0
  walkDistance(center, graph)
  return Array.from(graph.values())
    .map(g => g.distance)
    .reduce(sum, 0)
}

function plotOrbitalTransfer(graph, self, target) {
  let walkA = new Map()
  let walkB = new Map()
  let start = graph.get(graph.get(self).parent)
  let end = graph.get(graph.get(target).parent)
  let a = start
  let b = end
  // console.log('plot', start, end)
  while (true) {
    walkA.set(a.self, a)
    walkB.set(b.self, b)
    if (walkB.has(a.self) || walkA.has(b.self)) break
    a = traceUp(graph, a)
    b = traceUp(graph, b)
  }
  let [short, long] = [
    walkA.size <= walkB.size ? walkA : walkB,
    walkA.size > walkB.size ? walkA : walkB
  ]
  let longDex = Array.from(long.values())
  let shortDex = Array.from(short.values())
  let meetingPoint = longDex.find(orbit => short.has(orbit.self))
  // console.log('meetingPoint', meetingPoint)
  return (
    longDex.slice(0, longDex.indexOf(meetingPoint)).length +
    shortDex.slice(0, shortDex.indexOf(meetingPoint)).length
  )
}

function traceUp(graph, orbit) {
  return orbit.self === 'COM' ? orbit : graph.get(orbit.parent)
}

function createOrbitGraph(table) {
  let orbits = table.reduce((map, [parent, self]) => {
    let orbit = map.get(self) || { parent, self, children: [] }
    orbit.parent = parent
    // console.log('setting', self, orbit)
    map.set(self, orbit)
    let parentRef = map.get(parent)
    if (!parentRef) {
      parentRef = { self: parent, children: [self] }
      // console.log('adding parent', parentRef)
      map.set(parent, parentRef)
    } else {
      // console.log('adding child', parent, self)
      parentRef.children.push(self)
    }
    return map
  }, new Map())

  return orbits
}

function walkDistance(object, map) {
  const distance = object.distance + 1
  // console.log('walking', object, distance)
  object.children
    .map(c => map.get(c))
    .forEach(child => {
      child.distance = distance
      walkDistance(child, map)
    })
}

function sum(a, b) {
  return a + b
}

/* Tests */

// test(result, expected)
test(
  run_a(
    prepareInput(`COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L`)
  ),
  42
)
test(run_a(input), 224901)
test(
  run_b(
    prepareInput(`COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L
K)YOU
I)SAN`)
  ),
  4
)
test(run_b(input), 334)

/* Results */

console.time('Time')
const resultA = run_a(input)
const resultB = run_b(input)
console.timeEnd('Time')

console.log('Solution to part 1:', resultA)
console.log('Solution to part 2:', resultB)
