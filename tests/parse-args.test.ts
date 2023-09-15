/// <reference types="@as-pect/assembly/types/as-pect" />
import { parseArgs } from '../assembly/parse-args'

describe('parseArgs', () => {
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

  it('parses stacked short options', () => {
    const args = parseArgs(['-pfo'])

    expect(args.has('p')).toBe(true)
    expect(args.get('p').length).toBe(0)

    expect(args.has('f')).toBe(true)
    expect(args.get('f').length).toBe(0)

    expect(args.has('o')).toBe(true)
    expect(args.get('o').length).toBe(0)
  })

  it('handles boolean short options', () => {
    const args = parseArgs(['-p', '-o', 'foo', 'bar'], ['p', 'o'])

    expect(args.has('p')).toBe(true)
    expect(args.get('p').length).toBe(0)

    expect(args.has('o')).toBe(true)
    expect(args.get('o').length).toBe(0)

    expect(args.has('_')).toBe(true)
    expect(args.get('_').length).toBe(2)
    expect(args.get('_')).toInclude('foo')
    expect(args.get('_')).toInclude('bar')
  })

  it('handles boolean long options', () => {
    const args = parseArgs(
      ['--peppers', '--onions', 'foo', 'bar'],
      ['peppers', 'onions']
    )

    expect(args.has('peppers')).toBe(true)
    expect(args.get('peppers').length).toBe(0)

    expect(args.has('onions')).toBe(true)
    expect(args.get('onions').length).toBe(0)

    expect(args.has('_')).toBe(true)
    expect(args.get('_').length).toBe(2)
    expect(args.get('_')).toInclude('foo')
    expect(args.get('_')).toInclude('bar')
  })

  it('handles stop early operator', () => {
    const args = parseArgs(['-i', '--', 'index.html'])

    expect(args.has('i')).toBe(true)
    expect(args.get('i').length).toBe(0)

    expect(args.has('_')).toBe(true)
    expect(args.get('_').length).toBe(1)
    expect(args.get('_')).toInclude('index.html')
  })
})
