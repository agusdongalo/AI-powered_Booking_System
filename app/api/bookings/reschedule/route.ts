import { NextRequest, NextResponse } from 'next/server'
import { rescheduleBooking } from '@/lib/backend/booking-service'

export const runtime = 'nodejs'

export async function PATCH(request: NextRequest) {
  const id = new URL(request.url).searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Missing booking id' }, { status: 400 })
  }

  const body = await request.json()
  const result = await rescheduleBooking({
    bookingId: id,
    status: body.status ? String(body.status) : undefined,
    serviceId: body.serviceId ? String(body.serviceId) : undefined,
    stylistId: body.stylistId ? String(body.stylistId) : undefined,
    startTime: body.startTime ? String(body.startTime) : undefined,
  })

  if ('error' in result) {
    const statusCode = result.error === 'Selected time is not available' ? 409 : result.error === 'Service not found' ? 404 : 404
    return NextResponse.json({ error: result.error }, { status: statusCode })
  }

  return NextResponse.json(result.booking)
}

export async function POST(request: NextRequest) {
  return PATCH(request)
}
