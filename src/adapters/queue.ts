export interface Queue<
  Events extends Record<string, unknown> = Record<string, unknown>,
> {
  publish<K extends keyof Events>(
    eventName: K,
    payload: Events[K],
  ): Promise<void>

  consume<K extends keyof Events>(
    eventName: K,
    handler: (payload: Events[K]) => Promise<void>,
  ): Promise<void>
}
