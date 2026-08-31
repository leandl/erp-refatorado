import { BankDAO } from '@bank-dao.ts'

import { BankDAOFake } from '../../mocks/bank-dao-fake.ts'

let bankDAO: BankDAO

beforeEach(async () => {
  bankDAO = new BankDAOFake()
})

test('Should create, retrieve, update, list, and remove a bank', async () => {
  const fakeCode1 = `${Math.random()}`.substring(2, 5)
  const TEST_DATA_ORIGINAL = {
    code: fakeCode1,
    name: 'Test',
    url: 'test.com.br',
  }

  const fakeCode2 = `${Math.random()}`.substring(2, 5)
  const TEST_DATA_UPDATED = {
    code: fakeCode2,
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

test('Should retrieve a bank by code', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  const input = {
    code: fakeCode,
    name: 'Bank Test',
    url: 'bank.com.br',
  }

  const bankId = await bankDAO.save(input)

  const bank = await bankDAO.getByCode(input.code)

  expect(bank).toBeTruthy()
  expect(bank).toMatchObject({
    bank_id: bankId,
    ...input,
  })

  await bankDAO.remove(bankId)
})

test('Should return undefined when retrieving a non-existent bank by code', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)

  let bank = await bankDAO.getByCode(fakeCode)
  expect(bank).toBeUndefined()

  const input = {
    code: fakeCode,
    name: 'Bank Test',
    url: 'bank.com.br',
  }

  const bankId = await bankDAO.save(input)
  await bankDAO.remove(bankId)

  bank = await bankDAO.getByCode(fakeCode)
  expect(bank).toBeUndefined()
})
