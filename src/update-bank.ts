import { Bank } from '@bank.ts'
import { BankRepository } from '@bank-repository.ts'
import { UseCase } from '@use-case.ts'
import { validateBankCode } from '@validate-bank-code.ts'
import { validateBankName } from '@validate-bank-name.ts'

export class UpdateBank implements UseCase<
  UpdateBank.Input,
  UpdateBank.Output
> {
  constructor(private bankRepository: BankRepository) {}

  async execute(input: UpdateBank.Input): Promise<UpdateBank.Output> {
    if (!validateBankName(input.name)) {
      throw new Error('Invalid name')
    }

    if (!validateBankCode(input.code)) {
      throw new Error('Invalid code')
    }

    const bank = await this.bankRepository.findById(input.id)
    if (!bank) {
      throw new Error('Bank not found')
    }

    if (bank.getCode() !== input.code) {
      const alreadyExistsWithCode = await this.bankRepository.findByCode(
        input.code,
      )
      if (alreadyExistsWithCode) {
        throw new Error('Bank code already exists')
      }
    }

    if (bank.getName() !== input.name) {
      const alreadyExistsWithName = await this.bankRepository.findByName(
        input.name,
      )
      if (alreadyExistsWithName) {
        throw new Error('Bank name already exists')
      }
    }

    const code = input.code ?? bank!.getCode()
    const name = input.name ?? bank!.getName()
    const url = input.url ?? bank!.getUrl()

    const bankUpdated = Bank.restore({
      id: Number(input.id),
      code,
      name,
      url,
    })

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
