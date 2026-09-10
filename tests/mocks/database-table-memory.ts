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

  private clone(record: T): T {
    return this.params.clone(record)
  }

  private createIndexes(tableRecordId: number) {
    const entity = this.tableData.get(tableRecordId)
    if (!entity) throw new Error('Entity not found')

    for (const index of this.params.indexes) {
      const key = this.generateKeyIndex(index.name, index.getValue(entity))

      if (index.unique) {
        if (this.uniqueIndexes.has(key)) {
          throw new Error(`Unique index "${index.name}" already exists`)
        }

        this.uniqueIndexes.set(key, tableRecordId)
        continue
      }

      if (this.multipleIndexes.has(key)) {
        this.multipleIndexes.get(key)!.add(tableRecordId)
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

    const record = this.params.addIDInRecord(this.clone(entity), tableRecordId)

    this.tableData.set(tableRecordId, record)
    this.createIndexes(tableRecordId)

    return tableRecordId
  }

  async getById(tableRecordId: number): Promise<T | undefined> {
    const entity = this.tableData.get(tableRecordId)
    return entity ? this.clone(entity) : undefined
  }

  async getByIndex(type: string, value: string): Promise<T | undefined> {
    const key = this.generateKeyIndex(type, value)
    const tableRecordId = this.uniqueIndexes.get(key)

    if (tableRecordId === undefined) {
      return undefined
    }

    const entity = this.tableData.get(tableRecordId)
    return entity ? this.clone(entity) : undefined
  }

  async listByIndex(type: string, value: string): Promise<T[]> {
    const key = this.generateKeyIndex(type, value)
    const ids = this.multipleIndexes.get(key)

    if (!ids) return []

    return [...ids]
      .map((id) => this.tableData.get(id))
      .filter((record): record is T => record !== undefined)
      .map((record) => this.clone(record))
  }

  async update(tableRecordId: number, entity: T): Promise<void> {
    this.deleteIndexes(tableRecordId)

    const record = this.params.addIDInRecord(this.clone(entity), tableRecordId)

    this.tableData.set(tableRecordId, record)
    this.createIndexes(tableRecordId)
  }

  async list(): Promise<T[]> {
    return [...this.tableData.values()].map((record) => this.clone(record))
  }

  async remove(tableRecordId: number): Promise<void> {
    if (!this.tableData.has(tableRecordId)) return

    this.deleteIndexes(tableRecordId)
    this.tableData.delete(tableRecordId)
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
    clone: (record: T) => T
    indexes: readonly (UniqueIndex<T> | MultipleIndex<T>)[]
  }
}
