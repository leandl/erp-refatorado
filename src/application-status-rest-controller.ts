import { GetApplicationStatus } from '@get-application-status.ts'
import { HttpRestServer } from '@http-rest-server.ts'

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
