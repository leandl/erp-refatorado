import { ApplicationError } from '@application-error.ts'

export class NotFoundError extends ApplicationError {
  code = 'NOT_FOUND_ERROR'

  constructor(message: string) {
    super(message)
  }
}
