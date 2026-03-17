'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CalendarDays, Clock3, MessageCircle, Scissors, Sparkles, Users } from 'lucide-react'
import { SiteShell } from './site-shell'
import { Button } from './button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'
import { services, stylists } from '@/lib/mock-data'
import { BookingDialog } from './booking-dialog'

export function CustomerBooking() {
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  const handleBookService = (serviceId: string) => {
    setSelectedService(serviceId)
    setIsBookingOpen(true)
  }

  return (
    <SiteShell
      title="Customer Home"
      description="A glassmorphism customer landing page with services, stylists, and quick actions."
      navHref="/customer"
      navLabel="Customer"
      backHref="/"
      accent="cyan"
    >
      <div className="space-y-8">
        <Card className="border-slate-200 bg-white/80 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.16)] backdrop-blur-2xl">
          <CardHeader>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm text-cyan-800">
              <Sparkles className="h-4 w-4" />
              Glamour Studio
            </div>
            <CardTitle className="display-font text-4xl text-slate-900">
              Your beauty, our passion
            </CardTitle>
            <CardDescription className="text-slate-600">
              Choose a service, open the AI assistant, or jump into bookings from one calm interface.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button
              size="lg"
              className="rounded-full bg-slate-900 text-white hover:bg-slate-800"
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <CalendarDays className="h-5 w-5" />
              Book appointment
            </Button>
            <Button size="lg" variant="outline" className="rounded-full border-slate-300 bg-white text-slate-900 hover:bg-slate-50" asChild>
              <Link href="/chat">
                <MessageCircle className="h-5 w-5" />
                Chat with AI
              </Link>
            </Button>
          </CardContent>
        </Card>

        <section id="services" className="grid gap-6 xl:grid-cols-3">
          {services.map((service, index) => (
            <Card
              key={service.id}
              className="border-slate-200 bg-white/80 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.16)] backdrop-blur-2xl transition hover:-translate-y-1 hover:border-cyan-200"
            >
              <CardHeader className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="display-font text-2xl text-slate-900">
                      {service.name}
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      {service.description}
                    </CardDescription>
                  </div>
                  <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock3 className="h-4 w-4 text-cyan-700" />
                    {service.duration} min
                  </div>
                  <div className="text-2xl font-semibold text-slate-900">${service.price}</div>
                </div>
                <Button
                  className="w-full rounded-full bg-slate-900 text-white hover:bg-slate-800"
                  onClick={() => handleBookService(service.id)}
                >
                  Book now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="border-slate-200 bg-white/80 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.16)] backdrop-blur-2xl">
            <CardHeader>
              <CardTitle className="display-font text-3xl text-slate-900">
                Why choose Glamour Studio?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { icon: CalendarDays, title: 'Easy Booking', description: 'Book appointments instantly online or chat with our AI assistant.' },
                { icon: Scissors, title: 'Expert Stylists', description: 'Highly trained professionals with years of experience.' },
                { icon: MessageCircle, title: '24/7 AI Support', description: 'Get instant answers to your questions anytime.' },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.title} className="flex gap-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-cyan-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{item.title}</div>
                      <div className="text-sm leading-7 text-slate-600">{item.description}</div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white/80 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.16)] backdrop-blur-2xl">
            <CardHeader>
              <CardTitle className="display-font text-3xl text-slate-900">
                Meet our stylists
              </CardTitle>
              <CardDescription className="text-slate-600">
                Experienced professionals dedicated to your beauty.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {stylists.map((stylist) => (
                <div key={stylist.id} className="flex items-center gap-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                  <Avatar className="h-14 w-14 border border-slate-200">
                    <AvatarImage src={stylist.avatar} alt={stylist.name} />
                    <AvatarFallback>{stylist.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">{stylist.name}</div>
                    <div className="text-sm text-slate-600">{stylist.specialty}</div>
                  </div>
                  <Button
                    size="sm"
                    className="rounded-full bg-slate-900 text-white hover:bg-slate-800"
                    onClick={() => handleBookService('1')}
                  >
                    Book
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>

      <BookingDialog
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preSelectedServiceId={selectedService}
      />
    </SiteShell>
  )
}
