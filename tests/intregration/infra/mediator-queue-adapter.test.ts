import { MediatorQueueAdapter } from '@external/queue/mediator-queue-adapter.ts'
import Sinon from 'sinon'

let sut: MediatorQueueAdapter<any>

beforeEach(() => {
  sut = new MediatorQueueAdapter()
})

afterEach(() => {
  Sinon.restore()
})

describe('MediatorQueueAdapter', () => {
  describe('consume', () => {
    test('should register a handler for an event', async () => {
      const event = 'any-event'
      const handler = () => {}

      await sut.consume(event, handler)

      expect(Array.from(sut.handler[event]!)).toEqual([handler])
    })

    test('should register multiple handlers for the same event', async () => {
      const event = 'any-event'

      const firstHandler = () => {}
      const secondHandler = () => {}

      await sut.consume(event, firstHandler)
      await sut.consume(event, secondHandler)

      expect(Array.from(sut.handler[event]!)).toEqual([
        firstHandler,
        secondHandler,
      ])
    })

    test('should preserve the order in which handlers were registered', async () => {
      const event = 'any-event'

      const firstHandler = () => {}
      const secondHandler = () => {}
      const thirdHandler = () => {}

      await sut.consume(event, firstHandler)
      await sut.consume(event, secondHandler)
      await sut.consume(event, thirdHandler)

      expect(Array.from(sut.handler[event]!)).toEqual([
        firstHandler,
        secondHandler,
        thirdHandler,
      ])
    })

    test('should register handlers for different events independently', async () => {
      const firstEvent = 'first-event'
      const secondEvent = 'second-event'

      const firstHandler = () => {}
      const secondHandler = () => {}

      await sut.consume(firstEvent, firstHandler)
      await sut.consume(secondEvent, secondHandler)

      expect(Array.from(sut.handler[firstEvent]!)).toEqual([firstHandler])
      expect(Array.from(sut.handler[secondEvent]!)).toEqual([secondHandler])
    })

    test('should not share handlers between different events', async () => {
      const firstEvent = 'first-event'
      const secondEvent = 'second-event'

      const firstHandler = () => {}
      const secondHandler = () => {}

      await sut.consume(firstEvent, firstHandler)
      await sut.consume(secondEvent, secondHandler)

      expect(Array.from(sut.handler[firstEvent]!)).not.toContain(secondHandler)
      expect(Array.from(sut.handler[secondEvent]!)).not.toContain(firstHandler)
    })

    test('should not register the same handler more than once', async () => {
      const event = 'any-event'
      const handler = () => {}

      await sut.consume(event, handler)
      await sut.consume(event, handler)

      expect(sut.handler[event]!).toEqual(new Set([handler]))
    })
  })

  describe('publish', () => {
    test('should publish an event and call all registered handlers', async () => {
      const event = 'any-event'
      const handler = Sinon.spy()
      const payload = { data: 'any-data' }

      await sut.consume(event, handler)
      await sut.publish(event, payload)

      expect(handler.calledOnce).toBe(true)
      expect(handler.calledWith(payload)).toBe(true)
    })

    test('should call handlers in the order they were registered', async () => {
      const event = 'any-event'
      const payload = { data: 'any-data' }

      const firstHandler = Sinon.spy()
      const secondHandler = Sinon.spy()

      await sut.consume(event, firstHandler)
      await sut.consume(event, secondHandler)
      await sut.publish(event, payload)

      expect(firstHandler.calledOnce).toBe(true)
      expect(firstHandler.calledWith(payload)).toBe(true)
      expect(secondHandler.calledOnce).toBe(true)
      expect(secondHandler.calledWith(payload)).toBe(true)
    })

    test('should preserve the order in which handlers were registered', async () => {
      const event = 'any-event'
      const payload = { data: 'any-data' }

      const firstHandler = Sinon.spy()
      const secondHandler = Sinon.spy()
      const thirdHandler = Sinon.spy()

      await sut.consume(event, firstHandler)
      await sut.consume(event, secondHandler)
      await sut.consume(event, thirdHandler)

      await sut.publish(event, payload)

      expect(firstHandler.calledOnce).toBe(true)
      expect(firstHandler.calledWith(payload)).toBe(true)
      expect(secondHandler.calledOnce).toBe(true)
      expect(secondHandler.calledWith(payload)).toBe(true)
      expect(thirdHandler.calledOnce).toBe(true)
      expect(thirdHandler.calledWith(payload)).toBe(true)
    })

    test('should call the correct handlers for each event', async () => {
      const firstEvent = 'first-event'
      const firstPayload = { data: 'first-data' }
      const firstHandler = Sinon.spy()

      const secondEvent = 'second-event'
      const secondPayload = { data: 'second-data' }
      const secondHandler = Sinon.spy()

      await sut.consume(firstEvent, firstHandler)
      await sut.consume(secondEvent, secondHandler)

      await sut.publish(firstEvent, firstPayload)

      expect(firstHandler.calledOnce).toBe(true)
      expect(firstHandler.calledWith(firstPayload)).toBe(true)
      expect(secondHandler.callCount).toBe(0)

      await sut.publish(secondEvent, secondPayload)

      expect(firstHandler.calledOnce).toBe(true)
      expect(firstHandler.calledWith(firstPayload)).toBe(true)
      expect(secondHandler.calledOnce).toBe(true)
      expect(secondHandler.calledWith(secondPayload)).toBe(true)
    })

    test('should not throw when publishing an event without registered handlers', async () => {
      const event = 'any-event'
      const payload = { data: 'any-data' }

      await expect(sut.publish(event, payload)).resolves.not.toThrow()
    })

    test('should call a duplicated handler only once', async () => {
      const event = 'any-event'
      const payload = { data: 'any-data' }
      const handler = Sinon.spy()

      await sut.consume(event, handler)
      await sut.consume(event, handler)

      await sut.publish(event, payload)

      expect(handler.calledOnce).toBe(true)
      expect(handler.calledWith(payload)).toBe(true)
    })
  })
})
