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
  const fakeCode = `${Math.random()}`.substring(2, 5)
  const bankInput = {
    code: fakeCode,
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
    const fakeCode = `${Math.random()}`.substring(2, 5)
    const inputCreate = {
      code: fakeCode,
      name: rawName as string,
      url: 'test4.com',
    }

    await expect(sut.execute(inputCreate)).rejects.toThrow('Invalid name')
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
  'Should not create a bank with an invalid code %s',
  async (invalidCode: unknown) => {
    const inputCreate = {
      code: invalidCode as string,
      name: 'test 24',
      url: 'test4.com',
    }

    await expect(sut.execute(inputCreate)).rejects.toThrow('Invalid code')
  },
)

test('Should not create two banks with the same code', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  const input = {
    code: fakeCode,
    name: 'Banco Teste',
    url: 'teste.com',
  }

  await sut.execute(input)

  await expect(
    sut.execute({
      ...input,
      name: 'Outro Banco',
    }),
  ).rejects.toThrow('Bank code already exists')
})
