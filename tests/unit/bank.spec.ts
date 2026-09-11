import { Bank } from '@bank.ts'
import { DomainError } from '@domain-error.ts'

const makeInput = <T extends Bank.CreateParams | Bank.RestoreParams>(
  overrides: Partial<T> = {},
): T =>
  ({
    name: 'Banco Inter',
    code: '237',
    url: 'https://anyurl.com',
    ...overrides,
  }) as T

test('Should create a bank', () => {
  const input = makeInput()

  const bank = Bank.create(input)

  expect(bank).toBeInstanceOf(Bank)
  expect(bank.getBankId()).toBeDefined()
  expect(bank.getName()).toBe(input.name)
  expect(bank.getCode()).toBe(input.code)
  expect(bank.getUrl()).toBe(input.url)
})

test('Should restore a bank', () => {
  const bankDTO = {
    id: 1,
    name: 'Banco Inter',
    code: '237',
    url: 'https://anyurl.com',
  }

  const bank = Bank.restore(bankDTO)

  expect(bank).toBeInstanceOf(Bank)
  expect(bank.getBankId()).toBe(bankDTO.id)
  expect(bank.getName()).toBe(bankDTO.name)
  expect(bank.getCode()).toBe(bankDTO.code)
  expect(bank.getUrl()).toBe(bankDTO.url)
})

test.each(['', undefined, null, 'Banco', 'Nubank', '123', '   '])(
  'Should not create a bank with an invalid name: %s',
  (invalidName: unknown) => {
    expect(() =>
      Bank.create(
        makeInput<Bank.CreateParams>({
          name: invalidName as string,
        }),
      ),
    ).toThrow(new DomainError('Invalid name'))
  },
)

test.each([
  '',
  undefined,
  null,
  '1',
  '01',
  '1111',
  'ABC',
  'A12',
  '!@1',
  '12 ',
  '1234',
])(
  'Should not create a bank with an invalid code: %s',
  (invalidCode: unknown) => {
    expect(() =>
      Bank.create(
        makeInput<Bank.CreateParams>({
          code: invalidCode as string,
        }),
      ),
    ).toThrow(new DomainError('Invalid code'))
  },
)

test.each([
  'Banco Inter',
  'Banco do Brasil',
  'Caixa Econômica',
  'XP Investimentos',
])('Should create a bank with a valid name: %s', (validName) => {
  expect(() =>
    Bank.create(
      makeInput<Bank.CreateParams>({
        name: validName,
      }),
    ),
  ).not.toThrow()
})

test.each(['000', '001', '033', '104', '237', '341', '999'])(
  'Should create a bank with a valid code: %s',
  (validCode) => {
    expect(() =>
      Bank.create(
        makeInput<Bank.CreateParams>({
          code: validCode,
        }),
      ),
    ).not.toThrow()
  },
)

test('Should preserve the bank id after restore', () => {
  const bank = Bank.restore({
    id: 42,
    name: 'Banco Teste',
    code: '104',
    url: 'https://bank.com',
  })

  expect(bank.getBankId()).toBe(42)
})

test.each(['', undefined, null, 'Banco', 'Nubank', '123', '   '])(
  'Should not restore a bank with an invalid name: %s',
  (invalidName: unknown) => {
    expect(() =>
      Bank.restore(
        makeInput<Bank.RestoreParams>({
          id: 1,
          name: invalidName as string,
        }),
      ),
    ).toThrow(new DomainError('Invalid name'))
  },
)

test.each([
  '',
  undefined,
  null,
  '1',
  '01',
  '1111',
  'ABC',
  'A12',
  '!@1',
  '12 ',
  '1234',
])(
  'Should not restore a bank with an invalid code: %s',
  (invalidCode: unknown) => {
    expect(() =>
      Bank.restore(
        makeInput<Bank.RestoreParams>({
          id: 1,
          code: invalidCode as string,
        }),
      ),
    ).toThrow(new DomainError('Invalid code'))
  },
)

test.each([
  'Banco Inter',
  'Banco do Brasil',
  'Caixa Econômica',
  'XP Investimentos',
])('Should restore a bank with a valid name: %s', (validName) => {
  expect(() =>
    Bank.restore(
      makeInput<Bank.RestoreParams>({
        id: 1,
        name: validName,
      }),
    ),
  ).not.toThrow()
})

test.each(['000', '001', '033', '104', '237', '341', '999'])(
  'Should restore a bank with a valid code: %s',
  (validCode) => {
    expect(() =>
      Bank.restore(
        makeInput<Bank.RestoreParams>({
          id: 1,
          code: validCode,
        }),
      ),
    ).not.toThrow()
  },
)

test('Should change the bank name', () => {
  const bank = Bank.create(makeInput())

  bank.changeName('Banco do Brasil')

  expect(bank.getName()).toBe('Banco do Brasil')
})

test.each(['', undefined, null, 'Banco', 'Nubank', '123', '   '])(
  'Should not change the bank name to an invalid value: %s',
  (invalidName: unknown) => {
    const bank = Bank.create(makeInput())
    const oldBankName = bank.getName()

    expect(() => bank.changeName(invalidName as string)).toThrow(
      new DomainError('Invalid name'),
    )

    expect(bank.getName()).toBe(oldBankName)
  },
)

test('Should change the bank code', () => {
  const bank = Bank.create(makeInput())

  bank.changeCode('104')

  expect(bank.getCode()).toBe('104')
})

test.each([
  '',
  undefined,
  null,
  '1',
  '01',
  '1111',
  'ABC',
  'A12',
  '!@1',
  '12 ',
  '1234',
])(
  'Should not change the bank code to an invalid value: %s',
  (invalidCode: unknown) => {
    const bank = Bank.create(makeInput())

    expect(() => bank.changeCode(invalidCode as string)).toThrow(
      new DomainError('Invalid code'),
    )

    expect(bank.getCode()).toBe('237')
  },
)
