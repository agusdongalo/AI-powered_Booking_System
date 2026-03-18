'use client'

import { useEffect, useState } from 'react'
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
  const [services, setServices] = useState<
    { id: string; name: string; duration: number; price: number; description: string }[]
  >([])
  const [stylists, setStylists] = useState<
    { id: string; name: string; specialty: string; avatar: string; workingHours: { start: string; end: string } }[]
  >([])

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const [servicesResponse, stylistsResponse] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/stylists'),
        ])

        if (servicesResponse.ok) {
          setServices(await servicesResponse.json())
        }
        if (stylistsResponse.ok) {
          setStylists(await stylistsResponse.json())
        }
      } catch {
        // Home page can still render without live data.
      }
    }

    void loadCatalog()
  }, [])

  const openBooking = (serviceId?: string) => {
    setSelectedService(serviceId ?? null)
    setIsBookingOpen(true)
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-transparent text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-8 h-[26rem] w-[26rem] rounded-full bg-sky-300/30 blur-3xl" />
        <div className="absolute right-0 top-14 h-[30rem] w-[30rem] rounded-full bg-fuchsia-300/22 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-[24rem] w-[24rem] rounded-full bg-indigo-200/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.22),transparent_26%),radial-gradient(circle_at_top_right,rgba(244,114,182,0.15),transparent_24%),radial-gradient(circle_at_bottom,rgba(191,219,254,0.18),transparent_28%)]" />
      </div>

      <div className="relative z-10">
        <header className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <nav className="relative flex flex-wrap items-center justify-between gap-4 rounded-full border border-white/70 bg-white/55 px-5 py-4 text-slate-900 shadow-[0_30px_100px_-42px_rgba(56,96,160,0.5),0_12px_30px_-20px_rgba(15,23,42,0.18)] backdrop-blur-[28px]">
            <div className="pointer-events-none absolute inset-px rounded-full border border-white/65" />
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_12px_24px_-12px_rgba(15,23,42,0.55)] ring-1 ring-white/25">
                <Scissors className="h-5 w-5" />
              </div>
              <div>
                <p className="display-font text-lg font-semibold tracking-tight text-slate-900">
                  Glamour Studio
                </p>
                <p className="text-[10px] uppercase tracking-[0.34em] text-slate-500">
                  AI booking lounge
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-2 md:flex">
              <Button
                variant="ghost"
                className="rounded-full border border-transparent bg-white/30 px-4 text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] hover:border-white/70 hover:bg-white/55 hover:text-slate-900"
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Services
              </Button>
              <Button
                variant="ghost"
                className="rounded-full border border-transparent bg-white/30 px-4 text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] hover:border-white/70 hover:bg-white/55 hover:text-slate-900"
                asChild
              >
                <Link href="/chat">AI Chat</Link>
              </Button>
              <Button
                variant="ghost"
                className="rounded-full border border-transparent bg-white/30 px-4 text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] hover:border-white/70 hover:bg-white/55 hover:text-slate-900"
                asChild
              >
                <Link href="/staff">Staff</Link>
              </Button>
            </div>

            <Button
              className="rounded-full border border-white/70 bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 px-5 text-white shadow-[0_16px_34px_-12px_rgba(59,130,246,0.75),inset_0_1px_0_rgba(255,255,255,0.65)] hover:from-sky-400 hover:via-blue-400 hover:to-indigo-400"
              onClick={() => openBooking()}
            >
              Book now
              <ArrowRight className="h-4 w-4" />
            </Button>
          </nav>
        </header>

        <section className="mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 lg:px-8 lg:pb-16 lg:pt-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1.12fr_0.88fr]">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/75 bg-white/55 px-4 py-2 text-[13px] text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_10px_24px_-18px_rgba(15,23,42,0.35)] backdrop-blur-xl">
                <BadgeCheck className="h-4 w-4 text-sky-600" />
                <span>Glassmorphism booking for a modern salon front door</span>
              </div>

              <div className="space-y-4">
                <h1 className="display-font max-w-3xl text-[clamp(3.2rem,7vw,6.25rem)] font-semibold leading-[0.92] tracking-[-0.06em] text-slate-800 drop-shadow-[0_1px_0_rgba(255,255,255,0.45)]">
                  <span className="block">Luxury</span>
                  <span className="block">appointments,</span>
                  <span className="block">framed in glass.</span>
                </h1>
                <p className="max-w-2xl text-[15px] leading-7 text-slate-600 sm:text-[16px]">
                  Glamour Studio pairs AI guidance, real service availability, and a
                  refined booking flow so every client can move from inspiration to
                  confirmation without friction.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="rounded-full border border-white/70 bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 px-6 text-white shadow-[0_18px_36px_-18px_rgba(59,130,246,0.8),inset_0_1px_0_rgba(255,255,255,0.6)] hover:from-sky-400 hover:via-blue-400 hover:to-indigo-400"
                  onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <CalendarDays className="h-5 w-5" />
                  Explore services
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border border-white/75 bg-white/55 px-6 text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_12px_24px_-20px_rgba(15,23,42,0.35)] backdrop-blur-xl hover:bg-white/75"
                  asChild
                >
                  <Link href="/chat">
                    <MessageCircle className="h-5 w-5 text-sky-600" />
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
                    className="rounded-[26px] border border-white/80 bg-white/55 p-4 shadow-[0_18px_46px_-24px_rgba(56,96,160,0.5),inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-[26px]"
                  >
                    <div className="text-2xl font-semibold text-slate-800">{stat.value}</div>
                    <div className="mt-1 text-sm text-slate-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-sky-200/50 blur-3xl" />
              <div className="absolute -bottom-10 left-8 h-32 w-32 rounded-full bg-fuchsia-200/45 blur-3xl" />

              <div className="relative rounded-[36px] border border-white/75 bg-white/50 p-4 shadow-[0_40px_140px_-52px_rgba(59,130,246,0.65),0_18px_36px_-28px_rgba(15,23,42,0.3)] backdrop-blur-[30px] sm:p-5">
                <div className="absolute inset-px rounded-[36px] border border-white/55" />
                <div className="relative rounded-[30px] border border-white/70 bg-white/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.92)] sm:p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.45em] text-slate-500">
                        Live booking preview
                      </p>
                      <h2 className="display-font mt-2 text-3xl font-semibold leading-[0.92] text-slate-800 sm:text-[2.5rem]">
                        Your next
                        <br />
                        opening
                      </h2>
                    </div>
                    <div className="rounded-full border border-sky-200 bg-sky-100/75 px-3 py-1 text-[11px] text-slate-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
                      Accepting
                      <br />
                      bookings
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    <div className="rounded-[24px] border border-white/80 bg-white/70 p-4 shadow-[0_16px_26px_-18px_rgba(15,23,42,0.3),inset_0_1px_0_rgba(255,255,255,0.85)]">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm text-slate-500">Next open slot</p>
                          <p className="mt-1 text-2xl font-semibold text-slate-800">
                            3:30 PM
                          </p>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-sky-100 bg-sky-50 text-sky-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                          <Clock3 className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-xs text-slate-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
                          Balayage
                        </span>
                        <span className="rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-xs text-slate-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
                          Haircut
                        </span>
                        <span className="rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-xs text-slate-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
                          Blowout
                        </span>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-[1.05fr_0.95fr]">
                      <div className="rounded-[24px] border border-white/80 bg-white/70 p-4 shadow-[0_16px_26px_-18px_rgba(15,23,42,0.3),inset_0_1px_0_rgba(255,255,255,0.85)]">
                        <p className="text-sm text-slate-500">Recommended stylist</p>
                        <div className="mt-4 flex items-center gap-3">
                          <Avatar className="h-12 w-12 border border-white/80 shadow-[0_10px_20px_-14px_rgba(15,23,42,0.35)]">
                            <AvatarImage src={stylists[0]?.avatar} alt={stylists[0]?.name} />
                            <AvatarFallback className="bg-slate-100 text-slate-700">
                              {stylists[0]?.name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-lg font-semibold text-slate-800">
                              {stylists[0]?.name}
                            </div>
                            <div className="text-sm text-slate-500">
                              {stylists[0]?.specialty}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-white/80 bg-white/70 p-4 shadow-[0_16px_26px_-18px_rgba(15,23,42,0.3),inset_0_1px_0_rgba(255,255,255,0.85)]">
                        <p className="text-sm text-slate-500">Booking speed</p>
                        <div className="mt-4 text-3xl font-semibold text-slate-800">
                          45 sec
                        </div>
                        <p className="mt-1 text-sm text-slate-500">
                          from browse to confirmation
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-sky-100 bg-sky-50/85 p-4 shadow-[0_16px_26px_-18px_rgba(14,165,233,0.28),inset_0_1px_0_rgba(255,255,255,0.9)]">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-sky-100 bg-white text-sky-600 shadow-[0_10px_18px_-14px_rgba(14,165,233,0.35)]">
                            <Sparkles className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm text-sky-700">AI concierge</p>
                            <p className="text-sm text-slate-600">
                              Suggested a same-day match based on your preferences.
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="rounded-full border border-white/70 bg-gradient-to-r from-sky-500 to-blue-500 px-4 text-white shadow-[0_14px_30px_-16px_rgba(59,130,246,0.8),inset_0_1px_0_rgba(255,255,255,0.7)] hover:from-sky-400 hover:to-blue-400"
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
