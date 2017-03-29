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
  constructor (schema, typeDefs, foldDefs) {
    this._typeDefs = typeDefs
    this._foldDefs = foldDefs
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
            ref[currentAttr][VERB.IN] =
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

  $parseVerbType (raw) {
    let index = raw.indexOf(',')
    let type = index === -1
      ? raw
      : raw.slice(0, index)

    if (this._typeDefs[type] === void 0) {
      throw new ParserError(`Unrecognized type ${type}`)
    }

    if (index === -1) {
      return Object.assign({}, this._typeDefs[type])
    }

    let value = raw.slice(++index)
    if (type === 'string') {
      value = `"${value}"`
    }
    value = JSON.parse(value)

    return Object.assign({}, this._typeDefs[type], { fallback: value })
  }

  $parseVerbIn (value) {
    return value.split(',').map(path => path.split('|'))
  }

  $parseVerbFold (value) {
    return value.split(',').map(fn => {
      if (fn in this._foldDefs) {
        return this._foldDefs[fn]
      } else {
        throw new Parser(`Unrecognized fold function ${fn}`)
      }
    })
  }
}

module.exports = Parser
