import { BankDAO } from '@bank-dao.ts'

export class BankDAOFake implements BankDAO {
  private banks: Record<number, any> = {}
  private currentID = 1

  async save(dto: any): Promise<number> {
    this.banks[this.currentID] = {
      bank_id: this.currentID,
      ...dto,
    }

    return this.currentID++
  }

  async getById(bankId: number): Promise<any> {
    return this.banks[bankId]
  }

  async update({
    id: bankId,
    ...restDTO
  }: {
    id: number
    [key: string]: any
  }): Promise<void> {
    if (this.banks[bankId]) {
      this.banks[bankId] = {
        ...this.banks[bankId],
        ...restDTO,
      }
    }
  }

  async list(): Promise<any[]> {
    return Object.values(this.banks)
  }

  async remove(bankId: number): Promise<void> {
    delete this.banks[bankId]
  }
}
