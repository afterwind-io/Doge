const START = 'start'
const END = 'end'
const ERROR = 'error'
const OBJECT_START = 'object_start'
const OBJECT_END = 'object_end'
const ARRAY_START = 'array_start'
const ARRAY_END = 'array_end'
const ATTR_PENDING = 'attr_pending'
const ATTR_START = 'attr_start'
const ATTR_END = 'attr_end'
const VERB_PENDING = 'verb_pending'
const VERB_START = 'verb_start'
const VERB_END = 'verb_end'
const VALUE_PENDING = 'value_pending'
const VALUE_START = 'value_start'
const VALUE_END = 'value_end'
const SPREAD = 'spread'

const STATE_DEFS = new Set([
  START,
  END,
  ERROR,
  OBJECT_START,
  OBJECT_END,
  ARRAY_START,
  ARRAY_END,
  ATTR_PENDING,
  ATTR_START,
  ATTR_END,
  VERB_PENDING,
  VERB_START,
  VERB_END,
  VALUE_PENDING,
  VALUE_START,
  VALUE_END,
  SPREAD,
])

export default class State {
  public static START = 'start'
  public static END = 'end'
  public static ERROR = 'error'
  public static OBJECT_START = 'object_start'
  public static OBJECT_END = 'object_end'
  public static ARRAY_START = 'array_start'
  public static ARRAY_END = 'array_end'
  public static ATTR_PENDING = 'attr_pending'
  public static ATTR_START = 'attr_start'
  public static ATTR_END = 'attr_end'
  public static VERB_PENDING = 'verb_pending'
  public static VERB_START = 'verb_start'
  public static VERB_END = 'verb_end'
  public static VALUE_PENDING = 'value_pending'
  public static VALUE_START = 'value_start'
  public static VALUE_END = 'value_end'
  public static SPREAD = 'spread'

  public static hasState(char: string): boolean {
    return STATE_DEFS.has(char)
  }
}