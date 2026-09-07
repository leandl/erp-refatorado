import { Bank } from '@bank.ts'
import mysqlConnection from 'mysql2/promise'

export interface BankRepository {
  save(bank: Bank): Promise<Bank>
  findById(bankId: number): Promise<Bank | undefined>
  findByCode(code: string): Promise<Bank | undefined>
  findByName(name: string): Promise<Bank | undefined>
  update(bank: Bank): Promise<void>
  list(): Promise<Bank[]>
  remove(bankId: number): Promise<void>
}

export class BankRepositoryDatabase implements BankRepository {
  async save(bank: Bank): Promise<Bank> {
    const connection = mysqlConnection.createPool(
      process.env.DATABASE_URL || '',
    )

    const [rows] = (await connection.query(
      'INSERT INTO bank(code, name, url) VALUES(?, ?, ?)',
      [bank.getCode(), bank.getName(), bank.getUrl()],
    )) as any

    connection.pool.end()

    const bankId = rows.insertId
    return Bank.restore({
      id: bankId,
      code: bank.getCode(),
      name: bank.getName(),
      url: bank.getUrl(),
    })
  }

  async findById(bankId: number): Promise<Bank | undefined> {
    const connection = mysqlConnection.createPool(
      process.env.DATABASE_URL || '',
    )

    const [rows] = await connection.query<any[]>(
      'SELECT * FROM bank WHERE bank_id = ?',
      [bankId],
    )
    connection.pool.end()

    const [firstRow] = rows
    if (!firstRow) {
      return undefined
    }

    return Bank.restore({
      id: rows[0].bank_id,
      code: rows[0].code,
      name: rows[0].name,
      url: rows[0].url,
    })
  }

  async findByCode(code: string): Promise<Bank | undefined> {
    const connection = mysqlConnection.createPool(
      process.env.DATABASE_URL || '',
    )

    const [rows] = await connection.query<any[]>(
      'SELECT * FROM bank WHERE code = ?',
      [code],
    )
    connection.pool.end()

    const [firstRow] = rows
    if (!firstRow) {
      return undefined
    }

    return Bank.restore({
      id: rows[0].bank_id,
      code: rows[0].code,
      name: rows[0].name,
      url: rows[0].url,
    })
  }

  async findByName(name: string): Promise<Bank | undefined> {
    const connection = mysqlConnection.createPool(
      process.env.DATABASE_URL || '',
    )

    const [rows] = await connection.query<any[]>(
      'SELECT * FROM bank WHERE name = ?',
      [name],
    )
    connection.pool.end()

    const [firstRow] = rows
    if (!firstRow) {
      return undefined
    }

    return Bank.restore({
      id: rows[0].bank_id,
      code: rows[0].code,
      name: rows[0].name,
      url: rows[0].url,
    })
  }

  async update(bank: Bank): Promise<void> {
    const connection = mysqlConnection.createPool(
      process.env.DATABASE_URL || '',
    )

    await connection.query(
      'UPDATE bank SET code = ?, name = ?, url = ? WHERE bank_id = ?',
      [bank.getCode(), bank.getName(), bank.getUrl(), bank.getBankId()],
    )

    connection.pool.end()
  }

  async list(): Promise<Bank[]> {
    const connection = mysqlConnection.createPool(
      process.env.DATABASE_URL || '',
    )
    const [rows] = await connection.query<any[]>('SELECT * FROM bank')
    connection.pool.end()

    return rows.map((row) =>
      Bank.restore({
        id: row.bank_id,
        code: row.code,
        name: row.name,
        url: row.url,
      }),
    )
  }

  async remove(bankId: number): Promise<void> {
    const connection = mysqlConnection.createPool(
      process.env.DATABASE_URL || '',
    )

    await connection.query('DELETE FROM bank WHERE bank_id = ?', [bankId])
    connection.pool.end()
  }
}
