const { test, readInput } = require('../utils')
const { newIntCode, runIntcode, HALT, asRange } = require('../05/intCode')

const prepareInput = rawInput => rawInput.split(',').map(parseFloat)

const input = prepareInput(readInput())

function run_a(memory) {
  return getPermutations(asRange(0, 4)).reduce((max, phase) => {
    // console.log('phase', phase, max)
    return Math.max(max, computeThruster(memory, phase))
  }, -Infinity)
  return
}

function run_b(input) {
  return
}

function computeThruster(memory, phase) {
  return phase.reduce((output, signal) => {
    // console.log('signal', output)
    return computeAmp(cloneArray(memory), signal, output)
  }, 0)
}

function computeAmp(memory, signal, input) {
  const outputs = []
  let inputs = [signal, input]
  let intcode = newIntCode(memory, {
    input: () => inputs.shift(),
    output: (val, position) => {
      // console.log('output', val, position)
      outputs.push(val)
    }
  })
  let result = runIntcode(intcode)
  return outputs[0]
}

function getPermutations(list) {
  return permute([], [...list], 0, list.length - 1)
}

function permute(output, list, start, end) {
  if (start === end) return append(output, list)
  for (let i = start; i <= end; i++) {
    swap(list, start, i)
    permute(output, list, start + 1, end)
    swap(list, i, start)
  }
  return output
}

function swap(arr, a, b) {
  let c = arr[a]
  arr[a] = arr[b]
  arr[b] = c
  return arr
}

function cloneArray(input) {
  return [...input]
}

function append(output, permutation) {
  output.push([...permutation])
  return output
}

/* Tests */
// test(result, expected)
test(getPermutations([1, 2, 3]), [
  [1, 2, 3],
  [1, 3, 2],
  [2, 1, 3],
  [2, 3, 1],
  [3, 2, 1],
  [3, 1, 2]
])
test(
  run_a([3, 15, 3, 16, 1002, 16, 10, 16, 1, 16, 15, 15, 4, 15, 99, 0, 0]),
  43210
)
test(run_a(input), 17790)
/* Results */

console.time('Time')
const resultA = run_a(input)
const resultB = run_b(input)
console.timeEnd('Time')

console.log('Solution to part 1:', resultA)
console.log('Solution to part 2:', resultB)
