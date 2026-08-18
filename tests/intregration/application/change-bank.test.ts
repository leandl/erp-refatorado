import { changeBank } from '@change-bank.ts'
import { getById, save } from '@database.ts'

import { orchestrator } from '../../orchestrator.ts'

beforeAll(async () => {
  await orchestrator.waitForAllServices()
  await orchestrator.clearDatabase()
  await orchestrator.runPendingMigrations()
})

test('Should update a bank', async () => {
  const bankInput = {
    code: '553',
    name: 'Test Name',
    url: 'test4.com',
  }

  const bankId = await save(bankInput)
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

  const persistedBank = await getById(bankId)
  expect(persistedBank).toEqual(
    expect.objectContaining({
      bank_id: bankId,
      ...updateInput,
    }),
  )
})
