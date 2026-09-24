export abstract class DataSource<T> {
  constructor(protected source: T) {}

  getSource(): T {
    return this.source
  }

  abstract disconnect(): Promise<void>
}
