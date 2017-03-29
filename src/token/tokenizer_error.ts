enum TokenErrorCodes {
  unknown = -1,
  no_empty_array = 1000,
  no_empty_object = 1100,
}

export default class TokenError extends Error {
  public readonly row: number;
  public readonly col: number;
  public readonly code: TokenErrorCodes;

  constructor(error: string, row: number, col: number, code?: TokenErrorCodes) {
    super(`[Doge]<Token> ${error} @ ${row}:${col}`);
    this.row = row;
    this.col = col;
    this.code = code;
  }
}
