import type { Knex } from 'knex'

export default {
  client: 'mysql2',
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: './infra/database/migrations',
  },
} satisfies Knex.Config
