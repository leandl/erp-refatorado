import { Bank } from '@bank.ts'
import { BankRepository } from '@bank-repository.ts'

import { DatabaseTableMemory } from './database-table-memory.ts'

export class BankRepositoryFake implements BankRepository {
  private databaseTable = new DatabaseTableMemory<Bank>({
    addIDInRecord: (record, tableRecordId) => {
      return Bank.restore({
        id: tableRecordId,
        code: record.getCode(),
        name: record.getName(),
        url: record.getUrl(),
      })
    },
    indexes: [
      {
        name: 'CODE',
        unique: true,
        getValue: (bank) => bank.getCode(),
      },
      {
        name: 'NAME',
        unique: true,
        getValue: (bank) => bank.getName(),
      },
    ],
  })

  async save(bank: Bank): Promise<Bank> {
    const bankId = this.databaseTable.create(bank)
    return Bank.restore({
      id: bankId,
      code: bank.getCode(),
      name: bank.getName(),
      url: bank.getUrl(),
    })
  }

  async findById(bankId: number): Promise<Bank | undefined> {
    return this.databaseTable.getById(bankId)
  }

  async findByCode(code: string): Promise<Bank | undefined> {
    return this.databaseTable.getByIndex('CODE', code)
  }

  async findByName(name: string): Promise<Bank | undefined> {
    return this.databaseTable.getByIndex('NAME', name)
  }

  async update(bank: Bank): Promise<void> {
    this.databaseTable.update(bank.getBankId(), bank)
  }

  async list(): Promise<Bank[]> {
    return this.databaseTable.list()
  }

  async remove(bankId: number): Promise<void> {
    await this.databaseTable.remove(bankId)
  }
}
