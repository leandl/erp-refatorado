import { DatabaseConnection } from '@adapters/database/database-connection.ts'
import { GetApplicationStatus } from '@application/usecases/get-application-status.ts'

let databaseConnection: DatabaseConnection
let sut: GetApplicationStatus

beforeEach(() => {
  databaseConnection = {
    query: async () => [],
    close: async () => {},
    getStatus: async () => ({
      version: 'MariaDB 12.3.0',
      maxConnections: 151,
      openedConnections: 5,
    }),
  }

  sut = new GetApplicationStatus(databaseConnection)
})

test('Should return application status', async () => {
  const output = await sut.execute()

  expect(output.updated_at).toBeDefined()
  expect(new Date(output.updated_at).toISOString()).toBe(output.updated_at)
  expect(output.dependencies.database).toEqual({
    version: 'MariaDB 12.3.0',
    max_connections: 151,
    opened_connections: 5,
  })
})

test('Should return database dependency information', async () => {
  const output = await sut.execute()

  expect(output.dependencies).toEqual({
    database: {
      version: 'MariaDB 12.3.0',
      max_connections: 151,
      opened_connections: 5,
    },
  })
})

test('Should return current timestamp in ISO format', async () => {
  const before = new Date()
  const output = await sut.execute()
  const after = new Date()

  const updatedAt = new Date(output.updated_at)

  expect(updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime())
  expect(updatedAt.getTime()).toBeLessThanOrEqual(after.getTime())
})

test('Should reflect updated database status values', async () => {
  databaseConnection.getStatus = async () => ({
    version: 'PostgreSQL 17.1',
    maxConnections: 200,
    openedConnections: 42,
  })

  const output = await sut.execute()

  expect(output.dependencies.database).toEqual({
    version: 'PostgreSQL 17.1',
    max_connections: 200,
    opened_connections: 42,
  })
})
