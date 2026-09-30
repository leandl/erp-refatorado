import { BankCode } from '@domain/entities/bank-code.ts'
import { DomainError } from '@domain/errors/domain-error.ts'

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
  'Should throw an error when the bank code is invalid: %s',
  (invalidCode: unknown) => {
    expect(() => new BankCode(invalidCode as string)).toThrow(
      new DomainError('Invalid code'),
    )
  },
)

test.each(['000', '001', '033', '104', '237', '341', '999'])(
  'Should create a BankCode with a valid code: %s',
  (validCode) => {
    const bankCode = new BankCode(validCode)

    expect(bankCode).toBeInstanceOf(BankCode)
    expect(bankCode.getValue()).toBe(validCode)
  },
)
