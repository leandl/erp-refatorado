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

test.each(['', undefined, null, 'Test'])(
  'Should not update a bank with an invalid name %s',
  async (rawName: unknown) => {
    const bankInput = {
      code: '553',
      name: 'Test Name',
      url: 'test4.com',
    }

    const bankId = await bankDAO.save(bankInput)

    const inputUpdate = {
      id: bankId,
      code: '555',
      name: rawName as string,
      url: 'test4.com',
    }

    await expect(sut.execute(inputUpdate)).rejects.toThrow('Invalid name')
    await bankDAO.remove(bankId)
  },
)

test.each([
  '',
  undefined,
  null,
  'Test',
  '1',
  '01',
  '1111',
  'ABC',
  'A12',
  '!@1',
])(
  'Should not update a bank with an invalid code %s',
  async (invalidCode: unknown) => {
    const bankInput = {
      code: '553',
      name: 'Test Name',
      url: 'test4.com',
    }

    const bankId = await bankDAO.save(bankInput)

    const inputUpdate = {
      id: bankId,
      code: invalidCode as string,
      name: 'test 555',
      url: 'test4.com',
    }

    await expect(sut.execute(inputUpdate)).rejects.toThrow('Invalid code')
    await bankDAO.remove(bankId)
  },
)

test('Should not update a bank that does not exist', async () => {
  const inputUpdate = {
    id: 9_999_999,
    code: '553',
    name: 'Test Name',
    url: 'test4.com',
  }

  await expect(sut.execute(inputUpdate)).rejects.toThrow('Bank not found')
})
