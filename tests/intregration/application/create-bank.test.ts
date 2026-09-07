import { BankRepository } from '@bank-repository.ts'
import { CreateBank } from '@create-bank.ts'

import { BankRepositoryFake } from '../../mocks/bank-repository-fake.ts'

let bankRepository: BankRepository
let sut: CreateBank

beforeEach(() => {
  bankRepository = new BankRepositoryFake()
  sut = new CreateBank(bankRepository)
})

test('Should create a bank', async () => {
  const input = {
    code: `${Math.random()}`.substring(2, 5),
    name: 'Test Name 1',
    url: 'test1.com',
  }

  const createdBank = await sut.execute(input)
  const savedBank = await bankRepository.findById(createdBank.id)

  expect(savedBank).toBeDefined()
  expect(savedBank).toBeInstanceOf(Object)
  expect(savedBank?.getBankId()).toBe(createdBank.id)
  expect(savedBank?.getName()).toBe(createdBank.name)
  expect(savedBank?.getCode()).toBe(createdBank.code)
  expect(savedBank?.getUrl()).toBe(createdBank.url)
})

test.each(['', undefined, null, 'Test'])(
  'Should not create a bank with an invalid name %s',
  async (rawName: unknown) => {
    const input = {
      code: `${Math.random()}`.substring(2, 5),
      name: rawName as string,
      url: 'test4.com',
    }

    await expect(sut.execute(input)).rejects.toThrow('Invalid name')
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
    const input = {
      code: invalidCode as string,
      name: 'Test 24',
      url: 'test4.com',
    }

    await expect(sut.execute(input)).rejects.toThrow('Invalid code')
  },
)

test('Should not create two banks with the same code', async () => {
  const input = {
    code: `${Math.random()}`.substring(2, 5),
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

test('Should not create two banks with the same name', async () => {
  const name = `Name ${Math.random()}`

  await sut.execute({
    code: `${Math.random()}`.substring(2, 5),
    name,
    url: 'teste.com',
  })

  await expect(
    sut.execute({
      code: `${Math.random()}`.substring(2, 5),
      name,
      url: 'teste.com',
    }),
  ).rejects.toThrow('Bank name already exists')
})
