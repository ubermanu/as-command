export type ParsedArgs = Map<string, string[]>
export type CommandHandler = (args: ParsedArgs) => void

export class Command {
  protected _version: string | null = null
  protected _options: Map<string, Option> = new Map()
  protected _handler: CommandHandler = () => {}

  constructor(protected name: string) {}

  /**
   * Set your command version.
   *
   * @example
   *   program.version('3.18.5')
   */
  version(version: string): Command {
    this._version = version
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
    this._handler(parseArgs(args))
  }

  /**
   * Returns a formatted help string, with the program name, version and
   * options.
   */
  help(): string {
    const options = this._options.values()
    let helpMsg = `Usage: ${this.name} [options] [arguments]`

    if (this._version) {
      helpMsg += `\n\nVersion: ${this._version as string}`
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
 * @example
 *   const parsedArgs = this.parseArgs(['-p', '8080', '-h', 'localhost', 'index.html']);
 *
 *   parsedArgs = Map {
 *   '-p' => [ '8080' ],
 *   '-h' => [ 'localhost' ],
 *   '_' => [ 'index.html' ]
 *   }
 */
export function parseArgs(args: string[]): ParsedArgs {
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
    } else if (arg.startsWith('-')) {
      currentOption = arg.slice(1)
      if (!parsedArgs.has(currentOption)) {
        parsedArgs.set(currentOption, [])
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
