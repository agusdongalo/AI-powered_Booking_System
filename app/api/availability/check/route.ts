import { NextRequest, NextResponse } from 'next/server'
import { getAvailabilitySlots, getAvailabilitySlotsForStylists } from '@/lib/backend/availability-service'

export const runtime = 'nodejs'

async function handleInput(dateValue: string, durationValue: string, stylistId?: string | null) {
  if (!dateValue || !durationValue) {
    return NextResponse.json({ error: 'Missing required query params' }, { status: 400 })
  }

  const duration = Number(durationValue)
  if (Number.isNaN(duration) || duration <= 0) {
    return NextResponse.json({ error: 'Invalid duration' }, { status: 400 })
  }

  if (stylistId) {
    const result = await getAvailabilitySlots({
      date: dateValue,
      stylistId,
      duration,
    })

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 404 })
    }

    return NextResponse.json({ slots: result.slots })
  }

  const slots = await getAvailabilitySlotsForStylists({
    date: dateValue,
    serviceDuration: duration,
  })

  return NextResponse.json({ slots })
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  return handleInput(searchParams.get('date') || '', searchParams.get('duration') || searchParams.get('serviceDuration') || '', searchParams.get('stylistId'))
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  return handleInput(
    String(body.date ?? ''),
    String(body.duration ?? body.serviceDuration ?? ''),
    body.stylistId ? String(body.stylistId) : null
  )
}
