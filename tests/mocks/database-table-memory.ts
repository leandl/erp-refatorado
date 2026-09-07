export class DatabaseTableMemory<T> {
  private tableData = new Map<number, T>()
  private uniqueIndexes = new Map<string, number>()
  private multipleIndexes = new Map<string, Set<number>>()
  private currentId = 1

  constructor(
    private readonly params: DatabaseTableMemory.ConstructorParams<T>,
  ) {}

  private generateKeyIndex(type: string, value: string) {
    return `${type}:${value}`
  }

  private createIndexes(tableRecordId: number) {
    const entity = this.tableData.get(tableRecordId)

    if (!entity) throw new Error('Entity not found')

    for (const index of this.params.indexes) {
      const key = this.generateKeyIndex(index.name, index.getValue(entity))

      if (index.unique) {
        if (this.uniqueIndexes.get(key) !== undefined) {
          throw new Error(`Unique index "${index.name}" already exists`)
        }

        this.uniqueIndexes.set(key, tableRecordId)
        continue
      }

      if (this.multipleIndexes.has(key)) {
        this.multipleIndexes.get(key)?.add(tableRecordId)
      } else {
        this.multipleIndexes.set(key, new Set([tableRecordId]))
      }
    }
  }

  private deleteIndexes(tableRecordId: number) {
    const entity = this.tableData.get(tableRecordId)

    if (!entity) throw new Error('Entity not found')

    for (const index of this.params.indexes) {
      const key = this.generateKeyIndex(index.name, index.getValue(entity))

      if (index.unique) {
        this.uniqueIndexes.delete(key)
        continue
      }

      const ids = this.multipleIndexes.get(key)

      if (!ids) continue

      ids.delete(tableRecordId)

      if (ids.size === 0) {
        this.multipleIndexes.delete(key)
      }
    }
  }

  create(entity: T): number {
    const tableRecordId = this.currentId++
    this.tableData.set(
      tableRecordId,
      this.params.addIDInRecord(entity, tableRecordId),
    )
    this.createIndexes(tableRecordId)

    return tableRecordId
  }

  async getById(tableRecordId: number): Promise<T | undefined> {
    return this.tableData.get(tableRecordId)
  }

  async getByIndex(type: string, value: string): Promise<T | undefined> {
    const key = this.generateKeyIndex(type, value)
    const tableRecordId = this.uniqueIndexes.get(key)

    if (!tableRecordId) {
      return undefined
    }
    return this.tableData.get(tableRecordId)
  }

  async listByIndex(type: string, value: string): Promise<T[]> {
    const key = this.generateKeyIndex(type, value)
    const ids = this.multipleIndexes.get(key)

    if (!ids) return []

    const records = new Array<T>()

    for (const id of ids) {
      const record = this.tableData.get(id)
      if (record) {
        records.push(record)
      }
    }

    return records
  }

  async update(tableRecordId: number, entity: T): Promise<void> {
    this.deleteIndexes(tableRecordId)
    this.tableData.set(
      tableRecordId,
      this.params.addIDInRecord(entity, tableRecordId),
    )
    this.createIndexes(tableRecordId)
  }

  async list(): Promise<T[]> {
    return Array.from(this.tableData.values())
  }

  async remove(tableRecordId: number): Promise<void> {
    if (this.tableData.has(tableRecordId)) {
      this.deleteIndexes(tableRecordId)
      this.tableData.delete(tableRecordId)
    }
  }
}

export namespace DatabaseTableMemory {
  export type UniqueIndex<T> = {
    name: string
    unique: true
    getValue: (record: T) => string
  }

  export type MultipleIndex<T> = {
    name: string
    unique?: false
    getValue: (record: T) => string
  }

  export type ConstructorParams<T> = {
    addIDInRecord: (record: T, tableRecordId: number) => T
    indexes: readonly (UniqueIndex<T> | MultipleIndex<T>)[]
  }
}
