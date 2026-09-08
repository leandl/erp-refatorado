import { BankRepository } from '@bank-repository.ts'
import { UseCase } from '@use-case.ts'

export class GetBankList implements UseCase<
  GetBankList.Input,
  GetBankList.Output
> {
  constructor(private bankRepository: BankRepository) {}

  async execute(): Promise<GetBankList.Output> {
    const banks = await this.bankRepository.list()

    return banks.map((bank) => ({
      id: bank.getBankId(),
      name: bank.getName(),
      code: bank.getCode(),
      url: bank.getUrl(),
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
