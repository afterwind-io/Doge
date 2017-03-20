const TYPE = 'type'
const IN = 'in'
const RAW = 'raw'
const FOLD = 'fold'

const RESERVED_VERBS = new Set([
  TYPE,
  IN,
  RAW,
  FOLD
])

module.exports = {
  TYPE,
  IN,
  RAW,
  FOLD,

  isReservedVerb (verb) {
    return RESERVED_VERBS.has(verb)
  }
}
