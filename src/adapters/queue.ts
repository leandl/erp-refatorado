export interface Queue<Events extends Queue.Events = Queue.Events> {
  publish<K extends keyof Events>(
    eventName: K,
    payload: Events[K],
  ): Promise<void>

  consume<K extends keyof Events>(
    eventName: K,
    handler: Queue.Handler<Events[K]>,
  ): Promise<void>

  connect(): Promise<void>
  disconnect(): Promise<void>
}

export namespace Queue {
  export type Events = Record<string, unknown>

  export type Handler<Payload> = (payload: Payload) => Promise<void>
}
