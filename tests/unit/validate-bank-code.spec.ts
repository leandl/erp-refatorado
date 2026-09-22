import { validateBankCode } from '@domain/entities/validate-bank-code.ts'

test.each([
  '',
  undefined,
  null,
  '1',
  '01',
  '1111',
  'ABC',
  'A12',
  '12A',
  '!@1',
  '12 ',
  ' 12',
  '123 ',
  ' 123',
  '12.3',
  '-123',
])(
  'Should return false for an invalid bank code: %s',
  (invalidCode: unknown) => {
    expect(validateBankCode(invalidCode as string)).toBe(false)
  },
)

test.each(['000', '001', '033', '104', '237', '341', '999'])(
  'Should return true for a valid bank code: %s',
  (validCode) => {
    expect(validateBankCode(validCode)).toBe(true)
  },
)
