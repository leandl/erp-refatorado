import { BankDAO } from '@bank-dao.ts'
import { UseCase } from '@use-case.ts'

export class GetBankById implements UseCase<
  GetBankById.Input,
  GetBankById.Output
> {
  constructor(private bankDAO: BankDAO) {}

  async execute(input: GetBankById.Input): Promise<GetBankById.Output> {
    const bank = await this.bankDAO.getById(input.id)

    if (!bank) {
      return undefined
    }

    return {
      id: bank.bank_id,
      name: bank.name,
      code: bank.code,
      url: bank.url,
    }
  }
}

export namespace GetBankById {
  export type Input = {
    id: number
  }

  export type Output =
    | {
        id: number
        name: string
        code: string
        url: string
      }
    | undefined
}
