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

/**
 * 向字符串左侧填充指定长度的内容
 * @param   {String}  source       需要填充的字符串
 * @param   {Number}  num          填充后的长度
 * @param   {String}  [fill='  ']  填充的内容，默认为空格
 * @return  {String}               填充后的字符串
 */
const padRight = function (source, num, fill = ' ') {
  if (typeof source !== 'string') source = source.toString()
  if (typeof num !== 'number') num = 0
  if (source.length >= num) return source
  if (typeof fill !== 'string') fill = fill.toString()

  return source.concat(fill.repeat(num - source.length))
}

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

  step () {
    this._col ++
  }

  wrap () {
    this._col = 0
    this._row ++
  }
}

/**
 * 状态表：
 *    attr：模板树字段定义
 *    verb：保留关键字定义
 *    value：值定义
 *    object_start
 *    object_end
 *    array_start
 *    array_end
 *    attr_start
 *    attr_end
 *    verb_start
 *    verb_end
 *    value_start
 *    value_end
 */
class StateMgr {
  constructor () {
    this._state = 'start'
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
        if (state === 'start' || state === 'attr_end') {
          this._state = 'array_start'
        } else if (state === 'value_start') {
          break
        } else {
          error = `Wrong "${SYMBOL_START_ARRAY}" difinition`
        }
        break
      case SYMBOL_END_ARRAY:
        if (state === 'object_end') {
          this._state = 'array_end'
        } else if (state === 'value_start') {
          break
        } else {
          error = `Wrong "${SYMBOL_END_ARRAY}" difinition`
        }
        break
      case SYMBOL_START_OBJECT:
        if (state === 'start' || state === 'array_start' || state === 'attr_end') {
          this._state = 'object_start'
        } else if (state === 'value_start') {
          break
        } else {
          error = `Wrong "${SYMBOL_START_OBJECT}" difinition`
        }
        break
      case SYMBOL_END_OBJECT:
        if (state === 'value_end' || state === 'verb_start' || state === 'array_end') {
          this._state = 'object_end'
        } else if (state === 'value_start') {
          break
        } else {
          error = `Wrong "${SYMBOL_END_OBJECT}" difinition`
        }
        break
      case SYMBOL_ATTR_DEF:
        if (state === 'attr_start') {
          this._state = 'attr_end'
        } else if (state === 'value_start') {
          break
        } else {
          error = `Wrong "${SYMBOL_ATTR_DEF}" difinition`
        }
        break
      case SYMBOL_HYPHEN:
        if (state === 'attr_end' || state === 'value_end') {
          this._state = 'verb_start'
        } else if (state === 'verb_start') {
          this._state = 'verb_end'
        } else {
          error = `Wrong "${SYMBOL_HYPHEN}" difinition`
        }
        break
      case SYMBOL_START_VALUE:
        if (state === 'verb_start') {
          this._state = 'value_start'
        } else {
          error = `Wrong "${SYMBOL_START_VALUE}" difinition`
        }
        break
      case SYMBOL_END_VALUE:
        if (state === 'value_start') {
          this._state = 'value_end'
        } else {
          error = `Wrong "${SYMBOL_END_VALUE}" difinition`
        }
        break
      case SYMBOL_COMMA:
        if (state === 'verb_start' || state === 'value_end' || state === 'object_end' || state === 'array_end') {
          this._state = 'attr_start'
        } else if (state === 'value_start') {
          break
        } else {
          error = `Wrong ${SYMBOL_COMMA} difinition`
        }
        break
      case SYMBOL_SPREAD:
        break
      case SYMBOL_LINE_BREAK:
      case SYMBOL_SPACE:
        break
      default:
        if (state === 'object_start') {
          this._state = 'attr_start'
        } else if (state === 'verb_end') {
          this._state = 'verb_start'
        } else if (state === 'attr_start' || state === 'verb_start' || state === 'value_start') {
          break
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
    this._state = 'start'
  }

  debug () {
    this._debugger.output()
  }
}

class StateDebugger {
  constructor () {
    this.reset()
  }

  reset () {
    this._info = `${padRight('1', 3)}| `
    this._row = 1
  }

  store (char, phase) {
    let byte

    if (RESERVED_SYMBOLS.has(char)) {
      byte = chalk.white(char)
    } else if (phase === 'attr_start') {
      byte = chalk.yellow(char)
    } else if (phase === 'verb_start') {
      byte = chalk.magenta(char)
    } else if (phase === 'value_start') {
      byte = chalk.green(char)
    } else {
      byte = chalk.red(char)
    }

    this._info += byte

    if (char === SYMBOL_LINE_BREAK) {
      this._info += `${padRight(++this._row, 3)}| `
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
    let lastPhase = ''
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
          results.push({
            type: lastPhase,
            value: token,
            row: this._compass.row,
            col: this._compass.col
          })

          token = char
        }

        lastPhase = stack.phase

        let outChar = char === '\n' ? '_LB_' : char
        console.log(
          `Char: "${outChar}" State: "${stack.phase}" @ ${this._compass.row}:${this._compass.col}`
        )
      } else {
        this._stateMgr.debug()
        console.log(' '.repeat(this._compass.col + 5) + chalk.bold('^'))

        let e = `[Doge]<Token> ${stack.error} @ ${this._compass.row}:${this._compass.col}`
        console.error(chalk.bold.red(e))
        throw new Error(e)
      }

      if (char !== SYMBOL_LINE_BREAK) {
        this._compass.step()
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
  d: [{ e: -in(f) }]
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
tokenizer.getTokens().forEach(token => console.log(
  `${padRight(token.type, 12)}: ${token.value}`
))
