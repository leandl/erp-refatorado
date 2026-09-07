import { BankDAO } from '@bank-dao.ts'

import { DatabaseTableMemory } from './database-table-memory.ts'

export class BankDAOFake implements BankDAO {
  private databaseTable = new DatabaseTableMemory<BankDAO.BankDTO>({
    addIDInRecord: (record, tableRecordId) => {
      return {
        ...record,
        bank_id: tableRecordId,
      }
    },
    indexes: [
      {
        name: 'CODE',
        unique: true,
        getValue: (bank) => bank.code,
      },
      {
        name: 'NAME',
        unique: true,
        getValue: (bank) => bank.name,
      },
    ],
  })

  async save(dto: BankDAO.SaveDTO): Promise<number> {
    const bankId = this.databaseTable.create({ bank_id: 0, ...dto })
    return bankId
  }

  async getById(bankId: number): Promise<BankDAO.BankDTO | undefined> {
    return this.databaseTable.getById(bankId)
  }

  async getByCode(code: string): Promise<BankDAO.BankDTO | undefined> {
    return this.databaseTable.getByIndex('CODE', code)
  }

  async getByName(name: string): Promise<BankDAO.BankDTO | undefined> {
    return this.databaseTable.getByIndex('NAME', name)
  }

  async update({ id: bankId, ...restDTO }: BankDAO.UpdateDTO): Promise<void> {
    this.databaseTable.update(bankId, { bank_id: bankId, ...restDTO })
  }

  async list(): Promise<BankDAO.BankDTO[]> {
    return this.databaseTable.list()
  }

  async remove(bankId: number): Promise<void> {
    this.databaseTable.remove(bankId)
  }
}
