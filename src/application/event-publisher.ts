import { Event } from '@domain/events/event.ts'

export interface EventPublisher {
  publishAll(event: Event[]): Promise<void>
}
