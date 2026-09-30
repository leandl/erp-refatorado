import { DomainEvent } from './domain-event.ts'

export class BankInfoUpdatedEvent implements DomainEvent {
  readonly eventName = 'bank.info-updated'
  readonly occurredAt = new Date()

  constructor(readonly payload: DomainEvent.Payload) {}
}
