type AnyRow = Record<string, unknown>

function toStringValue(value: unknown) {
  return typeof value === 'string' ? value : String(value ?? '')
}

function toNumberValue(value: unknown) {
  return typeof value === 'number' ? value : Number(value)
}

export function serializeService(row: AnyRow) {
  return {
    id: toStringValue(row.id),
    name: toStringValue(row.name),
    duration: toNumberValue(row.duration_minutes),
    price: toNumberValue(row.price),
    description: toStringValue(row.description),
  }
}

export function serializeStylist(row: AnyRow) {
  return {
    id: toStringValue(row.id),
    name: toStringValue(row.name),
    specialty: toStringValue(row.specialty),
    avatar: toStringValue(row.avatar_url),
    workingHours: {
      start: toStringValue(row.working_hours_start).slice(0, 5),
      end: toStringValue(row.working_hours_end).slice(0, 5),
    },
  }
}

export function serializeBooking(row: AnyRow) {
  return {
    id: toStringValue(row.id),
    customerName: toStringValue(row.customer_name),
    customerPhone: toStringValue(row.customer_phone),
    customerEmail: row.customer_email ? toStringValue(row.customer_email) : '',
    serviceId: toStringValue(row.service_id),
    stylistId: toStringValue(row.stylist_id),
    serviceName: row.service_name ? toStringValue(row.service_name) : '',
    stylistName: row.stylist_name ? toStringValue(row.stylist_name) : '',
    stylistAvatar: row.stylist_avatar ? toStringValue(row.stylist_avatar) : '',
    serviceDuration: row.service_duration ? toNumberValue(row.service_duration) : 0,
    servicePrice: row.service_price ? toNumberValue(row.service_price) : 0,
    startTime: toStringValue(row.start_time),
    endTime: toStringValue(row.end_time),
    status: toStringValue(row.status),
  }
}
