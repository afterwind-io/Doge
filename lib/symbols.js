const START_OBJECT = '{'
const END_OBJECT = '}'
const START_ARRAY = '['
const END_ARRAY = ']'
const START_VALUE = '('
const END_VALUE = ')'
const ATTR_DEF = ':'
const COMMA = ','
const HYPHEN = '-'
const SPREAD = '*'
const LINE_BREAK = '\n'
const SPACE = ' '

const RESERVED_SYMBOLS = new Set([
  START_OBJECT,
  END_OBJECT,
  START_ARRAY,
  END_ARRAY,
  START_VALUE,
  END_VALUE,
  ATTR_DEF,
  COMMA,
  HYPHEN,
  SPREAD
])

module.exports = {
  START_OBJECT,
  END_OBJECT,
  START_ARRAY,
  END_ARRAY,
  START_VALUE,
  END_VALUE,
  ATTR_DEF,
  COMMA,
  HYPHEN,
  SPREAD,
  LINE_BREAK,
  SPACE,

  isReservedSymbol (char) {
    return RESERVED_SYMBOLS.has(char)
  }
}
