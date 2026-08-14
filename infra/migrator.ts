import knex from 'knex'

import config from '../knexfile.ts'

const database = knex(config)

async function listPendingMigrations() {
  const [_batch, log] = await database.migrate.list()

  return log
}

async function runPendingMigrations() {
  const [_batch, log] = await database.migrate.latest()

  return log
}

async function clearDatabase() {
  await database.migrate.rollback(undefined, true)
}

export const migrator = {
  listPendingMigrations,
  runPendingMigrations,
  clearDatabase,
}
