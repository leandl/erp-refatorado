import { ApplicationError } from '@application-error.ts'
import { Bank } from '@bank.ts'
import { BankRepository } from '@bank-repository.ts'
import { DomainError } from '@domain-error.ts'
import { NotFoundError } from '@not-found-error.ts'
import { UpdateBank } from '@update-bank.ts'

import { BankRepositoryFake } from '../../mocks/bank-repository-fake.ts'

let bankRepository: BankRepository
let sut: UpdateBank

beforeEach(() => {
  bankRepository = new BankRepositoryFake()
  sut = new UpdateBank(bankRepository)
})

const makeBank = async (overrides = {}) => {
  const bank = Bank.create({
    code: `${Math.floor(Math.random() * 900 + 100)}`,
    name: 'Test Bank',
    url: 'https://test.com',
    ...overrides,
  })

  return bankRepository.save(bank)
}

test('Should update a bank', async () => {
  const bank = await makeBank({
    code: '001',
    name: 'Original Bank',
    url: 'https://original.com',
  })

  const input = {
    id: bank.getBankId(),
    code: '237',
    name: 'Updated Bank',
    url: 'https://updated.com',
  }

  const updatedBank = await sut.execute(input)

  expect(updatedBank).toEqual(input)

  const persistedBank = await bankRepository.findById(bank.getBankId())

  expect(persistedBank?.getBankId()).toBe(bank.getBankId())
  expect(persistedBank?.getCode()).toBe('237')
  expect(persistedBank?.getName()).toBe('Updated Bank')
  expect(persistedBank?.getUrl()).toBe('https://updated.com')
})

test('Should update a bank with the same values', async () => {
  const bank = await makeBank({
    code: '001',
    name: 'Original Bank',
    url: 'https://original.com',
  })

  const input = {
    id: bank.getBankId(),
    code: '001',
    name: 'Original Bank',
    url: 'https://original.com',
  }

  await expect(sut.execute(input)).resolves.toEqual(input)
})

test('Should update only the requested bank', async () => {
  const firstBank = await makeBank({
    code: '001',
    name: 'Bank 1',
  })

  const secondBank = await makeBank({
    code: '237',
    name: 'Bank 2',
  })

  await sut.execute({
    id: firstBank.getBankId(),
    code: '033',
    name: 'Updated Bank',
    url: 'https://updated.com',
  })

  const unchangedBank = await bankRepository.findById(secondBank.getBankId())

  expect(unchangedBank?.getCode()).toBe('237')
  expect(unchangedBank?.getName()).toBe('Bank 2')
})

test.each(['', undefined, null, 'Test'])(
  'Should not update a bank with an invalid name: %s',
  async (invalidName: unknown) => {
    const bank = await makeBank()

    await expect(
      sut.execute({
        id: bank.getBankId(),
        code: '237',
        name: invalidName as string,
        url: 'https://test.com',
      }),
    ).rejects.toThrow(new DomainError('Invalid name'))
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
  'Should not update a bank with an invalid code: %s',
  async (invalidCode: unknown) => {
    const bank = await makeBank()

    await expect(
      sut.execute({
        id: bank.getBankId(),
        code: invalidCode as string,
        name: 'Updated Bank',
        url: 'https://test.com',
      }),
    ).rejects.toThrow(new DomainError('Invalid code'))
  },
)

test('Should not update a bank that does not exist', async () => {
  const NON_EXISTENT_BANK_ID = 999
  await expect(
    sut.execute({
      id: NON_EXISTENT_BANK_ID,
      code: '001',
      name: 'Bank 1',
      url: 'https://test.com',
    }),
  ).rejects.toThrow(new NotFoundError('Bank not found'))
})

test('Should not update a bank with another bank code', async () => {
  const firstBank = await makeBank({
    code: '001',
    name: 'Bank 1',
  })

  await makeBank({
    code: '237',
    name: 'Bank 2',
  })

  await expect(
    sut.execute({
      id: firstBank.getBankId(),
      code: '237',
      name: 'Bank 1',
      url: 'https://test.com',
    }),
  ).rejects.toThrow(new ApplicationError('Bank code already exists'))
})

test('Should not update a bank with another bank name', async () => {
  const firstBank = await makeBank({
    code: '001',
    name: 'Bank 1',
  })

  await makeBank({
    code: '237',
    name: 'Bank 2',
  })

  await expect(
    sut.execute({
      id: firstBank.getBankId(),
      code: '001',
      name: 'Bank 2',
      url: 'https://test.com',
    }),
  ).rejects.toThrow(new ApplicationError('Bank name already exists'))
})

test('Should allow keeping the same code', async () => {
  const bank = await makeBank({
    code: '001',
    name: 'Bank 1',
  })

  await expect(
    sut.execute({
      id: bank.getBankId(),
      code: '001',
      name: 'Updated Name',
      url: 'https://updated.com',
    }),
  ).resolves.toBeDefined()
})

test('Should allow keeping the same name', async () => {
  const bank = await makeBank({
    code: '001',
    name: 'Bank 1',
  })

  await expect(
    sut.execute({
      id: bank.getBankId(),
      code: '237',
      name: 'Bank 1',
      url: 'https://updated.com',
    }),
  ).resolves.toBeDefined()
})

test('Should allow reusing an old code after it is changed', async () => {
  const firstBank = await makeBank({
    code: '001',
    name: 'Bank 1',
  })

  const secondBank = await makeBank({
    code: '237',
    name: 'Bank 2',
  })

  await sut.execute({
    id: firstBank.getBankId(),
    code: '033',
    name: 'Bank 1',
    url: 'https://test.com',
  })

  await expect(
    sut.execute({
      id: secondBank.getBankId(),
      code: '001',
      name: 'Bank 2',
      url: 'https://test.com',
    }),
  ).resolves.toBeDefined()
})

test('Should allow reusing an old name after it is changed', async () => {
  const firstBank = await makeBank({
    code: '001',
    name: 'Bank 1',
  })

  const secondBank = await makeBank({
    code: '237',
    name: 'Bank 2',
  })

  await sut.execute({
    id: firstBank.getBankId(),
    code: '001',
    name: 'Renamed Bank',
    url: 'https://test.com',
  })

  await expect(
    sut.execute({
      id: secondBank.getBankId(),
      code: '237',
      name: 'Bank 1',
      url: 'https://test.com',
    }),
  ).resolves.toBeDefined()
})
