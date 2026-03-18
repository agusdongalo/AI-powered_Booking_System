import { NextRequest, NextResponse } from 'next/server'
import { listChatConversation, sendChatMessage } from '@/lib/backend/chat-service'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const conversationId = new URL(request.url).searchParams.get('conversationId')
  if (!conversationId) {
    return NextResponse.json({ error: 'Missing conversationId' }, { status: 400 })
  }

  const messages = await listChatConversation(conversationId)
  return NextResponse.json({ conversationId, messages })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const message = String(body.message ?? '').trim()
  if (!message) {
    return NextResponse.json({ error: 'Missing message' }, { status: 400 })
  }

  const result = await sendChatMessage({
    conversationId: body.conversationId ? String(body.conversationId) : undefined,
    customerName: body.customerName ? String(body.customerName) : undefined,
    customerPhone: body.customerPhone ? String(body.customerPhone) : undefined,
    message,
  })

  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  return NextResponse.json(result, { status: 201 })
}
