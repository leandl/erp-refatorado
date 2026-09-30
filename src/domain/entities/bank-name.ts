import { DomainError } from '@domain/errors/domain-error.ts'

export class BankName {
  constructor(private value: string) {
    if (!BankName.validate(value)) {
      throw new DomainError('Invalid name')
    }
  }

  getValue() {
    return this.value
  }

  private static validate(name: string): boolean {
    if (typeof name !== 'string') {
      return false
    }

    return name.trim().split(/\s+/).length >= 2
  }
}
