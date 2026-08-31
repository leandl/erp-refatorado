import { BankDAO } from '@bank-dao.ts'

export class BankDAOFake implements BankDAO {
  private indexs: Record<string, number> = {}
  private banks: Record<number, BankDAO.BankDTO> = {}

  private currentID = 1

  generateIndex(type: 'CODE', value: string) {
    return `${type}:${value}`
  }

  async save(dto: BankDAO.SaveDTO): Promise<number> {
    this.banks[this.currentID] = {
      bank_id: this.currentID,
      ...dto,
    }

    const codeIndex = this.generateIndex('CODE', dto.code)
    this.indexs[codeIndex] = this.currentID

    return this.currentID++
  }

  async getById(bankId: number): Promise<BankDAO.BankDTO | undefined> {
    return this.banks[bankId]
  }

  async getByCode(code: string): Promise<BankDAO.BankDTO | undefined> {
    const codeIndex = this.generateIndex('CODE', code)
    const bankId = this.indexs[codeIndex]

    return this.getById(bankId)
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
    if (this.banks[bankId]) {
      const code = this.banks[bankId].code
      const codeIndex = this.generateIndex('CODE', code)

      delete this.banks[bankId]
      delete this.indexs[codeIndex]
    }
  }
}
