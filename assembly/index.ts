import { Command } from './command'

export function command(name: string): Command {
  return new Command(name)
}
