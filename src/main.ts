import { ApplicationError } from '@application-error.ts'
import { BankRepositoryDatabase } from '@bank-repository.ts'
import { CreateBank } from '@create-bank.ts'
import { DatabaseStatusDAODatabase } from '@database-status-dao.ts'
import { DomainError } from '@domain-error.ts'
import { GetBankById } from '@get-bank-by-id.ts'
import { GetBankList } from '@get-bank-list.ts'
import { NotFoundError } from '@not-found-error.ts'
import { RemoveBank } from '@remove-bank.ts'
import { UpdateBank } from '@update-bank.ts'
import cors from 'cors'
import express, { Request, Response } from 'express'

const app = express()

app.use(express.json())
app.use(cors())

const bankRepository = new BankRepositoryDatabase()

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
  const usecase = new GetBankList(bankRepository)

  try {
    const output = await usecase.execute()
    response.status(200).json(output)
  } catch {
    return response.status(500).json({
      code: 'SERVER_ERROR',
      message: 'Internal server error',
    })
  }
})

app.get('/bank/:bank_id', async (request: Request, response: Response) => {
  const bankId = request.params.bank_id

  const input = { id: Number(bankId) }
  const usecase = new GetBankById(bankRepository)

  try {
    const output = await usecase.execute(input)
    response.status(200).json(output)
  } catch (error: unknown) {
    if (error instanceof NotFoundError) {
      return response.status(404).json({
        code: error.code,
        message: error.message,
      })
    }

    return response.status(500).json({
      code: 'SERVER_ERROR',
      message: 'Internal server error',
    })
  }
})

app.post('/bank', async (request: Request, response: Response) => {
  const bankData = request.body

  const input = {
    name: bankData.name,
    code: bankData.code,
    url: bankData.url,
  }

  const usecase = new CreateBank(bankRepository)

  try {
    const output = await usecase.execute(input)
    response.status(201).json(output)
  } catch (error: unknown) {
    if (error instanceof DomainError || error instanceof ApplicationError) {
      return response.status(422).json({
        code: error.code,
        message: error.message,
      })
    }

    return response.status(500).json({
      code: 'SERVER_ERROR',
      message: 'Internal server error',
    })
  }
})

app.put('/bank/:bank_id', async (request: Request, response: Response) => {
  const bankId = request.params.bank_id
  const bankData = request.body

  const input = {
    id: Number(bankId),
    name: bankData.name,
    code: bankData.code,
    url: bankData.url,
  }

  const usecase = new UpdateBank(bankRepository)

  try {
    const output = await usecase.execute(input)
    response.status(200).json(output)
  } catch (error: unknown) {
    if (error instanceof NotFoundError) {
      return response.status(404).json({
        code: error.code,
        message: error.message,
      })
    }

    if (error instanceof DomainError || error instanceof ApplicationError) {
      return response.status(422).json({
        code: error.code,
        message: error.message,
      })
    }

    return response.status(500).json({
      code: 'SERVER_ERROR',
      message: 'Internal server error',
    })
  }
})

app.delete('/bank/:bank_id', async (request: Request, response: Response) => {
  const bankId = request.params.bank_id

  const input = {
    id: Number(bankId),
  }

  const usecase = new RemoveBank(bankRepository)

  try {
    await usecase.execute(input)

    response.status(200).end()
  } catch (error: any) {
    return response.status(500).json({
      code: 'SERVER_ERROR',
      message: 'Internal server error',
    })
  }
})

app.listen(3001, () => {
  console.log('Server running at http://localhost:3001')
})
