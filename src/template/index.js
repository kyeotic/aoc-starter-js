const { test, readInput } = require('../utils')

const prepareInput = rawInput => rawInput

const input = prepareInput(readInput())

function run_a(input) {
  return
}

function run_b(input) {
  return
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
