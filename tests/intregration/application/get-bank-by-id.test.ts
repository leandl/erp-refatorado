import { BankDAO } from '@bank-dao.ts'
import { GetBankById } from '@get-bank-by-id.ts'
import Sinon from 'sinon'

import { BankDAOFake } from '../../mocks/bank-dao-fake.ts'

let bankDAO: BankDAO
let sut: GetBankById

beforeAll(() => {
  bankDAO = new BankDAOFake()
  sut = new GetBankById(bankDAO)
})

afterEach(() => {
  Sinon.restore()
})

test('Should get bank by id', async () => {
  const bankInput = {
    code: '111',
    name: 'Test Name 1',
    url: 'test1.com',
  }

  const bankId = await bankDAO.save(bankInput)

  const bank = await sut.execute({ id: bankId })

  expect(bank).toEqual({
    id: bankId,
    ...bankInput,
  })
})
