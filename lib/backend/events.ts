import { EventEmitter } from 'node:events'

export type AppRealtimeEventType =
  | 'booking.created'
  | 'booking.updated'
  | 'booking.cancelled'
  | 'schedule.updated'
  | 'chat.message.created'

export type AppRealtimeEventPayload = {
  type: AppRealtimeEventType
  [key: string]: unknown
}

const globalForEvents = globalThis as typeof globalThis & {
  __realtimeEvents?: EventEmitter
}

export const realtimeEvents =
  globalForEvents.__realtimeEvents ??
  new EventEmitter({
    captureRejections: true,
  })

export const bookingEvents = realtimeEvents

if (process.env.NODE_ENV !== 'production') {
  globalForEvents.__realtimeEvents = realtimeEvents
}

export function emitRealtimeEvent(payload: AppRealtimeEventPayload) {
  realtimeEvents.emit('event', payload)
}

export function emitBookingEvent(payload: AppRealtimeEventPayload) {
  emitRealtimeEvent(payload)
}
