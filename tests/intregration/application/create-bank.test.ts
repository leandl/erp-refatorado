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
