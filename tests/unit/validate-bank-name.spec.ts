import { validateBankName } from '@domain/entities/validate-bank-name.ts'

test.each(['', undefined, null, 'Banco', 'Nubank', '123', 'Banco123', '   '])(
  'Should return false for an invalid bank name: %s',
  (invalidName: unknown) => {
    expect(validateBankName(invalidName as string)).toBe(false)
  },
)

test.each([
  'Banco Inter',
  'Banco do Brasil',
  'Caixa Econômica',
  'XP Investimentos',
  'A B',
])('Should return true for a valid bank name: %s', (validName) => {
  expect(validateBankName(validName)).toBe(true)
})

test('Should return true when words are separated by multiple spaces', () => {
  expect(validateBankName('Banco    Inter')).toBe(true)
})

test('Should return true when words are separated by a tab', () => {
  expect(validateBankName('Banco\tInter')).toBe(true)
})

test('Should return true when words are separated by a newline', () => {
  expect(validateBankName('Banco\nInter')).toBe(true)
})
