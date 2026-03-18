import type { PoolClient } from 'pg'
import { pool } from '@/lib/db'
import { cancelBooking, createBooking, rescheduleBooking } from './booking-service'
import { getAvailabilitySlots, getAvailabilitySlotsForStylists } from './availability-service'
import { emitRealtimeEvent } from './events'
import { generateSalonReply } from '@/lib/openai'

export type ChatMessageRow = {
  id: string
  conversationId: string
  senderType: 'user' | 'assistant' | 'staff' | 'system'
  content: string
  toolName: string | null
  metadata: Record<string, unknown>
  createdAt: string
}

export type ChatResult =
  | {
      conversationId: string
      userMessage: ChatMessageRow
      assistantMessage: ChatMessageRow
      suggestions: string[]
    }
  | { error: string }

type CatalogService = {
  id: string
  name: string
  duration: number
  price: number
  description: string
}

type CatalogStylist = {
  id: string
  name: string
  specialty: string
  avatar: string
  workingHours: {
    start: string
    end: string
  }
}

type ParsedTimeReference =
  | { kind: 'exact'; value: string }
  | { kind: 'period'; value: 'morning' | 'afternoon' | 'evening' }
  | null

type ConversationContext = {
  service: CatalogService | null
  stylist: CatalogStylist | null
  bookingId: string | null
  pendingAction: 'booking' | 'availability' | 'reschedule' | 'cancel' | null
  lastDate: string | null
  lastTime: ParsedTimeReference
}

function anonymousPhone() {
  return `anonymous-${crypto.randomUUID().slice(0, 8)}`
}

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s:-]/g, ' ').replace(/\s+/g, ' ').trim()
}

function dayString(date: Date) {
  return date.toISOString().slice(0, 10)
}

function formatClockTime(value: string) {
  const [hours, minutes] = value.split(':').map(Number)
  const hour12 = hours % 12 || 12
  const suffix = hours >= 12 ? 'PM' : 'AM'
  return `${hour12}:${String(minutes).padStart(2, '0')} ${suffix}`
}

function formatFriendlyDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date(`${value}T00:00:00`))
}

function parseDateReference(message: string) {
  const normalized = normalizeText(message)

  if (normalized.includes('day after tomorrow')) {
    const date = new Date()
    date.setDate(date.getDate() + 2)
    return dayString(date)
  }

  if (normalized.includes('tomorrow')) {
    const date = new Date()
    date.setDate(date.getDate() + 1)
    return dayString(date)
  }

  if (normalized.includes('today')) {
    return dayString(new Date())
  }

  const weekdayMatch = normalized.match(/\b(?:this|next)?\s*(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/)
  if (weekdayMatch) {
    const weekday = weekdayMatch[1]
    const target = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(weekday)
    const date = new Date()
    let delta = target - date.getDay()
    if (delta < 0) delta += 7
    date.setDate(date.getDate() + delta)
    return dayString(date)
  }

  const match = message.match(/\b(\d{4}-\d{2}-\d{2})\b/)
  return match?.[1] ?? null
}

function parseTimeReference(message: string): ParsedTimeReference {
  const normalized = normalizeText(message)

  if (normalized.includes('morning') || normalized.includes('before lunch')) {
    return { kind: 'period', value: 'morning' }
  }

  if (normalized.includes('afternoon') || normalized.includes('after lunch') || normalized.includes('after noon')) {
    return { kind: 'period', value: 'afternoon' }
  }

  if (normalized.includes('evening') || normalized.includes('after work') || normalized.includes('tonight')) {
    return { kind: 'period', value: 'evening' }
  }

  if (normalized.includes('noon')) {
    return { kind: 'exact', value: '12:00' }
  }

  const exact = message.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i)
  if (exact) {
    const hours = Number(exact[1]) % 12 + (exact[3].toLowerCase() === 'pm' ? 12 : 0)
    const minutes = exact[2] ? Number(exact[2]) : 0
    return { kind: 'exact', value: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}` }
  }

  const twentyFour = message.match(/\b(\d{2}):(\d{2})\b/)
  return twentyFour ? { kind: 'exact', value: `${twentyFour[1]}:${twentyFour[2]}` } : null
}

function parseBookingId(message: string) {
  const explicit = message.match(/\b(?:bk|book|booking)\b(?:\s*(?:id|#))?\s*[:#-]?\s*([a-f0-9-]{4,})\b/i)
  if (explicit) {
    return explicit[1]
  }

  const uuid = message.match(
    /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/i
  )
  return uuid?.[0] ?? null
}

async function loadCatalog() {
  const [services, stylists] = await Promise.all([
    pool.query('SELECT id, name, duration_minutes, price, description FROM services ORDER BY name ASC'),
    pool.query(
      `SELECT id, name, specialty, avatar_url, working_hours_start, working_hours_end
       FROM stylists
       ORDER BY name ASC`
    ),
  ])

  return {
    services: services.rows.map((row) => ({
      id: String(row.id),
      name: String(row.name),
      duration: Number(row.duration_minutes),
      price: Number(row.price),
      description: String(row.description),
    })) as CatalogService[],
    stylists: stylists.rows.map((row) => ({
      id: String(row.id),
      name: String(row.name),
      specialty: String(row.specialty),
      avatar: String(row.avatar_url),
      workingHours: {
        start: String(row.working_hours_start).slice(0, 5),
        end: String(row.working_hours_end).slice(0, 5),
      },
    })) as CatalogStylist[],
  }
}

async function ensureConversation(
  client: PoolClient,
  input: { conversationId?: string; customerName?: string; customerPhone?: string }
) {
  if (input.conversationId) {
    const existing = await client.query(
      `SELECT id, customer_name, customer_phone
       FROM chat_conversations
       WHERE id = $1
       LIMIT 1`,
      [input.conversationId]
    )

    if (existing.rowCount) {
      return existing.rows[0]
    }
  }

  const id = crypto.randomUUID()
  const phone = input.customerPhone?.trim() || anonymousPhone()

  await client.query(
    `INSERT INTO chat_conversations (id, customer_name, customer_phone, title)
     VALUES ($1, $2, $3, $4)`,
    [id, input.customerName?.trim() || 'Anonymous', phone, 'Salon chat']
  )

  return {
    id,
    customer_name: input.customerName?.trim() || 'Anonymous',
    customer_phone: phone,
  }
}

async function insertChatMessage(
  client: PoolClient,
  input: {
    conversationId: string
    senderType: ChatMessageRow['senderType']
    content: string
    toolName?: string | null
    metadata?: Record<string, unknown>
  }
) {
  const id = crypto.randomUUID()

  await client.query(
    `INSERT INTO chat_messages (id, conversation_id, sender_type, content, tool_name, metadata)
     VALUES ($1, $2, $3, $4, $5, $6::jsonb)`,
    [id, input.conversationId, input.senderType, input.content, input.toolName ?? null, JSON.stringify(input.metadata ?? {})]
  )

  return {
    id,
    conversationId: input.conversationId,
    senderType: input.senderType,
    content: input.content,
    toolName: input.toolName ?? null,
    metadata: input.metadata ?? {},
    createdAt: new Date().toISOString(),
  } satisfies ChatMessageRow
}

async function loadConversationMessages(conversationId: string) {
  const result = await pool.query(
    `SELECT id, conversation_id, sender_type, content, tool_name, metadata, created_at::text AS created_at
     FROM chat_messages
     WHERE conversation_id = $1
     ORDER BY created_at ASC`,
    [conversationId]
  )

  return result.rows.map((row) => ({
    id: String(row.id),
    conversationId: String(row.conversation_id),
    senderType: row.sender_type as ChatMessageRow['senderType'],
    content: String(row.content),
    toolName: row.tool_name ? String(row.tool_name) : null,
    metadata: (row.metadata ?? {}) as Record<string, unknown>,
    createdAt: String(row.created_at),
  })) as ChatMessageRow[]
}

function matchService(message: string, services: CatalogService[]) {
  const normalized = normalizeText(message)
  return (
    services.find((service) => normalized.includes(normalizeText(service.name))) ??
    services.find((service) => normalized.includes(normalizeText(service.description))) ??
    null
  )
}

function matchStylist(message: string, stylists: CatalogStylist[]) {
  const normalized = normalizeText(message)
  return stylists.find((stylist) => normalized.includes(normalizeText(stylist.name))) ?? null
}

function isGreeting(message: string) {
  return /^(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(message)
}

function isThanks(message: string) {
  return /\b(thanks|thank you|appreciate it|nice|great)\b/.test(message)
}

function isBookingKeyword(message: string) {
  return /\b(book|booking|appointment|reserve|schedule|assist me|set me up)\b/.test(message)
}

function isAvailabilityKeyword(message: string) {
  return /\b(availability|available|slot|slots|time|openings|opening)\b/.test(message)
}

function isRescheduleKeyword(message: string) {
  return /\b(reschedule|move it|change my appointment|change it)\b/.test(message)
}

function isCancelKeyword(message: string) {
  return /\b(cancel|delete booking|remove appointment)\b/.test(message)
}

function isServiceKeyword(message: string) {
  return /\b(service|services|offer|treatment|menu|price list)\b/.test(message)
}

function isStylistKeyword(message: string) {
  return /\b(stylist|stylists|staff|who can|who does|who is)\b/.test(message)
}

function isHoursKeyword(message: string) {
  return /\b(hours|open|opening|close|closing)\b/.test(message)
}

function formatServiceList(services: CatalogService[]) {
  return services.map((item) => `${item.name} - $${item.price} for ${item.duration} minutes. ${item.description}`).join('\n')
}

function formatStylistList(stylists: CatalogStylist[]) {
  return stylists
    .map((item) => `${item.name} - ${item.specialty} (${item.workingHours.start} to ${item.workingHours.end})`)
    .join('\n')
}

function filterSlotsByPeriod(slots: string[], period: 'morning' | 'afternoon' | 'evening') {
  return slots.filter((slot) => {
    const hour = Number(slot.slice(0, 2))
    if (period === 'morning') return hour < 12
    if (period === 'afternoon') return hour >= 12 && hour < 18
    return hour >= 18
  })
}

function slotToMinutes(slot: string) {
  const [hours, minutes] = slot.split(':').map(Number)
  return hours * 60 + minutes
}

function sortSlotsByProximity(slots: string[], target: string) {
  const targetMinutes = slotToMinutes(target)
  return [...slots].sort((left, right) => {
    const leftDistance = Math.abs(slotToMinutes(left) - targetMinutes)
    const rightDistance = Math.abs(slotToMinutes(right) - targetMinutes)
    return leftDistance - rightDistance || slotToMinutes(left) - slotToMinutes(right)
  })
}

function formatAvailabilityAnswer(params: {
  serviceName: string
  dateLabel: string
  stylistName?: string
  exactTime?: string
  slots: string[]
}) {
  const prefix = params.stylistName
    ? `${params.serviceName} with ${params.stylistName} on ${params.dateLabel}`
    : `${params.serviceName} on ${params.dateLabel}`

  if (params.exactTime) {
    const exactAvailable = params.slots.includes(params.exactTime)
    const nearest = sortSlotsByProximity(params.slots, params.exactTime).slice(0, 4)

    if (exactAvailable) {
      const others = params.slots.filter((slot) => slot !== params.exactTime).slice(0, 3)
      return others.length
        ? `Yes, ${formatClockTime(params.exactTime)} is available for ${prefix}. Other openings: ${others.join(', ')}.`
        : `Yes, ${formatClockTime(params.exactTime)} is available for ${prefix}.`
    }

    return nearest.length
      ? `No, ${formatClockTime(params.exactTime)} is not available for ${prefix}. Closest openings: ${nearest.join(', ')}.`
      : `No, ${formatClockTime(params.exactTime)} is not available for ${prefix}. I could not find any openings.`
  }

  return params.slots.length
    ? `Available openings for ${prefix}: ${params.slots.slice(0, 4).join(', ')}.`
    : `I could not find any openings for ${prefix}.`
}

function buildConversationContext(
  messages: ChatMessageRow[],
  services: CatalogService[],
  stylists: CatalogStylist[]
): ConversationContext {
  const context: ConversationContext = {
    service: null,
    stylist: null,
    bookingId: null,
    pendingAction: null,
    lastDate: null,
    lastTime: null,
  }

  for (const message of messages) {
    const service = matchService(message.content, services)
    if (service) context.service = service

    const stylist = matchStylist(message.content, stylists)
    if (stylist) context.stylist = stylist

    const bookingId = parseBookingId(message.content)
    if (bookingId) context.bookingId = bookingId

    const metadata = message.metadata as Record<string, unknown>
    if (metadata && typeof metadata === 'object') {
      if (metadata.serviceId) {
        const matchedService = services.find((item) => item.id === String(metadata.serviceId))
        if (matchedService) context.service = matchedService
      }

      if (metadata.stylistId) {
        const matchedStylist = stylists.find((item) => item.id === String(metadata.stylistId))
        if (matchedStylist) context.stylist = matchedStylist
      }

      if (metadata.bookingId) {
        context.bookingId = String(metadata.bookingId)
      }

      if (metadata.awaiting && typeof metadata.awaiting === 'string') {
        context.pendingAction = metadata.awaiting as ConversationContext['pendingAction']
      }

      if (metadata.parsedDate && typeof metadata.parsedDate === 'string') {
        context.lastDate = String(metadata.parsedDate)
      }

      if (metadata.parsedTimeKind && typeof metadata.parsedTimeKind === 'string') {
        const kind = String(metadata.parsedTimeKind)
        const value = String(metadata.parsedTimeValue ?? '')
        if (kind === 'exact' && value) {
          context.lastTime = { kind: 'exact', value }
        }
        if ((kind === 'morning' || kind === 'afternoon' || kind === 'evening') && value) {
          context.lastTime = { kind: 'period', value: value as 'morning' | 'afternoon' | 'evening' }
        }
      }
    }
  }

  return context
}

function parseIntent(params: {
  normalized: string
  parsedDate: string | null
  parsedTime: ParsedTimeReference
  service: CatalogService | null
  bookingId: string | null
  context: ConversationContext
}) {
  const { normalized, parsedDate, parsedTime, service, bookingId, context } = params

  if (isGreeting(normalized)) return 'greeting' as const
  if (isThanks(normalized)) return 'thanks' as const
  if (normalized.includes('recommend') || normalized.includes('suggest') || normalized.includes('best')) return 'recommendation' as const
  if (isCancelKeyword(normalized)) return 'cancel' as const
  if (isRescheduleKeyword(normalized)) return 'reschedule' as const
  if (normalized.includes('price') || normalized.includes('cost') || normalized.includes('how much') || normalized.includes('rate')) return 'pricing' as const
  if (isServiceKeyword(normalized)) return 'services' as const
  if (isStylistKeyword(normalized)) return 'stylists' as const
  if (isHoursKeyword(normalized)) return 'hours' as const
  if (context.pendingAction === 'cancel' && bookingId) return 'cancel' as const
  if (context.pendingAction === 'reschedule' && (bookingId || parsedDate || parsedTime)) return 'reschedule' as const
  if (context.pendingAction === 'booking' && (parsedDate || parsedTime || service)) return 'booking' as const
  if (context.pendingAction === 'availability' && (parsedDate || parsedTime || service)) return 'availability' as const
  if (isBookingKeyword(normalized)) return 'booking' as const
  if (isAvailabilityKeyword(normalized)) return 'availability' as const
  if (service && (parsedDate || parsedTime)) return parsedTime?.kind === 'exact' ? 'booking' : 'availability'
  if (bookingId && (parsedDate || parsedTime)) return 'reschedule' as const
  return 'unknown' as const
}

function recommendService(message: string, services: CatalogService[]) {
  const normalized = normalizeText(message)
  const keywordsByService: Record<string, string[]> = {
    haircut: ['cut', 'trim', 'layers', 'shape', 'ends'],
    blowout: ['volume', 'bouncy', 'smooth', 'frizz', 'styling'],
    balayage: ['dimension', 'highlight', 'sun kissed', 'blend', 'soft color'],
    'hair color': ['color', 'dye', 'roots', 'gray', 'shade'],
    rebond: ['straight', 'sleek', 'smooth', 'frizz'],
    treatment: ['repair', 'damage', 'nourish', 'restore', 'hair health'],
  }

  let bestService: CatalogService | null = null
  let bestScore = 0

  for (const service of services) {
    const haystack = normalizeText(`${service.name} ${service.description}`)
    let score = 0

    if (normalized.includes(normalizeText(service.name))) {
      score += 6
    }

    for (const token of normalized.split(' ')) {
      if (token.length > 2 && haystack.includes(token)) {
        score += 1
      }
    }

    for (const keyword of keywordsByService[normalizeText(service.name)] ?? []) {
      if (normalized.includes(keyword)) {
        score += 3
      }
    }

    if (score > bestScore) {
      bestScore = score
      bestService = service
    }
  }

  return bestScore > 0 ? bestService : null
}

async function findAvailableStylistForExactTime(params: { date: string; serviceDuration: number; exactTime: string }) {
  const availability = await getAvailabilitySlotsForStylists({
    date: params.date,
    serviceDuration: params.serviceDuration,
  })

  return availability.find((item) => item.slots.includes(params.exactTime)) ?? null
}

function introMessage() {
  return 'I can help you book an appointment, check prices and availability, or move and cancel a booking. Tell me the service, date, and time you want.'
}

export async function listChatConversation(conversationId: string) {
  return loadConversationMessages(conversationId)
}

export async function sendChatMessage(input: {
  conversationId?: string
  customerName?: string
  customerPhone?: string
  message: string
}): Promise<ChatResult> {
  const message = input.message.trim()
  if (!message) {
    return { error: 'Message is required' }
  }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const conversation = await ensureConversation(client, {
      conversationId: input.conversationId,
      customerName: input.customerName,
      customerPhone: input.customerPhone,
    })

    const conversationId = String(conversation.id)
    const userMessage = await insertChatMessage(client, {
      conversationId,
      senderType: 'user',
      content: message,
    })

    const { services, stylists } = await loadCatalog()
    const history = await loadConversationMessages(conversationId)
    const context = buildConversationContext(history, services, stylists)
    const normalized = normalizeText(message)
    const parsedDate = parseDateReference(message)
    const parsedTime = parseTimeReference(message)
    const service = matchService(message, services) ?? context.service
    const stylist = matchStylist(message, stylists) ?? context.stylist
    const bookingId = parseBookingId(message) ?? context.bookingId
    const intent = parseIntent({
      normalized,
      parsedDate,
      parsedTime,
      service,
      bookingId,
      context,
    })

    const customerName = input.customerName?.trim() || String(conversation.customer_name || 'Anonymous')
    const customerPhone = input.customerPhone?.trim() || String(conversation.customer_phone || anonymousPhone())

    let assistantText = introMessage()
    let toolName: string | null = null
    const suggestions: string[] = []
    let awaiting: ConversationContext['pendingAction'] = null
    let resolvedBookingId: string | null = bookingId

    if (intent === 'greeting') {
      assistantText = 'Hello. Tell me what you want to book, and I will keep the salon context in mind.'
      suggestions.push('Show services', 'Check availability', 'Book an appointment')
      awaiting = 'booking'
    } else if (intent === 'thanks') {
      assistantText = 'You are welcome. If you need another booking, price check, or stylist recommendation, send it here.'
      suggestions.push('Book another service', 'Check availability', 'See stylists')
    } else if (intent === 'recommendation') {
      const recommendation = recommendService(message, services) ?? service
      if (recommendation) {
        assistantText = `For your request, I would suggest ${recommendation.name}. ${recommendation.description} Send me your preferred date and time, and I will check live openings.`
        toolName = 'catalog.recommendation'
        suggestions.push(recommendation.name, 'Check availability', 'Book it')
      } else {
        assistantText = 'Tell me the look you want, and I will recommend the best salon service.'
        suggestions.push('Smooth and straight', 'More volume', 'Color refresh')
      }
      awaiting = 'booking'
    } else if (intent === 'pricing') {
      assistantText = formatServiceList(services)
      toolName = 'catalog.services'
      suggestions.push(...services.slice(0, 3).map((item) => item.name))
      awaiting = 'booking'
    } else if (intent === 'services') {
      assistantText = formatServiceList(services)
      toolName = 'catalog.services'
      suggestions.push('Book a service', 'Show stylists')
      awaiting = 'booking'
    } else if (intent === 'stylists') {
      assistantText = formatStylistList(stylists)
      toolName = 'catalog.stylists'
      suggestions.push(...stylists.slice(0, 3).map((item) => item.name))
      awaiting = 'availability'
    } else if (intent === 'hours') {
      assistantText = 'I can check live openings for any stylist. Tell me the service and the date you want, and I will pull the available slots.'
      suggestions.push('Tomorrow afternoon', 'This Friday morning', 'Next week')
      awaiting = 'availability'
    } else if (intent === 'cancel') {
      if (!bookingId) {
        assistantText = 'Send me your booking ID and I will cancel it for you.'
        suggestions.push('Send booking ID')
        awaiting = 'cancel'
      } else {
        const result = await cancelBooking(bookingId)
        if ('error' in result) {
          assistantText = result.error || 'Could not cancel booking'
          awaiting = 'cancel'
        } else {
          assistantText = `Your booking ${bookingId} has been cancelled.`
          toolName = 'booking.cancel'
          resolvedBookingId = bookingId
        }
      }
    } else if (intent === 'reschedule') {
      if (!bookingId) {
        assistantText = 'Send me the booking ID first, then the new date or time, and I will move it.'
        suggestions.push('Send booking ID', 'Choose a new slot')
        awaiting = 'reschedule'
      } else if (!service || !parsedDate || !parsedTime) {
        assistantText = 'Send me the new date and preferred time, and I will move the booking.'
        suggestions.push('Tomorrow afternoon', 'Next Friday morning', 'See availability')
        awaiting = 'reschedule'
      } else if (parsedTime.kind === 'exact') {
        const match = stylist
          ? { stylistId: stylist.id }
          : await findAvailableStylistForExactTime({
              date: parsedDate,
              serviceDuration: service.duration,
              exactTime: parsedTime.value,
            })

        const selectedStylist = match ? stylists.find((item) => item.id === String(match.stylistId)) ?? null : null
        if (!selectedStylist) {
          assistantText = `I could not find ${formatClockTime(parsedTime.value)} for ${service.name}. Send another time or ask for availability.`
          suggestions.push('Choose a new slot', 'Check another day')
          awaiting = 'reschedule'
        } else {
          const result = await rescheduleBooking({
            bookingId,
            serviceId: service.id,
            stylistId: selectedStylist.id,
            startTime: `${parsedDate}T${parsedTime.value}:00`,
          })

          if ('error' in result) {
            assistantText = result.error || 'Could not reschedule booking'
            awaiting = 'reschedule'
          } else {
            assistantText = `Your booking has been moved to ${formatFriendlyDate(parsedDate)} at ${formatClockTime(parsedTime.value)}.`
            toolName = 'booking.reschedule'
            resolvedBookingId = bookingId
          }
        }
      } else {
        assistantText = `I can move your booking to ${formatFriendlyDate(parsedDate)} ${parsedTime.value}. Send an exact time if you want me to confirm it now.`
        suggestions.push('9:00 AM', '1:00 PM', '3:30 PM')
        awaiting = 'reschedule'
      }
    } else if (intent === 'booking') {
      if (!service) {
        assistantText = 'Which service do you want to book?'
        suggestions.push(...services.slice(0, 3).map((item) => item.name))
        awaiting = 'booking'
      } else if (!parsedDate && !context.lastDate) {
        assistantText = `I can book ${service.name}. Tell me the date you want, and I will check the openings.`
        suggestions.push('Tomorrow', 'This Friday', 'Next week')
        awaiting = 'booking'
      } else {
        const targetDate = parsedDate ?? context.lastDate ?? dayString(new Date())
        const targetTime = parsedTime ?? context.lastTime

        if (!targetTime) {
          assistantText = `I can book ${service.name}. Send me the date and preferred time.`
          suggestions.push('Tomorrow afternoon', 'Next Friday morning', 'After lunch')
          awaiting = 'booking'
        } else if (targetTime.kind === 'exact') {
          let selectedStylist = stylist
          if (!selectedStylist) {
            const match = await findAvailableStylistForExactTime({
              date: targetDate,
              serviceDuration: service.duration,
              exactTime: targetTime.value,
            })
            if (match) {
              selectedStylist = stylists.find((item) => item.id === String(match.stylistId)) ?? null
            }
          }

          if (!selectedStylist) {
            assistantText = `I could not find ${formatClockTime(targetTime.value)} for ${service.name}. Tell me another time or ask for availability.`
            suggestions.push('Choose a new slot', 'Check another day')
            awaiting = 'booking'
          } else {
            const availability = await getAvailabilitySlots({
              date: targetDate,
              stylistId: selectedStylist.id,
              duration: service.duration,
            })

            if ('error' in availability) {
              assistantText = availability.error || 'Could not check availability'
              awaiting = 'booking'
            } else if (!availability.slots.includes(targetTime.value)) {
              assistantText = formatAvailabilityAnswer({
                serviceName: service.name,
                dateLabel: formatFriendlyDate(targetDate),
                stylistName: selectedStylist.name,
                exactTime: targetTime.value,
                slots: availability.slots,
              })
              suggestions.push(...sortSlotsByProximity(availability.slots, targetTime.value).slice(0, 3))
              awaiting = 'booking'
            } else {
              const result = await createBooking({
                customerName,
                customerPhone,
                serviceId: service.id,
                stylistId: selectedStylist.id,
                startTime: `${targetDate}T${targetTime.value}:00`,
                status: 'confirmed',
              })

              if ('error' in result) {
                assistantText = result.error || 'Could not complete booking'
                awaiting = 'booking'
              } else {
                assistantText = `You are booked for ${service.name} with ${selectedStylist.name} on ${formatFriendlyDate(
                  targetDate
                )} at ${formatClockTime(targetTime.value)}.`
                toolName = 'booking.create'
                suggestions.push('View my bookings', 'Reschedule', 'Cancel')
                resolvedBookingId = String(result.booking.id)
              }
            }
          }
        } else {
          const targetPeriod = targetTime.value

          if (stylist) {
            const result = await getAvailabilitySlots({
              date: targetDate,
              stylistId: stylist.id,
              duration: service.duration,
            })

            if ('error' in result) {
              assistantText = result.error || 'Could not check availability'
            } else {
              const filteredSlots = filterSlotsByPeriod(result.slots, targetPeriod)
              assistantText = filteredSlots.length
                ? `I can book ${service.name} with ${stylist.name} on ${formatFriendlyDate(targetDate)} ${targetPeriod}. Openings: ${filteredSlots
                    .slice(0, 4)
                    .join(', ')}.`
                : `I could not find a ${targetPeriod} opening for ${service.name} with ${stylist.name} on ${formatFriendlyDate(
                    targetDate
                  )}.`
              if (filteredSlots.length > 0) {
                suggestions.push(...filteredSlots.slice(0, 3))
              }
            }
          } else {
            const slots = await getAvailabilitySlotsForStylists({
              date: targetDate,
              serviceDuration: service.duration,
            })

            const summary = slots
              .map((item) => ({
                stylistName: item.stylistName,
                slots: filterSlotsByPeriod(item.slots, targetPeriod).slice(0, 3),
              }))
              .filter((item) => item.slots.length > 0)
              .slice(0, 3)

            assistantText = summary.length
              ? `I can book ${service.name} on ${formatFriendlyDate(targetDate)} ${targetPeriod}. Openings: ${summary
                  .map((item) => `${item.stylistName}: ${item.slots.join(', ')}`)
                  .join(' | ')}.`
              : `I could not find any ${targetPeriod} openings for ${service.name} on ${formatFriendlyDate(targetDate)}.`
            if (summary.length > 0) {
              suggestions.push(...summary.flatMap((item) => item.slots).slice(0, 3))
            }
          }

          awaiting = 'booking'
        }
      }
    } else if (intent === 'availability') {
      if (!service) {
        assistantText = 'Tell me which service you want and the date you have in mind, and I will check live availability.'
        suggestions.push('Haircut tomorrow', 'Balayage next week', 'Hair Color this Friday')
        awaiting = 'availability'
      } else if (!parsedDate && !context.lastDate) {
        assistantText = `Tell me the date for ${service.name} and I will check live availability.`
        suggestions.push('Tomorrow', 'This Friday', 'Next week')
        awaiting = 'availability'
      } else {
        const targetDate = parsedDate ?? context.lastDate ?? dayString(new Date())
        const targetTime = parsedTime ?? context.lastTime

        if (stylist) {
          const result = await getAvailabilitySlots({
            date: targetDate,
            stylistId: stylist.id,
            duration: service.duration,
          })

          if ('error' in result) {
            assistantText = result.error || 'Could not check availability'
          } else {
            const filteredSlots =
              targetTime?.kind === 'period'
                ? filterSlotsByPeriod(result.slots, targetTime.value)
                : result.slots

            if (targetTime?.kind === 'exact') {
              assistantText = formatAvailabilityAnswer({
                serviceName: service.name,
                dateLabel: formatFriendlyDate(targetDate),
                stylistName: stylist.name,
                exactTime: targetTime.value,
                slots: filteredSlots,
              })
            } else {
              assistantText = formatAvailabilityAnswer({
                serviceName: service.name,
                dateLabel: formatFriendlyDate(targetDate),
                stylistName: stylist.name,
                slots: filteredSlots,
              })
            }

            if (filteredSlots.length > 0) {
              suggestions.push(...filteredSlots.slice(0, 3))
              toolName = 'availability.check'
            }
          }
        } else {
          const slots = await getAvailabilitySlotsForStylists({
            date: targetDate,
            serviceDuration: service.duration,
          })

          const allEntries = slots.flatMap((item) =>
            item.slots.map((slot) => ({
              stylistName: item.stylistName,
              slot,
            }))
          )

          const summary = slots
            .map((item) => ({
              stylistName: item.stylistName,
              slots: targetTime?.kind === 'period' ? filterSlotsByPeriod(item.slots, targetTime.value).slice(0, 3) : item.slots.slice(0, 3),
            }))
            .filter((item) => item.slots.length > 0)
            .slice(0, 3)

          if (targetTime?.kind === 'exact') {
            const exactMatches = allEntries
              .filter((entry) => entry.slot === targetTime.value)
              .map((entry) => `${entry.stylistName}: ${entry.slot}`)
            const nearest = sortSlotsByProximity(
              allEntries
                .map((entry) => entry.slot)
                .filter((slot, index, array) => array.indexOf(slot) === index),
              targetTime.value
            ).slice(0, 4)

            assistantText = exactMatches.length
              ? `Yes, ${formatClockTime(targetTime.value)} is available for ${service.name} on ${formatFriendlyDate(
                  targetDate
                )}. Openings include: ${exactMatches.slice(0, 3).join(' | ')}.`
              : nearest.length
                ? `No, ${formatClockTime(targetTime.value)} is not available for ${service.name} on ${formatFriendlyDate(
                    targetDate
                  )}. Closest openings: ${nearest.join(', ')}.`
                : `I could not find an open slot for ${service.name} on ${formatFriendlyDate(targetDate)}.`
          } else {
            assistantText = summary.length
              ? `Available openings for ${service.name} on ${formatFriendlyDate(targetDate)}: ${summary
                  .map((item) => `${item.stylistName}: ${item.slots.join(', ')}`)
                  .join(' | ')}.`
              : `I could not find an open slot for ${service.name} on ${formatFriendlyDate(targetDate)}.`
          }

          if (summary.length > 0) {
            suggestions.push(...summary.flatMap((item) => item.slots).slice(0, 3))
            toolName = 'availability.check'
          }
        }

        awaiting = 'availability'
      }
    } else {
      const recommendation = recommendService(message, services) ?? service
      if (recommendation && !service) {
        assistantText = `For your request, I would suggest ${recommendation.name}. ${recommendation.description} Send me your preferred date and time, and I will check live openings.`
        toolName = 'catalog.recommendation'
        suggestions.push(recommendation.name, 'Check availability', 'Book it')
        awaiting = 'booking'
      } else if (service && parsedDate && parsedTime) {
        if (parsedTime.kind === 'exact') {
          let selectedStylist = stylist
          if (!selectedStylist) {
            const match = await findAvailableStylistForExactTime({
              date: parsedDate,
              serviceDuration: service.duration,
              exactTime: parsedTime.value,
            })
            if (match) {
              selectedStylist = stylists.find((item) => item.id === String(match.stylistId)) ?? null
            }
          }

          if (selectedStylist) {
            const result = await createBooking({
              customerName,
              customerPhone,
              serviceId: service.id,
              stylistId: selectedStylist.id,
              startTime: `${parsedDate}T${parsedTime.value}:00`,
              status: 'confirmed',
            })

            if ('error' in result) {
              assistantText = result.error || 'Could not complete booking'
              awaiting = 'booking'
            } else {
              assistantText = `You are booked for ${service.name} with ${selectedStylist.name} on ${formatFriendlyDate(
                parsedDate
              )} at ${formatClockTime(parsedTime.value)}.`
              toolName = 'booking.create'
              suggestions.push('View my bookings', 'Reschedule', 'Cancel')
              resolvedBookingId = String(result.booking.id)
            }
          } else {
            assistantText = `I could not find ${formatClockTime(parsedTime.value)} for ${service.name}. Tell me another time or ask for availability.`
            suggestions.push('Choose a new slot', 'Check another day')
            awaiting = 'booking'
          }
        } else {
          assistantText = `I can book ${service.name} on ${formatFriendlyDate(parsedDate)} ${parsedTime.value}. Send an exact time if you want me to confirm it now.`
          suggestions.push('9:00 AM', '1:00 PM', '3:30 PM')
          awaiting = 'booking'
        }
      } else if (service) {
        assistantText = `I can book ${service.name}. Send me the date and preferred time.`
        suggestions.push('Tomorrow afternoon', 'Next Friday', 'Morning slot')
        awaiting = 'booking'
      } else if (parsedDate || parsedTime) {
        assistantText = 'Which service would you like me to use with that date or time?'
        suggestions.push(...services.slice(0, 3).map((item) => item.name))
        awaiting = 'booking'
    } else {
        assistantText = introMessage()
        suggestions.push('Services', 'Availability', 'Stylists')
      }
    }

    const transcript = history.slice(-12).map((item) => ({
      role: item.senderType === 'assistant' ? 'assistant' : 'user',
      content: item.content,
    })) as Array<{ role: 'user' | 'assistant'; content: string }>

    const polishedReply = await generateSalonReply({
      userMessage: message,
      backendDraft: assistantText,
      facts: {
        intent,
        awaiting,
        parsedDate,
        parsedTime,
        bookingId: resolvedBookingId,
        service: service
          ? {
              id: service.id,
              name: service.name,
              duration: service.duration,
              price: service.price,
              description: service.description,
            }
          : null,
        stylist: stylist
          ? {
              id: stylist.id,
              name: stylist.name,
              specialty: stylist.specialty,
            }
          : null,
        suggestions,
        catalog: {
          services: services.map((item) => ({
            name: item.name,
            duration: item.duration,
            price: item.price,
            description: item.description,
          })),
          stylists: stylists.map((item) => ({
            name: item.name,
            specialty: item.specialty,
            workingHours: item.workingHours,
          })),
        },
      },
      transcript,
    })

    const assistantMessage = await insertChatMessage(client, {
      conversationId,
      senderType: 'assistant',
      content: polishedReply ?? assistantText,
      toolName,
      metadata: {
        intent,
        awaiting,
        parsedDate,
        parsedTimeKind: parsedTime?.kind ?? null,
        parsedTimeValue: parsedTime?.kind ? parsedTime.value : null,
        serviceId: service?.id ?? null,
        stylistId: stylist?.id ?? null,
        bookingId: resolvedBookingId,
      },
    })

    await client.query('UPDATE chat_conversations SET updated_at = NOW() WHERE id = $1', [conversationId])
    await client.query('COMMIT')

    emitRealtimeEvent({
      type: 'chat.message.created',
      conversationId,
      messageId: assistantMessage.id,
    })

    return {
      conversationId,
      userMessage,
      assistantMessage,
      suggestions,
    }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}
