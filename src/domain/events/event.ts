export interface Event<EventPayload = unknown> {
  eventName: string
  occurredAt: Date
  payload: EventPayload
}
