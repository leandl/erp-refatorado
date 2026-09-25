import { BankDAO } from '@adapters/database/DAOs/bank-dao.ts'
import { eq } from 'drizzle-orm'

import { DataSourceDrizzle, DrizzleClient } from './data-source-drizzle.ts'
import { bankDrizzlePersistenceModel } from './schema.ts'

export class BankDAODrizzle implements BankDAO {
  private client: DrizzleClient

  constructor(dataSource: DataSourceDrizzle) {
    this.client = dataSource.getSource()
  }

  async save(dto: BankDAO.SaveDTO): Promise<number> {
    const [bankInsertedModel] = await this.client
      .insert(bankDrizzlePersistenceModel)
      .values({
        code: dto.code,
        name: dto.name,
        url: dto.url,
      })

    return bankInsertedModel.insertId
  }

  async getById(bankId: number): Promise<BankDAO.BankDTO | undefined> {
    const [bankModel] = await this.client
      .select()
      .from(bankDrizzlePersistenceModel)
      .where(eq(bankDrizzlePersistenceModel.bankId, bankId))

    if (!bankModel) return undefined

    return {
      bank_id: bankModel.bankId,
      code: bankModel.code,
      name: bankModel.name,
      url: bankModel.url,
    }
  }

  async getByCode(code: string): Promise<BankDAO.BankDTO | undefined> {
    const [bankModel] = await this.client
      .select()
      .from(bankDrizzlePersistenceModel)
      .where(eq(bankDrizzlePersistenceModel.code, code))

    if (!bankModel) return undefined

    return {
      bank_id: bankModel.bankId,
      code: bankModel.code,
      name: bankModel.name,
      url: bankModel.url,
    }
  }

  async getByName(name: string): Promise<BankDAO.BankDTO | undefined> {
    const [bankModel] = await this.client
      .select()
      .from(bankDrizzlePersistenceModel)
      .where(eq(bankDrizzlePersistenceModel.name, name))

    if (!bankModel) return undefined

    return {
      bank_id: bankModel.bankId,
      code: bankModel.code,
      name: bankModel.name,
      url: bankModel.url,
    }
  }

  async update(dto: BankDAO.UpdateDTO): Promise<void> {
    await this.client
      .update(bankDrizzlePersistenceModel)
      .set({
        code: dto.code,
        name: dto.name,
        url: dto.url,
      })
      .where(eq(bankDrizzlePersistenceModel.bankId, dto.id))
  }

  async list(): Promise<BankDAO.BankDTO[]> {
    const bankModelList = await this.client
      .select()
      .from(bankDrizzlePersistenceModel)

    return bankModelList.map((bankModel) => ({
      bank_id: bankModel.bankId,
      code: bankModel.code,
      name: bankModel.name,
      url: bankModel.url,
    }))
  }

  async remove(bankId: number): Promise<void> {
    await this.client
      .delete(bankDrizzlePersistenceModel)
      .where(eq(bankDrizzlePersistenceModel.bankId, bankId))
  }
}
