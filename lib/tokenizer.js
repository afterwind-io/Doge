const chalk = require('chalk')
const Compass = require('./compass')
const { padRight } = require('./lib')

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

class TokenError extends Error {
  constructor ({
    message, row, col
  }) {
    super(`[Doge]<Token> ${message} @ ${row}:${col}`)
    this.row = row
    this.col = col
  }
}

class Tokenizer {
  constructor () {
    this.reset()
  }

  get state () {
    return this._state
  }

  getTokens (schema) {
    let raws = schema.split('')
    let length = raws.length

    for (let i = -1, char; ++i < length;) {
      char = raws[i]
      let stack = this.$read(char)

      if (stack.error !== void 0) {
        throw new TokenError({
          message: stack.error,
          row: this._compass.row,
          col: this._compass.col
        })
      }

      if (char !== SYMBOL_LINE_BREAK) {
        this._compass.next()
      } else {
        this._compass.wrap()
      }
    }
  }

  reset () {
    this._state = this._lastState = STATE_START
    this._compass === void 0
      ? this._compass = new Compass()
      : this._compass.reset()
  }

  $read (char) {
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
          error = `Unexpected token "${SYMBOL_END_ARRAY}"`
        }
        break
      case SYMBOL_START_OBJECT:
        if (state === STATE_START || state === STATE_ARRAY_START || state === STATE_ATTR_END) {
          this._state = STATE_OBJECT_START
        } else if (state === STATE_VALUE_START) {
          break
        } else {
          error = `Unexpected token "${SYMBOL_START_OBJECT}"`
        }
        break
      case SYMBOL_END_OBJECT:
        if (state === STATE_VALUE_END || state === STATE_VERB_START || state === STATE_ARRAY_END || state === STATE_SPREAD) {
          this._state = STATE_OBJECT_END
        } else if (state === STATE_VALUE_START) {
          break
        } else {
          error = `Unexpected token "${SYMBOL_END_OBJECT}"`
        }
        break
      case SYMBOL_ATTR_DEF:
        if (state === STATE_ATTR_START) {
          this._state = STATE_ATTR_END
        } else if (state === STATE_VALUE_START) {
          break
        } else {
          error = `Unexpected token "${SYMBOL_ATTR_DEF}"`
        }
        break
      case SYMBOL_HYPHEN:
        if (state === STATE_ATTR_END || state === STATE_VERB_START || state === STATE_VALUE_END) {
          this._state = STATE_VERB_PENDING
        } else if (state === STATE_VALUE_START) {
          break
        } else {
          error = `Unexpected token "${SYMBOL_HYPHEN}"`
        }
        break
      case SYMBOL_START_VALUE:
        if (state === STATE_VERB_START) {
          this._state = STATE_VALUE_PENDING
        } else {
          error = `Unexpected token "${SYMBOL_START_VALUE}"`
        }
        break
      case SYMBOL_END_VALUE:
        if (state === STATE_VALUE_START) {
          this._state = STATE_VALUE_END
        } else {
          error = `Unexpected token "${SYMBOL_END_VALUE}"`
        }
        break
      case SYMBOL_COMMA:
        if (state === STATE_VERB_START || state === STATE_VALUE_END || state === STATE_OBJECT_END || state === STATE_ARRAY_END) {
          this._state = STATE_ATTR_PENDING
        } else if (state === STATE_VALUE_START) {
          break
        } else {
          error = `Unexpected token ${SYMBOL_COMMA}`
        }
        break
      case SYMBOL_SPREAD:
        if (state === STATE_OBJECT_START || state === STATE_ATTR_PENDING) {
          this._state = STATE_SPREAD
        } else if (state === STATE_VALUE_START) {
          break
        } else {
          error = `Unexpected token ${SYMBOL_SPREAD}`
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
          error = `Unexpected token "${char}"`
        }
        break
    }

    // this._debugger.store(char, this._state)

    return {
      error,
      phase: this._state
    }
  }

  // $
}

module.exports = Tokenizer
