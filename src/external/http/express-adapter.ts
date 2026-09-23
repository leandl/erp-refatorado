import { ErrorMapper } from '@adapters/error-mapper.ts'
import { HttpRestServer } from '@adapters/http/http-rest-server.ts'
import cors from 'cors'
import express, { Express, json, Request, Response } from 'express'
import { Server } from 'http'

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
  private serverInstance?: Server
  constructor() {
    this.server = express()

    this.server.use(json())
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
      async (expressRequest: Request, expressResponse: Response) => {
        try {
          const request: HttpRestServer.Request = {
            body: expressRequest.body,
            params: expressRequest.params,
          }

          const response = await callback(request)

          return expressResponse.status(response.statusCode).json(response.body)
        } catch (error: unknown) {
          const responseError = await ErrorMapper.toRestResponse(error)
          return expressResponse
            .status(responseError.statusCode)
            .json(responseError.body)
        }
      },
    )
  }

  listen(port: number): void {
    this.serverInstance = this.server.listen(port, (err) => {
      if (!err) {
        console.log(`Server running with express at http://localhost:${port}`)
      }
    })
  }

  async close(): Promise<void> {
    if (!this.serverInstance) return

    await new Promise((resolve, reject) => {
      this.serverInstance?.close((error) => {
        if (error) return reject(error)

        resolve(null)
      })
    })

    this.serverInstance = undefined
  }
}
