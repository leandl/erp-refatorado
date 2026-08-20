import { BankDAO } from '@bank-dao.ts'
import { UpdateBank } from '@update-bank.ts'
import Sinon from 'sinon'

import { BankDAOFake } from '../../mocks/bank-dao-fake.ts'

let bankDAO: BankDAO
let sut: UpdateBank

beforeAll(() => {
  bankDAO = new BankDAOFake()
  sut = new UpdateBank(bankDAO)
})

afterEach(() => {
  Sinon.restore()
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

  const updatedBank = await sut.execute({ id: bankId, ...updateInput })
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

  await bankDAO.remove(bankId)
})
