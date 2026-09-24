import { DataSource } from '@external/database/data-source.ts'

import { PrismaClient } from './generated/client.ts'

export class DataSourcePrisma extends DataSource<PrismaClient> {
  async disconnect(): Promise<void> {
    await this.source.$disconnect()
  }
}
