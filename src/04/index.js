const { test, readInput } = require('../utils')

const prepareInput = rawInput => rawInput.split('-').map(parseFloat)

const input = prepareInput(readInput())

/*
  However, they do remember a few key facts about the password:

  It is a six-digit number.
  The value is within the range given in your puzzle input.
  Two adjacent digits are the same (like 22 in 122345).
  Going from left to right, the digits never decrease; they only ever increase or stay the same (like 111123 or 135679).
  Other than the range rule, the following are true:

  111111 meets these criteria (double 11, never decreases).
  223450 does not meet these criteria (decreasing pair of digits 50).
  123789 does not meet these criteria (no double).
  How many different passwords within the range given in your puzzle input meet these criteria?
*/

function run_a([min, max]) {
  return findPasswordsInRange(min, max, isValidVenetianPassword)
}

function run_b([min, max]) {
  return findPasswordsInRange(min, max, isValidElfianPassword)
}

function findPasswordsInRange(min, max, predicate) {
  let passwords = new Set()
  let cursor = min
  while (cursor++ < max) {
    if (predicate(min, max, cursor)) {
      passwords.add(cursor)
    }
  }
  return passwords.size
}

function isValidElfianPassword(min, max, key) {
  return isValidVenetianPassword(min, max, key) && hasMaxRepeatingBlocks(2, key)
}

function isValidVenetianPassword(min, max, key) {
  let keyString = key.toString()
  let keyDex = keyString.split('').map(parseFloat)
  return (
    key > min &&
    key < max &&
    keyString.length === 6 &&
    keyDex.some((k, i, d) => i < 5 && k === d[i + 1]) &&
    keyDex.every((k, i, d) => i === 0 || d[i - 1] <= k)
  )
}

function hasMaxRepeatingBlocks(n, key) {
  let keyDex = key
    .toString()
    .split('')
    .map(parseFloat)
  let aggregations = keyDex.reduce((vals, k) => {
    let v = vals.get(k)
    vals.set(k, v ? v + 1 : 1)
    return vals
  }, new Map())
  return !!Array.from(aggregations.entries()).filter(([k, v]) => v === n).length
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

// test(result, expected)

test(isValidVenetianPassword(-Infinity, Infinity, 111111), true)
test(isValidVenetianPassword(-Infinity, Infinity, 223450), false)
test(isValidVenetianPassword(-Infinity, Infinity, 123789), false)
test(isValidVenetianPassword(-Infinity, Infinity, 123799), true)
test(hasMaxRepeatingBlocks(2, 111122), true)
test(hasMaxRepeatingBlocks(2, 112233), true)
test(hasMaxRepeatingBlocks(2, 123444), false)
test(hasMaxRepeatingBlocks(2, 123799), true)
test(run_a(input), 2150)
test(run_b(input), 1462)

/* Results */

console.time('Time')
const resultA = run_a(input)
const resultB = run_b(input)
console.timeEnd('Time')

console.log('Solution to part 1:', resultA)
console.log('Solution to part 2:', resultB)
