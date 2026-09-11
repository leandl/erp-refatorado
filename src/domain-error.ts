import { ExpectedError } from '@expected-error.ts'

export class DomainError extends ExpectedError {
  readonly code = 'DOMAIN_ERROR'

  constructor(message: string) {
    super(message)
  }
}
