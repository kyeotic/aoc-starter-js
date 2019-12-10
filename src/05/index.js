const { test, readInput } = require('../utils')
const { newIntCode, runIntcode, HALT } = require('./intCode')

const prepareInput = rawInput => rawInput.split(',').map(parseFloat)

const input = prepareInput(readInput())

function run_a(input) {
  const outputs = []
  let intcode = newIntCode(input, {
    input: () => 1,
    output: (val, position) => {
      console.log('output', val, position)
      outputs.push(val)
    }
  })
  let result = runIntcode(intcode)
  let lastOutput = outputs[outputs.length - 1]
  if (result !== HALT) {
    throw new Error(`result: ${result} invalid output: ${lastOutput}`)
  }
  console.log('done', result, lastOutput)
  return lastOutput
}

function run_b(input) {
  return
}

function run(input) {
  let intCode = newIntCode(input)
  runIntcode(intCode)
  return intCode.memory
}

/* Tests */

// test(result, expected)
// test(run([1002, 4, 3, 4, 33]), [1002, 4, 3, 4, 99])
// test(run([1, 0, 0, 0, 99]), [2, 0, 0, 0, 99])
// test(run([1, 1, 1, 4, 99, 5, 6, 0, 99]), [30, 1, 1, 4, 2, 5, 6, 0, 99])

/* Results */

console.time('Time')
const resultA = run_a(input)
const resultB = run_b(input)
console.timeEnd('Time')

console.log('Solution to part 1:', resultA)
console.log('Solution to part 2:', resultB)
