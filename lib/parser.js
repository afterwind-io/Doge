const SYMBOL = require('./symbols')
const STATE = require('./states')
const VERB = require('./verbs')
const chalk = require('chalk')
const Debugger = require('./debugger')

class ParserError extends Error {

}

class ParserDebugger extends Debugger {

}

class Parser {
  constructor (schema) {

  }

  parse (tokens) {
    let depth = 0
    let currentAttr = ''
    let currentVerb = ''
    let obj
    let ref

    let length = tokens.length
    for (var i = -1, token; ++i < length;) {
      token = tokens[i]

      switch (token.type) {
        case 'symbol':
          if (token.value === SYMBOL.START_OBJECT) {
            if (obj === void 0) {
              ref = obj = {}
            } else {
              let parent = ref

              if (parent.constructor === Array) {
                ref = { '__parent__': parent['__parent__'] }
                parent.push(ref)
              } else {
                ref = parent[currentAttr] = { '__parent__': parent }
              }
            }
            depth++
          } else if (token.value === SYMBOL.END_OBJECT) {
            ref = ref['__parent__']
            depth--
          } else if (token.value === SYMBOL.START_ARRAY) {
            if (obj === void 0) {
              ref = obj = []
            } else {
              let parent = ref
              ref = obj[currentAttr] = []
              ref['__parent__'] = parent
            }
          } else if (token.value === SYMBOL.END_ARRAY) {

          } else if (token.value === SYMBOL.SPREAD) {
            ref['__spread__'] = true
          }
          break
        case 'attr':
          let attr = token.value
          currentAttr = attr
          ref[currentAttr] = {}
          break
        case 'verb':
          let verb = token.value

          if (!VERB.isReservedVerb(verb)) {
            throw new ParserError(`Unrecognized verb ${verb}`)
          }

          currentVerb = verb
          ref[currentAttr][currentVerb] = ''
          break
        case 'value':
          let value = token.value
          ref[currentAttr][currentVerb] = value
          break
      }
    }

    return obj
  }
}

module.exports = Parser
