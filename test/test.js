const Tokenizer = require('../lib/tokenizer')
const expect = require('chai').expect
const schema = require('./schema_Tokenizer')

describe('D.O.G.E Unit Test', function () {
  describe('--Tokenizer', function () {
    let tokenizer = new Tokenizer()

    it('Grammar Check -- No empty object difinition', function () {
      try {
        tokenizer.reset()
        tokenizer.getTokens(schema.empty_object)
      } catch (e) {
        expect(e.row).to.equal(1)
        expect(e.col).to.equal(2)
      }
    })

    it('Grammar Check -- No empty array difinition', function () {
      try {
        tokenizer.reset()
        tokenizer.getTokens(schema.empty_array)
      } catch (e) {
        expect(e.row).to.equal(1)
        expect(e.col).to.equal(2)
      }
    })

    it('Grammar Check -- Verb should start with "-"', function () {
      try {
        tokenizer.reset()
        tokenizer.getTokens(schema.no_hyphen_before_verb)
      } catch (e) {
        expect(e.row).to.equal(2)
        expect(e.col).to.equal(6)
      }
    })

    it('Grammar Check -- Mutilple attributes should seperated by ","', function () {
      try {
        tokenizer.reset()
        tokenizer.getTokens(schema.mutil_attrs_without_comma)
      } catch (e) {
        expect(e.row).to.equal(3)
        expect(e.col).to.equal(3)
      }
    })

    it('Grammar Check -- Single attribute should not end with ","', function () {
      try {
        tokenizer.reset()
        tokenizer.getTokens(schema.single_attr_with_comma)
      } catch (e) {
        expect(e.row).to.equal(3)
        expect(e.col).to.equal(1)
      }
    })

    it('Grammar Check -- Array object difinition should always wrapped in "{ }"', function () {
      try {
        tokenizer.reset()
        tokenizer.getTokens(schema.array_without_brace)
      } catch (e) {
        expect(e.row).to.equal(2)
        expect(e.col).to.equal(7)
      }
    })

    it('Grammar Check -- Spread should be the last token in difinition', function () {
      try {
        tokenizer.reset()
        tokenizer.getTokens(schema.spread_before_content)
      } catch (e) {
        expect(e.row).to.equal(2)
        expect(e.col).to.equal(4)
      }
    })

    it('Grammar Check -- Most reserved symbols appeared in value are ok...for now', function () {
      tokenizer.reset()
      tokenizer.getTokens(schema.preserved_in_value)
    })

    it('Grammar Check -- "(" is not allowed in value', function () {
      try {
        tokenizer.reset()
        tokenizer.getTokens(schema.open_bracket_in_value)
      } catch (e) {
        expect(e.row).to.equal(2)
        expect(e.col).to.equal(21)
      }
    })

    it('Grammar Check -- ")" is not allowed in value', function () {
      try {
        tokenizer.reset()
        tokenizer.getTokens(schema.close_bracket_in_value)
      } catch (e) {
        expect(e.row).to.equal(2)
        expect(e.col).to.equal(22)
      }
    })

    it('Grammar Check -- Finally this full difinition should be all green', function () {
      tokenizer.reset()
      tokenizer.getTokens(schema.full_schema)
    })
  })
})
