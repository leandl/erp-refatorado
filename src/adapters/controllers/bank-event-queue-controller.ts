import { Queue } from '@adapters/queue.ts'
import { BankCreatedEvent } from '@application/events/bank-created-event.ts'
import { BankInfoUpdatedEvent } from '@domain/events/bank-info-updated-event.ts'

type BankEventMap = {
  [BankCreatedEvent.EVENT_NAME]: BankCreatedEvent['payload']
  [BankInfoUpdatedEvent.EVENT_NAME]: BankInfoUpdatedEvent['payload']
}

export class BankEventQueueController {
  constructor(queue: Queue<BankEventMap>) {
    queue.consume(BankCreatedEvent.EVENT_NAME, async (payload) => {
      // // chamar usecase
      // console.log(BankCreatedEvent.EVENT_NAME, { payload })
    })

    queue.consume(BankInfoUpdatedEvent.EVENT_NAME, async (payload) => {
      // // chamar usecase
      // console.log(BankInfoUpdatedEvent.EVENT_NAME, { payload })
    })
  }
}
