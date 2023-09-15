import { parseArgs, ParsedArgs } from './parse-args'

export type CommandHandler = (args: ParsedArgs) => void

export class Command {
  protected _description: string | null = null
  protected _version: string | null = null
  protected _options: Map<string, Option> = new Map()
  protected _handler: CommandHandler = () => {}

  constructor(protected name: string) {
    this.option('-h, --help', 'Prints help message')
  }

  /**
   * Set your command description.
   *
   * @example
   *   program.description('A simple command line interface.')
   */
  description(description: string): Command {
    this._description = description
    return this
  }

  /**
   * Set your command version. Also prints the version when the `-v` or
   * `--version` flag is used.
   *
   * @example
   *   program.version('3.18.5')
   */
  version(version: string): Command {
    this._version = version
    this.option('-v, --version', 'Prints current version')
    return this
  }

  /**
   * @example
   *   program.option('-p, --peppers', 'Add peppers')
   */
  option(
    name: string,
    description: string,
    defaultValue: string[] = []
  ): Command {
    this._options.set(name, new Option(name, description, defaultValue))
    return this
  }

  /**
   * Attach the command handler.
   *
   * @example
   *   program.action((args: ParsedArgs) => {
   *     if (args.has('name')) {
   *       console.log(`Hello ${args.get('name')}`)
   *     }
   *   })
   */
  action(handler: CommandHandler): Command {
    this._handler = handler
    return this
  }

  parse(args: string[]): void {
    const parsedArgs = parseArgs(args)

    if (parsedArgs.has('help') || parsedArgs.has('h')) {
      console.log(this.help())
      return
    }

    if (this._version && (parsedArgs.has('version') || parsedArgs.has('v'))) {
      console.log(this._version as string)
      return
    }

    const argKeys = parsedArgs.keys()

    for (let i = 0; i < argKeys.length; i++) {
      const key = argKeys[i]
      if (this._options.has(key) === false) {
        // Filter out unknown options
        parsedArgs.delete(key)
      } else if (parsedArgs.get(key).length === 0 && this._options.has(key)) {
        // Set default value if no value is provided
        parsedArgs.set(key, this._options.get(key).defaultValue)
      }
    }

    this._handler(parsedArgs)
  }

  /**
   * Returns a formatted help string, with the program name, version and
   * options.
   */
  help(): string {
    const options = this._options.values()
    let helpMsg = `Usage: ${this.name} [options] [arguments]`

    if (this._description) {
      helpMsg += `\n\n${this._description as string}`
    }

    if (options.length > 0) {
      const optionsHelp = options
        .map<string>((option) => {
          return `\t${option.name}\t${option.description}`
        })
        .join('\n')

      helpMsg += `\n\nOptions:\n${optionsHelp}`
    }

    return helpMsg
  }
}

// TODO: Use generics
export class Option {
  constructor(
    public name: string,
    public description: string,
    public defaultValue: string[] = []
  ) {}
}
