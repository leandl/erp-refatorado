import { DomainEvent } from './domain-event.ts'

export class BankInfoUpdatedEvent implements DomainEvent {
  static readonly EVENT_NAME = 'bank.info-updated'
  readonly eventName = BankInfoUpdatedEvent.EVENT_NAME
  readonly occurredAt = new Date()

  constructor(readonly payload: DomainEvent.Payload) {}
}
