import { BankDAO } from '@bank-dao.ts'

export class CreateBank {
  constructor(private bankDAO: BankDAO) {}

  async execute(input: any): Promise<any> {
    const bankId = await this.bankDAO.save(input)
    const bank = {
      id: bankId,
      ...input,
    }
    return bank
  }
}
