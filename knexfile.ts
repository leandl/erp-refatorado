import type { Knex } from 'knex'

const migrations = {
  directory: './src/external/database/migrations',
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

  sqlite3: {
    client: 'better-sqlite3',
    connection: {
      filename: String(process.env.DATABASE_SQLITE_FILENAME),
    },
    useNullAsDefault: true,
    migrations,
  } satisfies Knex.Config,
}

export default connections.mysql
