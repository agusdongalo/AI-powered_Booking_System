import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { serializeService } from '@/lib/serializers'

export const runtime = 'nodejs'

export async function GET() {
  const result = await pool.query(
    'SELECT id, name, duration_minutes, price, description FROM services ORDER BY name ASC'
  )

  return NextResponse.json(result.rows.map(serializeService))
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const id = body.id ?? crypto.randomUUID()

  const result = await pool.query(
    `INSERT INTO services (id, name, duration_minutes, price, description)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, duration_minutes, price, description`,
    [id, body.name, Number(body.duration), Number(body.price), body.description]
  )

  return NextResponse.json(serializeService(result.rows[0]), { status: 201 })
}

export async function PATCH(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Missing service id' }, { status: 400 })
  }

  const body = await request.json()
  const result = await pool.query(
    `UPDATE services
     SET name = $2,
         duration_minutes = $3,
         price = $4,
         description = $5,
         updated_at = NOW()
     WHERE id = $1
     RETURNING id, name, duration_minutes, price, description`,
    [id, body.name, Number(body.duration), Number(body.price), body.description]
  )

  if (result.rowCount === 0) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 })
  }

  return NextResponse.json(serializeService(result.rows[0]))
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Missing service id' }, { status: 400 })
  }

  const result = await pool.query('DELETE FROM services WHERE id = $1 RETURNING id', [id])

  if (result.rowCount === 0) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
