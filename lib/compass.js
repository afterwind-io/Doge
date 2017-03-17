class Compass {
  constructor () {
    this.reset()
  }

  get row () {
    return this._row
  }

  get col () {
    return this._col
  }

  reset () {
    this._row = 0
    this._col = 0
    return this
  }

  next (step = 1) {
    this._col += step
    return this
  }

  wrap () {
    this._col = 0
    this._row ++
    return this
  }
}

module.exports = Compass
