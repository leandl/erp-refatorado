import { EventPublisherQueue } from '@adapters/event-publisher-queue.ts'
import { Queue } from '@adapters/queue.ts'
import { EventPublisher } from '@application/event-publisher.ts'
import { DomainEvent } from '@domain/events/domain-event.ts'
import Sinon from 'sinon'

let sut: EventPublisher
const queue: Queue = {
  async publish() {},
}

beforeAll(() => {
  sut = new EventPublisherQueue(queue)
})

test('Should publish events to the queue', async () => {
  const firstEvent: DomainEvent = {
    eventName: 'test.first_event',
    occurredAt: new Date(),
    payload: {
      aggregateId: 0,
    },
  }

  const secondEvent: DomainEvent = {
    eventName: 'test.second_event',
    occurredAt: new Date(),
    payload: {
      aggregateId: 1,
    },
  }

  const queuePublishSpy = Sinon.spy(queue, 'publish')

  await sut.publishAll([firstEvent, secondEvent])

  expect(queuePublishSpy.calledTwice).toBeTruthy()
  expect(
    queuePublishSpy.firstCall.calledWith(firstEvent.eventName, {
      occurredAt: firstEvent.occurredAt,
      payload: firstEvent.payload,
    }),
  ).toBeTruthy()
  expect(
    queuePublishSpy.secondCall.calledWith(secondEvent.eventName, {
      occurredAt: secondEvent.occurredAt,
      payload: secondEvent.payload,
    }),
  ).toBeTruthy()
})
