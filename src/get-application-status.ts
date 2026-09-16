import { DatabaseConnection } from '@database-connection.ts'
import { UseCase } from '@use-case.ts'

export class GetApplicationStatus implements UseCase<
  GetApplicationStatus.Input,
  GetApplicationStatus.Output
> {
  constructor(private databaseConnection: DatabaseConnection) {}

  async execute(): Promise<GetApplicationStatus.Output> {
    const databaseStatus = await this.databaseConnection.getStatus()

    return {
      updated_at: new Date().toISOString(),
      dependencies: {
        database: {
          version: databaseStatus.version,
          max_connections: databaseStatus.maxConnections,
          opened_connections: databaseStatus.openedConnections,
        },
      },
    }
  }
}

export namespace GetApplicationStatus {
  export type Input = unknown

  export type Output = {
    updated_at: string
    dependencies: {
      database: {
        version: string
        max_connections: number
        opened_connections: number
      }
    }
  }
}
