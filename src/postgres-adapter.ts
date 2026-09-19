import { DatabaseConnection } from '@database-connection.ts'
import pgPromise, { IDatabase, IMain } from 'pg-promise'

export class PostgresAdapter implements DatabaseConnection {
  private readonly pgp: IMain
  private readonly connection: IDatabase<unknown>
  private connectionClosed = false

  constructor(databaseURI: string) {
    this.pgp = pgPromise()
    this.connection = this.pgp(databaseURI)
  }

  async query<T = unknown>(
    statement: string,
    params?: Record<`:${string}`, unknown>,
  ): Promise<T[]> {
    const keys: Record<DatabaseConnection.KeyParam, number> = {}
    const values: unknown[] = []

    const parsedStatement = statement.replace(/(?<!:):\w+/g, (match) => {
      const keyParam = match as DatabaseConnection.KeyParam

      if (keys[keyParam] === undefined) {
        keys[keyParam] = values.length + 1
        values.push(params?.[keyParam])
      }

      return `$${keys[keyParam]}`
    })

    return this.connection.any<T>(parsedStatement, values)
  }

  async getStatus() {
    const [{ version }] = await this.query<{ version: string }>(
      'SELECT version() AS version',
    )

    const [{ maxConnections }] = await this.query<{
      maxConnections: string
    }>(
      `SELECT setting AS "maxConnections"
       FROM pg_settings
       WHERE name = 'max_connections'`,
    )

    const [{ openedConnections }] = await this.query<{
      openedConnections: string
    }>(
      `SELECT COUNT(*) AS "openedConnections"
       FROM pg_stat_activity`,
    )

    return {
      version,
      maxConnections: Number(maxConnections),
      openedConnections: Number(openedConnections),
    }
  }

  async close(): Promise<void> {
    if (this.connectionClosed) {
      return
    }

    this.pgp.end()
    this.connectionClosed = true
  }
}
