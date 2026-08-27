import { BankDAODatabase } from '@bank-dao.ts'
import { CreateBank } from '@create-bank.ts'
import { DatabaseStatusDAODatabase } from '@database-status-dao.ts'
import { GetBankById } from '@get-bank-by-id.ts'
import { GetBankList } from '@get-bank-list.ts'
import { RemoveBank } from '@remove-bank.ts'
import { UpdateBank } from '@update-bank.ts'
import cors from 'cors'
import express, { Request, Response } from 'express'

const app = express()

app.use(express.json())
app.use(cors())

const bankDAO = new BankDAODatabase()

app.get('/status', async (request: Request, response: Response) => {
  const databaseStatusDAO = new DatabaseStatusDAODatabase()

  const databaseStatus = databaseStatusDAO.getStatus()

  return response.status(200).json({
    updated_at: new Date().toISOString(),
    dependencies: {
      database: databaseStatus,
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
  const output = await usecase.execute({ id: Number(bankId) })

  if (!output) {
    return response.status(404).end()
  }

  response.status(200).json(output)
})

app.post('/bank', async (request: Request, response: Response) => {
  const input = request.body

  const usecase = new CreateBank(bankDAO)

  try {
    const output = await usecase.execute(input)
    response.status(201).json(output)
  } catch (error: any) {
    return response.status(422).json({
      message: error.message,
    })
  }
})

app.put('/bank/:bank_id', async (request: Request, response: Response) => {
  const bankId = request.params.bank_id
  const bankData = request.body

  const input = {
    id: Number(bankId),
    ...bankData,
  }

  const usecase = new UpdateBank(bankDAO)

  try {
    const output = await usecase.execute(input)
    response.status(200).json(output)
  } catch (error: any) {
    if (error?.message === 'Bank not found') {
      return response.status(404).json({
        message: error.message,
      })
    }

    return response.status(422).json({
      message: error.message,
    })
  }
})

app.delete('/bank/:bank_id', async (request: Request, response: Response) => {
  const bankId = request.params.bank_id

  const usecase = new RemoveBank(bankDAO)
  await usecase.execute({ id: Number(bankId) })

  response.status(200).end()
})

app.listen(3001, () => {
  console.log('Server running at http://localhost:3001')
})
