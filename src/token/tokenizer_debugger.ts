import Debugger from "../debugger";
import Token from "../token";
import TokenError from "./tokenizer_error";

export default class TokenizerDebugger extends Debugger {
  public debug(token: Token, error: string = "") {
    this.$locate(token.row, token.col);

    const row = token.row + 1;
    const col = token.col + 1;
    throw new TokenError(error, row, col);
  }
}
