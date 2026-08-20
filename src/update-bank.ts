import { BankDAO } from '@bank-dao.ts'

export class UpdateBank {
  constructor(private bankDAO: BankDAO) {}

  async execute(input: any) {
    const row = await this.bankDAO.getById(Number(input.id))

    const bank = row!

    const code = input.code ?? bank.code
    const name = input.name ?? bank.name
    const url = input.url ?? bank.url

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
