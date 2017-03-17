let Tokenizer = require('./lib/tokenizer')

let b = new Tokenizer(`{
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
}`).getTokens()

console.log(b)
