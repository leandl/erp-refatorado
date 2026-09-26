import { BankDAO } from '@adapters/database/DAOs/bank-dao.ts'
import { Collection } from 'mongodb'

import { DataSourceMongo } from './data-source-mongo.ts'
import { BankMongoPersistenceModel } from './persistence-model.ts'

export class BankDAOMongo implements BankDAO {
  private collection: Collection<BankMongoPersistenceModel>

  constructor(dataSource: DataSourceMongo) {
    this.collection = dataSource
      .getSource()
      .db()
      .collection<BankMongoPersistenceModel>('bank')
  }

  async save(dto: BankDAO.SaveDTO): Promise<number> {
    const laskBank = await this.collection.findOne({}, { sort: { _id: -1 } })
    const bankId = laskBank?._id ? laskBank._id + 1 : 1

    await this.collection.insertOne({
      _id: bankId,
      code: dto.code,
      name: dto.name,
      url: dto.url,
    })

    return bankId
  }

  async getById(bankId: number): Promise<BankDAO.BankDTO | undefined> {
    const bankModel = await this.collection.findOne({ _id: bankId })
    return bankModel ? this.toDTO(bankModel) : undefined
  }

  async getByCode(code: string): Promise<BankDAO.BankDTO | undefined> {
    const bankModel = await this.collection.findOne({ code })
    return bankModel ? this.toDTO(bankModel) : undefined
  }

  async getByName(name: string): Promise<BankDAO.BankDTO | undefined> {
    const bankModel = await this.collection.findOne({ name })
    return bankModel ? this.toDTO(bankModel) : undefined
  }

  async update(dto: BankDAO.UpdateDTO): Promise<void> {
    await this.collection.updateOne(
      { _id: dto.id },
      {
        $set: {
          code: dto.code,
          name: dto.name,
          url: dto.url,
        },
      },
    )
  }

  async list(): Promise<BankDAO.BankDTO[]> {
    const bankModelList = await this.collection.find().toArray()
    return bankModelList.map(this.toDTO)
  }

  private toDTO(model: BankMongoPersistenceModel): BankDAO.BankDTO {
    return {
      bank_id: model._id,
      code: model.code,
      name: model.name,
      url: model.url,
    }
  }

  async remove(bankId: number): Promise<void> {
    await this.collection.deleteOne({ _id: bankId })
  }
}
