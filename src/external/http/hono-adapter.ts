import { ErrorMapper } from '@adapters/error-mapper.ts'
import { HttpRestServer } from '@adapters/http/http-rest-server.ts'
import { serve, ServerType } from '@hono/node-server'
import { Context, Hono } from 'hono'
import { cors } from 'hono/cors'

export class HonoAdapter implements HttpRestServer {
  private app: Hono
  private serverInstance?: ServerType

  constructor() {
    this.app = new Hono()
    this.app.use('*', cors())
  }

  register(
    method: HttpRestServer.AcceptedMethods,
    url: string,
    callback: (
      request: HttpRestServer.Request,
    ) => Promise<HttpRestServer.Response>,
  ): void {
    this.app.on(method, url, async (honoContext: Context) => {
      try {
        const body = await this.parseBody(honoContext)
        const request: HttpRestServer.Request = {
          body,
          params: honoContext.req.param(),
        }

        const response = await callback(request)
        return honoContext.json(response.body, response.statusCode)
      } catch (error: unknown) {
        const responseError = await ErrorMapper.toRestResponse(error)
        return honoContext.json(responseError.body, responseError.statusCode)
      }
    })
  }

  private async parseBody(context: Context): Promise<unknown> {
    const contentType = context.req.header('content-type')

    if (contentType?.includes('application/json')) {
      const text = await context.req.text()

      if (!text.trim()) {
        return undefined
      }

      return JSON.parse(text)
    }
  }

  listen(port: number): void {
    if (this.serverInstance) return

    const server = serve(
      {
        fetch: this.app.fetch,
        port,
      },
      function () {
        console.log(`Server running with hono at http://localhost:${port}`)
      },
    )

    this.serverInstance = server
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
