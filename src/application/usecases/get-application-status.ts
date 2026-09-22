import { ApplicationDependenciesRepository } from '@application/repositories/application-dependencies-repository.ts'
import { UseCase } from '@application/usecases/use-case.ts'

export class GetApplicationStatus implements UseCase<
  GetApplicationStatus.Input,
  GetApplicationStatus.Output
> {
  constructor(
    private applicationDependenciesRepository: ApplicationDependenciesRepository,
  ) {}

  async execute(): Promise<GetApplicationStatus.Output> {
    const dependenciesStatus =
      await this.applicationDependenciesRepository.getStatus()

    return {
      updated_at: new Date().toISOString(),
      dependencies: {
        database: {
          max_connections: dependenciesStatus.database.maxConnections,
          opened_connections: dependenciesStatus.database.openedConnections,
          version: dependenciesStatus.database.version,
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
