import { BankRepository } from '@application/repositories/bank-repository.ts'
import { GetBankList } from '@application/usecases/get-bank-list.ts'
import { Bank } from '@domain/entities/bank.ts'

import { BankRepositoryFake } from '../../mocks/bank-repository-fake.ts'

let bankRepository: BankRepository
let sut: GetBankList

beforeEach(() => {
  bankRepository = new BankRepositoryFake()
  sut = new GetBankList(bankRepository)
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

test('Should return an empty bank list when no banks exist', async () => {
  const banks = await sut.execute()

  expect(banks).toEqual([])
})

test('Should return a list with one bank', async () => {
  const savedBank = await makeBank({
    code: '001',
    name: 'Bank 1',
    url: 'https://bank1.com',
  })

  const banks = await sut.execute()

  expect(banks).toEqual([
    {
      id: savedBank.getBankId(),
      code: '001',
      name: 'Bank 1',
      url: 'https://bank1.com',
    },
  ])
})

test('Should return all banks', async () => {
  const firstBank = await makeBank({
    code: '001',
    name: 'Bank 1',
    url: 'https://bank1.com',
  })

  const secondBank = await makeBank({
    code: '237',
    name: 'Bank 2',
    url: 'https://bank2.com',
  })

  const banks = await sut.execute()

  expect(banks).toHaveLength(2)
  expect(banks).toEqual([
    {
      id: firstBank.getBankId(),
      code: '001',
      name: 'Bank 1',
      url: 'https://bank1.com',
    },
    {
      id: secondBank.getBankId(),
      code: '237',
      name: 'Bank 2',
      url: 'https://bank2.com',
    },
  ])
})

test('Should preserve insertion order', async () => {
  const firstBank = await makeBank({
    code: '001',
    name: 'First Bank',
  })

  const secondBank = await makeBank({
    code: '033',
    name: 'Second Bank',
  })

  const thirdBank = await makeBank({
    code: '341',
    name: 'Third Bank',
  })

  const banks = await sut.execute()

  expect(banks.map((bank) => bank.id)).toEqual([
    firstBank.getBankId(),
    secondBank.getBankId(),
    thirdBank.getBankId(),
  ])
})

test('Should not return removed banks', async () => {
  const firstBank = await makeBank({
    code: '001',
    name: 'Bank 1',
  })

  const secondBank = await makeBank({
    code: '237',
    name: 'Bank 2',
  })

  await bankRepository.remove(firstBank.getBankId())

  const banks = await sut.execute()

  expect(banks).toHaveLength(1)
  expect(banks).toEqual([
    {
      id: secondBank.getBankId(),
      code: '237',
      name: 'Bank 2',
      url: 'https://test.com',
    },
  ])
})

test('Should return immutable bank data', async () => {
  const savedBank = await makeBank({
    code: '104',
    name: 'Caixa Test',
    url: 'https://caixa.test',
  })

  const [bank] = await sut.execute()

  expect(bank).toEqual({
    id: savedBank.getBankId(),
    code: '104',
    name: 'Caixa Test',
    url: 'https://caixa.test',
  })

  expect(bank).not.toBe(savedBank)
})
