import { BankRepository } from '@bank-repository.ts'
import { UseCase } from '@use-case.ts'

export class UpdateBank implements UseCase<
  UpdateBank.Input,
  UpdateBank.Output
> {
  constructor(private bankRepository: BankRepository) {}

  async execute(input: UpdateBank.Input): Promise<UpdateBank.Output> {
    const bankUpdated = await this.bankRepository.findById(input.id)
    if (!bankUpdated) {
      throw new Error('Bank not found')
    }

    if (bankUpdated.getCode() !== input.code) {
      const alreadyExistsWithCode = await this.bankRepository.findByCode(
        input.code,
      )
      if (alreadyExistsWithCode) {
        throw new Error('Bank code already exists')
      }

      bankUpdated.changeCode(input.code)
    }

    if (bankUpdated.getName() !== input.name) {
      const alreadyExistsWithName = await this.bankRepository.findByName(
        input.name,
      )
      if (alreadyExistsWithName) {
        throw new Error('Bank name already exists')
      }

      bankUpdated.changeName(input.name)
    }

    bankUpdated.setUrl(input.url)
    await this.bankRepository.update(bankUpdated)

    return {
      id: bankUpdated.getBankId(),
      code: bankUpdated.getCode(),
      name: bankUpdated.getName(),
      url: bankUpdated.getUrl(),
    }
  }
}

export namespace UpdateBank {
  export type Input = {
    id: number
    name: string
    code: string
    url: string
  }

  export type Output = {
    id: number
    name: string
    code: string
    url: string
  }
}
