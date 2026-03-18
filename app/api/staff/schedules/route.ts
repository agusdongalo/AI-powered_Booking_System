import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { emitRealtimeEvent } from '@/lib/backend/events'

export const runtime = 'nodejs'

export async function GET() {
  const result = await pool.query(
    `SELECT id, stylist_id, day_of_week, start_time, end_time, is_active
     FROM stylist_schedules
     ORDER BY stylist_id, day_of_week, start_time`
  )

  return NextResponse.json(result.rows)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const stylistId = String(body.stylistId ?? '').trim()
  const dayOfWeek = Number(body.dayOfWeek ?? body.day_of_week)
  const startTime = String(body.startTime ?? body.start_time ?? '').trim()
  const endTime = String(body.endTime ?? body.end_time ?? '').trim()
  const isActive = body.isActive ?? body.is_active ?? true

  if (!stylistId || Number.isNaN(dayOfWeek) || !startTime || !endTime) {
    return NextResponse.json({ error: 'Missing required schedule fields' }, { status: 400 })
  }

  const id = crypto.randomUUID()
  const result = await pool.query(
    `INSERT INTO stylist_schedules (id, stylist_id, day_of_week, start_time, end_time, is_active)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, stylist_id, day_of_week, start_time, end_time, is_active`,
    [id, stylistId, dayOfWeek, startTime, endTime, Boolean(isActive)]
  )

  emitRealtimeEvent({ type: 'schedule.updated', scheduleId: id, stylistId })
  return NextResponse.json(result.rows[0], { status: 201 })
}

export async function PATCH(request: NextRequest) {
  const id = new URL(request.url).searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Missing schedule id' }, { status: 400 })
  }

  const body = await request.json()
  const result = await pool.query(
    `UPDATE stylist_schedules
     SET stylist_id = COALESCE($2, stylist_id),
         day_of_week = COALESCE($3, day_of_week),
         start_time = COALESCE($4, start_time),
         end_time = COALESCE($5, end_time),
         is_active = COALESCE($6, is_active),
         updated_at = NOW()
     WHERE id = $1
     RETURNING id, stylist_id, day_of_week, start_time, end_time, is_active`,
    [
      id,
      body.stylistId ? String(body.stylistId) : null,
      body.dayOfWeek !== undefined ? Number(body.dayOfWeek) : null,
      body.startTime ? String(body.startTime) : null,
      body.endTime ? String(body.endTime) : null,
      body.isActive !== undefined ? Boolean(body.isActive) : null,
    ]
  )

  if ((result.rowCount ?? 0) === 0) {
    return NextResponse.json({ error: 'Schedule not found' }, { status: 404 })
  }

  emitRealtimeEvent({ type: 'schedule.updated', scheduleId: id, stylistId: result.rows[0].stylist_id })
  return NextResponse.json(result.rows[0])
}

export async function DELETE(request: NextRequest) {
  const id = new URL(request.url).searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Missing schedule id' }, { status: 400 })
  }

  const result = await pool.query('DELETE FROM stylist_schedules WHERE id = $1 RETURNING stylist_id', [id])
  if ((result.rowCount ?? 0) === 0) {
    return NextResponse.json({ error: 'Schedule not found' }, { status: 404 })
  }

  emitRealtimeEvent({ type: 'schedule.updated', scheduleId: id, stylistId: result.rows[0].stylist_id })
  return NextResponse.json({ ok: true })
}
