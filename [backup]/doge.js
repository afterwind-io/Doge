/**
 * D.O.G.E
 * -- Data Object Generation Engine
 */

// import {
//   TYPE_FALLBACK,
//   TYPE_FORCE_DEF,
//   TYPE_DEFS
// } from './config.js'

const chalk = require('chalk')
const { padRight } = require('./lib')
// import chalk from 'chalk'
// import { padRight } from './lib'

const TYPE_FALLBACK = 'object'
const TYPE_FORCE_DEF = false
const TYPE_DEFS = {
  object: {},
  string: '',
  number: 0,
  array: [],
  bool: false
}

class Doge {
  constructor ({
    typeDefs = TYPE_DEFS,
    forceTypeCheck = TYPE_FORCE_DEF,
    defaultType = TYPE_FALLBACK
  }) {
    this.typeDefs = typeDefs
    this._forceTypeCheck = forceTypeCheck
    this._defaultType = defaultType
    this._schema = {}
  }

  get isForceTypeCheck () {
    return this._forceTypeCheck
  }

  get defaultType () {
    return this._defaultType
  }

  get typeDefs () {
    return Object.assign({}, this._typeDefs)
  }

  schema (schema) {

  }

  convert (source = {}, target = {}) {

  }
}

function isStartBrace (char) {
  return char === '{'
}

function isEndBrace (char) {
  return char === '}'
}

function isWhiteSpace (char) {
  return /\s/.test(char)
}

function isLineBreak (char) {
  return !/./.test(char)
}

function isEmpty (char) {
  return char === ''
}

function minify (schema) {
  return schema
    .split('')
    .filter(char => !isWhiteSpace(char))
    .join('')
}

const SYMBOL_START_OBJECT = '{'
const SYMBOL_END_OBJECT = '}'
const SYMBOL_START_ARRAY = '['
const SYMBOL_END_ARRAY = ']'
const SYMBOL_START_VALUE = '('
const SYMBOL_END_VALUE = ')'
const SYMBOL_ATTR_DEF = ':'
const SYMBOL_COMMA = ','
const SYMBOL_HYPHEN = '-'
const SYMBOL_SPREAD = '*'
const SYMBOL_LINE_BREAK = '\n'
const SYMBOL_SPACE = ' '
const RESERVE_TYPE = 'type'
const RESERVE_RAW = 'raw'
const RESERVE_IN = 'in'
const RESERVE_FOLD = 'fold'

const RESERVED_SYMBOLS = new Set([
  SYMBOL_START_OBJECT,
  SYMBOL_END_OBJECT,
  SYMBOL_START_ARRAY,
  SYMBOL_END_ARRAY,
  SYMBOL_START_VALUE,
  SYMBOL_END_VALUE,
  SYMBOL_ATTR_DEF,
  SYMBOL_COMMA,
  SYMBOL_HYPHEN,
  SYMBOL_SPREAD
])

class Compass {
  constructor () {
    this.reset()
  }

  get row () {
    return this._row
  }

  get col () {
    return this._col
  }

  reset () {
    this._row = 1
    this._col = 0
  }

  next (step = 1) {
    this._col += step
  }

  wrap () {
    this._col = 0
    this._row ++
  }
}

const STATE_START = 'start'
const STATE_END = 'end'
const STATE_ERROR = 'error'
const STATE_OBJECT_START = 'object_start'
const STATE_OBJECT_END = 'object_end'
const STATE_ARRAY_START = 'array_start'
const STATE_ARRAY_END = 'array_end'
const STATE_ATTR_PENDING = 'attr_pending'
const STATE_ATTR_START = 'attr_start'
const STATE_ATTR_END = 'attr_end'
const STATE_VERB_PENDING = 'verb_pending'
const STATE_VERB_START = 'verb_start'
const STATE_VERB_END = 'verb_end'
const STATE_VALUE_PENDING = 'value_pending'
const STATE_VALUE_START = 'value_start'
const STATE_VALUE_END = 'value_end'
const STATE_SPREAD = 'spread'

const ERROR_NONE_AFTER_SPREAD = `There should be no content except "${SYMBOL_END_OBJECT}" after "${SYMBOL_SPREAD}". (none-after-spread)`

class StateMgr {
  constructor () {
    this._state = STATE_START
    this._debugger = new StateDebugger()
  }

  get state () {
    return this._state
  }

  push (char) {
    let state = this._state
    let error = void 0

    switch (char) {
      case SYMBOL_START_ARRAY:
        if (state === STATE_START || state === STATE_ATTR_END) {
          this._state = STATE_ARRAY_START
        } else if (state === STATE_VALUE_START) {
          break
        } else {
          error = `Unexpected token "${SYMBOL_START_ARRAY}"`
        }
        break
      case SYMBOL_END_ARRAY:
        if (state === STATE_OBJECT_END) {
          this._state = STATE_ARRAY_END
        } else if (state === STATE_VALUE_START) {
          break
        } else {
          error = `Wrong "${SYMBOL_END_ARRAY}" difinition`
        }
        break
      case SYMBOL_START_OBJECT:
        if (state === STATE_START || state === STATE_ARRAY_START || state === STATE_ATTR_END) {
          this._state = STATE_OBJECT_START
        } else if (state === STATE_VALUE_START) {
          break
        } else {
          error = `Wrong "${SYMBOL_START_OBJECT}" difinition`
        }
        break
      case SYMBOL_END_OBJECT:
        if (state === STATE_VALUE_END || state === STATE_VERB_START || state === STATE_ARRAY_END || state === STATE_SPREAD) {
          this._state = STATE_OBJECT_END
        } else if (state === STATE_VALUE_START) {
          break
        } else {
          error = `Wrong "${SYMBOL_END_OBJECT}" difinition`
        }
        break
      case SYMBOL_ATTR_DEF:
        if (state === STATE_ATTR_START) {
          this._state = STATE_ATTR_END
        } else if (state === STATE_VALUE_START) {
          break
        } else {
          error = `Wrong "${SYMBOL_ATTR_DEF}" difinition`
        }
        break
      case SYMBOL_HYPHEN:
        if (state === STATE_ATTR_END || state === STATE_VERB_START || state === STATE_VALUE_END) {
          this._state = STATE_VERB_PENDING
        } else {
          error = `Wrong "${SYMBOL_HYPHEN}" difinition`
        }
        break
      case SYMBOL_START_VALUE:
        if (state === STATE_VERB_START) {
          this._state = STATE_VALUE_PENDING
        } else {
          error = `Wrong "${SYMBOL_START_VALUE}" difinition`
        }
        break
      case SYMBOL_END_VALUE:
        if (state === STATE_VALUE_START) {
          this._state = STATE_VALUE_END
        } else {
          error = `Wrong "${SYMBOL_END_VALUE}" difinition`
        }
        break
      case SYMBOL_COMMA:
        if (state === STATE_VERB_START || state === STATE_VALUE_END || state === STATE_OBJECT_END || state === STATE_ARRAY_END) {
          this._state = STATE_ATTR_PENDING
        } else if (state === STATE_VALUE_START) {
          break
        } else {
          error = `Wrong ${SYMBOL_COMMA} difinition`
        }
        break
      case SYMBOL_SPREAD:
        if (state === STATE_OBJECT_START || state === STATE_ATTR_PENDING) {
          this._state = STATE_SPREAD
        } else if (state === STATE_VALUE_START) {
          break
        } else {
          error = `Wrong ${SYMBOL_SPREAD} difinition`
        }
        break
      case SYMBOL_LINE_BREAK:
      case SYMBOL_SPACE:
        break
      default:
        if (state === STATE_OBJECT_START || state === STATE_ATTR_PENDING) {
          this._state = STATE_ATTR_START
        } else if (state === STATE_VERB_PENDING) {
          this._state = STATE_VERB_START
        } else if (state === STATE_VALUE_PENDING) {
          this._state = STATE_VALUE_START
        } else if (state === STATE_ATTR_START || state === STATE_VERB_START || state === STATE_VALUE_START) {
          break
        } else if (state === STATE_SPREAD) {
          error = ERROR_NONE_AFTER_SPREAD
        } else {
          error = `Unrecognized char "${char}"`
        }
        break
    }

    this._debugger.store(char, this._state)

    return {
      error,
      phase: this._state
    }
  }

  reset () {
    this._state = STATE_START
  }

  debug () {
    this._debugger.output()
  }
}

class StateDebugger {
  constructor () {
    this._compass = new Compass()
    this.reset()
  }

  $addRowHeader () {
    this._info += `${padRight(this._compass.row, 3)}| `
  }

  reset () {
    this._info = ''
    this._compass.reset()
    this.$addRowHeader()
  }

  store (char, phase) {
    let byte

    if (RESERVED_SYMBOLS.has(char)) {
      byte = chalk.white(char)
    } else if (phase === STATE_ATTR_START) {
      byte = chalk.yellow(char)
    } else if (phase === STATE_VERB_START) {
      byte = chalk.magenta(char)
    } else if (phase === STATE_VALUE_START) {
      byte = chalk.green(char)
    } else {
      byte = chalk.red(char)
    }

    this._info += byte

    if (char === SYMBOL_LINE_BREAK) {
      this._compass.wrap()
      this.$addRowHeader()
    }
  }

  output () {
    console.log(this._info)
  }
}

class Tokenizer {
  constructor (schema) {
    this._compass = new Compass()
    this._stateMgr = new StateMgr()
    this._tokens = schema.split('')
  }

  getTokens () {
    let lastPhase = STATE_START
    let token = ''
    let results = []

    let length = this._tokens.length
    for (let i = -1, char; ++i < length;) {
      char = this._tokens[i]

      let stack = this._stateMgr.push(char)
      if (stack.error === void 0) {
        if (stack.phase === lastPhase) {
          if (char !== SYMBOL_SPACE && char !== SYMBOL_LINE_BREAK) {
            token += char
          }
        } else {
          if (![
            STATE_ATTR_PENDING,
            STATE_ATTR_END,
            STATE_VERB_PENDING,
            STATE_VERB_END,
            STATE_VALUE_PENDING,
            STATE_VALUE_END
          ].includes(lastPhase)) {
            results.push({
              type: lastPhase,
              value: token,
              row: this._compass.row,
              col: this._compass.col
            })
          }

          token = char
        }

        lastPhase = stack.phase
      } else {
        this._stateMgr.debug()
        console.log(' '.repeat(this._compass.col + 5) + chalk.bold('^'))

        let e = `[Doge]<Token> ${stack.error} @ ${this._compass.row}:${this._compass.col}`
        console.error(chalk.bold.red(e))
        throw new Error(e)
      }

      if (char !== SYMBOL_LINE_BREAK) {
        this._compass.next()
      } else {
        this._compass.wrap()
      }
    }

    this._stateMgr.debug()

    return results
  }
}

// "*" 将源对象剩余的字段直接输出至结果
let schema = `{
  a: -type(string, wow) -raw -in(foo) -fold(bar, barz),
  aa: -type(object, {
    a: 'doge'
  }),
  ab: -type(array, [1, 2, 3]),
  b: {
    c: -raw,
    e: -type(number)
  },
  d: [{ e: -in(f) }],
  *
}`
// let tokens = [
//   { type: 'symbol', value: '{', row: 42, col: 42, start: 0 },
//   { type: 'attr', value: 'a', row: 42, col: 42, start: 1 },
//   { type: 'verb', value: 'type', row: 42, col: 42, start: 2 },
//   { type: 'value', value: 'string, wow', row: 42, col: 42, start: 42 },
//   { type: 'attr', value: 'b', row: 42, col: 42, start: 42 },
//   { type: 'symbol', value: '{', row: 42, col: 42, start: 42 },
//   { type: 'attr', value: 'c', row: 42, col: 42, start: 42 },
//   { type: 'verb', value: 'raw', row: 42, col: 42, start: 42 },
//   { type: 'symbol', value: '}', row: 42, col: 42, start: 42 },
//   { type: 'attr', value: 'd', row: 42, col: 42, start: 42 },
//   { type: 'symbol', value: '[', row: 42, col: 42, start: 42 },
//   { type: 'symbol', value: '{', row: 42, col: 42, start: 42 },
//   { type: 'attr', value: 'e', row: 42, col: 42, start: 42 },
//   { type: 'verb', value: 'in', row: 42, col: 42, start: 42 },
//   { type: 'value', value: 'f', row: 42, col: 42, start: 42 },
//   { type: 'symbol', value: '}', row: 42, col: 42, start: 42 },
//   { type: 'symbol', value: ']', row: 42, col: 42, start: 42 },
//   { type: 'symbol', value: '}', row: 42, col: 42, start: 42 }
// ]
let tokenizer = new Tokenizer(schema)
// tokenizer.getTokens()
tokenizer.getTokens().forEach(token => console.log(
  `${padRight(token.type, 14)}> ${token.value}`
))
