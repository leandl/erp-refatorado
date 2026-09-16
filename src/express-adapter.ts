import { ApplicationError } from '@application-error.ts'
import { HttpRestServer } from '@bank-rest-controller.ts'
import { DomainError } from '@domain-error.ts'
import { ExpectedError } from '@expected-error.ts'
import { NotFoundError } from '@not-found-error.ts'
import cors from 'cors'
import express, { Express, Request, Response } from 'express'

export class ExpressAdapter implements HttpRestServer {
  private server: Express

  constructor() {
    this.server = express()

    this.server.use(express.json())
    this.server.use(cors())
  }

  register(
    method: string,
    url: string,
    callback: (
      request: HttpRestServer.Request,
    ) => Promise<HttpRestServer.Response>,
  ): void {
    const methodExpress = method as 'get' | 'post' | 'put' | 'delete'
    this.server[methodExpress](
      url,
      async (requestExpress: Request, responseExpress: Response) => {
        try {
          const request: HttpRestServer.Request = {
            body: requestExpress.body,
            params: requestExpress.params,
          }

          const response = await callback(request)

          responseExpress.status(response.statusCode).json(response.body)
        } catch (error: unknown) {
          if (!(error instanceof ExpectedError)) {
            return responseExpress.status(500).json({
              code: 'SERVER_ERROR',
              message: 'Internal server error',
            })
          }

          if (error instanceof NotFoundError) {
            return responseExpress.status(404).json({
              code: error.code,
              message: error.message,
            })
          }

          if (error instanceof DomainError) {
            return responseExpress.status(422).json({
              code: error.code,
              message: error.message,
            })
          }

          if (error instanceof ApplicationError) {
            return responseExpress.status(422).json({
              code: error.code,
              message: error.message,
            })
          }

          return responseExpress.status(500).json({
            code: 'SERVER_ERROR',
            message: 'Internal server error',
          })
        }
      },
    )
  }

  listen(port: number): void {
    this.server.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`)
    })
  }
}
