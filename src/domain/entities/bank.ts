import { BankCode } from './bank-code.ts'
import { BankName } from './bank-name.ts'

export class Bank {
  private code: BankCode
  private name: BankName

  private constructor(
    private bankId: number,
    name: string,
    code: string,
    private url: string,
  ) {
    this.name = new BankName(name)
    this.code = new BankCode(code)
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
    return this.name.getValue()
  }

  getCode() {
    return this.code.getValue()
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
    this.name = new BankName(name)
  }

  changeCode(code: string) {
    this.code = new BankCode(code)
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
