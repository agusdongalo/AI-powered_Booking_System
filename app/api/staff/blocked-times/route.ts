import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { emitRealtimeEvent } from '@/lib/backend/events'

export const runtime = 'nodejs'

export async function GET() {
  const result = await pool.query(
    `SELECT id, stylist_id, start_datetime, end_datetime, reason
     FROM blocked_times
     ORDER BY start_datetime DESC`
  )

  return NextResponse.json(result.rows)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const id = crypto.randomUUID()
  const stylistId = body.stylistId ? String(body.stylistId) : null
  const startDatetime = String(body.startDatetime ?? body.start_datetime ?? '').trim()
  const endDatetime = String(body.endDatetime ?? body.end_datetime ?? '').trim()
  const reason = String(body.reason ?? 'Blocked time').trim()

  if (!startDatetime || !endDatetime) {
    return NextResponse.json({ error: 'Missing blocked time fields' }, { status: 400 })
  }

  const result = await pool.query(
    `INSERT INTO blocked_times (id, stylist_id, start_datetime, end_datetime, reason)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, stylist_id, start_datetime, end_datetime, reason`,
    [id, stylistId, startDatetime, endDatetime, reason]
  )

  emitRealtimeEvent({ type: 'schedule.updated', blockedTimeId: id, stylistId })
  return NextResponse.json(result.rows[0], { status: 201 })
}

export async function PATCH(request: NextRequest) {
  const id = new URL(request.url).searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Missing blocked time id' }, { status: 400 })
  }

  const body = await request.json()
  const result = await pool.query(
    `UPDATE blocked_times
     SET stylist_id = COALESCE($2, stylist_id),
         start_datetime = COALESCE($3::timestamptz, start_datetime),
         end_datetime = COALESCE($4::timestamptz, end_datetime),
         reason = COALESCE($5, reason),
         updated_at = NOW()
     WHERE id = $1
     RETURNING id, stylist_id, start_datetime, end_datetime, reason`,
    [
      id,
      body.stylistId ? String(body.stylistId) : null,
      body.startDatetime ? String(body.startDatetime) : null,
      body.endDatetime ? String(body.endDatetime) : null,
      body.reason ? String(body.reason) : null,
    ]
  )

  if ((result.rowCount ?? 0) === 0) {
    return NextResponse.json({ error: 'Blocked time not found' }, { status: 404 })
  }

  emitRealtimeEvent({ type: 'schedule.updated', blockedTimeId: id, stylistId: result.rows[0].stylist_id })
  return NextResponse.json(result.rows[0])
}

export async function DELETE(request: NextRequest) {
  const id = new URL(request.url).searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Missing blocked time id' }, { status: 400 })
  }

  const result = await pool.query('DELETE FROM blocked_times WHERE id = $1 RETURNING stylist_id', [id])
  if ((result.rowCount ?? 0) === 0) {
    return NextResponse.json({ error: 'Blocked time not found' }, { status: 404 })
  }

  emitRealtimeEvent({ type: 'schedule.updated', blockedTimeId: id, stylistId: result.rows[0].stylist_id })
  return NextResponse.json({ ok: true })
}
