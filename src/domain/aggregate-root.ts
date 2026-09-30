import { DomainEvent } from './events/domain-event.ts'

export abstract class AggregateRoot {
  private events: DomainEvent[] = []

  protected registerEvent(event: DomainEvent) {
    this.events.push(event)
  }

  protected registerEventOnce(newEvent: DomainEvent) {
    const exists = this.events.some(
      (event) => event.eventName === newEvent.eventName,
    )

    if (exists) return

    this.events.push(newEvent)
  }

  getDomainEvents() {
    return this.events
  }
}
