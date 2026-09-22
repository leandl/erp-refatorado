import { DatabaseConnection } from '@adapters/database/database-connection.ts'
import { createPool, Pool } from 'mysql2/promise'

export class MysqlAdapter implements DatabaseConnection {
  private readonly connection: Pool

  constructor(databaseURI: string) {
    this.connection = createPool(databaseURI)
  }

  async query<T = unknown>(
    statement: string,
    params?: Record<DatabaseConnection.KeyParam, unknown>,
  ): Promise<T[]> {
    const { statement: parsedStatement, values } = this.prepareStatement(
      statement,
      params,
    )

    const [rows] = await this.connection.query(parsedStatement, values)

    return rows as T[]
  }

  private prepareStatement(
    statement: string,
    params?: Record<DatabaseConnection.KeyParam, unknown>,
  ): {
    statement: string
    values: unknown[]
  } {
    const values: unknown[] = []

    const parsedStatement = statement.replace(/(?<!:):\w+/g, (match) => {
      values.push(params?.[match as DatabaseConnection.KeyParam])
      return '?'
    })

    return {
      statement: parsedStatement,
      values,
    }
  }

  async getStatus() {
    const [{ version }] = await this.query<{ version: string }>(
      'SELECT VERSION() AS version',
    )

    const [{ Value: maxConnections }] = await this.query<{
      Value: string
    }>("SHOW VARIABLES LIKE 'max_connections'")

    const [{ Value: openedConnections }] = await this.query<{
      Value: string
    }>("SHOW STATUS LIKE 'Threads_connected'")

    return {
      version,
      maxConnections: Number(maxConnections),
      openedConnections: Number(openedConnections),
    }
  }

  async close(): Promise<void> {
    await this.connection.end()
  }
}
