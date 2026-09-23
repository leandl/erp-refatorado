import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'bank' })
export class BankTypeORMPersistenceModel {
  @PrimaryGeneratedColumn({ name: 'bank_id' })
  bankId!: number

  @Column('varchar', { name: 'name' })
  name!: string

  @Column('varchar', { name: 'code' })
  code!: string

  @Column('varchar', { name: 'url' })
  url!: string
}
