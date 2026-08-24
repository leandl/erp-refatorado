import { BankDAO } from '@bank-dao.ts'

export class GetBankList {
  constructor(private bankDAO: BankDAO) {}

  async execute() {
    const banks = await this.bankDAO.list()

    return banks.map((bank) => ({
      id: bank.bank_id,
      name: bank.name,
      code: bank.code,
      url: bank.url,
    }))
  }
}
