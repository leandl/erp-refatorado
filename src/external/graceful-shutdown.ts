export class GracefulShutdown {
  private shutdownPromise: Promise<void> | null = null

  constructor(private readonly handlers: GracefulShutdown.Handler[]) {}

  register(): void {
    process.once('SIGTERM', () => this.shutdown())
    process.once('SIGINT', () => this.shutdown())
  }

  private shutdown(): Promise<void> {
    if (this.shutdownPromise) {
      return this.shutdownPromise
    }

    this.shutdownPromise = this.execute()

    return this.shutdownPromise
  }

  private async execute(): Promise<void> {
    try {
      for (const handler of this.handlers) {
        await handler()
      }

      console.log('Application terminated')
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))

      console.error(`Error on application shutdown: ${err.message}`, err.stack)

      process.exitCode = 1
    }
  }
}

namespace GracefulShutdown {
  export type Handler = () => Promise<void>
}
