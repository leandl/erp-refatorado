import type { Knex } from 'knex'

const migrations = {
  directory: './infra/database/migrations',
}

export const connections = {
  mysql: {
    client: 'mysql2',
    connection: process.env.DATABASE_MYSQL_URL,
    migrations,
  } satisfies Knex.Config,

  postgres: {
    client: 'pg',
    connection: process.env.DATABASE_POSTGRES_URL,
    migrations,
  } satisfies Knex.Config,
}

export default connections.postgres
