exports.empty_object = `{}`

exports.empty_array = `[]`

exports.no_hyphen_before_verb = `{
  a: type(string)
}`

exports.mutil_attrs_without_comma = `{
  a: -type(string)
  b: -raw
}`

exports.single_attr_with_comma = `{
  a: -type(string),
}`

exports.array_without_brace = `{
  a: [foo: -type(string)]
}`

exports.spread_before_content = `{
  *,
  a: -raw
}`

// exports.preserved_in_value = `{
//   a: -in(a[]{}:-,*)
// }`

exports.open_bracket_in_value = `{
  a: -type(string, w(w)
}`

exports.close_bracket_in_value = `{
  a: -type(string, w)w)
}`

exports.full_schema = `{
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
