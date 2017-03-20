const chalk = require('chalk')
const Debugger = require('./debugger')
const Tokenizer = require('./tokenizer')
const Parser = require('./parser')

class DogeError extends Error {

}

class DogeDebugger extends Debugger {

}

class Doge {
  constructor (schema) {
    this._debugger = new DogeDebugger()
    this._tokenizer = new Tokenizer(schema)
    this._parser = new Parser(schema)
  }

  static schema (schema) {
    return new Doge(schema)
  }

  parse (source, target) {

  }
}
