import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { serializeStylist } from '@/lib/serializers'

export const runtime = 'nodejs'

export async function GET() {
  const result = await pool.query(
    `SELECT id, name, specialty, avatar_url, working_hours_start, working_hours_end
     FROM stylists
     ORDER BY name ASC`
  )

  return NextResponse.json(result.rows.map(serializeStylist))
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const id = body.id ?? crypto.randomUUID()

  const result = await pool.query(
    `INSERT INTO stylists (id, name, specialty, avatar_url, working_hours_start, working_hours_end)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, name, specialty, avatar_url, working_hours_start, working_hours_end`,
    [
      id,
      body.name,
      body.specialty,
      body.avatar || body.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
      body.workingHours?.start || body.working_hours_start,
      body.workingHours?.end || body.working_hours_end,
    ]
  )

  return NextResponse.json(serializeStylist(result.rows[0]), { status: 201 })
}

export async function PATCH(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Missing stylist id' }, { status: 400 })
  }

  const body = await request.json()
  const result = await pool.query(
    `UPDATE stylists
     SET name = $2,
         specialty = $3,
         avatar_url = $4,
         working_hours_start = $5,
         working_hours_end = $6,
         updated_at = NOW()
     WHERE id = $1
     RETURNING id, name, specialty, avatar_url, working_hours_start, working_hours_end`,
    [
      id,
      body.name,
      body.specialty,
      body.avatar || body.avatar_url,
      body.workingHours?.start || body.working_hours_start,
      body.workingHours?.end || body.working_hours_end,
    ]
  )

  if (result.rowCount === 0) {
    return NextResponse.json({ error: 'Stylist not found' }, { status: 404 })
  }

  return NextResponse.json(serializeStylist(result.rows[0]))
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Missing stylist id' }, { status: 400 })
  }

  const result = await pool.query('DELETE FROM stylists WHERE id = $1 RETURNING id', [id])

  if (result.rowCount === 0) {
    return NextResponse.json({ error: 'Stylist not found' }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
