import { DataSource } from '@external/database/data-source.ts'
import { DataSource as SourceTypeORM } from 'typeorm'

export class DataSourceTypeORM extends DataSource<SourceTypeORM> {
  async disconnect(): Promise<void> {
    await this.source.destroy()
  }
}
