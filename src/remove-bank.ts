import { BankDAO } from '@bank-dao.ts'
import { UseCase } from '@use-case.ts'

export class RemoveBank implements UseCase<
  RemoveBank.Input,
  RemoveBank.Output
> {
  constructor(private bankDAO: BankDAO) {}

  async execute(input: RemoveBank.Input): Promise<RemoveBank.Output> {
    await this.bankDAO.remove(input.id)
  }
}

export namespace RemoveBank {
  export type Input = {
    id: number
  }

  export type Output = void
}
