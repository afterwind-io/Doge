const Tokenizer = require('../lib/tokenizer')
const expect = require('chai').expect
const schema = require('./schema_Tokenizer')

describe('D.O.G.E Unit Test', function () {
  describe('--Tokenizer1', function () {
    let tokenizer = new Tokenizer()

    it('Init', function () {
      expect(tokenizer.state).to.equal('start')
    })

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

    it('Grammar Check -- Spread should be the last token in difinition', function () {
      try {
        tokenizer.reset()
        tokenizer.getTokens(schema.spread_before_content)
      } catch (e) {
        expect(e.row).to.equal(2)
        expect(e.col).to.equal(4)
      }
    })

    it('Grammar Check -- And this full difinition should be all green', function () {
      tokenizer.reset()
      tokenizer.getTokens(schema.full_schema)
    })
  })
})
