const Compass = require('../lib/compass').default
const Tokenizer = require('../lib/token/tokenizer').default
const expect = require('chai').expect
const schema = require('./schema_Tokenizer')

const catchError = function (fn, constructor = Error) {
  try {
    fn()
  } catch (e) {
    expect(e).instanceof(constructor)
    return e
  }
  expect('NO_ERROR_THROWED').instanceof(constructor)
}

describe('D.O.G.E Unit Test', function () {
  describe('--Compass', function () {
    let compass = new Compass()

    it('Should start with 0:0', function () {
      expect(compass.row).equal(0)
      expect(compass.col).equal(0)
    })

    it('Should arrive at 0:1 when call next()', function () {
      compass.next()
      expect(compass.row).equal(0)
      expect(compass.col).equal(1)
    })

    it('Should arrive at 0:3 when call next(2)', function () {
      compass.next(2)
      expect(compass.row).equal(0)
      expect(compass.col).equal(3)
    })

    it('Should arrive at 1:0 when call wrap()', function () {
      compass.wrap()
      expect(compass.row).equal(1)
      expect(compass.col).equal(0)
    })

    it('Should arrive back at 0:0 after call reset()', function () {
      compass.reset()
      expect(compass.row).equal(0)
      expect(compass.col).equal(0)
    })
  })

  describe('--Tokenizer', function () {
    let tokenizer = new Tokenizer('')

    it('Grammar Check -- No empty object difinition', function () {
      let error = catchError(
        () => tokenizer.reset(schema.empty_object).getTokens())
      expect(error).property('row').equal(1)
      expect(error).property('col').equal(2)
    })

    it('Grammar Check -- No empty array difinition', function () {
      let error = catchError(
        () => tokenizer.reset(schema.empty_array).getTokens())
      expect(error).property('row').equal(1)
      expect(error).property('col').equal(2)
    })

    it('Grammar Check -- Verb should start with "-"', function () {
      let error = catchError(
        () => tokenizer.reset(schema.no_hyphen_before_verb).getTokens())
      expect(error).property('row').equal(2)
      expect(error).property('col').equal(6)
    })

    it('Grammar Check -- Mutilple attributes should seperated by ","', function () {
      let error = catchError(
        () => tokenizer.reset(schema.mutil_attrs_without_comma).getTokens())
      expect(error).property('row').equal(3)
      expect(error).property('col').equal(3)
    })

    it('Grammar Check -- Single attribute should not end with ","', function () {
      let error = catchError(
        () => tokenizer.reset(schema.single_attr_with_comma).getTokens())
      expect(error).property('row').equal(3)
      expect(error).property('col').equal(1)
    })

    it('Grammar Check -- Array object difinition should always wrapped in "{ }"', function () {
      let error = catchError(
        () => tokenizer.reset(schema.array_without_brace).getTokens())
      expect(error).property('row').equal(2)
      expect(error).property('col').equal(7)
    })

    it('Grammar Check -- Spread should be the last token in difinition', function () {
      let error = catchError(
        () => tokenizer.reset(schema.spread_before_content).getTokens())
      expect(error).property('row').equal(2)
      expect(error).property('col').equal(4)
    })

    it('Grammar Check -- "(" is not allowed in value', function () {
      let error = catchError(
        () => tokenizer.reset(schema.open_bracket_in_value).getTokens())
      expect(error).property('row').equal(2)
      expect(error).property('col').equal(21)
    })

    it('Grammar Check -- ")" is not allowed in value', function () {
      let error = catchError(
        () => tokenizer.reset(schema.close_bracket_in_value).getTokens())
      expect(error).property('row').equal(2)
      expect(error).property('col').equal(22)
    })

    it('Grammar Check -- No line break in attribute difinition', function () {
      let error = catchError(
        () => tokenizer.reset(schema.line_break_in_attr).getTokens())
      expect(error).property('row').equal(2)
      expect(error).property('col').equal(12)
    })

    /**
     * 【待定】无法正确检测-raw之后直接换行的情况
     */
    // it('Grammar Check -- No line break in verb difinition', function () {
    //   let error = catchError(
    //     () => tokenizer.reset(schema.line_break_in_verb).getTokens())
    //   expect(error).property('row').equal(2)
    //   expect(error).property('col').equal(9)
    // })

    it('Grammar Check -- Finally this full difinition should be all green', function () {
      tokenizer.reset(schema.full_schema).getTokens()
    })
  })
})
