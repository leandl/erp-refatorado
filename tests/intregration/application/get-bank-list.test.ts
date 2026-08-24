import { BankDAO } from '@bank-dao.ts'
import { GetBankList } from '@get-bank-list.ts'
import Sinon from 'sinon'

import { BankDAOFake } from '../../mocks/bank-dao-fake.ts'

let bankDAO: BankDAO
let sut: GetBankList

beforeAll(() => {
  bankDAO = new BankDAOFake()
  sut = new GetBankList(bankDAO)
})

afterEach(() => {
  Sinon.restore()
})

test('Should get bank list', async () => {
  const bankInput1 = {
    code: '111',
    name: 'Test Name 1',
    url: 'test1.com',
  }

  const bankId1 = await bankDAO.save(bankInput1)

  const bankInput2 = {
    code: '222',
    name: 'Test Name 2',
    url: 'test2.com',
  }

  const bankId2 = await bankDAO.save(bankInput2)

  const banks = await sut.execute()
  expect(banks.length).toBe(2)
  expect(banks[0]).toEqual({
    id: bankId1,
    ...bankInput1,
  })

  expect(banks[1]).toEqual({
    id: bankId2,
    ...bankInput2,
  })
})
