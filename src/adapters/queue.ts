export interface Queue {
  publish(eventName: string, payload: unknown): Promise<void>
}
