const { test, readInput } = require('../utils')

const prepareInput = rawInput => rawInput.split(',').map(parseFloat)
const input = prepareInput(readInput())

const OP_ADD = 1
const OP_MULTIPLY = 2
const OP_DONE = 99
const HALT = -1

function run(data) {
  return runIntcode(data)
}

function run_a(data) {
  return runIntcode(assignNounVerb(data, 12, 2))
}

function run_b(data) {
  const target = 19690720
  // brute force
  for (let a = 0; a < 100; a++) {
    for (let b = 0; b < 100; b++) {
      let result = runIntcode(assignNounVerb(data, a, b))
      if (result === target) return 100 * a + b
    }
  }
  return 'failed'
}

function assignNounVerb(inputs, noun, verb) {
  let result = [...inputs]
  result.splice(1, 2, noun, verb)
  return result
}

function runIntcode(inputs) {
  const memory = [...inputs]
  let result = 0
  let pointer = 0
  while (result !== HALT) {
    result = processPosition(memory, pointer)
    pointer += result
  }
  return read(memory, 0)
}

function processPosition(memory, position) {
  switch (read(memory, position)) {
    case OP_ADD:
      return add(memory, position)
    case OP_MULTIPLY:
      return multiply(memory, position)
    case OP_DONE:
      return HALT
    default:
      console.error(
        `Unknown OPCODE: ${read(memory, position)}, POSITION: ${position}`
      )
      write(memory, 0, HALT)
      return HALT
  }
}

function add(memory, position) {
  const [a, b, target] = getOps(memory, position)
  // console.log(
  //   'adding',
  //   target,
  //   read(memory, a),
  //   read(memory, b),
  //   read(memory, a) + read(memory, b)
  // )
  write(memory, target, read(memory, a) + read(memory, b))
  return 4
}

function multiply(memory, position) {
  const [a, b, target] = getOps(memory, position)
  write(memory, target, read(memory, a) * read(memory, b))
  return 4
}

function read(memory, position) {
  return memory[position]
}

function write(memory, position, value) {
  memory[position] = value
}

function getOps(memory, position) {
  return [position + 1, position + 2, position + 3].map(read.bind(null, memory))
}

/* Tests */

// test(result, expected)
// test(run([1, 0, 0, 0, 99]), 2)
// test(run([1, 1, 1, 4, 99, 5, 6, 0, 99]), 30)
// test(run_a(input), 6730673)
test(run_b(input), 3749)

/* Results */

console.time('Time')
const resultA = run_a(input)
const resultB = run_b(input)
console.timeEnd('Time')

console.log('Solution to part 1:', resultA)
console.log('Solution to part 2:', resultB)
