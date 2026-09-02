import { BankDAO } from '@bank-dao.ts'
import { UseCase } from '@use-case.ts'

export class UpdateBank implements UseCase<
  UpdateBank.Input,
  UpdateBank.Output
> {
  constructor(private bankDAO: BankDAO) {}

  async execute(input: UpdateBank.Input): Promise<UpdateBank.Output> {
    if (!input.name || !input.name.match(/^.+\s.+$/)) {
      throw new Error('Invalid name')
    }

    if (!input.code || input.code.length !== 3 || !input.code.match(/\d{3}/)) {
      throw new Error('Invalid code')
    }

    const bank = await this.bankDAO.getById(input.id)
    if (!bank) {
      throw new Error('Bank not found')
    }

    if (bank.code !== input.code) {
      const alreadyExistsWithCode = await this.bankDAO.getByCode(input.code)
      if (alreadyExistsWithCode) {
        throw new Error('Bank code already exists')
      }
    }

    if (bank.name !== input.name) {
      const alreadyExistsWithName = await this.bankDAO.getByName(input.name)
      if (alreadyExistsWithName) {
        throw new Error('Bank name already exists')
      }
    }

    const code = input.code ?? bank!.code
    const name = input.name ?? bank!.name
    const url = input.url ?? bank!.url

    const bankUpdated = {
      id: Number(input.id),
      code,
      name,
      url,
    }

    await this.bankDAO.update(bankUpdated)

    return bankUpdated
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
