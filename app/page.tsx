'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Clock3,
  MessageCircle,
  Scissors,
  Sparkles,
  Users,
  ShieldCheck,
  MapPin,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/card'
import { Button } from '@/components/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/avatar'
import { BookingDialog } from '@/components/booking-dialog'
import { services, stylists } from '@/lib/mock-data'

const featurePillars = [
  {
    icon: Sparkles,
    title: 'AI concierge',
    description:
      'Guide clients to the right service, match them to a stylist, and shorten the booking path.',
  },
  {
    icon: ShieldCheck,
    title: 'Trusted experience',
    description:
      'Glass layers, soft contrast, and clear actions keep the interface polished and easy to scan.',
  },
  {
    icon: Users,
    title: 'Salon-ready flow',
    description:
      'Booking, chat, and staff access sit together so each visitor can move to the right destination fast.',
  },
]

const journeySteps = [
  {
    number: '01',
    title: 'Explore the menu',
    description:
      'Browse services, durations, and pricing in one clean glass panel.',
  },
  {
    number: '02',
    title: 'Book or ask AI',
    description:
      'Jump into the booking dialog or open the AI assistant for guidance.',
  },
  {
    number: '03',
    title: 'Confirm the visit',
    description:
      'Lock the time, stylist, and appointment details before you arrive.',
  },
]

export default function Home() {
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  const openBooking = (serviceId?: string) => {
    setSelectedService(serviceId ?? null)
    setIsBookingOpen(true)
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-transparent text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 top-12 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute right-0 top-24 h-96 w-96 rounded-full bg-fuchsia-300/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-violet-300/15 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.12),transparent_30%),radial-gradient(circle_at_top_right,rgba(232,121,249,0.1),transparent_28%),radial-gradient(circle_at_bottom,rgba(99,102,241,0.08),transparent_30%)]" />
      </div>

      <div className="relative z-10">
        <header className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <nav className="flex flex-wrap items-center justify-between gap-4 rounded-full border border-slate-200/70 bg-white/75 px-5 py-4 text-slate-900 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.18)] backdrop-blur-2xl">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white ring-1 ring-slate-900/5">
                <Scissors className="h-5 w-5" />
              </div>
              <div>
                <p className="display-font text-lg font-semibold tracking-tight text-slate-900">
                  Glamour Studio
                </p>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  AI booking lounge
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-2 md:flex">
              <Button
                variant="ghost"
                className="text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Services
              </Button>
              <Button
                variant="ghost"
                className="text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                asChild
              >
                <Link href="/chat">AI Chat</Link>
              </Button>
              <Button
                variant="ghost"
                className="text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                asChild
              >
                <Link href="/staff">Staff</Link>
              </Button>
            </div>

            <Button
              className="rounded-full bg-slate-900 px-5 text-white hover:bg-slate-800"
              onClick={() => openBooking()}
            >
              Book now
              <ArrowRight className="h-4 w-4" />
            </Button>
          </nav>
        </header>

        <section className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/40 bg-cyan-50 px-4 py-2 text-sm text-cyan-900 backdrop-blur-xl">
                <BadgeCheck className="h-4 w-4 text-cyan-700" />
                <span>Glassmorphism booking for a modern salon front door</span>
              </div>

              <div className="space-y-5">
                <h1 className="display-font max-w-4xl text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
                  Luxury appointments, framed in glass.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                  Glamour Studio pairs AI guidance, real service availability,
                  and a refined booking flow so every client can move from
                  inspiration to confirmation without friction.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="rounded-full bg-slate-900 px-6 text-white hover:bg-slate-800"
                  onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <CalendarDays className="h-5 w-5" />
                  Explore services
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-slate-300 bg-white/70 px-6 text-slate-900 hover:bg-slate-50"
                  asChild
                >
                  <Link href="/chat">
                    <MessageCircle className="h-5 w-5" />
                    Chat with AI
                  </Link>
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { value: '4.9/5', label: 'Client rating' },
                  { value: 'Same day', label: 'Fast availability' },
                  { value: '24/7', label: 'AI support' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[24px] border border-slate-200 bg-white/80 p-4 shadow-[0_16px_50px_-30px_rgba(15,23,42,0.25)] backdrop-blur-xl"
                  >
                    <div className="text-2xl font-semibold text-slate-900">{stat.value}</div>
                    <div className="mt-1 text-sm text-slate-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -right-4 -top-6 h-24 w-24 rounded-full bg-cyan-200/50 blur-2xl" />
              <div className="absolute -bottom-8 left-10 h-28 w-28 rounded-full bg-fuchsia-200/45 blur-3xl" />

              <div className="rounded-[32px] border border-slate-200 bg-white/70 p-4 shadow-[0_32px_100px_-32px_rgba(15,23,42,0.18)] backdrop-blur-2xl sm:p-6">
                <div className="rounded-[26px] border border-slate-200 bg-white/75 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                        Live booking preview
                      </p>
                      <h2 className="display-font mt-2 text-3xl font-semibold text-slate-900">
                        Your next opening
                      </h2>
                    </div>
                    <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
                      Accepting bookings
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="rounded-[24px] border border-slate-200 bg-white/80 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm text-slate-500">Next open slot</p>
                          <p className="mt-1 text-2xl font-semibold text-slate-900">
                            3:30 PM
                          </p>
                        </div>
                        <Clock3 className="h-5 w-5 text-cyan-700" />
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                          Balayage
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                          Haircut
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                          Blowout
                        </span>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-[1.15fr_0.85fr]">
                      <div className="rounded-[24px] border border-slate-200 bg-white/80 p-4">
                        <p className="text-sm text-slate-500">Recommended stylist</p>
                        <div className="mt-4 flex items-center gap-3">
                          <Avatar className="h-12 w-12 border border-slate-200">
                            <AvatarImage src={stylists[0]?.avatar} alt={stylists[0]?.name} />
                            <AvatarFallback>{stylists[0]?.name?.[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-lg font-semibold text-slate-900">
                              {stylists[0]?.name}
                            </div>
                            <div className="text-sm text-slate-500">
                              {stylists[0]?.specialty}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-slate-200 bg-white/80 p-4">
                        <p className="text-sm text-slate-500">Booking speed</p>
                        <div className="mt-4 text-3xl font-semibold text-slate-900">
                          45 sec
                        </div>
                        <p className="mt-1 text-sm text-slate-500">
                          from browse to confirmation
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-cyan-200 bg-cyan-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100">
                            <Sparkles className="h-5 w-5 text-cyan-700" />
                          </div>
                          <div>
                            <p className="text-sm text-cyan-700">AI concierge</p>
                            <p className="text-sm text-slate-700">
                              Suggested a same-day match based on your preferences.
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="rounded-full bg-slate-900 px-4 text-white hover:bg-slate-800"
                          onClick={() => openBooking('1')}
                        >
                          Book it
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            {featurePillars.map((item) => {
              const Icon = item.icon

              return (
                <Card
                  key={item.title}
                  className="border-slate-200 bg-white/75 text-slate-900 shadow-[0_20px_70px_-30px_rgba(15,23,42,0.12)] backdrop-blur-2xl transition-transform duration-300 hover:-translate-y-1"
                >
                  <CardHeader className="space-y-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-cyan-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="display-font text-2xl text-slate-900">
                        {item.title}
                      </CardTitle>
                      <CardDescription className="mt-2 leading-7 text-slate-600">
                        {item.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </section>

        <section id="services" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-700/70">
                Curated services
              </p>
              <h2 className="display-font text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                Browse the menu in a soft glass panel.
              </h2>
            </div>

            <Button
              variant="outline"
              className="rounded-full border-slate-300 bg-white px-5 text-slate-900 hover:bg-slate-50"
              asChild
            >
              <Link href="/customer">
                Customer portal
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service, index) => (
              <Card
                key={service.id}
                className="group border-slate-200 bg-white/75 text-slate-900 shadow-[0_20px_80px_-36px_rgba(15,23,42,0.12)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:bg-white/95"
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="display-font text-2xl text-slate-900">
                        {service.name}
                      </CardTitle>
                      <CardDescription className="mt-2 leading-7 text-slate-600">
                        {service.description}
                      </CardDescription>
                    </div>
                    <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-5">
                  <div className="flex items-center justify-between gap-3 rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock3 className="h-4 w-4" />
                      <span>{service.duration} minutes</span>
                    </div>
                    <div className="text-2xl font-semibold text-slate-900">
                      ${service.price}
                    </div>
                  </div>

                  <Button
                    className="w-full rounded-full bg-slate-900 px-5 text-white hover:bg-slate-800"
                    onClick={() => openBooking(service.id)}
                  >
                    Book this service
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[32px] border border-slate-200 bg-white/75 p-6 backdrop-blur-2xl sm:p-8">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500">
                How it works
              </p>
              <h2 className="display-font mt-3 text-4xl font-semibold tracking-tight text-slate-900">
                A booking flow that feels calm and intentional.
              </h2>
              <p className="mt-4 max-w-xl leading-7 text-slate-600">
                The layout balances atmosphere with clarity so visitors can
                immediately understand where to book, where to chat, and where
                the staff tools live.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {journeySteps.map((step) => (
                <div
                  key={step.number}
                  className="rounded-[28px] border border-slate-200 bg-white/75 p-5 backdrop-blur-2xl"
                >
                  <div className="text-sm uppercase tracking-[0.3em] text-cyan-700/70">
                    {step.number}
                  </div>
                  <h3 className="display-font mt-4 text-2xl font-semibold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-sm uppercase tracking-[0.28em] text-fuchsia-700/70">
                Stylists
              </p>
              <h2 className="display-font text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                Meet the team behind the experience.
              </h2>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-600 backdrop-blur-xl">
              <MapPin className="h-4 w-4 text-cyan-700" />
              Central salon, flexible weekday hours
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {stylists.map((stylist) => (
              <Card
                key={stylist.id}
                className="border-slate-200 bg-white/75 text-slate-900 shadow-[0_20px_80px_-36px_rgba(15,23,42,0.12)] backdrop-blur-2xl transition-transform duration-300 hover:-translate-y-1"
              >
                <CardHeader className="space-y-4 text-center">
                  <div className="flex justify-center">
                    <Avatar className="h-24 w-24 border border-slate-200 ring-1 ring-slate-200">
                      <AvatarImage src={stylist.avatar} alt={stylist.name} />
                      <AvatarFallback>{stylist.name[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <CardTitle className="display-font text-2xl text-slate-900">
                      {stylist.name}
                    </CardTitle>
                    <CardDescription className="mt-2 text-slate-600">
                      {stylist.specialty}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock3 className="h-4 w-4" />
                    <span>
                      {stylist.workingHours.start} - {stylist.workingHours.end}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 transition hover:bg-slate-50"
                    onClick={() => openBooking()}
                  >
                    Book
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <footer className="border-t border-slate-200 bg-white/80">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <div>
              <p className="display-font text-2xl font-semibold text-slate-900">
                Glamour Studio
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Glassmorphism homepage for AI-assisted salon booking.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="ghost"
                className="text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                asChild
              >
                <Link href="/chat">AI Chat</Link>
              </Button>
              <Button
                variant="ghost"
                className="text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                asChild
              >
                <Link href="/staff">Staff Login</Link>
              </Button>
            </div>
          </div>
        </footer>
      </div>

      <BookingDialog
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preSelectedServiceId={selectedService}
      />
    </main>
  )
}
