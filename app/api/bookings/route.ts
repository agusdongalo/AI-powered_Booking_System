import { NextRequest, NextResponse } from 'next/server'
import {
  cancelBooking,
  createBooking,
  listBookings,
  rescheduleBooking,
} from '@/lib/backend/booking-service'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const customerPhone = searchParams.get('customerPhone')

  return NextResponse.json(await listBookings(customerPhone || undefined))
}

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
    const statusCode =
      result.error === 'Selected time is not available' ? 409 : result.error === 'Service not found' ? 404 : 400
    return NextResponse.json({ error: result.error }, { status: statusCode })
  }

  return NextResponse.json(result.booking, { status: 201 })
}

export async function PATCH(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

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
    const statusCode =
      result.error === 'Selected time is not available' ? 409 : result.error === 'Service not found' ? 404 : 404
    return NextResponse.json({ error: result.error }, { status: statusCode })
  }

  return NextResponse.json(result.booking)
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Missing booking id' }, { status: 400 })
  }

  const result = await cancelBooking(id)

  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
