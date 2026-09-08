import { BankRepository } from '@bank-repository.ts'
import { CreateBank } from '@create-bank.ts'

import { BankRepositoryFake } from '../../mocks/bank-repository-fake.ts'

let bankRepository: BankRepository
let sut: CreateBank

beforeEach(() => {
  bankRepository = new BankRepositoryFake()
  sut = new CreateBank(bankRepository)
})

const makeInput = (overrides = {}) => ({
  code: `${Math.floor(Math.random() * 900 + 100)}`,
  name: 'Test Bank',
  url: 'https://test.com',
  ...overrides,
})

test('Should create a bank', async () => {
  const input = makeInput({
    code: '001',
    name: 'Banco Teste',
    url: 'https://bank.com',
  })

  const createdBank = await sut.execute(input)
  const savedBank = await bankRepository.findById(createdBank.id)

  expect(createdBank).toEqual({
    id: expect.any(Number),
    ...input,
  })

  expect(savedBank).toBeDefined()
  expect(savedBank?.getBankId()).toBe(createdBank.id)
  expect(savedBank?.getCode()).toBe(input.code)
  expect(savedBank?.getName()).toBe(input.name)
  expect(savedBank?.getUrl()).toBe(input.url)
})

test('Should generate different ids for different banks', async () => {
  const first = await sut.execute(makeInput({ code: '001', name: 'Bank 1' }))
  const second = await sut.execute(makeInput({ code: '002', name: 'Bank 2' }))

  expect(first.id).not.toBe(second.id)
})

test('Should create multiple banks with different names and codes', async () => {
  const first = await sut.execute(makeInput({ code: '001', name: 'Bank 1' }))
  const second = await sut.execute(makeInput({ code: '237', name: 'Bank 2' }))

  const firstSaved = await bankRepository.findById(first.id)
  const secondSaved = await bankRepository.findById(second.id)

  expect(firstSaved).toBeDefined()
  expect(secondSaved).toBeDefined()
  expect(firstSaved?.getCode()).toBe('001')
  expect(secondSaved?.getCode()).toBe('237')
})

test.each(['', undefined, null, 'Test'])(
  'Should not create a bank with an invalid name: %s',
  async (invalidName: unknown) => {
    await expect(
      sut.execute(makeInput({ name: invalidName as string })),
    ).rejects.toThrow('Invalid name')
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
  'Should not create a bank with an invalid code: %s',
  async (invalidCode: unknown) => {
    await expect(
      sut.execute(makeInput({ code: invalidCode as string })),
    ).rejects.toThrow('Invalid code')
  },
)

test('Should not create two banks with the same code', async () => {
  const input = makeInput({
    code: '033',
    name: 'Banco Teste',
  })

  await sut.execute(input)

  await expect(
    sut.execute({
      ...input,
      name: 'Outro Banco',
    }),
  ).rejects.toThrow('Bank code already exists')
})

test('Should not create two banks with the same name', async () => {
  const name = 'Banco Único'

  await sut.execute(
    makeInput({
      code: '001',
      name,
    }),
  )

  await expect(
    sut.execute(
      makeInput({
        code: '237',
        name,
      }),
    ),
  ).rejects.toThrow('Bank name already exists')
})

test('Should allow same url for different banks', async () => {
  const url = 'https://shared.com'

  await expect(
    sut.execute(
      makeInput({
        code: '001',
        name: 'Bank 1',
        url,
      }),
    ),
  ).resolves.toBeDefined()

  await expect(
    sut.execute(
      makeInput({
        code: '237',
        name: 'Bank 2',
        url,
      }),
    ),
  ).resolves.toBeDefined()
})
