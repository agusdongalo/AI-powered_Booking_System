import { NextResponse } from 'next/server'
import { realtimeEvents } from '@/lib/backend/events'

export const runtime = 'nodejs'

export async function GET() {
  let handleEvent: ((payload: unknown) => void) | null = null

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()
      const push = (data: unknown) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
        } catch {
          // The client disconnected; let cancel() clean up.
        }
      }

      handleEvent = (payload: unknown) => push(payload)
      realtimeEvents.on('event', handleEvent)
      push({ type: 'connected' })
    },
    cancel() {
      if (handleEvent) {
        realtimeEvents.off('event', handleEvent)
        handleEvent = null
      }
    },
  })

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}
