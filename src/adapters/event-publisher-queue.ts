import { EventPublisher } from '@application/event-publisher.ts'
import { Event } from '@domain/events/event.ts'

import { Queue } from './queue.ts'

export class EventPublisherQueue implements EventPublisher {
  constructor(private queue: Queue) {}

  public async publishAll(events: Event[]): Promise<void> {
    for (const event of events) {
      const payload = {
        occurredAt: event.occurredAt,
        payload: event.payload,
      }
      await this.queue.publish(event.eventName, payload)
    }
  }
}
