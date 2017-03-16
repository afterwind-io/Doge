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
    this._row = 1
    this._col = 1
  }

  next (step = 1) {
    this._col += step
  }

  wrap () {
    this._col = 1
    this._row ++
  }
}

module.exports = Compass
