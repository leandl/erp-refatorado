import { BankDAO } from '@bank-dao.ts'

export class GetBankById {
  constructor(private bankDAO: BankDAO) {}

  async execute(bankId: number) {
    const bank = await this.bankDAO.getById(bankId)

    if (!bank) {
      return null
    }

    return {
      id: bank.bank_id,
      name: bank.name,
      code: bank.code,
      url: bank.url,
    }
  }
}
