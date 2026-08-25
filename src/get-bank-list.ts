import { BankDAO } from '@bank-dao.ts'
import { UseCase } from '@use-case.ts'

export class GetBankList implements UseCase<
  GetBankList.Input,
  GetBankList.Output
> {
  constructor(private bankDAO: BankDAO) {}

  async execute(): Promise<GetBankList.Output> {
    const banks = await this.bankDAO.list()

    return banks.map((bank) => ({
      id: bank.bank_id,
      name: bank.name,
      code: bank.code,
      url: bank.url,
    }))
  }
}

export namespace GetBankList {
  export type Input = unknown

  export type Output = {
    id: number
    name: string
    code: string
    url: string
  }[]
}
