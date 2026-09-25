import { drizzle } from 'drizzle-orm/mysql2'
import { createPool } from 'mysql2/promise'

import { DataSourceDrizzle, DrizzleClient } from './data-source-drizzle.ts'

export async function drizzleDataSourceFactory(
  databaseURI: string,
): Promise<DataSourceDrizzle> {
  const pool = createPool(databaseURI)
  const source = drizzle({
    client: pool.pool,
  }) as DrizzleClient
  return new DataSourceDrizzle(source)
}
