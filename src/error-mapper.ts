import { ApplicationError } from '@application-error.ts'
import { HttpRestServer } from '@bank-rest-controller.ts'
import { DomainError } from '@domain-error.ts'
import { NotFoundError } from '@not-found-error.ts'

export class ErrorMapper {
  static async toRestResponse(
    error: unknown,
  ): Promise<HttpRestServer.Response> {
    if (error instanceof NotFoundError) {
      return {
        statusCode: 404,
        body: {
          code: error.code,
          message: error.message,
        },
      }
    }

    if (error instanceof DomainError) {
      return {
        statusCode: 422,
        body: {
          code: error.code,
          message: error.message,
        },
      }
    }

    if (error instanceof ApplicationError) {
      return {
        statusCode: 422,
        body: {
          code: error.code,
          message: error.message,
        },
      }
    }

    return {
      statusCode: 500,
      body: {
        code: 'SERVER_ERROR',
        message: 'Internal server error',
      },
    }
  }
}
