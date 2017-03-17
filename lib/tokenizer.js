const SYMBOL = require('./symbols')
const STATE = require('./states')
const chalk = require('chalk')
const Compass = require('./compass')
const { padRight } = require('./lib')

const ERROR_NONE_AFTER_SPREAD = `There should be no content except "${SYMBOL.END_OBJECT}" after "${SYMBOL.SPREAD}". (none-after-spread)`

class TokenError extends Error {
  constructor ({
    error, row, col
  }) {
    super(`[Doge]<Token> ${error} @ ${row}:${col}`)
    this.row = row
    this.col = col
  }
}

class SchemaDebugger {
  constructor (schema) {
    if (schema === void 0) {
      throw new Error('No schema applied.')
    }

    this.reset(schema)
    this._enableStyling = true
  }

  reset (schema) {
    if (schema !== void 0) {
      this._map = this.$split(schema)
    }
  }

  store ({ char, state, row, col }) {
    let byte = this._enableStyling
      ? this.$style(char, state)
      : char

    this._map[row].splice(col, 1, byte)
  }

  debug ({ char, state, row, col, error = '' }) {
    let info = this._map
      .slice(0, row + 1)
      .map((row, index) => this.$getRowHeader(++index).concat(row.join('')))
      .concat(' '.repeat(5 + col))
      .concat(chalk.bold('^'))
      .join('')
    console.log(info)

    throw new TokenError({error, row: ++row, col: ++col})
  }

  $split (schema) {
    return schema
      .split(SYMBOL.LINE_BREAK)
      .map(row => row.concat(SYMBOL.LINE_BREAK).split(''))
  }

  $style (char, state) {
    if (state === STATE.ATTR_START) {
      return chalk.yellow(char)
    } else if (state === STATE.VERB_START) {
      return chalk.magenta(char)
    } else if (state === STATE.VALUE_START) {
      return chalk.green(char)
    } else if (SYMBOL.isReservedSymbol(char)) {
      return chalk.white(char)
    } else {
      return chalk.red(char)
    }
  }

  $getRowHeader (row) {
    return `${padRight(row, 3)}| `
  }
}

class Tokenizer {
  constructor (schema) {
    if (schema === void 0) {
      throw new Error('No schema applied.')
    }

    this.reset(schema)
  }

  getTokens () {
    let raws = this._schema.split('')
    let length = raws.length

    for (let i = -1, char; ++i < length;) {
      char = raws[i]

      let error = this.$read(char)
      this.$debug(char, error)
      this.$join(char)

      if (char !== SYMBOL.LINE_BREAK) {
        this._compass.next()
      } else {
        this._compass.wrap()
      }
    }

    return this._lexicalizer.lexicons
  }

  reset (schema) {
    if (schema !== void 0) {
      this._schema = schema
    }

    this._state = this._lastState = STATE.START
    this._compass === void 0
      ? this._compass = new Compass()
      : this._compass.reset()
    this._lexicalizer === void 0
      ? this._lexicalizer = new Lexicalizer()
      : this._lexicalizer.reset()
    this._debugger === void 0
      ? this._debugger = new SchemaDebugger(this._schema)
      : this._debugger.reset(this._schema)
    return this
  }

  $read (char) {
    let state = this._state
    let error = void 0

    switch (char) {
      case SYMBOL.START_ARRAY:
        if (state === STATE.START || state === STATE.ATTR_END) {
          this._state = STATE.ARRAY_START
        } else if (state === STATE.VALUE_START) {
          break
        } else {
          error = `Unexpected token "${SYMBOL.START_ARRAY}"`
        }
        break
      case SYMBOL.END_ARRAY:
        if (state === STATE.OBJECT_END) {
          this._state = STATE.ARRAY_END
        } else if (state === STATE.VALUE_START) {
          break
        } else {
          error = `Unexpected token "${SYMBOL.END_ARRAY}"`
        }
        break
      case SYMBOL.START_OBJECT:
        if (state === STATE.START || state === STATE.ARRAY_START || state === STATE.ATTR_END) {
          this._state = STATE.OBJECT_START
        } else if (state === STATE.VALUE_START) {
          break
        } else {
          error = `Unexpected token "${SYMBOL.START_OBJECT}"`
        }
        break
      case SYMBOL.END_OBJECT:
        if (state === STATE.VALUE_END || state === STATE.VERB_START || state === STATE.ARRAY_END || state === STATE.SPREAD) {
          this._state = STATE.OBJECT_END
        } else if (state === STATE.VALUE_START) {
          break
        } else {
          error = `Unexpected token "${SYMBOL.END_OBJECT}"`
        }
        break
      case SYMBOL.ATTR_DEF:
        if (state === STATE.ATTR_START) {
          this._state = STATE.ATTR_END
        } else if (state === STATE.VALUE_START) {
          break
        } else {
          error = `Unexpected token "${SYMBOL.ATTR_DEF}"`
        }
        break
      case SYMBOL.HYPHEN:
        if (state === STATE.ATTR_END || state === STATE.VERB_START || state === STATE.VALUE_END) {
          this._state = STATE.VERB_PENDING
        } else if (state === STATE.VALUE_START) {
          break
        } else {
          error = `Unexpected token "${SYMBOL.HYPHEN}"`
        }
        break
      case SYMBOL.START_VALUE:
        if (state === STATE.VERB_START) {
          this._state = STATE.VALUE_PENDING
        } else {
          error = `Unexpected token "${SYMBOL.START_VALUE}"`
        }
        break
      case SYMBOL.END_VALUE:
        if (state === STATE.VALUE_START) {
          this._state = STATE.VALUE_END
        } else {
          error = `Unexpected token "${SYMBOL.END_VALUE}"`
        }
        break
      case SYMBOL.COMMA:
        if (state === STATE.VERB_START || state === STATE.VALUE_END || state === STATE.OBJECT_END || state === STATE.ARRAY_END) {
          this._state = STATE.ATTR_PENDING
        } else if (state === STATE.VALUE_START) {
          break
        } else {
          error = `Unexpected token ${SYMBOL.COMMA}`
        }
        break
      case SYMBOL.SPREAD:
        if (state === STATE.OBJECT_START || state === STATE.ATTR_PENDING) {
          this._state = STATE.SPREAD
        } else if (state === STATE.VALUE_START) {
          break
        } else {
          error = `Unexpected token ${SYMBOL.SPREAD}`
        }
        break
      case SYMBOL.LINE_BREAK:
      case SYMBOL.SPACE:
        break
      default:
        if (state === STATE.OBJECT_START || state === STATE.ATTR_PENDING) {
          this._state = STATE.ATTR_START
        } else if (state === STATE.VERB_PENDING) {
          this._state = STATE.VERB_START
        } else if (state === STATE.VALUE_PENDING) {
          this._state = STATE.VALUE_START
        } else if (state === STATE.ATTR_START || state === STATE.VERB_START || state === STATE.VALUE_START) {
          break
        } else if (state === STATE.SPREAD) {
          error = ERROR_NONE_AFTER_SPREAD
        } else {
          error = `Unexpected token "${char}"`
        }
        break
    }

    return error
  }

  $join (char) {
    let state = this._state
    let row = this._compass.row
    let col = this._compass.col

    this._lexicalizer.push({char, state, row, col})
  }

  $debug (char, error) {
    let state = this._state
    let row = this._compass.row
    let col = this._compass.col

    this._debugger.store({ char, state, row, col })

    if (error !== void 0) {
      this._debugger.debug({ error, row, col })
    }
  }
}

class Lexicalizer {
  constructor () {
    this.reset()
  }

  get lexicons () {
    return this._lexicons
  }

  reset () {
    this._state = STATE.START
    this._type = 'symbol'
    this._cache = ''
    this._lexicons = []
  }

  push ({char, state, row, col}) {
    let prevState = this._state

    if (char === SYMBOL.SPACE || char === SYMBOL.LINE_BREAK) {
      return
    }

    if (state === prevState) {
      this._cache += char
      return
    }

    switch (state) {
      case STATE.OBJECT_END:
        if (prevState === STATE.VERB_START) {
          this.lexicons.push({ type: this._type, value: this._cache, row, col })
          this._cache = ''
        }
      case STATE.OBJECT_START:
      case STATE.ARRAY_START:
      case STATE.ARRAY_END:
      case STATE.SPREAD:
        this._lexicons.push({ type: 'symbol', value: char, row, col })
        break
      case STATE.ATTR_START:
        this._type = 'attr'
        this._cache += char
        break
      case STATE.VERB_START:
        this._type = 'verb'
        this._cache += char
        break
      case STATE.VALUE_START:
        this._type = 'value'
        this._cache += char
        break
      // case STATE.ATTR_END:
      // case STATE.VALUE_PENDING:
      // case STATE.VALUE_END:
      case STATE.ATTR_PENDING:
      case STATE.VERB_PENDING:
        if (prevState === STATE.VERB_START) {
          this.lexicons.push({ type: this._type, value: this._cache, row, col })
          this._cache = ''
        }
        break
      default:
        this._lexicons.push({ type: this._type, value: this._cache, row, col })
        this._cache = ''
        break
    }

    this._state = state
  }
}

module.exports = Tokenizer
