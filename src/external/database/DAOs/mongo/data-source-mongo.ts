import { DataSource } from '@external/database/data-source.ts'
import { MongoClient } from 'mongodb'

export class DataSourceMongo extends DataSource<MongoClient> {
  async disconnect(): Promise<void> {
    await this.source.close()
  }
}
