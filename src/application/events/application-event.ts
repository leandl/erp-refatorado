import { Event } from '@domain/events/event.ts'

export interface ApplicationEvent<T> extends Event<T> {}
