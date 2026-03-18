import type { PoolClient } from 'pg'
import { pool } from '@/lib/db'
import { serializeBooking } from '@/lib/serializers'
import { assertSlotAvailability } from './availability-service'
import { emitBookingEvent } from './events'

export type BookingRecord = {
  id: string
  customerName: string
  customerPhone: string
  customerEmail: string
  serviceId: string
  stylistId: string
  serviceName: string
  serviceDuration: number
  servicePrice: number
  stylistName: string
  stylistAvatar: string
  startTime: string
  endTime: string
  status: string
}

function fallbackEmail(phone: string) {
  return `guest-${phone.replace(/[^a-zA-Z0-9]/g, '') || 'booking'}@example.invalid`
}

function parseLocalDateTime(value: string) {
  const match = value.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})/)
  if (match) {
    return {
      date: match[1],
      time: `${match[2]}:${match[3]}`,
    }
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return null
  }

  return {
    date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
    time: `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`,
  }
}

async function fetchBookingById(id: string) {
  const result = await pool.query(
    `SELECT
       b.id,
       b.customer_name,
       b.customer_phone,
       c.email AS customer_email,
       b.service_id,
       b.stylist_id,
       s.name AS service_name,
       s.duration_minutes AS service_duration,
       s.price AS service_price,
       st.name AS stylist_name,
       st.avatar_url AS stylist_avatar,
       b.start_time::text AS start_time,
       b.end_time::text AS end_time,
       b.status
     FROM bookings b
     LEFT JOIN customers c ON c.id = b.customer_id
     JOIN services s ON s.id = b.service_id
     JOIN stylists st ON st.id = b.stylist_id
     WHERE b.id = $1
     LIMIT 1`,
    [id]
  )

  return result.rows[0] ? (serializeBooking(result.rows[0]) as BookingRecord) : null
}

async function upsertCustomer(
  client: PoolClient,
  input: { customerName: string; customerPhone: string; customerEmail?: string }
) {
  const lookup = await client.query('SELECT id, email FROM customers WHERE phone = $1 LIMIT 1', [input.customerPhone])
  const existing = lookup.rows[0]
  const email = input.customerEmail || existing?.email || fallbackEmail(input.customerPhone)

  if (existing?.id) {
    await client.query('UPDATE customers SET name = $2, email = $3, updated_at = NOW() WHERE id = $1', [
      existing.id,
      input.customerName,
      email,
    ])
    return { customerId: existing.id as string, email }
  }

  const customerId = crypto.randomUUID()
  await client.query(
    'INSERT INTO customers (id, name, phone, email) VALUES ($1, $2, $3, $4)',
    [customerId, input.customerName, input.customerPhone, email]
  )

  return { customerId, email }
}

export async function listBookings(customerPhone?: string) {
  const result = await pool.query(
    `SELECT
       b.id,
       b.customer_name,
       b.customer_phone,
       c.email AS customer_email,
       b.service_id,
       b.stylist_id,
       s.name AS service_name,
       s.duration_minutes AS service_duration,
       s.price AS service_price,
       st.name AS stylist_name,
       st.avatar_url AS stylist_avatar,
       b.start_time::text AS start_time,
       b.end_time::text AS end_time,
       b.status
     FROM bookings b
     LEFT JOIN customers c ON c.id = b.customer_id
     JOIN services s ON s.id = b.service_id
     JOIN stylists st ON st.id = b.stylist_id
     ${customerPhone ? 'WHERE b.customer_phone = $1' : ''}
     ORDER BY b.start_time DESC`,
    customerPhone ? [customerPhone] : []
  )

  return result.rows.map(serializeBooking) as BookingRecord[]
}

export async function createBooking(input: {
  customerName: string
  customerPhone: string
  customerEmail?: string
  serviceId: string
  stylistId: string
  startTime: string
  status?: string
}) {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const serviceResult = await client.query('SELECT duration_minutes FROM services WHERE id = $1 LIMIT 1', [
      input.serviceId,
    ])
    if ((serviceResult.rowCount ?? 0) === 0) {
      await client.query('ROLLBACK')
      return { error: 'Service not found' as const }
    }

    const start = new Date(input.startTime)
    if (Number.isNaN(start.getTime())) {
      await client.query('ROLLBACK')
      return { error: 'Invalid start time' as const }
    }

    const serviceDuration = Number(serviceResult.rows[0].duration_minutes)
    const parsed = parseLocalDateTime(input.startTime)
    if (!parsed) {
      await client.query('ROLLBACK')
      return { error: 'Invalid start time' as const }
    }

    const availability = await assertSlotAvailability(client, {
      date: parsed.date,
      stylistId: input.stylistId,
      serviceDuration,
      startTime: parsed.time,
    })

    if ('error' in availability) {
      await client.query('ROLLBACK')
      return { error: availability.error }
    }

    const { customerId } = await upsertCustomer(client, {
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      customerEmail: input.customerEmail,
    })

    const bookingId = crypto.randomUUID()
    await client.query(
      `INSERT INTO bookings (
         id,
         customer_id,
         customer_name,
         customer_phone,
         service_id,
         stylist_id,
         start_time,
         end_time,
         status
       ) VALUES ($1, $2, $3, $4, $5, $6, $7::timestamptz, $8::timestamptz, $9)`,
      [
        bookingId,
        customerId,
        input.customerName,
        input.customerPhone,
        input.serviceId,
        input.stylistId,
        availability.start.toISOString(),
        availability.end.toISOString(),
        input.status ?? 'confirmed',
      ]
    )

    await client.query('COMMIT')

    const booking = await fetchBookingById(bookingId)
    if (!booking) {
      return { error: 'Booking not found after creation' as const }
    }

    emitBookingEvent({
      type: 'booking.created',
      bookingId,
      customerPhone: input.customerPhone,
      booking,
    })

    return { booking }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export async function rescheduleBooking(input: {
  bookingId: string
  serviceId?: string
  stylistId?: string
  startTime?: string
  status?: string
}) {
  const current = await pool.query('SELECT service_id, stylist_id, start_time FROM bookings WHERE id = $1 LIMIT 1', [
    input.bookingId,
  ])
  if ((current.rowCount ?? 0) === 0) {
    return { error: 'Booking not found' as const }
  }

  const serviceId = String(input.serviceId ?? current.rows[0].service_id)
  const serviceResult = await pool.query('SELECT duration_minutes FROM services WHERE id = $1 LIMIT 1', [serviceId])
  if ((serviceResult.rowCount ?? 0) === 0) {
    return { error: 'Service not found' as const }
  }

  const start = input.startTime ? new Date(input.startTime) : new Date(String(current.rows[0].start_time))
  if (Number.isNaN(start.getTime())) {
    return { error: 'Invalid start time' as const }
  }

    const serviceDuration = Number(serviceResult.rows[0].duration_minutes)
    const targetStylist = String(input.stylistId ?? current.rows[0].stylist_id)
    const parsed = input.startTime ? parseLocalDateTime(input.startTime) : null
    const currentParsed = parseLocalDateTime(String(current.rows[0].start_time))
    const date = parsed?.date ?? currentParsed?.date
    const time = parsed?.time ?? currentParsed?.time
    if (!date || !time) {
      return { error: 'Invalid start time' as const }
    }

    const client = await pool.connect()
    try {
      await client.query('BEGIN')

      const availability = await assertSlotAvailability(client, {
        bookingId: input.bookingId,
        date,
        stylistId: targetStylist,
        serviceDuration,
        startTime: time,
      })

    if ('error' in availability) {
      await client.query('ROLLBACK')
      return { error: availability.error }
    }

    const result = await client.query(
      `UPDATE bookings
       SET status = COALESCE($2, status),
           stylist_id = COALESCE($3, stylist_id),
           service_id = COALESCE($4, service_id),
           start_time = COALESCE($5::timestamptz, start_time),
           end_time = COALESCE($6::timestamptz, end_time),
           updated_at = NOW()
       WHERE id = $1
       RETURNING id`,
      [
        input.bookingId,
        input.status ?? null,
        input.stylistId ?? null,
        input.serviceId ?? null,
        input.startTime ? availability.start.toISOString() : null,
        input.startTime ? availability.end.toISOString() : null,
      ]
    )

    if ((result.rowCount ?? 0) === 0) {
      await client.query('ROLLBACK')
      return { error: 'Booking not found' as const }
    }

    await client.query('COMMIT')
    const booking = await fetchBookingById(input.bookingId)

    emitBookingEvent({
      type: 'booking.updated',
      bookingId: input.bookingId,
      booking,
    })

    return { booking }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export async function cancelBooking(bookingId: string) {
  const result = await pool.query(
    `UPDATE bookings
     SET status = 'cancelled',
         updated_at = NOW()
     WHERE id = $1
     RETURNING id, customer_phone`,
    [bookingId]
  )

  if ((result.rowCount ?? 0) === 0) {
    return { error: 'Booking not found' as const }
  }

  emitBookingEvent({
    type: 'booking.cancelled',
    bookingId,
    customerPhone: String(result.rows[0].customer_phone ?? ''),
  })

  return { ok: true }
}
