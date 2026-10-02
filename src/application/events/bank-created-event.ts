import { ApplicationEvent } from './application-event.ts'

export class BankCreatedEvent implements ApplicationEvent<BankCreatedEvent.Payload> {
  static readonly EVENT_NAME = 'bank.created'
  readonly eventName = BankCreatedEvent.EVENT_NAME
  readonly occurredAt = new Date()

  constructor(readonly payload: BankCreatedEvent.Payload) {}
}

export namespace BankCreatedEvent {
  export type Payload = {
    bankId: number
  }
}
