import { Bank } from '@bank.ts'

export interface BankRepository {
  save(bank: Bank): Promise<Bank>
  findById(bankId: number): Promise<Bank | undefined>
  findByCode(code: string): Promise<Bank | undefined>
  findByName(name: string): Promise<Bank | undefined>
  update(bank: Bank): Promise<void>
  list(): Promise<Bank[]>
  remove(bankId: number): Promise<void>
}
