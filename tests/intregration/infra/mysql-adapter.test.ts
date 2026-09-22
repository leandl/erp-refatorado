import { DatabaseConnection } from '@adapters/database/database-connection.ts'
import { MysqlAdapter } from '@external/database/mysql-adapter.ts'
import { afterEach, beforeEach, expect, test } from 'vitest'

let databaseConnection: DatabaseConnection

beforeEach(async () => {
  databaseConnection = new MysqlAdapter(String(process.env.DATABASE_MYSQL_URL))
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

test('Should execute a query with named params', async () => {
  const rows = await databaseConnection.query<{ value: number }>(
    'SELECT :value AS value',
    {
      ':value': 123,
    },
  )

  expect(rows).toEqual([{ value: 123 }])
})

test('Should close connection', async () => {
  await databaseConnection.close()

  await expect(databaseConnection.query('SELECT 1')).rejects.toThrow()
})
