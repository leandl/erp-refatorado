import { AggregateRoot } from '@domain/aggregate-root.ts'
import { BankInfoUpdatedEvent } from '@domain/events/bank-info-updated-event.ts'

import { BankCode } from './bank-code.ts'
import { BankName } from './bank-name.ts'

export class Bank extends AggregateRoot {
  private code: BankCode
  private name: BankName

  private constructor(
    private bankId: number,
    name: string,
    code: string,
    private url: string,
  ) {
    super()

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
    const event = new BankInfoUpdatedEvent({
      aggregateId: this.bankId,
    })
    this.registerEventOnce(event)
  }

  changeCode(code: string) {
    this.code = new BankCode(code)
    const event = new BankInfoUpdatedEvent({
      aggregateId: this.bankId,
    })
    this.registerEventOnce(event)
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
