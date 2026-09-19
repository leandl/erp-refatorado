import { DatabaseConnection } from '@database-connection.ts'
import { SqliteAdapter } from '@sqlite-adapter.ts'
import { afterEach, beforeEach, expect, test } from 'vitest'

let databaseConnection: DatabaseConnection

beforeEach(() => {
  databaseConnection = new SqliteAdapter(
    String(process.env.DATABASE_SQLITE_FILENAME),
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
