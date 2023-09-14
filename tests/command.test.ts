/// <reference types="@as-pect/assembly/types/as-pect" />
import { Command, parseArgs } from '../assembly/command'

describe('Program', () => {
  it('prints a simple help message', () => {
    const program = new Command('test')

    expect(program.help()).toBe('Usage: test [options] [arguments]')
  })

  it('prints a proper help message with description and version', () => {
    const program = new Command('test')
    program.description('A simple command line interface.')
    program.version('1.0.0')

    expect(program.help()).toBe(
        'Usage: test [options] [arguments]\n\nA simple command line interface.\n\nVersion: 1.0.0'
    )
  })

  it('prints a proper help message with options', () => {
    const program = new Command('test')

    program.option('-p, --peppers', 'Add peppers')
    program.option('-o, --onions', 'Add onions')
    program.option('-b, --bbq-sauce', 'Add bbq sauce')

    expect(program.help()).toBe(
      'Usage: test [options] [arguments]\n\nOptions:\n\t-p, --peppers\tAdd peppers\n\t-o, --onions\tAdd onions\n\t-b, --bbq-sauce\tAdd bbq sauce'
    )
  })

  it('parses options with arguments', () => {
    const args = parseArgs(['-p', '-o', 'foo', 'bar'])

    expect(args.has('p')).toBe(true)
    expect(args.get('p').length).toBe(0)

    expect(args.has('o')).toBe(true)
    expect(args.get('o').length).toBe(1)
    expect(args.get('o')).toInclude('foo')

    expect(args.has('_')).toBe(true)
    expect(args.get('_').length).toBe(1)
    expect(args.get('_')).toInclude('bar')
  })

  it('parses long options with arguments', () => {
    const args = parseArgs(['--peppers', '--onions', 'foo', 'bar'])

    expect(args.has('peppers')).toBe(true)
    expect(args.get('peppers').length).toBe(0)

    expect(args.has('onions')).toBe(true)
    expect(args.get('onions').length).toBe(1)
    expect(args.get('onions')).toInclude('foo')

    expect(args.has('_')).toBe(true)
    expect(args.get('_').length).toBe(1)
    expect(args.get('_')).toInclude('bar')
  })

  it('parses many arguments', () => {
    const args = parseArgs(['foo', 'bar', 'baz'])

    expect(args.has('_')).toBe(true)
    expect(args.get('_').length).toBe(3)
    expect(args.get('_')).toInclude('foo')
    expect(args.get('_')).toInclude('bar')
    expect(args.get('_')).toInclude('baz')
  })
})
