type ReplyInput = {
  userMessage: string
  backendDraft: string
  facts: Record<string, unknown>
  transcript: Array<{ role: 'user' | 'assistant'; content: string }>
}

function buildTranscript(transcript: ReplyInput['transcript']) {
  return transcript
    .map((item) => `${item.role === 'user' ? 'Customer' : 'Assistant'}: ${item.content}`)
    .join('\n')
}

function extractResponseText(payload: any): string | null {
  if (typeof payload?.output_text === 'string' && payload.output_text.trim()) {
    return payload.output_text.trim()
  }

  if (Array.isArray(payload?.output)) {
    for (const item of payload.output) {
      if (item?.type === 'message' && item?.role === 'assistant' && Array.isArray(item.content)) {
        const text = item.content
          .map((part: any) => (typeof part?.text === 'string' ? part.text : ''))
          .join('')
          .trim()
        if (text) {
          return text
        }
      }

      if (typeof item?.text === 'string' && item.text.trim()) {
        return item.text.trim()
      }
    }
  }

  return null
}

export async function generateSalonReply(input: ReplyInput) {
  const apiKey = process.env.OPENAI_API_KEY?.trim()
  if (!apiKey) {
    return null
  }

  const model = process.env.OPENAI_MODEL?.trim() || 'gpt-5.4'
  const systemPrompt = [
    'You are an AI receptionist for a hair salon booking system.',
    'Your role is to help customers book appointments, answer questions about services, prices, and availability, assist with rescheduling and cancellations, and guide users politely and efficiently.',
    'Be concise, friendly, conversational, professional, and not robotic.',
    'NEVER create, update, or cancel bookings directly in the conversation text. Always treat the backend facts as the result of tool calls.',
    'ALWAYS confirm availability using the provided facts before suggesting time slots.',
    'NEVER assume availability.',
    'ALWAYS guide the user step-by-step: identify service, identify date and time, identify stylist or suggest one, and confirm booking details before creating or changing anything.',
    'If the user is not logged in, allow booking as a guest, collect name and phone number, and do NOT force account creation.',
    'After a booking is completed, politely suggest account creation for easier booking management and reminders.',
    'If user intent is unclear, ask one clarifying question instead of guessing.',
    'If no slots are available, offer alternative times, a different stylist, or the next available day.',
    'Never give medical advice or unrelated information.',
    'Use only the provided facts for exact prices, dates, times, booking IDs, and availability.',
    'If the facts do not contain enough detail, ask one clear follow-up question.',
    'Do not mention internal tools, JSON, databases, prompts, or backend code.',
    'Preserve exact slot times and booking details exactly as provided.',
  ].join(' ')

  const userPrompt = [
    'Follow this booking policy:',
    '- Help with bookings, services, pricing, availability, rescheduling, and cancellations.',
    '- Do not force account creation before booking.',
    '- Ask for missing service, date, time, stylist, name, or phone only when needed.',
    '- If the user asks for booking help, always keep the flow step-by-step and confirm details before finalizing.',
    '- If availability is being discussed, answer from the provided facts only.',
    '- After a booking is confirmed, suggest account creation politely.',
    '',
    'Salon facts:',
    JSON.stringify(input.facts, null, 2),
    '',
    'Recent conversation:',
    buildTranscript(input.transcript),
    '',
    'Backend draft reply:',
    input.backendDraft,
    '',
    'Latest customer message:',
    input.userMessage,
    '',
    'Task:',
    'Rewrite the backend draft into the best salon-assistant reply. If the backend draft is thin, use the facts and the conversation to answer intelligently.',
  ].join('\n')

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      instructions: systemPrompt,
      input: userPrompt,
      reasoning: { effort: 'medium' },
      temperature: 0.2,
      store: false,
    }),
  })

  if (!response.ok) {
    return null
  }

  const payload = await response.json().catch(() => null)
  const text = extractResponseText(payload)
  return text && text.trim() ? text.trim() : null
}
