const chalk = require('chalk')
const SYMBOL = require('./symbols')
const STATE = require('./states')
const { padRight } = require('./lib')

module.exports = class Debugger {
  constructor (schema) {
    this.reset(schema)
  }

  reset (schema) {
    this._map = this.$split(schema)
    this._enableStyling = true
  }

  store ({ char, state, row, col }) {
    let byte = this._enableStyling
      ? this.$style(char, state)
      : char

    this._map[row].splice(col, 1, byte)
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

  $locate (row, col, length = 1) {
    console.log(this._map
      .slice(0, row + 1)
      .map((line, index) => `${padRight(++index, 3)}| `.concat(line.join('')))
      .join('')
      .concat(' '.repeat(5 + col))
      .concat(chalk.bold('^'.repeat(length)))
    )
  }
}
