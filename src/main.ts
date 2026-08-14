import cors from 'cors'
import express, { Request, Response } from 'express'
import mysqlConnection from 'mysql2/promise'

const app = express()

app.use(express.json())
app.use(cors())

app.get('/status', async (request: Request, response: Response) => {
  const connection = mysqlConnection.createPool(process.env.DATABASE_URL || '')
  const [versionResult] = await connection.query('SELECT VERSION() AS version')

  const [maxConnectionsResult] = await connection.query(
    "SHOW VARIABLES LIKE 'max_connections'",
  )

  const [openedConnectionsResult] = await connection.query(
    "SHOW STATUS LIKE 'Threads_connected'",
  )

  const version = (versionResult as { version: string }[])[0].version

  const maxConnections = Number(
    (maxConnectionsResult as { Value: string }[])[0].Value,
  )

  const openedConnections = Number(
    (openedConnectionsResult as { Value: string }[])[0].Value,
  )

  return response.status(200).json({
    updated_at: new Date().toISOString(),
    dependencies: {
      database: {
        version,
        max_connections: maxConnections,
        opened_connections: openedConnections,
      },
    },
  })
})

app.get('/bank', async (request: Request, response: Response) => {
  const connection = mysqlConnection.createPool(process.env.DATABASE_URL || '')
  const [rows] = await connection.query('SELECT * FROM bank')
  connection.pool.end()

  const output = (rows as Record<string, unknown>[]).map((bank) => ({
    id: bank.bank_id,
    name: bank.name,
    code: bank.code,
    url: bank.url,
  }))

  response.status(200).json(output)
})

app.get('/bank/:bank_id', async (request: Request, response: Response) => {
  const connection = mysqlConnection.createPool(process.env.DATABASE_URL || '')

  const bankId = request.params.bank_id

  const [rows] = await connection.query(
    'SELECT * FROM bank WHERE bank_id = ?',
    [bankId],
  )
  connection.pool.end()

  const output = (rows as Record<string, unknown>[]).map((bank) => ({
    id: bank.bank_id,
    name: bank.name,
    code: bank.code,
    url: bank.url,
  }))

  if (output.length > 0) {
    response.status(200).json(output[0])
    return
  }

  response.status(404).end()
})

app.post('/bank', async (request: Request, response: Response) => {
  const bankData = request.body
  const connection = mysqlConnection.createPool(process.env.DATABASE_URL || '')

  const [rows] = (await connection.query(
    'INSERT INTO bank(code, name, url) VALUES(?, ?, ?)',
    [bankData.code, bankData.name, bankData.url],
  )) as unknown as [Record<string, unknown>]

  const bankId = rows.insertId
  const bank = {
    id: bankId,
    ...bankData,
  }

  connection.pool.end()
  response.status(201).json(bank)
})

app.put('/bank/:bank_id', async (request: Request, response: Response) => {
  const connection = mysqlConnection.createPool(process.env.DATABASE_URL || '')

  const bankId = request.params.bank_id
  const bankData = request.body

  const [rows] = (await connection.query(
    'SELECT * FROM bank WHERE bank_id = ?',
    [bankId],
  )) as unknown as [Array<Record<string, unknown>>]

  if (rows.length === 0) {
    await connection.end()

    return response.status(404).json({
      message: 'Bank not found',
    })
  }

  const bank = rows[0]

  const code = bankData.code ?? bank.code
  const name = bankData.name ?? bank.name
  const url = bankData.url ?? bank.url

  await connection.query(
    'UPDATE bank SET code = ?, name = ?, url = ? WHERE bank_id = ?',
    [code, name, url, bankId],
  )

  await connection.end()

  response.status(200).json({
    id: Number(bankId),
    code,
    name,
    url,
  })
})
app.delete('/bank/:bank_id', async (request: Request, response: Response) => {
  const connection = mysqlConnection.createPool(process.env.DATABASE_URL || '')

  const bankId = request.params.bank_id

  await connection.query('DELETE FROM bank WHERE bank_id = ?', [bankId])
  connection.pool.end()

  response.status(200).end()
})

app.listen(3001, () => {
  console.log('Server running at http://localhost:3001')
})
