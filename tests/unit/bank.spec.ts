import { Bank } from '@bank.ts'

test('should create a bank', () => {
  const bankInput = {
    name: 'Any Name',
    code: '123',
    url: 'https://anyurl.com',
  }

  const instance = Bank.create(bankInput)

  expect(instance).toBeTruthy()
  expect(instance).toBeInstanceOf(Bank)

  expect(instance.getBankId()).toBeDefined()
  expect(instance.getName()).toBe(bankInput.name)
  expect(instance.getCode()).toBe(bankInput.code)
  expect(instance.getUrl()).toBe(bankInput.url)
})

test('should restore a bank', () => {
  const bankDTO = {
    id: 1,
    name: 'Any Name',
    code: '123',
    url: 'https://anyurl.com',
  }

  const instance = Bank.restore(bankDTO)

  expect(instance).toBeTruthy()
  expect(instance).toBeInstanceOf(Bank)

  expect(instance.getBankId()).toBe(bankDTO.id)
  expect(instance.getName()).toBe(bankDTO.name)
  expect(instance.getCode()).toBe(bankDTO.code)
  expect(instance.getUrl()).toBe(bankDTO.url)
})
