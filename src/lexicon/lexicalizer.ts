import State from "../state";
import Symbol from "../symbol";
import Token from "../token";
import Lexicon from "./lexicon";

export default class Lexicalizer {
  private lexicons: Lexicon[];
  private state: string;
  private type: string;
  private cache: string;

  constructor() {
    this.reset();
  }

  public reset() {
    this.state = State.START;
    this.type = "symbol";
    this.cache = "";
    this.lexicons = [];
  }

  public push({ char, state, row, col }: Token) {
    const prevState = this.state;

    if (char === Symbol.SPACE || char === Symbol.LINE_BREAK) {
      return;
    }

    if (state === prevState) {
      this.cache += char;
      return;
    }

    switch (state) {
      case State.OBJECT_END:
        if (prevState === State.VERB_START) {
          this.lexicons.push(new Lexicon(this.type, this.cache, row, col));
          this.cache = "";
        }
        this.lexicons.push(new Lexicon("symbol", char, row, col));
        break;
      case State.OBJECT_START:
      case State.ARRAY_START:
      case State.ARRAY_END:
      case State.SPREAD:
        this.lexicons.push(new Lexicon("symbol", char, row, col));
        break;
      case State.ATTR_START:
        this.type = "attr";
        this.cache += char;
        break;
      case State.VERB_START:
        this.type = "verb";
        this.cache += char;
        break;
      case State.VALUE_START:
        this.type = "value";
        this.cache += char;
        break;
      // case State.ATTR_END:
      // case State.VALUE_PENDING:
      // case State.VALUE_END:
      case State.ATTR_PENDING:
      case State.VERB_PENDING:
        if (prevState === State.VERB_START) {
          this.lexicons.push(new Lexicon(this.type, this.cache, row, col));
          this.cache = "";
        }
        break;
      default:
        this.lexicons.push(new Lexicon(this.type, this.cache, row, col));
        this.cache = "";
        break;
    }

    this.state = state;
  }

  public pop(): Lexicon[] {
    return this.lexicons;
  }
}
