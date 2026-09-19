import { DatabaseConnection } from '@database-connection.ts'
import { PostgresAdapter } from '@postgres-adapter.ts'
import { afterEach, beforeEach, expect, test } from 'vitest'

let databaseConnection: DatabaseConnection

beforeEach(() => {
  databaseConnection = new PostgresAdapter(
    String(process.env.DATABASE_POSTGRES_URL),
  )
})

afterEach(async () => {
  await databaseConnection.close()
})

test('Should execute a query', async () => {
  const rows = await databaseConnection.query<{ value: number }>(
    'SELECT 1 AS value',
  )

  expect(rows).toEqual([{ value: 1 }])
})

test('Should execute a query with named parameters', async () => {
  const rows = await databaseConnection.query<{ value: number }>(
    'SELECT :value AS value',
    {
      ':value': 123,
    },
  )

  expect(rows).toEqual([{ value: 123 }])
})

test('Should reject queries after closing the connection', async () => {
  await databaseConnection.close()

  await expect(databaseConnection.query('SELECT 1')).rejects.toThrow()
})
