import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core'

export const bankDrizzlePersistenceModel = mysqlTable('bank', {
  bankId: int('bank_id').autoincrement().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  code: varchar('code', { length: 30 }).notNull(),
  url: varchar('url', { length: 200 }).notNull(),
})
