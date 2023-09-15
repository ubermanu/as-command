import { trimLeft } from './util'

export class Option {
  constructor(
    public identifiers: string[] = [],
    public description: string = '',
    public defaultValue: string[] = []
  ) {}

  get name(): string {
    return this.identifiers.join(', ')
  }

  get trimmedIdentifiers(): string[] {
    return this.identifiers.map((id: string) => trimLeft(id, '-'))
  }

  static validateIdentifier(identifier: string): bool {
    return (
      (identifier.length === 2 && identifier.startsWith('-')) ||
      (identifier.length > 2 && identifier.startsWith('--'))
    )
  }
}
