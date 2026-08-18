import mysqlConnection from 'mysql2/promise'

export const save = async (dto: any) => {
  const connection = mysqlConnection.createPool(process.env.DATABASE_URL || '')

  const [rows] = (await connection.query(
    'INSERT INTO bank(code, name, url) VALUES(?, ?, ?)',
    [dto.code, dto.name, dto.url],
  )) as any

  connection.pool.end()

  const bankId = rows.insertId
  return bankId
}

export const list = async () => {
  const connection = mysqlConnection.createPool(process.env.DATABASE_URL || '')
  const [rows] = await connection.query<any[]>('SELECT * FROM bank')
  connection.pool.end()

  return rows
}

export const getById = async (bankId: number) => {
  const connection = mysqlConnection.createPool(process.env.DATABASE_URL || '')

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

export const remove = async (bankId: number) => {
  const connection = mysqlConnection.createPool(process.env.DATABASE_URL || '')

  await connection.query('DELETE FROM bank WHERE bank_id = ?', [bankId])
  connection.pool.end()
}

export const update = async (dto: any) => {
  const connection = mysqlConnection.createPool(process.env.DATABASE_URL || '')

  await connection.query(
    'UPDATE bank SET code = ?, name = ?, url = ? WHERE bank_id = ?',
    [dto.code, dto.name, dto.url, dto.id],
  )

  connection.pool.end()
}
