import { HttpRestServer } from '@bank-rest-controller.ts'
import { ErrorMapper } from '@error-mapper.ts'
import fastifyCors from '@fastify/cors'
import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

export class FastifyAdapter implements HttpRestServer {
  private server: FastifyInstance

  constructor() {
    this.server = Fastify()
    this.server.register(fastifyCors, {
      origin: true,
      methods: [...HttpRestServer.AcceptedMethodsList],
    })
  }

  register(
    method: HttpRestServer.AcceptedMethods,
    url: string,
    callback: (
      request: HttpRestServer.Request,
    ) => Promise<HttpRestServer.Response>,
  ): void {
    this.server.route({
      method,
      url,
      handler: async (
        fastifyRequest: FastifyRequest,
        fastifyReply: FastifyReply,
      ) => {
        try {
          const request: HttpRestServer.Request = {
            body: fastifyRequest.body,
            params: fastifyRequest.params,
          }

          const response = await callback(request)

          return fastifyReply.status(response.statusCode).send(response.body)
        } catch (error: unknown) {
          const responseError = await ErrorMapper.toRestResponse(error)
          return fastifyReply
            .status(responseError.statusCode)
            .send(responseError.body)
        }
      },
    })
  }

  listen(port: number): void {
    this.server.listen({ port }, function (err) {
      if (!err) {
        console.log(`Server running with fastify at http://localhost:${port}`)
      }
    })
  }
}
