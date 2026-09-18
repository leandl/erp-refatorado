import { HttpRestServer } from '@bank-rest-controller.ts'
import { ErrorMapper } from '@error-mapper.ts'
import cors from 'cors'
import express, { Express, Request, Response } from 'express'

const expressMethods: Record<
  HttpRestServer.AcceptedMethods,
  'get' | 'post' | 'put' | 'delete'
> = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete',
}

export class ExpressAdapter implements HttpRestServer {
  private server: Express

  constructor() {
    this.server = express()

    this.server.use(express.json())
    this.server.use(cors())
  }

  register(
    method: HttpRestServer.AcceptedMethods,
    url: string,
    callback: (
      request: HttpRestServer.Request,
    ) => Promise<HttpRestServer.Response>,
  ): void {
    const methodExpress = expressMethods[method]

    this.server[methodExpress](
      url,
      async (requestExpress: Request, responseExpress: Response) => {
        try {
          const request: HttpRestServer.Request = {
            body: requestExpress.body,
            params: requestExpress.params,
          }

          const response = await callback(request)

          return responseExpress.status(response.statusCode).json(response.body)
        } catch (error: unknown) {
          const responseError = await ErrorMapper.toRestResponse(error)
          return responseExpress
            .status(responseError.statusCode)
            .json(responseError.body)
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
