import { Queue } from '@adapters/queue.ts'

export class MediatorQueueAdapter<
  Events extends Queue.Events = Queue.Events,
> implements Queue<Events> {
  public readonly handler: MediatorQueueAdapter.Handlers<Events> = {}

  async publish<K extends keyof Events>(
    eventName: K,
    payload: Events[K],
  ): Promise<void> {
    const handlers = this.handler[eventName]

    if (!handlers) {
      return
    }

    for (const handler of handlers) {
      await handler(payload)
    }
  }

  async consume<K extends keyof Events>(
    eventName: K,
    handler: Queue.Handler<Events[K]>,
  ): Promise<void> {
    const handlers = (this.handler[eventName] ??= new Set())

    handlers.add(handler)
  }

  async connect(): Promise<void> {}
  async disconnect(): Promise<void> {}
}

export namespace MediatorQueueAdapter {
  export type Handlers<Events extends Record<string, unknown>> = {
    [K in keyof Events]?: Set<Queue.Handler<Events[K]>>
  }
}
