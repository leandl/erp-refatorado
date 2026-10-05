import { Queue } from '@adapters/queue.ts'
import { RabbitMQueueAdapter } from '@external/queue/rabbit-mqueue-adapter.ts'
import Sinon from 'sinon'

let sut: Queue

beforeAll(async () => {
  sut = new RabbitMQueueAdapter(process.env.QUEUE_RABBITMQ_URI!)
  await sut.connect()
})

afterAll(async () => {
  await sut.disconnect()
})

type WaitForCallsCallbackParams = {
  callback: Sinon.SinonSpy
  expectedCalls: number
  timeoutMs?: number
  throwOnTimeout?: boolean
}

function waitForCalls({
  callback,
  expectedCalls,
  timeoutMs = 5_000,
  throwOnTimeout = true,
}: WaitForCallsCallbackParams): Promise<void> {
  return new Promise((resolve, reject) => {
    const startedAt = Date.now()

    const interval = setInterval(() => {
      if (callback.callCount >= expectedCalls) {
        clearInterval(interval)
        resolve()
        return
      }

      if (Date.now() - startedAt >= timeoutMs) {
        clearInterval(interval)

        if (throwOnTimeout) {
          reject(
            new Error(
              `Expected ${expectedCalls} calls, but received ${callback.callCount}`,
            ),
          )
          return
        }

        resolve()
      }
    }, 10)
  })
}

test('should publish and consume multiple events', async () => {
  const callbackSpy = Sinon.spy()
  const eventName = `any.event.${Date.now()}`
  const payload = { message: 'Hello, World!' }

  await sut.consume(eventName, callbackSpy)

  await sut.publish(eventName, payload)

  await waitForCalls({
    callback: callbackSpy,
    expectedCalls: 2,
    timeoutMs: 500,
    throwOnTimeout: false,
  })

  expect(callbackSpy.callCount).toEqual(1)
  expect(callbackSpy.calledWith(Sinon.match(payload))).toBeTruthy()
})
