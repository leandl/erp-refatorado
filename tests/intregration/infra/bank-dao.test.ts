import { BankDAO } from '@bank-dao.ts'

import { orchestrator } from '../../orchestrator.ts'

let bankDAO: BankDAO

beforeAll(async () => {
  await orchestrator.waitForAllServices()
  await orchestrator.clearDatabase()
  await orchestrator.runPendingMigrations()

  bankDAO = new BankDAO()
})

test('Should create, retrieve, update, list, and remove a bank', async () => {
  const TEST_DATA_ORIGINAL = {
    code: '123',
    name: 'Test',
    url: 'test.com.br',
  }

  const TEST_DATA_UPDATED = {
    code: '111',
    name: 'Test1',
    url: 'test1.com.br',
  }

  // Create the bank
  const bankId = await bankDAO.save(TEST_DATA_ORIGINAL)

  // Retrieve the bank by ID
  let bank = await bankDAO.getById(bankId)

  expect(bank).toBeTruthy()
  expect(bank).toMatchObject(TEST_DATA_ORIGINAL)

  // Retrieve the bank from the list
  let bankList = await bankDAO.list()
  bank = bankList.find((bankData) => bankData.bank_id === bankId)

  expect(bank).toBeTruthy()
  expect(bank).toMatchObject(TEST_DATA_ORIGINAL)

  // Update the bank
  await bankDAO.update({
    id: bankId,
    ...TEST_DATA_UPDATED,
  })

  // Verify the updated bank by ID
  bank = await bankDAO.getById(bankId)

  expect(bank).toBeTruthy()
  expect(bank).toMatchObject(TEST_DATA_UPDATED)

  // Verify the updated bank in the list
  bankList = await bankDAO.list()
  bank = bankList.find((bankData) => bankData.bank_id === bankId)

  expect(bank).toBeTruthy()
  expect(bank).toMatchObject(TEST_DATA_UPDATED)

  // Remove the bank
  await bankDAO.remove(bankId)

  // Verify that the bank was removed by ID
  bank = await bankDAO.getById(bankId)

  expect(bank).toBeFalsy()

  // Verify that the bank was removed from the list
  bankList = await bankDAO.list()
  bank = bankList.find((bankData) => bankData.bank_id === bankId)

  expect(bank).toBeFalsy()
})
