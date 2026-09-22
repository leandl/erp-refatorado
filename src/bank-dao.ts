import { DatabaseConnection } from '@database-connection.ts'

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

export class BankDAOSQL implements BankDAO {
  constructor(private databaseConnection: DatabaseConnection) {}

  async save(dto: BankDAO.SaveDTO): Promise<number> {
    const [row] = await this.databaseConnection.query<BankDAOSQL.BankRow>(
      'INSERT INTO bank(code, name, url) VALUES(:code, :name, :url) RETURNING *',
      {
        ':code': dto.code,
        ':name': dto.name,
        ':url': dto.url,
      },
    )

    return row.bank_id
  }

  async list(): Promise<BankDAO.BankDTO[]> {
    return await this.databaseConnection.query<BankDAOSQL.BankRow>(
      'SELECT * FROM bank',
    )
  }

  async getById(bankId: number): Promise<BankDAO.BankDTO | undefined> {
    const [row] = await this.databaseConnection.query<BankDAOSQL.BankRow>(
      'SELECT * FROM bank WHERE bank_id = :bank_id',
      { ':bank_id': bankId },
    )

    return row
  }

  async getByCode(code: string): Promise<BankDAO.BankDTO | undefined> {
    const [row] = await this.databaseConnection.query<BankDAOSQL.BankRow>(
      'SELECT * FROM bank WHERE code = :code',
      { ':code': code },
    )

    return row
  }

  async getByName(name: string): Promise<BankDAO.BankDTO | undefined> {
    const [row] = await this.databaseConnection.query<BankDAOSQL.BankRow>(
      'SELECT * FROM bank WHERE name = :name',
      { ':name': name },
    )

    return row
  }

  async remove(bankId: number): Promise<void> {
    await this.databaseConnection.query(
      'DELETE FROM bank WHERE bank_id = :bank_id',
      {
        ':bank_id': bankId,
      },
    )
  }

  async update(dto: BankDAO.UpdateDTO): Promise<void> {
    await this.databaseConnection.query(
      'UPDATE bank SET code = :code, name = :name, url = :url WHERE bank_id = :bank_id',
      {
        ':bank_id': dto.id,
        ':code': dto.code,
        ':name': dto.name,
        ':url': dto.url,
      },
    )
  }
}

namespace BankDAOSQL {
  export type BankRow = {
    bank_id: number
    name: string
    code: string
    url: string
  }
}
