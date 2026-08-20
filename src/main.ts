import { BankDAO } from '@bank-dao.ts'
import { UpdateBank } from '@update-bank.ts'
import cors from 'cors'
import express, { Request, Response } from 'express'
import mysqlConnection from 'mysql2/promise'

const app = express()

app.use(express.json())
app.use(cors())

const bankDAO = new BankDAO()

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
  const rows = await bankDAO.list()

  const output = rows.map((bank) => ({
    id: bank.bank_id,
    name: bank.name,
    code: bank.code,
    url: bank.url,
  }))

  response.status(200).json(output)
})

app.get('/bank/:bank_id', async (request: Request, response: Response) => {
  const bankId = request.params.bank_id

  const row = await bankDAO.getById(Number(bankId))

  if (!row) {
    return response.status(404).end()
  }

  const output = {
    id: row.bank_id,
    name: row.name,
    code: row.code,
    url: row.url,
  }

  response.status(200).json(output)
})

app.post('/bank', async (request: Request, response: Response) => {
  const bankData = request.body

  const bankId = await bankDAO.save(bankData)
  const bank = {
    id: bankId,
    ...bankData,
  }

  response.status(201).json(bank)
})

app.put('/bank/:bank_id', async (request: Request, response: Response) => {
  const bankId = request.params.bank_id
  const bankData = request.body

  const input = {
    id: Number(bankId),
    ...bankData,
  }

  const usecase = new UpdateBank(bankDAO)
  const output = await usecase.execute(input)

  response.status(200).json(output)
})

app.delete('/bank/:bank_id', async (request: Request, response: Response) => {
  const bankId = request.params.bank_id

  await bankDAO.remove(Number(bankId))

  response.status(200).end()
})

app.listen(3001, () => {
  console.log('Server running at http://localhost:3001')
})
