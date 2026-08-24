import { BankDAO } from '@bank-dao.ts'
import { RemoveBank } from '@remove-bank.ts'
import Sinon from 'sinon'

import { BankDAOFake } from '../../mocks/bank-dao-fake.ts'

let bankDAO: BankDAO
let sut: RemoveBank

beforeAll(() => {
  bankDAO = new BankDAOFake()
  sut = new RemoveBank(bankDAO)
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

  const bankId = await bankDAO.save(bankInput)

  await sut.execute(bankId)

  const removedBank = await bankDAO.getById(bankId)

  expect(removedBank).toBe(undefined)
})
