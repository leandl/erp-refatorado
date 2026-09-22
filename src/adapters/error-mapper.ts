import { HttpRestServer } from '@adapters/http/http-rest-server.ts'
import { ApplicationError } from '@application/errors/application-error.ts'
import { NotFoundError } from '@application/errors/not-found-error.ts'
import { DomainError } from '@domain/errors/domain-error.ts'

export class ErrorMapper {
  static async toRestResponse(
    error: unknown,
  ): Promise<HttpRestServer.Response> {
    if (error instanceof NotFoundError) {
      return {
        statusCode: HttpRestServer.StatusCode.NOT_FOUND,
        body: {
          code: error.code,
          message: error.message,
        },
      }
    }

    if (error instanceof DomainError) {
      return {
        statusCode: HttpRestServer.StatusCode.UNPROCESSABLE_ENTITY,
        body: {
          code: error.code,
          message: error.message,
        },
      }
    }

    if (error instanceof ApplicationError) {
      return {
        statusCode: HttpRestServer.StatusCode.UNPROCESSABLE_ENTITY,
        body: {
          code: error.code,
          message: error.message,
        },
      }
    }

    return {
      statusCode: HttpRestServer.StatusCode.INTERNAL_SERVER_ERROR,
      body: {
        code: 'SERVER_ERROR',
        message: 'Internal server error',
      },
    }
  }
}
