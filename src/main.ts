import { BankDAODatabase } from '@bank-dao.ts'
import { CreateBank } from '@create-bank.ts'
import { GetBankById } from '@get-bank-by-id.ts'
import { GetBankList } from '@get-bank-list.ts'
import { RemoveBank } from '@remove-bank.ts'
import { UpdateBank } from '@update-bank.ts'
import cors from 'cors'
import express, { Request, Response } from 'express'
import mysqlConnection from 'mysql2/promise'

const app = express()

app.use(express.json())
app.use(cors())

const bankDAO = new BankDAODatabase()

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
  const usecase = new GetBankList(bankDAO)
  const output = await usecase.execute()
  response.status(200).json(output)
})

app.get('/bank/:bank_id', async (request: Request, response: Response) => {
  const bankId = request.params.bank_id

  const usecase = new GetBankById(bankDAO)
  const output = await usecase.execute(Number(bankId))

  if (!output) {
    return response.status(404).end()
  }

  response.status(200).json(output)
})

app.post('/bank', async (request: Request, response: Response) => {
  const bankData = request.body

  const usecase = new CreateBank(bankDAO)
  const output = await usecase.execute(bankData)

  response.status(201).json(output)
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

  const usecase = new RemoveBank(bankDAO)
  await usecase.execute(Number(bankId))

  response.status(200).end()
})

app.listen(3001, () => {
  console.log('Server running at http://localhost:3001')
})
