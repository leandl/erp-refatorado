import { BankDAO } from '@adapters/database/DAOs/bank-dao.ts'

import { DataSourcePrisma } from './data-source-prisma.ts'
import { PrismaClient } from './generated/client.ts'

export class BankDAOPrisma implements BankDAO {
  private prismaClient: PrismaClient

  constructor(dataSource: DataSourcePrisma) {
    this.prismaClient = dataSource.getSource()
  }

  async save(dto: BankDAO.SaveDTO): Promise<number> {
    const savedBankModel =
      await this.prismaClient.bankPrismaPersistenceModel.create({
        data: {
          code: dto.code,
          name: dto.name,
          url: dto.url,
        },
      })

    return savedBankModel.bankId
  }

  async getById(bankId: number): Promise<BankDAO.BankDTO | undefined> {
    const bankModel =
      await this.prismaClient.bankPrismaPersistenceModel.findUnique({
        where: { bankId },
      })

    if (!bankModel) return undefined

    return {
      bank_id: bankModel.bankId,
      code: bankModel.code,
      name: bankModel.name,
      url: bankModel.url,
    }
  }

  async getByCode(code: string): Promise<BankDAO.BankDTO | undefined> {
    const bankModel =
      await this.prismaClient.bankPrismaPersistenceModel.findFirst({
        where: { code },
      })

    if (!bankModel) return undefined

    return {
      bank_id: bankModel.bankId,
      code: bankModel.code,
      name: bankModel.name,
      url: bankModel.url,
    }
  }

  async getByName(name: string): Promise<BankDAO.BankDTO | undefined> {
    const bankModel =
      await this.prismaClient.bankPrismaPersistenceModel.findFirst({
        where: { name },
      })

    if (!bankModel) return undefined

    return {
      bank_id: bankModel.bankId,
      code: bankModel.code,
      name: bankModel.name,
      url: bankModel.url,
    }
  }

  async update(dto: BankDAO.UpdateDTO): Promise<void> {
    await this.prismaClient.bankPrismaPersistenceModel.update({
      where: {
        bankId: dto.id,
      },
      data: {
        code: dto.code,
        name: dto.name,
        url: dto.url,
      },
    })
  }

  async list(): Promise<BankDAO.BankDTO[]> {
    const bankModelList =
      await this.prismaClient.bankPrismaPersistenceModel.findMany()

    return bankModelList.map((bankModel) => ({
      bank_id: bankModel.bankId,
      code: bankModel.code,
      name: bankModel.name,
      url: bankModel.url,
    }))
  }

  async remove(bankId: number): Promise<void> {
    await this.prismaClient.bankPrismaPersistenceModel.delete({
      where: {
        bankId,
      },
    })
  }
}
