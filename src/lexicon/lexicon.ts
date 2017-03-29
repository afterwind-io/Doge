export default class Lexicon {
  public readonly type: string;
  public readonly value: string;
  public readonly row: number;
  public readonly col: number;

  constructor(type: string, value: string, row: number, col: number) {
    this.type = type;
    this.value = value;
    this.row = row;
    this.col = col;
  }
}