import mysqlConnection from 'mysql2/promise'

export interface DatabaseStatusDAO {
  getStatus(): Promise<DatabaseStatusDAO.StatusDTO>
}

export namespace DatabaseStatusDAO {
  export type StatusDTO = {
    version: string
    max_connections: number
    opened_connections: number
  }
}

export class DatabaseStatusDAODatabase implements DatabaseStatusDAO {
  async getStatus(): Promise<DatabaseStatusDAO.StatusDTO> {
    const connection = mysqlConnection.createPool(
      process.env.DATABASE_URL || '',
    )

    const [versionResult] = await connection.query(
      'SELECT VERSION() AS version',
    )

    const [maxConnectionsResult] = await connection.query(
      "SHOW VARIABLES LIKE 'max_connections'",
    )

    const [openedConnectionsResult] = await connection.query(
      "SHOW STATUS LIKE 'Threads_connected'",
    )

    const version = (versionResult as { version: string }[])[0].version

    const maxConnections = Number(
      (maxConnectionsResult as { Value: string }[])[0].Value,
    )

    const openedConnections = Number(
      (openedConnectionsResult as { Value: string }[])[0].Value,
    )

    await connection.end()

    return {
      version,
      max_connections: Number(maxConnections),
      opened_connections: Number(openedConnections),
    }
  }
}
