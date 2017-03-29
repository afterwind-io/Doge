const util = require('util')
const chalk = require('chalk')
const Debugger = require('./debugger')
const Tokenizer = require('./tokenizer')
const Parser = require('./parser')

const TYPE_DEFAULT = 'object'
const TYPE_CHECK = true
const TYPE_FORCE_DEF = true
const TYPE_DEFS = {
  object: {
    fallback: {},
    validate: value => value.constructor === Object
  },
  array: {
    fallback: [],
    validate: value => value.constructor === Array
  },
  boolean: {
    fallback: false,
    validate: value => typeof value === 'boolean'
  },
  string: {
    fallback: '',
    validate: value => typeof value === 'string'
  },
  number: {
    fallback: 0,
    validate: value => typeof value === 'number'
  }
}
const FOLD_DEFS = {
  $sum (arr) {
    return arr.reduce((sum, num) => sum + num, 0)
  }
}

class DogeError extends Error {

}

class DogeDebugger extends Debugger {

}

module.exports = class Doge {
  constructor (option = {}) {
    this._option = Object.assign({
      types: TYPE_DEFS,
      typeCheck: false,
      typeForceDef: true,
      typeDefault: 'object',
      folds: FOLD_DEFS
    }, option)
  }

  schema (schema) {
    this._debugger = new DogeDebugger(schema)
    this._tokenizer = new Tokenizer(schema)
    this._parser = new Parser(
      schema,
      this._option.types,
      this._option.folds
    )

    console.log(util.inspect(
      this._parser.parse(this._tokenizer.getTokens()),
      { depth: 5, colors: true, breakLength: 1 }
    ))
    return this
  }

  convert (source, target) {

  }
}
