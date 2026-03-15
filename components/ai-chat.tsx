'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Send, Bot, User, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { Card } from './card';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { services, stylists, generateTimeSlots } from '@/lib/mock-data';
import { format } from 'date-fns';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI salon assistant. I can help you book appointments, check availability, answer questions about our services, or reschedule existing bookings. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Check for greetings
    if (lowerMessage.match(/^(hi|hello|hey|good morning|good afternoon)/)) {
      return "Hello! Welcome to Glamour Studio. I'm here to help you with bookings, service information, or any questions you have. What would you like to know?";
    }

    // Check for availability queries
    if (lowerMessage.includes('available') || lowerMessage.includes('slot') || lowerMessage.includes('time')) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const slots = generateTimeSlots(tomorrow, '2', 45); // Mike, 45 min service
      
      if (slots.length > 0) {
        return `For tomorrow (${format(tomorrow, 'MMMM d')}), we have the following slots available:\n\n${slots.slice(0, 5).join(', ')}\n\nWould you like to book one of these times? Just let me know which service and stylist you prefer!`;
      }
    }

    // Check for pricing queries
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much')) {
      if (lowerMessage.includes('balayage')) {
        return "Balayage starts at $120 and usually takes about 2 hours. It's one of our most popular services! Would you like to book an appointment?";
      }
      if (lowerMessage.includes('haircut')) {
        return "A professional haircut is $20 and takes 45 minutes. We also offer additional styling if needed. Would you like to book?";
      }
      if (lowerMessage.includes('color')) {
        return "Our full hair color treatment is $80 and takes 1.5 hours. We use professional products for long-lasting results. Interested in booking?";
      }
      
      // General pricing
      const priceList = services
        .map((s) => `• ${s.name}: $${s.price} (${s.duration} min)`)
        .join('\n');
      return `Here are our service prices:\n\n${priceList}\n\nWhich service interests you?`;
    }

    // Check for service information
    if (lowerMessage.includes('service') || lowerMessage.includes('offer') || lowerMessage.includes('what do you')) {
      return `We offer the following services:\n\n${services.map((s) => `• ${s.name} - ${s.description} ($${s.price}, ${s.duration} min)`).join('\n')}\n\nWould you like to book any of these?`;
    }

    // Check for stylist queries
    if (lowerMessage.includes('stylist') || lowerMessage.includes('who') || lowerMessage.includes('staff')) {
      return `Our talented stylists:\n\n${stylists.map((s) => `• ${s.name} - Specialty: ${s.specialty} (Available ${s.workingHours.start}-${s.workingHours.end})`).join('\n')}\n\nWho would you like to book with?`;
    }

    // Check for booking intent
    if (lowerMessage.includes('book') || lowerMessage.includes('appointment') || lowerMessage.includes('schedule')) {
      return "I'd love to help you book an appointment! To get started, please tell me:\n\n1. Which service would you like?\n2. Do you have a preferred stylist?\n3. What date works best for you?\n\nOr you can use the 'Book Now' button on any service card on our homepage!";
    }

    // Check for rescheduling
    if (lowerMessage.includes('reschedule') || lowerMessage.includes('move') || lowerMessage.includes('change')) {
      return "I can help you reschedule your appointment. To do this, I'll need:\n\n1. Your current appointment date/time\n2. Your preferred new date/time\n\nPlease provide these details and I'll check availability for you.";
    }

    // Check for cancellation
    if (lowerMessage.includes('cancel')) {
      return "I understand you need to cancel. Can you please provide:\n\n1. Your name\n2. Your appointment date and time\n\nI'll help you cancel the booking. We recommend canceling at least 24 hours in advance when possible.";
    }

    // Check for upselling opportunities
    if (lowerMessage.includes('haircut') && !lowerMessage.includes('price')) {
      return "Great choice! A haircut is $20 and takes 45 minutes. Many of our customers also add a hair treatment ($35, 30 min) for extra shine and health. Would you like to combine these services?";
    }

    // Check for hours
    if (lowerMessage.includes('hour') || lowerMessage.includes('open') || lowerMessage.includes('close')) {
      return "Our salon hours vary by stylist:\n\n• Anna: 9:00 AM - 6:00 PM\n• Mike: 10:00 AM - 7:00 PM\n• Liza: 9:00 AM - 5:00 PM\n\nWe're open Monday through Saturday. Which stylist would you like to book with?";
    }

    // Default response
    return "I'm here to help! I can assist you with:\n\n• Booking appointments\n• Checking availability\n• Service prices and information\n• Rescheduling or canceling bookings\n• Questions about our stylists\n\nWhat would you like to know?";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(input),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    "Do you have slots tomorrow?",
    "How much is balayage?",
    "What services do you offer?",
    "Who are your stylists?",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            asChild
          >
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-3 flex-1">
            <div className="relative">
              <Avatar className="h-10 w-10 border-2 border-white">
                <AvatarFallback className="bg-purple-700">
                  <Bot className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="font-semibold">AI Salon Assistant</h1>
              <p className="text-xs text-purple-100">Online • Always here to help</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback className="bg-purple-100">
                    <Bot className="h-5 w-5 text-purple-600" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[80%] sm:max-w-[70%] ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                    : 'bg-white border border-gray-200'
                } rounded-2xl px-4 py-3 shadow-sm`}
              >
                <p className="whitespace-pre-line text-sm sm:text-base">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-purple-100' : 'text-gray-500'
                  }`}
                >
                  {format(message.timestamp, 'HH:mm')}
                </p>
              </div>
              {message.role === 'user' && (
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback className="bg-pink-100">
                    <User className="h-5 w-5 text-pink-600" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start">
              <Avatar className="h-8 w-8 mt-1">
                <AvatarFallback className="bg-purple-100">
                  <Bot className="h-5 w-5 text-purple-600" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Questions */}
      {messages.length <= 1 && (
        <div className="max-w-4xl mx-auto px-4 pb-4">
          <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
            <Sparkles className="h-4 w-4" />
            <span>Quick questions:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setInput(question)}
                className="text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-pink-300 hover:bg-pink-50 transition-colors text-sm"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t bg-white p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
