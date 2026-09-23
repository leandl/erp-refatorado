export interface HttpRestServer {
  register(
    method: HttpRestServer.AcceptedMethods,
    url: string,
    callback: (
      request: HttpRestServer.Request,
    ) => Promise<HttpRestServer.Response>,
  ): void

  listen(port: number): void
  close(): Promise<void>
}

export namespace HttpRestServer {
  export type Request = {
    body?: any
    params?: any
  }
  export type Response = {
    statusCode: StatusCode
    body: any
  }
  export const AcceptedMethodsList = ['GET', 'POST', 'PUT', 'DELETE'] as const
  export type AcceptedMethods = (typeof AcceptedMethodsList)[number]
  export enum StatusCode {
    OK = 200,
    CREATED = 201,

    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    UNPROCESSABLE_ENTITY = 422,

    INTERNAL_SERVER_ERROR = 500,
  }
}
