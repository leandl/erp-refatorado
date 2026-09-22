export interface ApplicationDependenciesRepository {
  getStatus(): Promise<ApplicationDependenciesRepository.Status>
}

export namespace ApplicationDependenciesRepository {
  export type Status = {
    database: {
      version: string
      maxConnections: number
      openedConnections: number
    }
  }
}
