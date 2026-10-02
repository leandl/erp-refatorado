import { HttpRestServer } from '@adapters/http/http-rest-server.ts'
import { GetApplicationStatus } from '@application/usecases/get-application-status.ts'

export class ApplicationStatusRestController {
  constructor(
    private httpServer: HttpRestServer,
    private getApplicationStatus: GetApplicationStatus,
  ) {
    this.httpServer.register(
      'GET',
      '/status',
      async (): Promise<HttpRestServer.Response> => {
        const output = await this.getApplicationStatus.execute()

        return {
          statusCode: HttpRestServer.StatusCode.OK,
          body: output,
        }
      },
    )
  }
}
