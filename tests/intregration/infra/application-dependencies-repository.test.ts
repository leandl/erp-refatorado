import { DatabaseConnection } from '@adapters/database/database-connection.ts'
import { ApplicationDependenciesRepository as ApplicationDependenciesRepositoryDatabase } from '@adapters/database/repositories/application-dependencies-repository.ts'
import { ApplicationDependenciesRepository } from '@application/repositories/application-dependencies-repository.ts'

let applicationDependenciesRepository: ApplicationDependenciesRepository
let databaseConnection: DatabaseConnection

beforeEach(async () => {
  databaseConnection = {
    query: async () => [],
    close: async () => {},
    getStatus: async (): Promise<DatabaseConnection.Status> => ({
      version: 'PostgreSQL 16.0',
      maxConnections: 100,
      openedConnections: 10,
    }),
  } as DatabaseConnection

  applicationDependenciesRepository =
    new ApplicationDependenciesRepositoryDatabase(databaseConnection)
})

test('Should retrieve application dependencies status', async () => {
  const dependenciesStatus = await applicationDependenciesRepository.getStatus()

  expect(dependenciesStatus).toBeDefined()

  expect(dependenciesStatus.database).toBeDefined()
  expect(dependenciesStatus.database.version).toBe('PostgreSQL 16.0')
  expect(dependenciesStatus.database.maxConnections).toBe(100)
  expect(dependenciesStatus.database.openedConnections).toBe(10)
})
