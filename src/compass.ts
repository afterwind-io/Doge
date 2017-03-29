export default class Compass {
  private _row: number = 0
  private _col: number = 0

  get row() {
    return this._row
  }

  get col() {
    return this._col
  }

  public reset() {
    this._row = 0
    this._col = 0
    return this
  }

  public next(step: number = 1) {
    this._col += step
    return this
  }

  public wrap() {
    this._col = 0
    this._row ++
    return this
  }
}