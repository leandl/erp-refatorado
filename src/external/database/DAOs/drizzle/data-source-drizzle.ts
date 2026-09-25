import { DataSource } from '@external/database/data-source.ts'
import { EmptyRelations } from 'drizzle-orm'
import { MySql2Database } from 'drizzle-orm/mysql2'
import { Pool } from 'mysql2'

export type DrizzleClient = MySql2Database<EmptyRelations> & {
  $client: Pool
}

export class DataSourceDrizzle extends DataSource<DrizzleClient> {
  async disconnect(): Promise<void> {
    this.source.$client.end()
  }
}
