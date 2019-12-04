const { test, readInput } = require('../utils')

const prepareInput = rawInput => rawInput.split('\n')

const input = prepareInput(readInput())

function run_a(input) {
  return calculateModuleFuel(input)
}

function run_b(input) {
  return calculateTotalFuel(input)
}

function calculateTotalFuel(modules) {
  return modules
    .map(getFuelForMass)
    .map(getMetaFuel)
    .reduce(sumReduce, 0)
}

function getMetaFuel(fuelMass) {
  let total = fuelMass
  let metaFuel = fuelMass
  do {
    metaFuel = getFuelForMass(metaFuel)
    if (metaFuel > 0) total += metaFuel
  } while (metaFuel > 0)
  return total
}

function calculateModuleFuel(modules) {
  return input.map(getFuelForMass).reduce(sumReduce, 0)
}

function getFuelForMass(mass) {
  return Math.floor(mass / 3) - 2
}

function sumReduce(acc, element) {
  return acc + element
}

/*
Fuel required to launch a given module is based on its mass. 
Specifically, to find the fuel required for a module, 
  take its mass, divide by three, round down, and subtract 2.

For example:

For a mass of 12, divide by 3 and round down to get 4, then subtract 2 to get 2.
For a mass of 14, dividing by 3 and rounding down still yields 4, so the fuel required is also 2.
For a mass of 1969, the fuel required is 654.
For a mass of 100756, the fuel required is 33583.
*/

/* Tests */

// test(result, expected)

/* Results */

console.time('Time')
const resultA = run_a(input)
const resultB = run_b(input)
console.timeEnd('Time')

console.log('Solution to part 1:', resultA)
console.log('Solution to part 2:', resultB)
