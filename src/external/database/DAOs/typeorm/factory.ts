import { DataSource } from 'typeorm'

import { BankTypeORMPersistenceModel } from './bank-typeorm-persistence-model.ts'

export async function typeORMDataSourceFactory(
  databaseURI: string,
): Promise<DataSource> {
  const dataSource = await new DataSource({
    type: 'mariadb',
    url: databaseURI,
    entities: [BankTypeORMPersistenceModel],
    synchronize: false,
  }).initialize()

  return dataSource
}
