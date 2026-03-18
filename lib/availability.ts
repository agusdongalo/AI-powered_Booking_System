export interface AvailabilityBooking {
  startTime: string
  endTime: string
  status: string
}

export interface AvailabilityStylist {
  workingHoursStart: string
  workingHoursEnd: string
}

export interface AvailabilityWindow {
  startTime: string
  endTime: string
}

function pad(value: number) {
  return String(value).padStart(2, '0')
}

function toMinutes(time: string) {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

function formatTime(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${pad(hours)}:${pad(minutes)}`
}

function rangesOverlap(start: Date, end: Date, ranges: AvailabilityBooking[]) {
  return ranges.some((range) => {
    if (range.status === 'cancelled') {
      return false
    }

    const rangeStart = new Date(range.startTime)
    const rangeEnd = new Date(range.endTime)

    return !(end <= rangeStart || start >= rangeEnd)
  })
}

export function generateAvailabilitySlots(
  date: Date,
  stylist: AvailabilityStylist,
  serviceDuration: number,
  bookings: AvailabilityBooking[],
  blockedTimes: AvailabilityBooking[] = []
): string[] {
  return generateAvailabilitySlotsForWindows(
    date,
    [
      {
        startTime: stylist.workingHoursStart,
        endTime: stylist.workingHoursEnd,
      },
    ],
    serviceDuration,
    bookings,
    blockedTimes
  )
}

export function generateAvailabilitySlotsForWindows(
  date: Date,
  windows: AvailabilityWindow[],
  serviceDuration: number,
  bookings: AvailabilityBooking[],
  blockedTimes: AvailabilityBooking[] = []
): string[] {
  const slots = new Set<string>()

  for (const window of windows) {
    const startMinutes = toMinutes(window.startTime)
    const endMinutes = toMinutes(window.endTime)

    for (
      let currentMinutes = startMinutes;
      currentMinutes + serviceDuration <= endMinutes;
      currentMinutes += 30
    ) {
      const slotStart = new Date(date)
      slotStart.setHours(Math.floor(currentMinutes / 60), currentMinutes % 60, 0, 0)
      const slotEnd = new Date(slotStart.getTime() + serviceDuration * 60 * 1000)

      if (rangesOverlap(slotStart, slotEnd, bookings) || rangesOverlap(slotStart, slotEnd, blockedTimes)) {
        continue
      }

      slots.add(formatTime(currentMinutes))
    }
  }

  return Array.from(slots).sort()
}

export function slotWithinWindows(
  date: Date,
  windows: AvailabilityWindow[],
  startTime: Date | string,
  endTime: Date | string
) {
  const slotStart = startTime instanceof Date ? startTime : new Date(startTime)
  const slotEnd = endTime instanceof Date ? endTime : new Date(endTime)

  return windows.some((window) => {
    const windowStart = new Date(date)
    const [windowStartHours, windowStartMinutes] = window.startTime.split(':').map(Number)
    windowStart.setHours(windowStartHours, windowStartMinutes, 0, 0)

    const windowEnd = new Date(date)
    const [windowEndHours, windowEndMinutes] = window.endTime.split(':').map(Number)
    windowEnd.setHours(windowEndHours, windowEndMinutes, 0, 0)

    return slotStart >= windowStart && slotEnd <= windowEnd
  })
}
