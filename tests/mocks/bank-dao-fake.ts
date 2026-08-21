import { BankDAO } from '@bank-dao.ts'

export class BankDAOFake implements BankDAO {
  private banks: Record<number, BankDAO.BankDTO> = {}
  private currentID = 1

  async save(dto: BankDAO.SaveDTO): Promise<number> {
    this.banks[this.currentID] = {
      bank_id: this.currentID,
      ...dto,
    }

    return this.currentID++
  }

  async getById(bankId: number): Promise<BankDAO.BankDTO> {
    return this.banks[bankId]
  }

  async update({ id: bankId, ...restDTO }: BankDAO.UpdateDTO): Promise<void> {
    if (this.banks[bankId]) {
      this.banks[bankId] = {
        ...this.banks[bankId],
        ...restDTO,
      }
    }
  }

  async list(): Promise<BankDAO.BankDTO[]> {
    return Object.values(this.banks)
  }

  async remove(bankId: number): Promise<void> {
    delete this.banks[bankId]
  }
}
