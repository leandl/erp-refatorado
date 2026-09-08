import { Bank } from '@bank.ts'
import { BankRepository } from '@bank-repository.ts'
import { RemoveBank } from '@remove-bank.ts'

import { BankRepositoryFake } from '../../mocks/bank-repository-fake.ts'

let bankRepository: BankRepository
let sut: RemoveBank

beforeEach(() => {
  bankRepository = new BankRepositoryFake()
  sut = new RemoveBank(bankRepository)
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

test('Should remove a bank', async () => {
  const savedBank = await makeBank({
    code: '001',
    name: 'Banco Teste',
  })

  await sut.execute({ id: savedBank.getBankId() })

  const removedBank = await bankRepository.findById(savedBank.getBankId())

  expect(removedBank).toBeUndefined()
})

test('Should remove only the requested bank', async () => {
  const firstBank = await makeBank({
    code: '001',
    name: 'Bank 1',
  })

  const secondBank = await makeBank({
    code: '237',
    name: 'Bank 2',
  })

  await sut.execute({ id: firstBank.getBankId() })

  expect(await bankRepository.findById(firstBank.getBankId())).toBeUndefined()

  const remainingBank = await bankRepository.findById(secondBank.getBankId())

  expect(remainingBank).toBeDefined()
  expect(remainingBank?.getBankId()).toBe(secondBank.getBankId())
})

test('Should not fail when removing a non-existent bank', async () => {
  const NON_EXISTENT_BANK_ID = 999
  await expect(
    sut.execute({ id: NON_EXISTENT_BANK_ID }),
  ).resolves.toBeUndefined()
})

test('Should keep repository empty after removing the only bank', async () => {
  const savedBank = await makeBank()

  await sut.execute({ id: savedBank.getBankId() })

  expect(await bankRepository.findById(savedBank.getBankId())).toBeUndefined()
})

test('Should allow creating another bank with the same code after removal', async () => {
  const savedBank = await makeBank({
    code: '341',
    name: 'Original Bank',
  })

  await sut.execute({ id: savedBank.getBankId() })

  const recreatedBank = await makeBank({
    code: '341',
    name: 'New Bank',
  })

  expect(recreatedBank.getCode()).toBe('341')
  expect(recreatedBank.getName()).toBe('New Bank')
})
