import chalk = require("chalk");
import State from "./state";
import Symbol from "./symbol";
import Token from "./token";
import { padRight } from "./util";

export default class Debugger {
  private _map: string[][];
  private _enableStyling: boolean;

  constructor(schema: string) {
    this.reset(schema);
  }

  public reset(schema: string) {
    this._map = this.$split(schema);
    this._enableStyling = true;
  }

  public store({ char, state, row, col }: Token) {
    const byte = this._enableStyling
      ? this.$style(char, state)
      : char;

    this._map[row].splice(col, 1, byte);
  }

  protected $locate(row: number, col: number, length = 1) {
    console.log(this._map
      .slice(0, row + 1)
      .map((line, index) => `${padRight((++index).toString(), 3)}| `.concat(line.join("")))
      .join("")
      .concat(" ".repeat(5 + col))
      .concat(chalk.bold("^".repeat(length))),
    );
  }

  private $split(schema: string): string[][] {
    return schema
      .split(Symbol.LINE_BREAK)
      .map((row) => row.concat(Symbol.LINE_BREAK).split(""));
  }

  private $style(char: string, state: string) {
    if (state === State.ATTR_START) {
      return chalk.yellow(char);
    } else if (state === State.VERB_START) {
      return chalk.magenta(char);
    } else if (state === State.VALUE_START) {
      return chalk.green(char);
    } else if (Symbol.isReservedSymbol(char)) {
      return chalk.white(char);
    } else {
      return chalk.red(char);
    }
  }
}
