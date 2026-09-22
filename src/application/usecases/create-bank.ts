import { ApplicationError } from '@application/errors/application-error.ts'
import { BankRepository } from '@application/repositories/bank-repository.ts'
import { Bank } from '@domain/entities/bank.ts'

import { UseCase } from './use-case.ts'

export class CreateBank implements UseCase<
  CreateBank.Input,
  CreateBank.Output
> {
  constructor(private repository: BankRepository) {}

  async execute(input: CreateBank.Input): Promise<CreateBank.Output> {
    const bank = Bank.create({
      name: input.name,
      code: input.code,
      url: input.url,
    })

    const alreadyExistsWithCode = await this.repository.findByCode(input.code)
    if (alreadyExistsWithCode) {
      throw new ApplicationError('Bank code already exists')
    }

    const alreadyExistsWithName = await this.repository.findByName(input.name)
    if (alreadyExistsWithName) {
      throw new ApplicationError('Bank name already exists')
    }

    const bankSeved = await this.repository.save(bank)

    return {
      id: bankSeved.getBankId(),
      code: bankSeved.getCode(),
      name: bankSeved.getName(),
      url: bankSeved.getUrl(),
    }
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
