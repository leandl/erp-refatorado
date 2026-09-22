import { validateBankCode } from '@domain/entities/validate-bank-code.ts'
import { DomainError } from '@domain/errors/domain-error.ts'

import { validateBankName } from './validate-bank-name.ts'

export class Bank {
  private constructor(
    private bankId: number,
    private name: string,
    private code: string,
    private url: string,
  ) {
    if (!validateBankName(name)) {
      throw new DomainError('Invalid name')
    }

    if (!validateBankCode(code)) {
      throw new DomainError('Invalid code')
    }
  }

  static create({ name, code, url }: Bank.CreateParams): Bank {
    return new Bank(0, name, code, url)
  }

  static restore({ id, name, code, url }: Bank.RestoreParams): Bank {
    return new Bank(id, name, code, url)
  }

  getBankId() {
    return this.bankId
  }

  getName() {
    return this.name
  }

  getCode() {
    return this.code
  }

  getUrl() {
    return this.url
  }

  setBankId(bankId: number) {
    this.bankId = bankId
  }

  setUrl(url: string) {
    this.url = url
  }

  changeName(name: string) {
    if (!validateBankName(name)) {
      throw new DomainError('Invalid name')
    }

    this.name = name
  }

  changeCode(code: string) {
    if (!validateBankCode(code)) {
      throw new DomainError('Invalid code')
    }

    this.code = code
  }
}

export namespace Bank {
  export type CreateParams = {
    name: string
    code: string
    url: string
  }

  export type RestoreParams = {
    id: number
    name: string
    code: string
    url: string
  }
}
