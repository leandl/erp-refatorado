import { CreateBank } from '@create-bank.ts'
import { GetBankById } from '@get-bank-by-id.ts'
import { GetBankList } from '@get-bank-list.ts'
import { RemoveBank } from '@remove-bank.ts'
import { UpdateBank } from '@update-bank.ts'

export interface HttpRestServer {
  register(
    method: HttpRestServer.AcceptedMethods,
    url: string,
    callback: (
      request: HttpRestServer.Request,
    ) => Promise<HttpRestServer.Response>,
  ): void

  listen(port: number): void
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

export class BankRestController {
  constructor(
    private httpServer: HttpRestServer,
    private getBankList: GetBankList,
    private getBankById: GetBankById,
    private createBank: CreateBank,
    private updateBank: UpdateBank,
    private removeBank: RemoveBank,
  ) {
    this.httpServer.register(
      'GET',
      '/bank',
      async (): Promise<HttpRestServer.Response> => {
        const output = await this.getBankList.execute()
        return {
          statusCode: HttpRestServer.StatusCode.OK,
          body: output,
        }
      },
    )

    this.httpServer.register(
      'GET',
      '/bank/:id',
      async (
        request: HttpRestServer.Request,
      ): Promise<HttpRestServer.Response> => {
        const input: GetBankById.Input = {
          id: Number(request.params.id),
        }
        const output = await this.getBankById.execute(input)
        return {
          statusCode: HttpRestServer.StatusCode.OK,
          body: output,
        }
      },
    )

    this.httpServer.register(
      'POST',
      '/bank',
      async (
        request: HttpRestServer.Request,
      ): Promise<HttpRestServer.Response> => {
        const input: CreateBank.Input = {
          code: String(request.body.code),
          name: String(request.body.name),
          url: String(request.body.url),
        }
        const output = await this.createBank.execute(input)
        return {
          statusCode: HttpRestServer.StatusCode.CREATED,
          body: output,
        }
      },
    )

    this.httpServer.register(
      'PUT',
      '/bank/:id',
      async (
        request: HttpRestServer.Request,
      ): Promise<HttpRestServer.Response> => {
        const input: UpdateBank.Input = {
          id: Number(request.params.id),
          code: String(request.body.code),
          name: String(request.body.name),
          url: String(request.body.url),
        }
        const output = await this.updateBank.execute(input)
        return {
          statusCode: HttpRestServer.StatusCode.OK,
          body: output,
        }
      },
    )

    this.httpServer.register(
      'DELETE',
      '/bank/:id',
      async (
        request: HttpRestServer.Request,
      ): Promise<HttpRestServer.Response> => {
        const input: RemoveBank.Input = {
          id: Number(request.params.id),
        }
        const output = await this.removeBank.execute(input)
        return {
          statusCode: HttpRestServer.StatusCode.OK,
          body: output,
        }
      },
    )
  }
}
