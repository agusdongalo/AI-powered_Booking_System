'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ArrowLeft, Bot, MessageCircle, Send, Sparkles, User } from 'lucide-react'
import { Button } from './button'
import { Input } from './input'
import { Avatar, AvatarFallback } from './avatar'
import { Card } from './card'
import { services, stylists, generateTimeSlots } from '@/lib/mock-data'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Hi, I'm the Glamour Studio assistant. I can help you book appointments, check availability, explain services, or find the right stylist.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.match(/^(hi|hello|hey|good morning|good afternoon)/)) {
      return "Hello. What would you like to do today: book a service, check available slots, or review stylist options?"
    }

    if (
      lowerMessage.includes('available') ||
      lowerMessage.includes('slot') ||
      lowerMessage.includes('time')
    ) {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const slots = generateTimeSlots(tomorrow, '2', 45)

      if (slots.length > 0) {
        return `For tomorrow (${format(tomorrow, 'MMMM d')}), these slots are open:\n\n${slots
          .slice(0, 5)
          .join(', ')}\n\nIf you want, I can help you choose a service and stylist.`
      }
    }

    if (
      lowerMessage.includes('price') ||
      lowerMessage.includes('cost') ||
      lowerMessage.includes('how much')
    ) {
      if (lowerMessage.includes('balayage')) {
        return 'Balayage starts at $120 and takes about 2 hours.'
      }
      if (lowerMessage.includes('haircut')) {
        return 'A professional haircut is $20 and takes 45 minutes.'
      }
      if (lowerMessage.includes('color')) {
        return 'Our hair color service is $80 and takes about 90 minutes.'
      }

      return `Here are our service prices:\n\n${services
        .map((s) => `- ${s.name}: $${s.price} (${s.duration} min)`)
        .join('\n')}`
    }

    if (lowerMessage.includes('service') || lowerMessage.includes('offer')) {
      return `We offer:\n\n${services
        .map((s) => `- ${s.name}: ${s.description}`)
        .join('\n')}\n\nTell me which one you want and I can help you book it.`
    }

    if (lowerMessage.includes('stylist') || lowerMessage.includes('staff')) {
      return `Our stylists:\n\n${stylists
        .map((s) => `- ${s.name}: ${s.specialty}`)
        .join('\n')}`
    }

    if (lowerMessage.includes('book') || lowerMessage.includes('appointment')) {
      return 'I can help you book an appointment. Tell me which service you want, your preferred stylist, and your ideal date.'
    }

    if (lowerMessage.includes('reschedule')) {
      return 'I can help reschedule an appointment. Share the current date and time, plus your preferred new slot.'
    }

    if (lowerMessage.includes('cancel')) {
      return 'I can help with cancellations. Share your name or booking ID and I will guide you through the next step.'
    }

    return 'I can help with booking, availability, services, stylists, or rescheduling. What would you like to do next?'
  }

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    const currentInput = input
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(currentInput),
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 850)
  }

  const quickQuestions = [
    'Do you have slots tomorrow?',
    'How much is balayage?',
    'What services do you offer?',
    'Who are your stylists?',
  ]

  return (
    <div className="relative min-h-[calc(100vh-2rem)] overflow-hidden bg-transparent">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-fuchsia-300/18 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-2rem)] max-w-5xl flex-col gap-6">
        <Card className="border-slate-200 bg-white/80 p-5 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.18)] backdrop-blur-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-900" asChild>
                <Link href="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <Avatar className="h-11 w-11 border border-slate-200">
                <AvatarFallback className="bg-cyan-100 text-cyan-700">
                  <Bot className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="display-font text-2xl font-semibold text-slate-900">
                  AI Salon Assistant
                </h1>
                <p className="text-sm text-slate-500">
                  Online now, ready to help you book
                </p>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm text-cyan-800">
              <Sparkles className="h-4 w-4" />
              Concierge mode
            </div>
          </div>
        </Card>

        <Card className="flex-1 border-slate-200 bg-white/80 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.18)] backdrop-blur-2xl">
          <div className="flex h-[60vh] flex-col">
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-end gap-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' ? (
                      <Avatar className="h-9 w-9 border border-slate-200">
                        <AvatarFallback className="bg-cyan-100 text-cyan-700">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    ) : null}
                    <div
                      className={`max-w-[80%] rounded-3xl px-4 py-3 shadow-sm ${
                        message.role === 'user'
                          ? 'rounded-br-md bg-slate-900 text-white'
                          : 'rounded-bl-md border border-slate-200 bg-white text-slate-800'
                      }`}
                    >
                      <p className="whitespace-pre-line text-sm leading-7">
                        {message.content}
                      </p>
                      <p
                        className={`mt-1 text-xs ${
                          message.role === 'user' ? 'text-slate-300' : 'text-slate-500'
                        }`}
                      >
                        {format(message.timestamp, 'HH:mm')}
                      </p>
                    </div>
                    {message.role === 'user' ? (
                      <Avatar className="h-9 w-9 border border-slate-200">
                        <AvatarFallback className="bg-slate-100 text-slate-700">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    ) : null}
                  </div>
                ))}

                {isTyping ? (
                  <div className="flex items-end gap-3 justify-start">
                    <Avatar className="h-9 w-9 border border-slate-200">
                      <AvatarFallback className="bg-cyan-100 text-cyan-700">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="rounded-3xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
                      <div className="flex gap-1">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
                        <div
                          className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                          style={{ animationDelay: '0.15s' }}
                        />
                        <div
                          className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                          style={{ animationDelay: '0.3s' }}
                        />
                      </div>
                    </div>
                  </div>
                ) : null}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {messages.length <= 1 ? (
              <div className="border-t border-slate-200 px-6 pb-5 pt-4">
                <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
                  <Sparkles className="h-4 w-4 text-cyan-700" />
                  Quick questions
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {quickQuestions.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => setInput(question)}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="border-t border-slate-200 p-4">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                  placeholder="Ask about prices, availability, booking, or stylists..."
                  className="h-12 rounded-2xl border-slate-300 bg-white/90"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="h-12 rounded-2xl bg-slate-900 px-5 text-white hover:bg-slate-800"
                >
                  <Send className="h-4 w-4" />
                  Send
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
