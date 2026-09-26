import { MongoClient } from 'mongodb'

import { DataSourceMongo } from './data-source-mongo.ts'

export async function mongoDataSourceFactory(
  databaseURI: string,
): Promise<DataSourceMongo> {
  const source = new MongoClient(databaseURI)

  await source.connect()

  return new DataSourceMongo(source)
}
