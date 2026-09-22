export interface BankDAO {
  save(dto: BankDAO.SaveDTO): Promise<number>
  getById(bankId: number): Promise<BankDAO.BankDTO | undefined>
  getByCode(code: string): Promise<BankDAO.BankDTO | undefined>
  getByName(name: string): Promise<BankDAO.BankDTO | undefined>
  update(dto: BankDAO.UpdateDTO): Promise<void>
  list(): Promise<BankDAO.BankDTO[]>
  remove(bankId: number): Promise<void>
}

export namespace BankDAO {
  export type SaveDTO = {
    code: string
    name: string
    url: string
  }

  export type UpdateDTO = {
    id: number
    code: string
    name: string
    url: string
  }

  export type BankDTO = {
    bank_id: number
    code: string
    name: string
    url: string
  }
}
