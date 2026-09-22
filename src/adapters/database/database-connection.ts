export interface DatabaseConnection {
  query<T = any>(
    statement: string,
    params?: Record<DatabaseConnection.KeyParam, unknown>,
  ): Promise<T[]>
  getStatus(): Promise<DatabaseConnection.Status>
  close(): Promise<void>
}

export namespace DatabaseConnection {
  export type KeyParam = `:${string}`
  export type Status = {
    version: string
    maxConnections: number
    openedConnections: number
  }
}
