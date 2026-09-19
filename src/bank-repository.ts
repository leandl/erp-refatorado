import { Bank } from '@bank.ts'
import { DatabaseConnection } from '@database-connection.ts'

export interface BankRepository {
  save(bank: Bank): Promise<Bank>
  findById(bankId: number): Promise<Bank | undefined>
  findByCode(code: string): Promise<Bank | undefined>
  findByName(name: string): Promise<Bank | undefined>
  update(bank: Bank): Promise<void>
  list(): Promise<Bank[]>
  remove(bankId: number): Promise<void>
}

export class BankRepositorySQL implements BankRepository {
  constructor(private databaseConnection: DatabaseConnection) {}

  async save(bank: Bank): Promise<Bank> {
    const [row] =
      await this.databaseConnection.query<BankRepositorySQL.BankRow>(
        'INSERT INTO bank(code, name, url) VALUES(:code, :name, :url) RETURNING *',
        {
          ':code': bank.getCode(),
          ':name': bank.getName(),
          ':url': bank.getUrl(),
        },
      )

    const bankId = row.bank_id

    return Bank.restore({
      id: bankId,
      code: bank.getCode(),
      name: bank.getName(),
      url: bank.getUrl(),
    })
  }

  async findById(bankId: number): Promise<Bank | undefined> {
    const [firstRow] =
      await this.databaseConnection.query<BankRepositorySQL.BankRow>(
        'SELECT * FROM bank WHERE bank_id = :bank_id',
        { ':bank_id': bankId },
      )

    if (!firstRow) {
      return undefined
    }

    return Bank.restore({
      id: firstRow.bank_id,
      code: firstRow.code,
      name: firstRow.name,
      url: firstRow.url,
    })
  }

  async findByCode(code: string): Promise<Bank | undefined> {
    const [firstRow] =
      await this.databaseConnection.query<BankRepositorySQL.BankRow>(
        'SELECT * FROM bank WHERE code = :code',
        { ':code': code },
      )

    if (!firstRow) {
      return undefined
    }

    return Bank.restore({
      id: firstRow.bank_id,
      code: firstRow.code,
      name: firstRow.name,
      url: firstRow.url,
    })
  }

  async findByName(name: string): Promise<Bank | undefined> {
    const [firstRow] =
      await this.databaseConnection.query<BankRepositorySQL.BankRow>(
        'SELECT * FROM bank WHERE name = :name',
        { ':name': name },
      )

    if (!firstRow) {
      return undefined
    }

    return Bank.restore({
      id: firstRow.bank_id,
      code: firstRow.code,
      name: firstRow.name,
      url: firstRow.url,
    })
  }

  async update(bank: Bank): Promise<void> {
    await this.databaseConnection.query<BankRepositorySQL.BankRow>(
      'UPDATE bank SET code = :code, name = :name, url = :url WHERE bank_id = :bank_id',
      {
        ':bank_id': bank.getBankId(),
        ':code': bank.getCode(),
        ':name': bank.getName(),
        ':url': bank.getUrl(),
      },
    )
  }

  async list(): Promise<Bank[]> {
    const rows =
      await this.databaseConnection.query<BankRepositorySQL.BankRow>(
        'SELECT * FROM bank',
      )

    return rows.map((row) =>
      Bank.restore({
        id: row.bank_id,
        code: row.code,
        name: row.name,
        url: row.url,
      }),
    )
  }

  async remove(bankId: number): Promise<void> {
    await this.databaseConnection.query<BankRepositorySQL.BankRow>(
      'DELETE FROM bank WHERE bank_id = :bank_id',
      {
        ':bank_id': bankId,
      },
    )
  }
}

namespace BankRepositorySQL {
  export type BankRow = {
    bank_id: number
    name: string
    code: string
    url: string
  }
}
