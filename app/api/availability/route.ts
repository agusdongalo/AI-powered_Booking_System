import { NextRequest, NextResponse } from 'next/server'
import { getAvailabilitySlots } from '@/lib/backend/availability-service'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const dateValue = searchParams.get('date')
  const stylistId = searchParams.get('stylistId')
  const durationValue = searchParams.get('duration')

  if (!dateValue || !stylistId || !durationValue) {
    return NextResponse.json({ error: 'Missing required query params' }, { status: 400 })
  }

  const result = await getAvailabilitySlots({
    date: dateValue,
    stylistId,
    duration: Number(durationValue),
  })

  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 404 })
  }

  return NextResponse.json({ slots: result.slots })
}
