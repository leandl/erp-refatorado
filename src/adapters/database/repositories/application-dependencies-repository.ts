import { DatabaseConnection } from '@adapters/database/database-connection.ts'
import type { ApplicationDependenciesRepository as ApplicationDependenciesRepositoryContract } from '@application/repositories/application-dependencies-repository.ts'

export class ApplicationDependenciesRepository implements ApplicationDependenciesRepositoryContract {
  constructor(private databaseConnection: DatabaseConnection) {}

  async getStatus(): Promise<ApplicationDependenciesRepositoryContract.Status> {
    const databaseStatus = await this.databaseConnection.getStatus()

    return {
      database: {
        version: databaseStatus.version,
        maxConnections: databaseStatus.maxConnections,
        openedConnections: databaseStatus.openedConnections,
      },
    }
  }
}
