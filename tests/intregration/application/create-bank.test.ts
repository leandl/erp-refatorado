import { BankDAO } from '@bank-dao.ts'
import { CreateBank } from '@create-bank.ts'
import Sinon from 'sinon'

import { BankDAOFake } from '../../mocks/bank-dao-fake.ts'

let bankDAO: BankDAO
let sut: CreateBank

beforeAll(() => {
  bankDAO = new BankDAOFake()
  sut = new CreateBank(bankDAO)
})

afterEach(() => {
  Sinon.restore()
})

test('Should create bank ', async () => {
  const bankInput = {
    code: '111',
    name: 'Test Name 1',
    url: 'test1.com',
  }

  const { id: bankId, ...restSavedBank } = await sut.execute(bankInput)

  const savedBank = await bankDAO.getById(bankId)

  expect(savedBank).toEqual({
    bank_id: bankId,
    ...restSavedBank,
  })
})

test.each(['', undefined, null, 'Test'])(
  'Should not create a bank with an invalid name %s',
  async (rawName: unknown) => {
    const inputCreate = {
      code: '555',
      name: rawName as string,
      url: 'test4.com',
    }

    await expect(sut.execute(inputCreate)).rejects.toThrow('Invalid name')
  },
)
