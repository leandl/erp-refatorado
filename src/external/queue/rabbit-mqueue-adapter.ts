import { Queue } from '@adapters/queue.ts'
import { ChannelModel, connect, ConsumeMessage } from 'amqplib'

export class RabbitMQueueAdapter<
  Events extends Queue.Events = Queue.Events,
> implements Queue<Events> {
  private connection: ChannelModel | null = null

  constructor(private readonly rabbitMQURI: string) {}

  async publish<K extends keyof Events>(
    eventName: K,
    payload: Events[K],
  ): Promise<void> {
    if (!this.connection) {
      throw new Error(
        'Connection not established. Call connect() before consuming events.',
      )
    }

    const channel = await this.connection.createChannel()
    await channel.assertQueue(eventName.toString(), { durable: true })
    channel.sendToQueue(
      eventName.toString(),
      Buffer.from(JSON.stringify(payload)),
    )
  }

  async consume<K extends keyof Events>(
    eventName: K,
    handler: Queue.Handler<Events[K]>,
  ): Promise<void> {
    if (!this.connection) {
      throw new Error(
        'Connection not established. Call connect() before consuming events.',
      )
    }

    const channel = await this.connection.createChannel()
    await channel.assertQueue(eventName.toString(), { durable: true })
    await channel.consume(
      eventName.toString(),
      async (message: ConsumeMessage | null) => {
        if (!message) return

        try {
          const payload = JSON.parse(message.content.toString())
          await handler(payload)
          channel.ack(message)
        } catch (error) {
          console.error('Error on consumer:', error)
          channel.nack(message, false, false)
        }
      },
    )
  }

  async connect(): Promise<void> {
    this.connection = await connect(this.rabbitMQURI)
  }

  async disconnect(): Promise<void> {
    if (!this.connection) return

    await this.connection.close()
    this.connection = null
  }
}
