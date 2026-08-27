import { BankDAO } from '@bank-dao.ts'
import { UseCase } from '@use-case.ts'

export class CreateBank implements UseCase<
  CreateBank.Input,
  CreateBank.Output
> {
  constructor(private bankDAO: BankDAO) {}

  async execute(input: CreateBank.Input): Promise<CreateBank.Output> {
    if (!input.name || !input.name.match(/^.+\s.+$/)) {
      throw new Error('Invalid name')
    }

    if (!input.code || input.code.length !== 3 || !input.code.match(/\d{3}/)) {
      throw new Error('Invalid code')
    }

    const bankId = await this.bankDAO.save(input)
    const bank = {
      id: bankId,
      ...input,
    }
    return bank
  }
}

export namespace CreateBank {
  export type Input = {
    code: string
    name: string
    url: string
  }

  export type Output = {
    id: number
    code: string
    name: string
    url: string
  }
}
