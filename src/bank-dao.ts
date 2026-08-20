import mysqlConnection from 'mysql2/promise'

export interface BankDAO {
  save(dto: any): Promise<number>
  getById(bankId: number): Promise<any>
  update(dto: any): Promise<void>
  list(): Promise<any[]>
  remove(bankId: number): Promise<void>
}

export class BankDAODatabase implements BankDAO {
  async save(dto: any) {
    const connection = mysqlConnection.createPool(
      process.env.DATABASE_URL || '',
    )

    const [rows] = (await connection.query(
      'INSERT INTO bank(code, name, url) VALUES(?, ?, ?)',
      [dto.code, dto.name, dto.url],
    )) as any

    connection.pool.end()

    const bankId = rows.insertId
    return bankId
  }

  async list() {
    const connection = mysqlConnection.createPool(
      process.env.DATABASE_URL || '',
    )
    const [rows] = await connection.query<any[]>('SELECT * FROM bank')
    connection.pool.end()

    return rows
  }

  async getById(bankId: number) {
    const connection = mysqlConnection.createPool(
      process.env.DATABASE_URL || '',
    )

    const [rows] = await connection.query<any[]>(
      'SELECT * FROM bank WHERE bank_id = ?',
      [bankId],
    )
    connection.pool.end()

    if (rows.length > 0) {
      return rows[0]
    }

    return null
  }

  async remove(bankId: number) {
    const connection = mysqlConnection.createPool(
      process.env.DATABASE_URL || '',
    )

    await connection.query('DELETE FROM bank WHERE bank_id = ?', [bankId])
    connection.pool.end()
  }

  async update(dto: any) {
    const connection = mysqlConnection.createPool(
      process.env.DATABASE_URL || '',
    )

    await connection.query(
      'UPDATE bank SET code = ?, name = ?, url = ? WHERE bank_id = ?',
      [dto.code, dto.name, dto.url, dto.id],
    )

    connection.pool.end()
  }
}
