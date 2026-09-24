import { PrismaMariaDb } from '@prisma/adapter-mariadb'

import { DataSourcePrisma } from './data-source-prisma.ts'
import { PrismaClient } from './generated/client.ts'

export async function prismaDataSourceFactory(
  databaseURI: string,
): Promise<DataSourcePrisma> {
  const adapter = new PrismaMariaDb(databaseURI)
  const prismaClient = new PrismaClient({
    adapter,
  })

  return new DataSourcePrisma(prismaClient)
}
