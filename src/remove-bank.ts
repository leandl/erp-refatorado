import { BankDAO } from '@bank-dao.ts'

export class RemoveBank {
  constructor(private bankDAO: BankDAO) {}

  async execute(bankId: number): Promise<any> {
    await this.bankDAO.remove(bankId)
  }
}
