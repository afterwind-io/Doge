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
          currentAttr = token.value
          ref[currentAttr] = {}
          break
        case 'verb':
          currentVerb = token.value

          if (currentVerb === VERB.RAW) {
            ref[currentAttr][currentVerb] =
              this.$verbParse(currentVerb, currentAttr)
          }
          break
        case 'value':
          let value = token.value
          ref[currentAttr][currentVerb] =
            this.$verbParse(currentVerb, value)
          break
      }
    }

    return obj
  }

  $verbParse (verb, value) {
    switch (verb) {
      case 'type':
        return this.$parseVerbType(value)
      case 'in':
      case 'raw':
        return this.$parseVerbIn(value)
      case 'fold':
        return this.$parseVerbFold(value)
      default:
        throw new ParserError(`Unrecognized verb ${verb}`)
    }
  }

  $parseVerbType (value) {

  }

  $parseVerbIn (value) {
    // -in(a, b|c, d.e|f.g)
    return value.split(',').map(path => path.split('|'))
  }

  $parseVerbFold (value) {

  }
}

module.exports = Parser
