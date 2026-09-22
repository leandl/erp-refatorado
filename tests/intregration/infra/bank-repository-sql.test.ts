import { DatabaseConnection } from '@adapters/database/database-connection.ts'
import { BankRepositorySQL } from '@adapters/database/repositories/bank-repository-sql.ts'
import { BankRepository } from '@application/repositories/bank-repository.ts'
import { Bank } from '@domain/entities/bank.ts'
import { MysqlAdapter } from '@external/database/mysql-adapter.ts'

import { orchestrator } from '../../orchestrator.ts'

let bankRepository: BankRepository
let connection: DatabaseConnection

beforeAll(async () => {
  await orchestrator.clearDatabase()
  await orchestrator.runPendingMigrations()

  connection = new MysqlAdapter(String(process.env.DATABASE_MYSQL_URL))
  // connection = new PostgresAdapter(String(process.env.DATABASE_POSTGRES_URL))
  // connection = new SqliteAdapter(String(process.env.DATABASE_SQLITE_FILENAME))

  bankRepository = new BankRepositorySQL(connection)
})

afterAll(async () => {
  await connection?.close()
})

test('Should create, retrieve, update, list, and remove a bank', async () => {
  const originalData = {
    code: `${Math.random()}`.substring(2, 5),
    name: 'Test 1',
    url: 'test.com.br',
  }

  const updatedData = {
    code: `${Math.random()}`.substring(2, 5),
    name: 'Test 2',
    url: 'test1.com.br',
  }

  const savedBank = await bankRepository.save(Bank.create(originalData))
  const bankId = savedBank.getBankId()

  let bank = await bankRepository.findById(bankId)

  expect(bank).toBeDefined()
  expect(bank?.getBankId()).toBe(bankId)
  expect(bank?.getName()).toBe(originalData.name)
  expect(bank?.getCode()).toBe(originalData.code)
  expect(bank?.getUrl()).toBe(originalData.url)

  let bankList = await bankRepository.list()
  bank = bankList.find((item) => item.getBankId() === bankId)

  expect(bank).toBeDefined()
  expect(bank?.getName()).toBe(originalData.name)
  expect(bank?.getCode()).toBe(originalData.code)
  expect(bank?.getUrl()).toBe(originalData.url)

  bank!.changeName(updatedData.name)
  bank!.changeCode(updatedData.code)
  bank!.setUrl(updatedData.url)

  await bankRepository.update(bank!)

  bank = await bankRepository.findById(bankId)

  expect(bank).toBeDefined()
  expect(bank?.getBankId()).toBe(bankId)
  expect(bank?.getName()).toBe(updatedData.name)
  expect(bank?.getCode()).toBe(updatedData.code)
  expect(bank?.getUrl()).toBe(updatedData.url)

  bankList = await bankRepository.list()
  bank = bankList.find((item) => item.getBankId() === bankId)

  expect(bank).toBeDefined()
  expect(bank?.getName()).toBe(updatedData.name)
  expect(bank?.getCode()).toBe(updatedData.code)
  expect(bank?.getUrl()).toBe(updatedData.url)

  await bankRepository.remove(bankId)

  expect(await bankRepository.findById(bankId)).toBeUndefined()
  expect(
    (await bankRepository.list()).find((item) => item.getBankId() === bankId),
  ).toBeUndefined()
})

test('Should retrieve a bank by code', async () => {
  const input = {
    code: `${Math.random()}`.substring(2, 5),
    name: 'Bank Test',
    url: 'bank.com.br',
  }

  const savedBank = await bankRepository.save(Bank.create(input))

  const bank = await bankRepository.findByCode(input.code)

  expect(bank).toBeDefined()
  expect(bank?.getBankId()).toBe(savedBank.getBankId())
  expect(bank?.getName()).toBe(input.name)
  expect(bank?.getCode()).toBe(input.code)
  expect(bank?.getUrl()).toBe(input.url)
})

test('Should return undefined when retrieving a non-existent bank by code', async () => {
  const code = `${Math.random()}`.substring(2, 5)

  expect(await bankRepository.findByCode(code)).toBeUndefined()

  const savedBank = await bankRepository.save(
    Bank.create({
      code,
      name: 'Bank Test',
      url: 'bank.com.br',
    }),
  )

  await bankRepository.remove(savedBank.getBankId())

  expect(await bankRepository.findByCode(code)).toBeUndefined()
})

test('Should retrieve a bank by name', async () => {
  const input = {
    code: `${Math.random()}`.substring(2, 5),
    name: `Test ${Math.random()}`,
    url: 'bank.com.br',
  }

  const savedBank = await bankRepository.save(Bank.create(input))

  const bank = await bankRepository.findByName(input.name)

  expect(bank).toBeDefined()
  expect(bank?.getBankId()).toBe(savedBank.getBankId())
  expect(bank?.getName()).toBe(input.name)
  expect(bank?.getCode()).toBe(input.code)
  expect(bank?.getUrl()).toBe(input.url)
})

test('Should return undefined when retrieving a non-existent bank by name', async () => {
  const name = `Test ${Math.random()}`

  expect(await bankRepository.findByName(name)).toBeUndefined()

  const savedBank = await bankRepository.save(
    Bank.create({
      code: `${Math.random()}`.substring(2, 5),
      name,
      url: 'bank.com.br',
    }),
  )

  await bankRepository.remove(savedBank.getBankId())

  expect(await bankRepository.findByName(name)).toBeUndefined()
})
