const Tokenizer = require('../lib/tokenizer')
const expect = require('chai').expect
const schema = require('./schema_Tokenizer')

describe('D.O.G.E Unit Test', function () {
  describe('--Tokenizer', function () {
    let tokenizer = new Tokenizer('')

    it('Grammar Check -- No empty object difinition', function () {
      try {
        tokenizer.reset(schema.empty_object).getTokens()
      } catch (e) {
        expect(e.row).to.equal(1)
        expect(e.col).to.equal(2)
      }
    })

    it('Grammar Check -- No empty array difinition', function () {
      try {
        tokenizer.reset(schema.empty_array).getTokens()
      } catch (e) {
        expect(e.row).to.equal(1)
        expect(e.col).to.equal(2)
      }
    })

    it('Grammar Check -- Verb should start with "-"', function () {
      try {
        tokenizer.reset(schema.no_hyphen_before_verb).getTokens()
      } catch (e) {
        expect(e.row).to.equal(2)
        expect(e.col).to.equal(6)
      }
    })

    it('Grammar Check -- Mutilple attributes should seperated by ","', function () {
      try {
        tokenizer.reset(schema.mutil_attrs_without_comma).getTokens()
      } catch (e) {
        expect(e.row).to.equal(3)
        expect(e.col).to.equal(3)
      }
    })

    it('Grammar Check -- Single attribute should not end with ","', function () {
      try {
        tokenizer.reset(schema.single_attr_with_comma).getTokens()
      } catch (e) {
        expect(e.row).to.equal(3)
        expect(e.col).to.equal(1)
      }
    })

    it('Grammar Check -- Array object difinition should always wrapped in "{ }"', function () {
      try {
        tokenizer.reset(schema.array_without_brace).getTokens()
      } catch (e) {
        expect(e.row).to.equal(2)
        expect(e.col).to.equal(7)
      }
    })

    it('Grammar Check -- Spread should be the last token in difinition', function () {
      try {
        tokenizer.reset(schema.spread_before_content).getTokens()
      } catch (e) {
        expect(e.row).to.equal(2)
        expect(e.col).to.equal(4)
      }
    })

    it('Grammar Check -- "(" is not allowed in value', function () {
      try {
        tokenizer.reset(schema.open_bracket_in_value).getTokens()
      } catch (e) {
        expect(e.row).to.equal(2)
        expect(e.col).to.equal(21)
      }
    })

    it('Grammar Check -- ")" is not allowed in value', function () {
      try {
        tokenizer.reset(schema.close_bracket_in_value).getTokens()
      } catch (e) {
        expect(e.row).to.equal(2)
        expect(e.col).to.equal(22)
      }
    })

    it('Grammar Check -- Finally this full difinition should be all green', function () {
      tokenizer.reset(schema.full_schema).getTokens()
    })
  })
})
