import mysqlConnection from 'mysql2/promise'

export interface BankDAO {
  save(dto: BankDAO.SaveDTO): Promise<number>
  getById(bankId: number): Promise<BankDAO.BankDTO | undefined>
  getByCode(code: string): Promise<BankDAO.BankDTO | undefined>
  getByName(name: string): Promise<BankDAO.BankDTO | undefined>
  update(dto: BankDAO.UpdateDTO): Promise<void>
  list(): Promise<BankDAO.BankDTO[]>
  remove(bankId: number): Promise<void>
}

export namespace BankDAO {
  export type SaveDTO = {
    code: string
    name: string
    url: string
  }

  export type UpdateDTO = {
    id: number
    code: string
    name: string
    url: string
  }

  export type BankDTO = {
    bank_id: number
    code: string
    name: string
    url: string
  }
}

export class BankDAODatabase implements BankDAO {
  async save(dto: BankDAO.SaveDTO): Promise<number> {
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

  async list(): Promise<BankDAO.BankDTO[]> {
    const connection = mysqlConnection.createPool(
      process.env.DATABASE_URL || '',
    )
    const [rows] = await connection.query<any[]>('SELECT * FROM bank')
    connection.pool.end()

    return rows
  }

  async getById(bankId: number): Promise<BankDAO.BankDTO | undefined> {
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
  }

  async getByCode(code: string): Promise<BankDAO.BankDTO | undefined> {
    const connection = mysqlConnection.createPool(
      process.env.DATABASE_URL || '',
    )

    const [rows] = await connection.query<any[]>(
      'SELECT * FROM bank WHERE code = ?',
      [code],
    )
    connection.pool.end()

    if (rows.length > 0) {
      return rows[0]
    }
  }

  async getByName(name: string): Promise<BankDAO.BankDTO | undefined> {
    const connection = mysqlConnection.createPool(
      process.env.DATABASE_URL || '',
    )

    const [rows] = await connection.query<any[]>(
      'SELECT * FROM bank WHERE name = ?',
      [name],
    )
    connection.pool.end()

    if (rows.length > 0) {
      return rows[0]
    }
  }

  async remove(bankId: number): Promise<void> {
    const connection = mysqlConnection.createPool(
      process.env.DATABASE_URL || '',
    )

    await connection.query('DELETE FROM bank WHERE bank_id = ?', [bankId])
    connection.pool.end()
  }

  async update(dto: BankDAO.UpdateDTO): Promise<void> {
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
