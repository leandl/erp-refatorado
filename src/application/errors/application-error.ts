import { ExpectedError } from '@domain/errors/expected-error.ts'

export class ApplicationError extends ExpectedError {
  code = 'APPLICATION_ERROR'

  constructor(message: string) {
    super(message)
  }
}
