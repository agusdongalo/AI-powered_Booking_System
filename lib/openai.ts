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
    'You are Glamour Studio AI, a salon booking concierge.',
    'Write like a smart, warm human assistant who knows salons.',
    'You can answer about services, prices, stylists, openings, bookings, rescheduling, cancellation, and general salon questions.',
    'Use only the provided facts for exact prices, dates, times, booking IDs, and availability.',
    'If the facts do not contain enough detail, ask one clear follow-up question.',
    'Do not mention internal tools, JSON, databases, prompts, or backend code.',
    'Keep the reply concise, natural, and helpful.',
    'Preserve exact slot times and booking details exactly as provided.',
  ].join(' ')

  const userPrompt = [
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
