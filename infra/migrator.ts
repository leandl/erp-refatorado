import knex, { type Knex } from 'knex'

import config, { connections } from '../knexfile.ts'

type Migrator = {
  listPendingMigrations: () => Promise<string[]>
  runPendingMigrations: () => Promise<string[]>
  clearDatabase: () => Promise<void>
}

function createMigrator(database: Knex): Migrator {
  return {
    async listPendingMigrations() {
      const [_batch, log] = await database.migrate.list()

      return log
    },

    async runPendingMigrations() {
      const [_batch, log] = await database.migrate.latest()

      return log
    },

    async clearDatabase() {
      await database.migrate.rollback(undefined, true)
    },
  }
}

export const migrator = {
  default: createMigrator(knex(config)),
  mysql: createMigrator(knex(connections.mysql)),
  postgres: createMigrator(knex(connections.postgres)),
} as const
