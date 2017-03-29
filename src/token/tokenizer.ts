import Compass from "../compass";
import Lexicalizer from "../lexicon/lexicalizer";
import Lexicon from "../lexicon/lexicon";
import State from "../state";
import Symbol from "../symbol";
import Token from "../token";
import TokenizerDebugger from "./tokenizer_debugger";
import TokenizerError from "./tokenizer_error";

export default class Tokenizer {
  private schema: string;
  private compass: Compass;
  private lexicalizer: Lexicalizer;
  private debugger: TokenizerDebugger;
  private state: string;

  constructor(schema: string) {
    this.reset(schema);
  }

  public getTokens(): Lexicon[] {
    const raws = this.schema.split("");
    const length = raws.length;

    for (let i = -1, char; ++i < length; ) {
      char = raws[i];

      const error = this.$read(char);
      this.$debug(char, error);
      this.$join(char);

      if (char !== Symbol.LINE_BREAK) {
        this.compass.next();
      } else {
        this.compass.wrap();
      }
    }

    return this.lexicalizer.pop();
  }

  public reset(schema: string) {
    if (schema !== void 0) {
      this.schema = schema;
    }

    this.state = State.START;
    this.compass === void 0
      ? this.compass = new Compass()
      : this.compass.reset();
    this.lexicalizer === void 0
      ? this.lexicalizer = new Lexicalizer()
      : this.lexicalizer.reset();
    this.debugger === void 0
      ? this.debugger = new TokenizerDebugger(this.schema)
      : this.debugger.reset(this.schema);
    return this;
  }

  private $read(char: string) {
    const state = this.state;
    let error: string = void 0;

    switch (char) {
      case Symbol.START_ARRAY:
        if (state === State.START || state === State.ATTR_END) {
          this.state = State.ARRAY_START;
        } else if (state === State.VALUE_START) {
          break;
        } else {
          error = `Unexpected token "${Symbol.START_ARRAY}"`;
        }
        break;
      case Symbol.END_ARRAY:
        if (state === State.OBJECT_END) {
          this.state = State.ARRAY_END;
        } else if (state === State.ARRAY_START) {
          error = `No empty array allowed. (no-empty-array)`;
        } else if (state === State.VALUE_START) {
          break;
        } else {
          error = `Unexpected token "${Symbol.END_ARRAY}"`;
        }
        break;
      case Symbol.START_OBJECT:
        if (state === State.START || state === State.ARRAY_START || state === State.ATTR_END) {
          this.state = State.OBJECT_START;
        } else if (state === State.VALUE_START) {
          break;
        } else {
          error = `Unexpected token "${Symbol.START_OBJECT}"`;
        }
        break;
      case Symbol.END_OBJECT:
        if (state === State.VALUE_END || state === State.VERB_START || state === State.ARRAY_END || state === State.SPREAD) {
          this.state = State.OBJECT_END;
        } else if (state === State.OBJECT_END || state === State.VALUE_START) {
          break;
        } else if (state === State.OBJECT_START) {
          error = `No empty object allowed. (no-empty-object)`;
        } else {
          error = `Unexpected token "${Symbol.END_OBJECT}"`;
        }
        break;
      case Symbol.ATTR_DEF:
        if (state === State.ATTR_START) {
          this.state = State.ATTR_END;
        } else if (state === State.VALUE_START) {
          break;
        } else {
          error = `Unexpected token "${Symbol.ATTR_DEF}"`;
        }
        break;
      case Symbol.HYPHEN:
        if (state === State.ATTR_END || state === State.VERB_START || state === State.VALUE_END) {
          this.state = State.VERB_PENDING;
        } else if (state === State.VALUE_START) {
          break;
        } else {
          error = `Unexpected token "${Symbol.HYPHEN}"`;
        }
        break;
      case Symbol.START_VALUE:
        if (state === State.VERB_START) {
          this.state = State.VALUE_PENDING;
        } else {
          error = `Unexpected token "${Symbol.START_VALUE}"`;
        }
        break;
      case Symbol.END_VALUE:
        if (state === State.VALUE_START) {
          this.state = State.VALUE_END;
        } else {
          error = `Unexpected token "${Symbol.END_VALUE}"`;
        }
        break;
      case Symbol.COMMA:
        if (state === State.VERB_START || state === State.VALUE_END || state === State.OBJECT_END || state === State.ARRAY_END) {
          this.state = State.ATTR_PENDING;
        } else if (state === State.VALUE_START) {
          break;
        } else {
          error = `Unexpected token ${Symbol.COMMA}`;
        }
        break;
      case Symbol.SPREAD:
        if (state === State.OBJECT_START || state === State.ATTR_PENDING) {
          this.state = State.SPREAD;
        } else if (state === State.VALUE_START) {
          break;
        } else {
          error = `Unexpected token ${Symbol.SPREAD}`;
        }
        break;
      case Symbol.LINE_BREAK:
        if (state === State.ATTR_START) {
          error = `There should be no line break within attribute difinition. (no-line-break-in-attribute)`;
        }
        break;
      case Symbol.SPACE:
        break;
      default:
        if (state === State.OBJECT_START || state === State.ATTR_PENDING) {
          this.state = State.ATTR_START;
        } else if (state === State.VERB_PENDING) {
          this.state = State.VERB_START;
        } else if (state === State.VALUE_PENDING) {
          this.state = State.VALUE_START;
        } else if (state === State.ATTR_START || state === State.VERB_START || state === State.VALUE_START) {
          break;
        } else if (state === State.SPREAD) {
          error = `There should be no content except "${Symbol.END_OBJECT}" after "${Symbol.SPREAD}". (none-after-spread)`;
        } else {
          error = `Unexpected token "${char}"`;
        }
        break;
    }

    return error;
  }

  private $join(char: string) {
    const state = this.state;
    const row = this.compass.row;
    const col = this.compass.col;

    this.lexicalizer.push({char, state, row, col});
  }

  private $debug(char: string, error: string) {
    const state = this.state;
    const row = this.compass.row;
    const col = this.compass.col;

    this.debugger.store(new Token(char, state, row, col));

    if (error !== void 0) {
      this.debugger.debug(new Token(char, state, row, col), error);
    }
  }
}
