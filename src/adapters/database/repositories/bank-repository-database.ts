import { BankDAO } from '@adapters/database/DAOs/bank-dao.ts'
import { BankRepository } from '@application/repositories/bank-repository.ts'
import { Bank } from '@domain/entities/bank.ts'

export class BankRepositoryDatabase implements BankRepository {
  constructor(private bankDAO: BankDAO) {}

  async save(bank: Bank): Promise<Bank> {
    const bankId = await this.bankDAO.save({
      code: bank.getCode(),
      name: bank.getName(),
      url: bank.getUrl(),
    })

    return Bank.restore({
      id: bankId,
      code: bank.getCode(),
      name: bank.getName(),
      url: bank.getUrl(),
    })
  }

  async findById(bankId: number): Promise<Bank | undefined> {
    const bankDTO = await this.bankDAO.getById(bankId)

    if (!bankDTO) {
      return undefined
    }

    return Bank.restore({
      id: bankDTO.bank_id,
      code: bankDTO.code,
      name: bankDTO.name,
      url: bankDTO.url,
    })
  }

  async findByCode(code: string): Promise<Bank | undefined> {
    const bankDTO = await this.bankDAO.getByCode(code)

    if (!bankDTO) {
      return undefined
    }

    return Bank.restore({
      id: bankDTO.bank_id,
      code: bankDTO.code,
      name: bankDTO.name,
      url: bankDTO.url,
    })
  }

  async findByName(name: string): Promise<Bank | undefined> {
    const bankDTO = await this.bankDAO.getByName(name)

    if (!bankDTO) {
      return undefined
    }

    return Bank.restore({
      id: bankDTO.bank_id,
      code: bankDTO.code,
      name: bankDTO.name,
      url: bankDTO.url,
    })
  }

  async update(bank: Bank): Promise<void> {
    await this.bankDAO.update({
      id: bank.getBankId(),
      code: bank.getCode(),
      name: bank.getName(),
      url: bank.getUrl(),
    })
  }

  async list(): Promise<Bank[]> {
    const bankDTOs = await this.bankDAO.list()

    return bankDTOs.map((bankDTO) =>
      Bank.restore({
        id: bankDTO.bank_id,
        code: bankDTO.code,
        name: bankDTO.name,
        url: bankDTO.url,
      }),
    )
  }

  async remove(bankId: number): Promise<void> {
    await this.bankDAO.remove(bankId)
  }
}
