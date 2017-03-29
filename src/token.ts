import State from "./state";

export default class Token {
  public readonly char: string;
  public readonly state: string;
  public readonly row: number;
  public readonly col: number;

  constructor(char: string, state: string, row: number = 0, col: number = 0) {
    this.char = char;
    this.row = row;
    this.col = col;

    if (State.hasState(state)) {
      this.state = state;
    } else {
      throw new Error(`No Such state "${state}"`);
    }
  }
}
