import { BankName } from '@domain/entities/bank-name.ts'
import { DomainError } from '@domain/errors/domain-error.ts'

test.each(['', undefined, null, 'Banco', 'Nubank', '123', 'Banco123', '   '])(
  'Should throw an error when the bank name is invalid: %s',
  (invalidName: unknown) => {
    expect(() => new BankName(invalidName as string)).toThrow(
      new DomainError('Invalid name'),
    )
  },
)

test.each([
  'Banco Inter',
  'Banco do Brasil',
  'Caixa Econômica',
  'XP Investimentos',
  'A B',
])('Should create a BankName with a valid name: %s', (validName) => {
  const bankName = new BankName(validName)

  expect(bankName).toBeInstanceOf(BankName)
  expect(bankName.getValue()).toBe(validName)
})

test('Should accept a bank name with multiple spaces between words', () => {
  const bankName = new BankName('Banco    Inter')

  expect(bankName.getValue()).toBe('Banco    Inter')
})

test('Should accept a bank name with a tab between words', () => {
  const bankName = new BankName('Banco\tInter')

  expect(bankName.getValue()).toBe('Banco\tInter')
})

test('Should accept a bank name with a newline between words', () => {
  const bankName = new BankName('Banco\nInter')

  expect(bankName.getValue()).toBe('Banco\nInter')
})
