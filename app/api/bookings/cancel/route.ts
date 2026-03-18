import { NextRequest, NextResponse } from 'next/server'
import { cancelBooking } from '@/lib/backend/booking-service'

export const runtime = 'nodejs'

export async function DELETE(request: NextRequest) {
  const id = new URL(request.url).searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Missing booking id' }, { status: 400 })
  }

  const result = await cancelBooking(id)
  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}

export async function POST(request: NextRequest) {
  return DELETE(request)
}
