import { DataSource } from 'typeorm'

import { BankTypeORMPersistenceModel } from './bank-typeorm-persistence-model.ts'
import { DataSourceTypeORM } from './data-source-typeorm.ts'

export async function typeORMDataSourceFactory(
  databaseURI: string,
): Promise<DataSourceTypeORM> {
  const source = await new DataSource({
    type: 'mariadb',
    url: databaseURI,
    entities: [BankTypeORMPersistenceModel],
    synchronize: false,
  }).initialize()

  return new DataSourceTypeORM(source)
}
