import { DomainError } from '@domain/errors/domain-error.ts'

export class BankCode {
  constructor(private value: string) {
    if (!BankCode.validate(value)) {
      throw new DomainError('Invalid code')
    }
  }

  getValue() {
    return this.value
  }

  private static validate(code: string): boolean {
    if (typeof code !== 'string') {
      return false
    }

    return Boolean(code.length === 3 && code.match(/\d{3}/))
  }
}
