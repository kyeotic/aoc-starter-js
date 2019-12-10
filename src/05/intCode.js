'use strict'

const { noop } = require('../utils')

const OP_ADD = 1
const OP_MULTIPLY = 2
const OP_INPUT = 3
const OP_OUTPUT = 4
const OP_DONE = 99
const HALT = -1

const MODE_POSITION = 0
const MODE_IMMEDIATE = 1

module.exports = {
  HALT,
  newIntCode,
  runIntcode
}

function newIntCode(inputs, { input = noop, output = noop } = {}) {
  return {
    memory: [...inputs],
    input,
    output
  }
}

function assignNounVerb(intCode, noun, verb) {
  intCode.memory.splice(1, 2, noun, verb)
  return intCode
}

function runIntcode(intCode) {
  // console.log('init', read(intCode, 223))
  let result = 0
  let cursor = 0
  while (result !== HALT) {
    result = processPosition(intCode, cursor)
    cursor += result
  }
  return result
}

function processPosition(intCode, position) {
  let [code, ...modes] = getInstruction(intCode, position)
  switch (code) {
    case OP_ADD:
      return add(intCode, position, modes)
    case OP_MULTIPLY:
      return multiply(intCode, position, modes)
    case OP_INPUT:
      return input(intCode, position, modes)
    case OP_OUTPUT:
      return output(intCode, position, modes)
    case OP_DONE:
      return HALT
    default:
      console.error(`Unknown OPCODE: ${code}, POSITION: ${position}`)
      write(intCode, 0, HALT)
      return HALT
  }
}

function add(intCode, position, modes) {
  const [a, b] = getParams(intCode, position, 2, modes)
  const target = read(intCode, position + 3)
  // console.log('adding', { target, a, b })
  write(intCode, target, a + b)
  return 4
}

function multiply(intCode, position, modes) {
  const [a, b] = getParams(intCode, position, 2, modes)
  const target = read(intCode, position + 3)
  // console.log('multiply', { target, a, b })
  write(intCode, target, a * b)
  return 4
}

function input(intCode, position, modes) {
  const target = read(intCode, position + 1)
  let val = intCode.input()
  console.log('input', { target, input: val, modes })
  write(intCode, target, val)
  // console.log('input done', target, read(intCode, target))
  return 2
}

function output(intCode, position, modes) {
  const [target] = getParams(intCode, position, 1, modes)
  // console.log('output', read(intCode, position + 1), {
  //   position,
  //   target,
  //   modes
  // })
  intCode.output(target, position)
  return 2
}

function read(intCode, position) {
  return intCode.memory[position]
}

function write(intCode, position, value) {
  intCode.memory[position] = value
}

function getParams(intCode, position, ops, modes) {
  return asRange(position + 1, position + ops).map((p, i) =>
    readParam(intCode, p, modes[i])
  )
}

function getInstruction(intCode, position) {
  let val = read(intCode, position)
  return [
    // Modulo-100 will return the value in the ten and one position
    val % 100,
    // Then return the remaining codes in reverse order
    ...val
      .toString()
      .split('')
      .slice(0, -2)
      .reverse()
      .map(parseFloat)
  ]
}

function readParam(intCode, position, mode) {
  // console.log('getting param', position, mode)
  switch (mode) {
    case MODE_IMMEDIATE:
      // console.log('param immediate', position)
      return read(intCode, position)
    case MODE_POSITION:
    default:
      // console.log(
      //   'param position',
      //   position,
      //   read(intCode, position),
      //   read(intCode, read(intCode, position))
      // )
      return read(intCode, read(intCode, position))
  }
}

function asRange(start, end) {
  let result = []
  for (let i = start; i <= end; i++) {
    result.push(i)
  }
  return result
}
