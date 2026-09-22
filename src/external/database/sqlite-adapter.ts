import { DatabaseConnection } from '@adapters/database/database-connection.ts'
import BetterSQLite, { Database } from 'better-sqlite3'

export class SqliteAdapter implements DatabaseConnection {
  private readonly connection: Database
  private connectionClosed = false

  constructor(databasePath: string) {
    this.connection = new BetterSQLite(databasePath)
    this.connection.pragma('foreign_keys = on')
    this.connection.pragma('journal_mode = WAL')
  }

  async query<T = unknown>(
    statement: string,
    params?: Record<DatabaseConnection.KeyParam, unknown>,
  ): Promise<T[]> {
    const normalizedStatement = this.normalizeStatement(statement)
    const preparedStatement = this.connection.prepare(normalizedStatement)
    const parsedParams = this.parseParams(params)

    if (preparedStatement.reader) {
      return preparedStatement.all(parsedParams) as T[]
    }

    return preparedStatement.run(parsedParams) as unknown as T[]
  }

  private normalizeStatement(statement: string): string {
    return statement.replace(/(?<!:):\w+/g, (match) => `@${match.slice(1)}`)
  }

  private parseParams(
    params?: Record<DatabaseConnection.KeyParam, unknown>,
  ): Record<string, unknown> {
    return Object.fromEntries(
      Object.entries(params ?? {}).map(([key, value]) => [key.slice(1), value]),
    )
  }

  async getStatus() {
    const [{ version }] = await this.query<{ version: string }>(
      `SELECT sqlite_version() AS version`,
    )

    const [{ openedConnections }] = await this.query<{
      openedConnections: number
    }>(`PRAGMA database_list`)

    return {
      version,
      maxConnections: 1,
      openedConnections,
    }
  }

  async close(): Promise<void> {
    if (this.connectionClosed) {
      return
    }

    this.connection.close()
    this.connectionClosed = true
  }
}
