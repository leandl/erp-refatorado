import { Queue } from '@adapters/queue.ts'

export class MediatorQueueAdapter<
  Events extends Record<string, unknown>,
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
    handler: MediatorQueueAdapter.Handler<Events[K]>,
  ): Promise<void> {
    const handlers = (this.handler[eventName] ??= new Set())

    handlers.add(handler)
  }
}

export namespace MediatorQueueAdapter {
  export type Handler<Payload> = (payload: Payload) => Promise<void> | void

  export type Handlers<Events extends Record<string, unknown>> = {
    [K in keyof Events]?: Set<Handler<Events[K]>>
  }
}
