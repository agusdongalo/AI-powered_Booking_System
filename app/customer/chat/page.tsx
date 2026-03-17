'use client'

import { useEffect, useRef, useState } from 'react'
import { Bot, Send, Sparkles, UserRound } from 'lucide-react'
import { Button } from '@/components/button'
import { Card } from '@/components/card'
import { SiteShell } from '@/components/site-shell'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
}

const starterPrompts = [
  'How much is balayage?',
  'Do you have a slot tomorrow?',
  'Book a haircut for me',
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content:
        "Hello, I'm your salon assistant. I can help with booking, pricing, availability, and rescheduling. Ask me anything or choose one of the quick prompts below.",
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = (value: string) => {
    const message = value.trim()
    if (!message || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    window.setTimeout(() => {
      const responses: Record<string, string> = {
        haircut:
          'Haircuts take about 45 minutes and start at $20. I can help you book the next available slot.',
        balayage:
          'Balayage takes around 2 hours and starts at $120. I can also show the best stylist match.',
        price:
          'Our popular services include haircut, color, balayage, and treatment options. Ask for any service and I will give the price and duration.',
        available:
          'I can check availability. Tell me the service and the date you want.',
        reschedule:
          'I can help you reschedule. Send me your booking name or booking ID and I will guide you.',
        default:
          `I read your message: "${message}". I can help you check availability, compare services, or start a booking.`,
      }

      const lowercaseInput = message.toLowerCase()
      const response =
        Object.entries(responses).find(([key]) => lowercaseInput.includes(key))?.[1] ??
        responses.default

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: response,
        },
      ])
      setIsLoading(false)
    }, 900)
  }

  return (
    <SiteShell
      title="AI chat concierge"
      description="Ask about pricing, openings, and booking help. The same white glass language from the homepage keeps the chat readable and calm."
      backHref="/customer"
      navHref="/"
      navLabel="Homepage"
      accent="cyan"
    >
      <Card className="overflow-hidden border-slate-200 bg-white/80 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.18)] backdrop-blur-2xl">
        <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="border-b border-slate-200 bg-slate-50/80 p-5 lg:border-b-0 lg:border-r">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold text-slate-900">Salon assistant</div>
                <div className="text-sm text-slate-500">Fast answers for bookings and services</div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleSendMessage(prompt)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 sm:p-5">
            <div className="h-[520px] overflow-y-auto rounded-[28px] border border-slate-200 bg-white/90 p-4 shadow-inner">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-7 shadow-sm ${
                        message.type === 'user'
                          ? 'rounded-br-md bg-slate-900 text-white'
                          : 'rounded-bl-md border border-slate-200 bg-white text-slate-800'
                      }`}
                    >
                      <div className="mb-1 flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] opacity-70">
                        {message.type === 'user' ? (
                          <>
                            <UserRound className="h-3 w-3" />
                            You
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-3 w-3" />
                            Assistant
                          </>
                        )}
                      </div>
                      <div className="whitespace-pre-line">{message.content}</div>
                    </div>
                  </div>
                ))}

                {isLoading ? (
                  <div className="flex justify-start">
                    <div className="rounded-3xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-slate-500 shadow-sm">
                      Typing...
                    </div>
                  </div>
                ) : null}

                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="mt-4 rounded-[28px] border border-slate-200 bg-white/90 p-4 backdrop-blur-xl">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage(inputValue)
                    }
                  }}
                  placeholder="Ask about services, slots, or pricing"
                  className="h-12 flex-1 rounded-full border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-300"
                  disabled={isLoading}
                />
                <Button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={isLoading}
                  className="h-12 rounded-full bg-slate-900 px-5 text-white hover:bg-slate-800"
                >
                  <Send className="h-4 w-4" />
                  Send
                </Button>
              </div>

              <p className="mt-3 text-xs text-slate-500">
                Tip: ask about availability, pricing, or booking a specific service.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </SiteShell>
  )
}
