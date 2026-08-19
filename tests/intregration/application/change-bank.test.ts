import { BankDAO } from '@bank-dao.ts'
import { changeBank } from '@change-bank.ts'

import { orchestrator } from '../../orchestrator.ts'

let bankDAO: BankDAO

beforeAll(async () => {
  await orchestrator.waitForAllServices()
  await orchestrator.clearDatabase()
  await orchestrator.runPendingMigrations()

  bankDAO = new BankDAO()
})

test('Should update a bank', async () => {
  const bankInput = {
    code: '553',
    name: 'Test Name',
    url: 'test4.com',
  }

  const bankId = await bankDAO.save(bankInput)
  const updateInput = {
    code: '553',
    name: 'Test Name Changed',
    url: 'test4.changed.com',
  }

  const updatedBank = await changeBank({ id: bankId, ...updateInput })
  expect(updatedBank).toEqual(
    expect.objectContaining({
      id: bankId,
      ...updateInput,
    }),
  )

  const persistedBank = await bankDAO.getById(bankId)
  expect(persistedBank).toEqual(
    expect.objectContaining({
      bank_id: bankId,
      ...updateInput,
    }),
  )
})
