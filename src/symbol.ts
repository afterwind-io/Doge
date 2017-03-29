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
  SPREAD,
])

export default class Symbol {
  public static readonly START_OBJECT = START_OBJECT
  public static readonly END_OBJECT = END_OBJECT
  public static readonly START_ARRAY = START_ARRAY
  public static readonly END_ARRAY = END_ARRAY
  public static readonly START_VALUE = START_VALUE
  public static readonly END_VALUE = END_VALUE
  public static readonly ATTR_DEF = ATTR_DEF
  public static readonly COMMA = COMMA
  public static readonly HYPHEN = HYPHEN
  public static readonly SPREAD = SPREAD
  public static readonly LINE_BREAK = LINE_BREAK
  public static readonly SPACE = SPACE

  public static isReservedSymbol(char: string): boolean {
    return RESERVED_SYMBOLS.has(char)
  }
}