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
  const fakeCode1 = `${Math.random()}`.substring(2, 5)
  const bankInput = {
    code: fakeCode1,
    name: 'Test Name',
    url: 'test4.com',
  }

  const bankId = await bankDAO.save(bankInput)

  const fakeCode2 = `${Math.random()}`.substring(2, 5)
  const updateInput = {
    code: fakeCode2,
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
    const fakeCode1 = `${Math.random()}`.substring(2, 5)
    const bankInput = {
      code: fakeCode1,
      name: 'Test Name',
      url: 'test4.com',
    }

    const bankId = await bankDAO.save(bankInput)

    const fakeCode2 = `${Math.random()}`.substring(2, 5)
    const inputUpdate = {
      id: bankId,
      code: fakeCode2,
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
    const fakeCode = `${Math.random()}`.substring(2, 5)
    const bankInput = {
      code: fakeCode,
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
  const fakeCode = `${Math.random()}`.substring(2, 5)
  const inputUpdate = {
    id: 9_999_999,
    code: fakeCode,
    name: 'Test Name',
    url: 'test4.com',
  }

  await expect(sut.execute(inputUpdate)).rejects.toThrow('Bank not found')
})
