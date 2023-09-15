export type ParsedArgs = Map<string, string[]>

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
    if (arg === '--') {
      // Stop parsing options after this
      currentOption = null
    } else if (arg.startsWith('--')) {
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
