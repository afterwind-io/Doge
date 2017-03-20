let Tokenizer = require('./lib/tokenizer')
let Parser = require('./lib/parser')

let a = new Tokenizer(`{
  a: -ty
  pe(string)
}`).getTokens()

let b = `{
  a: -type(string, wow) -raw -in(foo) -fold(bar, barz),
  aa: -type(object, {
    foo: '-doge*',
    bar: [1, 2, 3],
    barz: { wow: 42}
  }),
  ab: -type(array, [1, 2, 3]),
  ac: -type(number, -42),
  ad: -type(boolean, true),
  b: {
    foo: -raw
  },
  bb: {
    foo: -raw,
    bar: -in(foo)
  },
  d: [{ e: -in(f) }],
  *
}`

let tokenizer = new Tokenizer(b)
let parser = new Parser()

console.log(parser.parse(tokenizer.getTokens()))
