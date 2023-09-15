/// <reference types="@as-pect/assembly/types/as-pect" />
import { Command } from '../assembly/command'
import { ParsedArgs } from '../assembly/parse-args'

describe('Command', () => {
  it('prints a simple help message', () => {
    const program = new Command('test')

    expect(program.help()).toBe(
      'Usage: test [options] [arguments]\n\nOptions:\n\t-h, --help\tPrints help message'
    )
  })

  it('prints a proper help message with description and version', () => {
    const program = new Command('test')
    program.description('A simple command line interface.')
    program.version('1.0.0')

    expect(program.help()).toBe(
      'Usage: test [options] [arguments]\n\nA simple command line interface.\n\nOptions:\n\t-h, --help\tPrints help message\n\t-v, --version\tPrints current version'
    )
  })

  it('prints a proper help message with options', () => {
    const program = new Command('test')

    program.option('-p, --peppers', 'Add peppers')
    program.option('-o, --onions', 'Add onions')
    program.option('-b, --bbq-sauce', 'Add bbq sauce')

    expect(program.help()).toBe(
      'Usage: test [options] [arguments]\n\nOptions:\n\t-h, --help\tPrints help message\n\t-p, --peppers\tAdd peppers\n\t-o, --onions\tAdd onions\n\t-b, --bbq-sauce\tAdd bbq sauce'
    )
  })

  it('filters out unknown options', () => {
    const program = new Command('test')

    program.action(function (args: ParsedArgs): void {
      expect(args.has('p')).toBe(false)
      expect(args.has('o')).toBe(false)
    })

    program.parse(['-p', '-o'])
  })
})
