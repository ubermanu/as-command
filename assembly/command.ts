export type ParsedArgs = Map<string, string[]>
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

  /** Attach the handler. */
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

/**
 * Construct a map of parsed arguments. Regroup every option into a map. For the
 * arguments, they are stored into the `_` key.
 *
 * The `booleans` argument is used to specify which options are boolean. If an
 * option is boolean, it will stop looking for a value after it.
 *
 * @example
 *   const parsedArgs = this.parseArgs(['-p', '8080', '-h', 'localhost', 'index.html']);
 *
 *   parsedArgs = Map {
 *   '-p' => [ '8080' ],
 *   '-h' => [ 'localhost' ],
 *   '_' => [ 'index.html' ]
 *   }
 */
export function parseArgs(args: string[], booleans: string[] = []): ParsedArgs {
  const parsedArgs: ParsedArgs = new Map()
  parsedArgs.set('_', [])

  let currentOption: string | null = null

  // Every argument that starts with a dash is an option.
  // Can start with one or two dashes.
  // Can have multiple times the same option.
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg.startsWith('--')) {
      currentOption = arg.slice(2)
      if (!parsedArgs.has(currentOption)) {
        parsedArgs.set(currentOption, [])
      }
      if (booleans.includes(currentOption)) {
        currentOption = null
      }
    } else if (arg.startsWith('-')) {
      currentOption = arg.slice(1)
      if (currentOption.length > 1) {
        // Handle stacked short options
        for (let j = 0; j < currentOption.length; j++) {
          const option = currentOption.charAt(j)
          if (!parsedArgs.has(option)) {
            parsedArgs.set(option, [])
          }
        }
        currentOption = null
      } else if (!parsedArgs.has(currentOption)) {
        parsedArgs.set(currentOption, [])
      }
      if (currentOption && booleans.includes(currentOption)) {
        currentOption = null
      }
    } else if (currentOption) {
      const option = parsedArgs.get(currentOption)
      option.push(arg)
      parsedArgs.set(currentOption, option)
      currentOption = null
    } else {
      if (!parsedArgs.has('_')) {
        parsedArgs.set('_', [])
      }
      const option = parsedArgs.get('_')
      option.push(arg)
      parsedArgs.set('_', option)
    }
  }

  return parsedArgs
}
