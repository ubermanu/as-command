import { Option } from './option'
import { parseArgs, ParsedArgs } from './parse-args'

export type CommandHandler = (args: ParsedArgs) => void
export type LogHandler = (message: string) => void

export class Command {
  protected _description: string | null
  protected _version: string | null
  protected _options: Map<string, Option>
  protected _handler: CommandHandler
  protected _log: LogHandler

  constructor(protected name: string) {
    this._description = null
    this._version = null
    this._options = new Map()
    this._handler = () => {}
    this._log = () => {}
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
    const ids = name.split(',').map((part: string) => part.trim())

    for (let i = 0; i < ids.length; i++) {
      const id = ids[i]
      if (!Option.validateIdentifier(id)) {
        throw new Error(`Invalid option name: "${id}"`)
      }
    }

    this._options.set(name, new Option(ids, description, defaultValue))
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

  /**
   * Attach the log handler.
   *
   * @example
   *   program.log((message: string) => console.log(message))
   */
  log(handler: LogHandler): Command {
    this._log = handler
    return this
  }

  /** Parse the arguments and call the command handler. */
  parse(args: string[]): void {
    const parsedArgs = parseArgs(args)

    if (parsedArgs.has('help') || parsedArgs.has('h')) {
      this._log(this.help())
      return
    }

    // Fore each options, check if it is present in the parsed arguments.
    // If it is, add it to the real arguments.
    // If it is not, check if it has a default value. If it does, add it to the
    // real arguments.
    // Also set the same values to all the identifiers of the option (if it has
    // multiple identifiers).
    // So if the parameters are `-p, --peppers` and you have it both, merge the
    // values.

    const realArgs: ParsedArgs = new Map()
    realArgs.set('_', parsedArgs.get('_'))

    const options = this._options.values()

    for (let i = 0; i < options.length; i++) {
      const option = options[i]
      const identifiers = option.identifiers.map((id: string) =>
        trimLeft(id, '-')
      )

      for (let j = 0; j < identifiers.length; j++) {
        const identifier = identifiers[j]
        if (parsedArgs.has(identifier)) {
          realArgs.set(identifier, parsedArgs.get(identifier))
        } else if (option.defaultValue.length > 0) {
          realArgs.set(identifier, option.defaultValue)
        }
      }
    }

    if (this._version && (realArgs.has('version') || realArgs.has('v'))) {
      this._log(this._version as string)
      return
    }

    this._handler(realArgs)
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

  /**
   * Returns a map of options with one of their identifiers as key. If an option
   * has multiple identifiers, it is returned multiple times.
   *
   * @example
   *   const options = this.getNamedOptions()
   *
   *   options = Map {
   *   'h' => Option,
   *   'help' => Option,
   *   'v' => Option,
   *   'version' => Option,
   *   }
   */
  protected getNamedOptions(): Map<string, Option> {
    const namedOptions: Map<string, Option> = new Map()
    const options = this._options.values()

    for (let i = 0; i < options.length; i++) {
      const option = options[i]
      const identifiers = option.identifiers.map((id: string) =>
        trimLeft(id, '-')
      )

      for (let j = 0; j < identifiers.length; j++) {
        const identifier = identifiers[j]
        namedOptions.set(identifier, option)
      }
    }

    return namedOptions
  }
}

function trimLeft(str: string, char: string = ' '): string {
  let i = 0
  while (i < str.length && str.charAt(i) === char) {
    i++
  }
  return str.slice(i)
}
