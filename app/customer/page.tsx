'use client'

import Link from 'next/link'
import {
  ArrowRight,
  CalendarDays,
  ClipboardList,
  MessageCircle,
  Sparkles,
  Scissors,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card'
import { Button } from '@/components/button'
import { SiteShell } from '@/components/site-shell'

const quickActions = [
  {
    href: '/customer/book',
    title: 'Quick Book',
    icon: CalendarDays,
    description: 'Book an appointment for your favorite service.',
  },
  {
    href: '/customer/chat',
    title: 'Chat with AI',
    icon: MessageCircle,
    description: 'Ask about services, availability, and pricing.',
  },
  {
    href: '/customer/bookings',
    title: 'My Bookings',
    icon: ClipboardList,
    description: 'View, reschedule, or cancel your appointments.',
  },
]

export default function CustomerHome() {
  return (
    <SiteShell
      title="Customer Portal"
      description="A glassmorphism front end for customers to book, chat, and manage appointments."
      navHref="/customer"
      navLabel="Customer"
      backHref="/"
      accent="cyan"
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-slate-200 bg-white/80 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.16)] backdrop-blur-2xl">
          <CardHeader>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm text-cyan-800">
              <Sparkles className="h-4 w-4" />
              Customer actions
            </div>
            <CardTitle className="display-font text-3xl text-slate-900">
              Start where you need to go.
            </CardTitle>
            <CardDescription className="text-slate-600">
              Booking, chat, and booking history are grouped together so the flow stays simple.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon

              return (
                <Link key={action.title} href={action.href} className="group">
                  <div className="h-full rounded-[24px] border border-slate-200 bg-white/90 p-5 transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-[0_18px_40px_-24px_rgba(15,23,42,0.2)]">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-cyan-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="display-font text-2xl text-slate-900">
                      {action.title}
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {action.description}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-slate-900">
                      Open
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white/80 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.16)] backdrop-blur-2xl">
          <CardHeader>
            <CardTitle className="display-font text-3xl text-slate-900">
              Popular services
            </CardTitle>
            <CardDescription className="text-slate-600">
              The most requested treatments at Glamour Studio.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: 'Haircut', duration: '45 min', price: '$20' },
              { name: 'Hair Color', duration: '90 min', price: '$80' },
              { name: 'Balayage', duration: '120 min', price: '$120' },
              { name: 'Hair Treatment', duration: '60 min', price: '$50' },
            ].map((service) => (
              <div
                key={service.name}
                className="flex items-center justify-between rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="font-semibold text-slate-900">{service.name}</p>
                  <p className="text-sm text-slate-500">{service.duration}</p>
                </div>
                <div className="text-lg font-semibold text-slate-900">
                  {service.price}
                </div>
              </div>
            ))}
            <Button className="w-full rounded-full bg-slate-900 text-white hover:bg-slate-800" asChild>
              <Link href="/customer/book">Book a service</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </SiteShell>
  )
}
