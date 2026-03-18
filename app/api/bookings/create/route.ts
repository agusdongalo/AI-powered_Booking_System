import { NextRequest, NextResponse } from 'next/server'
import { createBooking } from '@/lib/backend/booking-service'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const customerName = String(body.customerName ?? '').trim()
  const customerPhone = String(body.customerPhone ?? '').trim()
  const customerEmail = String(body.customerEmail ?? '').trim()
  const serviceId = String(body.serviceId ?? '').trim()
  const stylistId = String(body.stylistId ?? '').trim()
  const startTime = String(body.startTime ?? '').trim()
  const status = String(body.status ?? 'confirmed').trim()

  if (!customerName || !customerPhone || !serviceId || !stylistId || !startTime) {
    return NextResponse.json({ error: 'Missing required booking fields' }, { status: 400 })
  }

  const result = await createBooking({
    customerName,
    customerPhone,
    customerEmail,
    serviceId,
    stylistId,
    startTime,
    status,
  })

  if ('error' in result) {
    const statusCode = result.error === 'Selected time is not available' ? 409 : result.error === 'Service not found' ? 404 : 400
    return NextResponse.json({ error: result.error }, { status: statusCode })
  }

  return NextResponse.json(result.booking, { status: 201 })
}
