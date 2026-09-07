export class Bank {
  private constructor(
    private bankId: number,
    private name: string,
    private code: string,
    private url: string,
  ) {}

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

  setName(name: string) {
    this.name = name
  }

  setCode(code: string) {
    this.code = code
  }

  setUrl(url: string) {
    this.url = url
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
