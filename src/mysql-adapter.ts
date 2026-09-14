import { DatabaseConnection } from '@database-connection.ts'
import mysql, { Pool } from 'mysql2/promise'

export class MysqlAdapter implements DatabaseConnection {
  private connection: Pool

  constructor(private databaseURI: string) {
    this.connection = mysql.createPool(databaseURI)
  }

  async query<T = any>(
    statement: string,
    params?: Record<`:${string}`, unknown>,
  ): Promise<T[]> {
    const values: unknown[] = []

    const parsedStatement = statement.replace(/:\w+/g, (match) => {
      values.push(params?.[match as DatabaseConnection.KeyParam])
      return '?'
    })

    const [rows] = await this.connection.query(parsedStatement, values)

    return rows as T[]
  }

  async getStatus() {
    const [{ version }] = await this.query<{ version: string }>(
      'SELECT VERSION() AS version',
    )

    const [{ Value: maxConnections }] = await this.query<{ Value: string }>(
      "SHOW VARIABLES LIKE 'max_connections'",
    )

    const [{ Value: openedConnections }] = await this.query<{ Value: string }>(
      "SHOW STATUS LIKE 'Threads_connected'",
    )

    return {
      version,
      maxConnections: Number(maxConnections),
      openedConnections: Number(openedConnections),
    }
  }

  async close(): Promise<void> {
    this.connection.end()
  }
}
