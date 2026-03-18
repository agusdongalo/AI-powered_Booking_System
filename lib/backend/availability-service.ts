import type { PoolClient } from 'pg'
import { pool } from '@/lib/db'
import {
  AvailabilityBooking,
  AvailabilityWindow,
  generateAvailabilitySlotsForWindows,
  slotWithinWindows,
} from '@/lib/availability'

export type AvailabilityResult = { slots: string[] } | { error: string }
type StylistWindowsResult = { stylist: any; windows: AvailabilityWindow[] } | { error: string }

function dayStart(date: string) {
  return new Date(`${date}T00:00:00`)
}

function dayEnd(date: string) {
  return new Date(`${date}T23:59:59.999`)
}

function toTime(value: unknown) {
  return String(value ?? '').slice(0, 5)
}

async function loadStylistWindows(client: PoolClient, stylistId: string, date: string): Promise<StylistWindowsResult> {
  const stylistResult = await client.query(
    `SELECT id, name, specialty, avatar_url, working_hours_start, working_hours_end
     FROM stylists
     WHERE id = $1
     LIMIT 1`,
    [stylistId]
  )

  if ((stylistResult.rowCount ?? 0) === 0) {
    return { error: 'Stylist not found' as const }
  }

  const dayOfWeek = dayStart(date).getDay()
  const scheduleResult = await client.query(
    `SELECT start_time, end_time
     FROM stylist_schedules
     WHERE stylist_id = $1
       AND day_of_week = $2
       AND is_active = TRUE
     ORDER BY start_time ASC`,
    [stylistId, dayOfWeek]
  )

  const windows: AvailabilityWindow[] =
    scheduleResult.rowCount && scheduleResult.rowCount > 0
      ? scheduleResult.rows.map((row) => ({
          startTime: toTime(row.start_time),
          endTime: toTime(row.end_time),
        }))
      : [
          {
            startTime: toTime(stylistResult.rows[0].working_hours_start),
            endTime: toTime(stylistResult.rows[0].working_hours_end),
          },
        ]

  return { stylist: stylistResult.rows[0], windows }
}

async function loadConflicts(
  client: PoolClient,
  params: { stylistId: string; date: string; excludeBookingId?: string }
) {
  const bookings = await client.query(
    `SELECT start_time::text AS start_time, end_time::text AS end_time, status
     FROM bookings
     WHERE stylist_id = $1
       AND start_time::date = $2::date
       AND ($3::text IS NULL OR id <> $3)
       AND status <> 'cancelled'
     ORDER BY start_time ASC`,
    [params.stylistId, params.date, params.excludeBookingId ?? null]
  )

  const blockedTimes = await client.query(
    `SELECT start_datetime::text AS start_time, end_datetime::text AS end_time, 'blocked' AS status
     FROM blocked_times
     WHERE (stylist_id = $1 OR stylist_id IS NULL)
       AND start_datetime < $3::timestamptz
       AND end_datetime > $2::timestamptz
     ORDER BY start_datetime ASC`,
    [params.stylistId, dayStart(params.date).toISOString(), dayEnd(params.date).toISOString()]
  )

  return {
    bookings: bookings.rows as AvailabilityBooking[],
    blockedTimes: blockedTimes.rows as AvailabilityBooking[],
  }
}

export async function getAvailabilitySlots(params: {
  date: string
  stylistId: string
  duration: number
}): Promise<AvailabilityResult> {
  const client = await pool.connect()

  try {
    const windowsResult = await loadStylistWindows(client, params.stylistId, params.date)
    if ('error' in windowsResult) {
      return windowsResult
    }

    const { bookings, blockedTimes } = await loadConflicts(client, {
      stylistId: params.stylistId,
      date: params.date,
    })

    const slots = generateAvailabilitySlotsForWindows(
      dayStart(params.date),
      windowsResult.windows,
      params.duration,
      bookings,
      blockedTimes
    )

    return { slots }
  } finally {
    client.release()
  }
}

export async function assertSlotAvailability(
  client: PoolClient,
  params: {
    date: string
    stylistId: string
    serviceDuration: number
    startTime: string
    bookingId?: string
  }
) {
  const windowsResult = await loadStylistWindows(client, params.stylistId, params.date)
  if ('error' in windowsResult) {
    return windowsResult
  }

  const [hours, minutes] = params.startTime.split(':').map(Number)
  const slotStart = dayStart(params.date)
  slotStart.setHours(hours, minutes, 0, 0)
  const slotEnd = new Date(slotStart.getTime() + params.serviceDuration * 60 * 1000)

  if (!slotWithinWindows(dayStart(params.date), windowsResult.windows, slotStart, slotEnd)) {
    return { error: 'Selected time is outside the stylist schedule' as const }
  }

  const { bookings, blockedTimes } = await loadConflicts(client, {
    stylistId: params.stylistId,
    date: params.date,
    excludeBookingId: params.bookingId,
  })

  const conflict = [...bookings, ...blockedTimes].find((item) => {
    const conflictStart = new Date(item.startTime)
    const conflictEnd = new Date(item.endTime)
    return !(slotEnd <= conflictStart || slotStart >= conflictEnd)
  })

  if (conflict) {
    return { error: 'Selected time is not available' as const }
  }

  return { ok: true as const, start: slotStart, end: slotEnd }
}

export async function getAvailabilitySlotsForStylists(params: {
  date: string
  serviceDuration: number
}): Promise<Array<{ stylistId: string; stylistName: string; slots: string[] }>> {
  const result = await pool.query(
    `SELECT id, name, specialty, avatar_url, working_hours_start, working_hours_end
     FROM stylists
     ORDER BY name ASC`
  )

  const client = await pool.connect()

  try {
    const response: Array<{ stylistId: string; stylistName: string; slots: string[] }> = []

    for (const stylist of result.rows) {
      const windowsResult = await loadStylistWindows(client, String(stylist.id), params.date)
      if ('error' in windowsResult) {
        continue
      }

      const { bookings, blockedTimes } = await loadConflicts(client, {
        stylistId: String(stylist.id),
        date: params.date,
      })

      const slots = generateAvailabilitySlotsForWindows(
        dayStart(params.date),
        windowsResult.windows,
        params.serviceDuration,
        bookings,
        blockedTimes
      )

      response.push({
        stylistId: String(stylist.id),
        stylistName: String(stylist.name),
        slots,
      })
    }

    return response
  } finally {
    client.release()
  }
}
