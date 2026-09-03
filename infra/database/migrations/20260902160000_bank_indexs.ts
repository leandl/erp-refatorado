import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  knex.schema.alterTable('bank', (table) => {
    table.index('code', 'bank_code_index')
    table.index('name', 'bank_name_index')
  })
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.alterTable('bank', (table) => {
    table.dropIndex('code', 'bank_code_index')
    table.dropIndex('name', 'bank_name_index')
  })
}
