import { HttpRestServer } from '@adapters/http/http-rest-server.ts'
import { CreateBank } from '@application/usecases/create-bank.ts'
import { GetBankById } from '@application/usecases/get-bank-by-id.ts'
import { GetBankList } from '@application/usecases/get-bank-list.ts'
import { RemoveBank } from '@application/usecases/remove-bank.ts'
import { UpdateBank } from '@application/usecases/update-bank.ts'

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
