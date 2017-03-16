exports.empty_object = `{}`

exports.empty_array = `[]`

exports.no_hyphen_before_verb = `{
  a: type(string)
}`

exports.spread_before_content = `{
  *,
  a: -raw
}`

exports.full_schema = `{
  a: -type(string, wow) -raw -in(foo) -fold(bar, barz),
  aa: -type(object, {
    foo: 'doge'
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
