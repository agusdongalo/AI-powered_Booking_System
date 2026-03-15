'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content:
        'Hello! 👋 I\'m your salon assistant. I can help you with:\n\n• Booking appointments\n• Checking availability\n• Service information & pricing\n• Rescheduling appointments\n• Answering salon questions\n\nWhat can I help you with today?',
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const responses: { [key: string]: string } = {
        haircut: `Haircuts take 45 minutes and cost $20. We have several stylists available. Mike specializes in men's haircuts. Would you like to book an appointment?`,
        balayage: `Balayage takes about 2 hours and costs $120. Anna is our coloring specialist. Would you like to check availability?`,
        price: `Here are our services:\n• Haircut: $20 (45 min)\n• Hair Color: $80 (1.5 hr)\n• Balayage: $120 (2 hr)\n• Hair Treatment: $50 (1 hr)\n\nWhich service interests you?`,
        available: `I can check availability! What service and date are you interested in?`,
        reschedule: `I can help you reschedule. Do you have an existing booking? Please provide your name or booking ID.`,
        default: `I understand you're asking about "${inputValue}". How can I help you better? Would you like to:\n\n• Check availability\n• Get service information\n• Book an appointment\n• Reschedule existing booking`,
      }

      const lowercaseInput = inputValue.toLowerCase()
      let response = responses.default

      for (const [key, value] of Object.entries(responses)) {
        if (lowercaseInput.includes(key)) {
          response = value
          break
        }
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response,
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="max-w-2xl mx-auto h-[600px] flex flex-col rounded-lg border border-gray-200 overflow-hidden bg-white">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.type === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg whitespace-pre-line ${
                message.type === 'user'
                  ? 'bg-purple-600 text-white rounded-br-none'
                  : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 border border-gray-200 px-4 py-2 rounded-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.1s' }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) =>
              e.key === 'Enter' && handleSendMessage()
            }
            placeholder="Ask me anything... ('How much is balayage?', 'Do you have slots tomorrow?')"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
          >
            Send
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          💡 Try asking: "Do you have a slot tomorrow?" or "How much is balayage?"
        </p>
      </div>
    </div>
  )
}
