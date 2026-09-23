import { BankDAO } from '@adapters/database/DAOs/bank-dao.ts'
import { DataSource, Repository } from 'typeorm'

import { BankTypeORMPersistenceModel } from './bank-typeorm-persistence-model.ts'

export class BankDAOTypeORM implements BankDAO {
  private repository: Repository<BankTypeORMPersistenceModel>

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(BankTypeORMPersistenceModel)
  }

  async save(dto: BankDAO.SaveDTO): Promise<number> {
    const bankModel = new BankTypeORMPersistenceModel()

    bankModel.code = dto.code
    bankModel.name = dto.name
    bankModel.url = dto.url

    const savedBankModel = await this.repository.save(bankModel)
    return savedBankModel.bankId
  }

  async getById(bankId: number): Promise<BankDAO.BankDTO | undefined> {
    const bankModel = await this.repository.findOneBy({ bankId })

    if (!bankModel) return undefined

    return {
      bank_id: bankModel.bankId,
      code: bankModel.code,
      name: bankModel.name,
      url: bankModel.url,
    }
  }

  async getByCode(code: string): Promise<BankDAO.BankDTO | undefined> {
    const bankModel = await this.repository.findOneBy({ code })

    if (!bankModel) return undefined

    return {
      bank_id: bankModel.bankId,
      code: bankModel.code,
      name: bankModel.name,
      url: bankModel.url,
    }
  }

  async getByName(name: string): Promise<BankDAO.BankDTO | undefined> {
    const bankModel = await this.repository.findOneBy({ name })

    if (!bankModel) return undefined

    return {
      bank_id: bankModel.bankId,
      code: bankModel.code,
      name: bankModel.name,
      url: bankModel.url,
    }
  }

  async update(dto: BankDAO.UpdateDTO): Promise<void> {
    const bankModel = new BankTypeORMPersistenceModel()

    bankModel.bankId = dto.id
    bankModel.code = dto.code
    bankModel.name = dto.name
    bankModel.url = dto.url

    await this.repository.save(bankModel)
  }

  async list(): Promise<BankDAO.BankDTO[]> {
    const bankModelList = await this.repository.find()

    return bankModelList.map((bankModel) => ({
      bank_id: bankModel.bankId,
      code: bankModel.code,
      name: bankModel.name,
      url: bankModel.url,
    }))
  }

  async remove(bankId: number): Promise<void> {
    await this.repository.delete({ bankId })
  }
}
