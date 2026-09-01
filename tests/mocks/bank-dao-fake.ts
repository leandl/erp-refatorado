import { BankDAO } from '@bank-dao.ts'

export class BankDAOFake implements BankDAO {
  private indexs: Record<string, number> = {}
  private banks: Record<number, BankDAO.BankDTO> = {}

  private currentID = 1

  generateKeyIndex(type: 'CODE' | 'NAME', value: string) {
    return `${type}:${value}`
  }

  createIndexs(bankId: number) {
    const bank = this.banks[bankId]
    if (!bank) {
      throw new Error('Bank not found')
    }

    this.indexs[this.generateKeyIndex('CODE', bank.code)] = bankId
    this.indexs[this.generateKeyIndex('NAME', bank.name)] = bankId
  }

  deleteIndexs(bankId: number) {
    const bank = this.banks[bankId]
    if (!bank) {
      throw new Error('Bank not found')
    }

    delete this.indexs[this.generateKeyIndex('CODE', bank.code)]
    delete this.indexs[this.generateKeyIndex('NAME', bank.name)]
  }

  async save(dto: BankDAO.SaveDTO): Promise<number> {
    this.banks[this.currentID] = {
      bank_id: this.currentID,
      ...dto,
    }

    this.createIndexs(this.currentID)

    return this.currentID++
  }

  async getById(bankId: number): Promise<BankDAO.BankDTO | undefined> {
    return this.banks[bankId]
  }

  async getByCode(code: string): Promise<BankDAO.BankDTO | undefined> {
    const codeIndex = this.generateKeyIndex('CODE', code)
    const bankId = this.indexs[codeIndex]

    return this.getById(bankId)
  }

  async getByName(name: string): Promise<BankDAO.BankDTO | undefined> {
    const nameIndex = this.generateKeyIndex('NAME', name)
    const bankId = this.indexs[nameIndex]

    return this.getById(bankId)
  }

  async update({ id: bankId, ...restDTO }: BankDAO.UpdateDTO): Promise<void> {
    if (this.banks[bankId]) {
      this.deleteIndexs(bankId)
      this.banks[bankId] = {
        ...this.banks[bankId],
        ...restDTO,
      }
      this.createIndexs(bankId)
    }
  }

  async list(): Promise<BankDAO.BankDTO[]> {
    return Object.values(this.banks)
  }

  async remove(bankId: number): Promise<void> {
    if (this.banks[bankId]) {
      this.deleteIndexs(bankId)
      delete this.banks[bankId]
    }
  }
}
