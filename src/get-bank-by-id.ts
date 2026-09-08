import { BankRepository } from '@bank-repository.ts'
import { UseCase } from '@use-case.ts'

export class GetBankById implements UseCase<
  GetBankById.Input,
  GetBankById.Output
> {
  constructor(private bankRepository: BankRepository) {}

  async execute(input: GetBankById.Input): Promise<GetBankById.Output> {
    const bank = await this.bankRepository.findById(input.id)

    if (!bank) {
      return undefined
    }

    return {
      id: bank.getBankId(),
      name: bank.getName(),
      code: bank.getCode(),
      url: bank.getUrl(),
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
