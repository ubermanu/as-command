import { Command } from './command'

export function program(name: string): Command {
  return new Command(name)
}
