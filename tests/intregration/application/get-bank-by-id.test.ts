import { Bank } from '@bank.ts'
import { BankRepository } from '@bank-repository.ts'
import { GetBankById } from '@get-bank-by-id.ts'

import { BankRepositoryFake } from '../../mocks/bank-repository-fake.ts'

let bankRepository: BankRepository
let sut: GetBankById

beforeEach(() => {
  bankRepository = new BankRepositoryFake()
  sut = new GetBankById(bankRepository)
})

const makeBank = async (overrides: Partial<Bank.CreateParams> = {}) => {
  const bank = Bank.create({
    code: `${Math.random()}`.substring(2, 5),
    name: 'Test Bank',
    url: 'https://test.com',
    ...overrides,
  })

  return bankRepository.save(bank)
}

test('Should get bank by id', async () => {
  const savedBank = await makeBank({
    code: '001',
    name: 'Banco Test',
    url: 'https://bank.com',
  })

  const bank = await sut.execute({ id: savedBank.getBankId() })

  expect(bank).toEqual({
    id: savedBank.getBankId(),
    code: '001',
    name: 'Banco Test',
    url: 'https://bank.com',
  })
})

test('Should return undefined when bank does not exist', async () => {
  const NON_EXISTENT_ID = 999
  const bank = await sut.execute({ id: NON_EXISTENT_ID })

  expect(bank).toBeUndefined()
})

test('Should return undefined after bank is removed', async () => {
  const savedBank = await makeBank()

  await bankRepository.remove(savedBank.getBankId())

  const bank = await sut.execute({ id: savedBank.getBankId() })

  expect(bank).toBeUndefined()
})

test('Should return the correct bank when multiple banks exist', async () => {
  await makeBank({
    code: '001',
    name: 'First Bank',
  })

  const targetBank = await makeBank({
    code: '237',
    name: 'Target Bank',
    url: 'https://target.com',
  })

  await makeBank({
    code: '341',
    name: 'Third Bank',
  })

  const bank = await sut.execute({ id: targetBank.getBankId() })

  expect(bank).toEqual({
    id: targetBank.getBankId(),
    code: '237',
    name: 'Target Bank',
    url: 'https://target.com',
  })
})

test('Should preserve bank data after saving', async () => {
  const savedBank = await makeBank({
    code: '104',
    name: 'Caixa Test',
    url: 'https://caixa.test',
  })

  const bank = await sut.execute({ id: savedBank.getBankId() })

  expect(bank?.code).toBe('104')
  expect(bank?.name).toBe('Caixa Test')
  expect(bank?.url).toBe('https://caixa.test')
})
