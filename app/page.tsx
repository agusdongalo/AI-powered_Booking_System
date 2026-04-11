'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  MessageCircle,
  Scissors,
  Sparkles,
  Users,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card'
import { Button } from '@/components/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/avatar'

type Service = {
  id: string
  name: string
  duration: number
  price: number
  description: string
}

type Stylist = {
  id: string
  name: string
  specialty: string
  avatar: string
  workingHours: { start: string; end: string }
}

export default function Home() {
  const [services, setServices] = useState<Service[]>([])
  const [stylists, setStylists] = useState<Stylist[]>([])

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
        // Landing page remains usable without live data.
      }
    }

    void loadCatalog()
  }, [])

  const bookingHref = (serviceId?: string) => {
    if (!serviceId) return '/customer/book'

    const params = new URLSearchParams({ service: serviceId })
    return `/customer/book?${params.toString()}`
  }

  return (
    <main className="min-h-screen bg-transparent text-slate-900">
      <header className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap items-center justify-between gap-4 rounded-[8px] border border-slate-300 bg-[#fcfbf8] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-slate-900 text-white">
              <Scissors className="h-5 w-5" />
            </div>
            <div>
              <p className="display-font text-lg font-semibold tracking-tight text-slate-900">
                Glamour Studio
              </p>
              <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">
                AI booking
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <Button variant="ghost" onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}>
              Services
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/customer">Customer</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/staff">Staff</Link>
            </Button>
          </div>

          <Button className="px-5" asChild>
            <Link href="/customer/book">
              Book now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </nav>
      </header>

      <section className="mx-auto max-w-7xl px-4 pb-14 pt-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6 rounded-[8px] border border-slate-300 bg-[#fcfbf8] p-7 sm:p-9">
            <div className="inline-flex items-center gap-2 rounded-[6px] border border-slate-300 bg-white px-3 py-2 text-sm text-slate-600">
              <Sparkles className="h-4 w-4" />
              Quiet luxury booking experience
            </div>

            <div className="space-y-4">
              <h1 className="display-font max-w-3xl text-[clamp(2.9rem,6vw,5rem)] font-semibold leading-[0.92] tracking-[-0.045em] text-slate-900">
                Premium booking,
                <br />
                minimal by design.
              </h1>
              <p className="max-w-2xl text-[16px] leading-8 text-slate-600">
                A focused experience for clients and staff. Clear schedules,
                real availability, and AI assistance when needed.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="px-6" asChild>
                <Link href="/customer/book">
                  <CalendarDays className="h-5 w-5" />
                  Book appointment
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="px-6" asChild>
                <Link href="/chat">
                  <MessageCircle className="h-5 w-5" />
                  Ask AI concierge
                </Link>
              </Button>
            </div>
          </div>

          <div className="rounded-[8px] border border-slate-300 bg-[#fcfbf8] p-7">
            <p className="text-sm uppercase tracking-[0.22em] text-slate-500">At a glance</p>
            <div className="mt-5 space-y-4">
              <div className="rounded-[6px] border border-slate-300 bg-white px-4 py-4">
                <p className="text-sm text-slate-500">Average booking time</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">Under 1 minute</p>
              </div>
              <div className="rounded-[6px] border border-slate-300 bg-white px-4 py-4">
                <p className="text-sm text-slate-500">Next open slot</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">Today, 3:30 PM</p>
              </div>
              <div className="rounded-[6px] border border-slate-300 bg-white px-4 py-4">
                <p className="text-sm text-slate-500">AI concierge support</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">24/7 response</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Services</p>
            <h2 className="display-font mt-2 text-4xl font-semibold tracking-tight text-slate-900">
              Service menu
            </h2>
          </div>
          <Button variant="outline" asChild>
            <Link href="/customer">
              Go to customer portal
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id} className="border-slate-300 bg-[#fcfbf8] shadow-none">
              <CardHeader className="space-y-3">
                <CardTitle className="display-font text-2xl text-slate-900">{service.name}</CardTitle>
                <CardDescription className="text-sm leading-7 text-slate-600">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-[6px] border border-slate-300 bg-white px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock3 className="h-4 w-4" />
                    {service.duration} minutes
                  </div>
                  <p className="text-lg font-semibold text-slate-900">${service.price}</p>
                </div>
                <Button className="w-full" asChild>
                  <Link href={bookingHref(service.id)}>
                    Book this service
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <Card className="border-slate-300 bg-[#fcfbf8] shadow-none">
            <CardHeader>
              <CardTitle className="display-font text-3xl text-slate-900">How it works</CardTitle>
              <CardDescription className="leading-8 text-slate-600">
                A short path from discovery to confirmation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                'Select a service and preferred stylist.',
                'Check real availability and confirm a slot.',
                'Manage bookings anytime from the customer portal.',
              ].map((step, index) => (
                <div key={step} className="flex items-start gap-3 rounded-[6px] border border-slate-300 bg-white px-4 py-3">
                  <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-[4px] bg-slate-900 text-xs font-medium text-white">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-7 text-slate-700">{step}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-slate-300 bg-[#fcfbf8] shadow-none">
            <CardHeader>
              <CardTitle className="display-font text-3xl text-slate-900">Stylists</CardTitle>
              <CardDescription className="leading-8 text-slate-600">
                Meet the team behind each appointment.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {stylists.map((stylist) => (
                <div key={stylist.id} className="flex items-center justify-between gap-3 rounded-[6px] border border-slate-300 bg-white px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-11 w-11 rounded-[6px] border border-slate-300">
                      <AvatarImage src={stylist.avatar} alt={stylist.name} />
                      <AvatarFallback className="rounded-[6px] bg-slate-100 text-slate-700">
                        {stylist.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-slate-900">{stylist.name}</p>
                      <p className="text-sm text-slate-600">{stylist.specialty}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">
                    {stylist.workingHours.start} - {stylist.workingHours.end}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="border-t border-slate-300 bg-[#fcfbf8]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-slate-800">
            <Users className="h-4 w-4" />
            <span className="text-sm">Glamour Studio premium booking system</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/chat">AI Chat</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/staff">Staff Login</Link>
            </Button>
          </div>
        </div>
      </footer>
    </main>
  )
}
