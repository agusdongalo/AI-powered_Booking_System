'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, Clock3, Loader2, Plus, Scissors, Sparkles, Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'
import { Button } from './button'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs'
import { Calendar } from './calendar'
import { SiteShell } from './site-shell'
import { toast } from 'sonner'

interface Service {
  id: string
  name: string
  duration: number
  price: number
  description: string
}

interface Stylist {
  id: string
  name: string
  specialty: string
  avatar: string
  workingHours: { start: string; end: string }
}

interface Booking {
  id: string
  customerName: string
  customerPhone: string
  serviceId: string
  stylistId: string
  serviceName: string
  serviceDuration: number
  servicePrice: number
  stylistName: string
  stylistAvatar: string
  startTime: string
  endTime: string
  status: string
}

export function StaffDashboard() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [services, setServices] = useState<Service[]>([])
  const [stylists, setStylists] = useState<Stylist[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true)
      try {
        const [servicesResponse, stylistsResponse, bookingsResponse] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/stylists'),
          fetch('/api/bookings'),
        ])

        if (!servicesResponse.ok || !stylistsResponse.ok || !bookingsResponse.ok) {
          throw new Error('Failed to load dashboard data')
        }

        setServices(await servicesResponse.json())
        setStylists(await stylistsResponse.json())
        setBookings(await bookingsResponse.json())
      } catch {
        toast.error('Could not load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    void loadDashboard()

    const source = new EventSource('/api/events')
    source.onmessage = () => void loadDashboard()
    source.onerror = () => source.close()

    return () => source.close()
  }, [])

  const todayBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.startTime)
      return (
        bookingDate.getDate() === selectedDate.getDate() &&
        bookingDate.getMonth() === selectedDate.getMonth() &&
        bookingDate.getFullYear() === selectedDate.getFullYear()
      )
    })
  }, [bookings, selectedDate])

  const totalRevenue = useMemo(() => {
    return todayBookings
      .filter((booking) => booking.status === 'confirmed')
      .reduce((sum, booking) => sum + booking.servicePrice, 0)
  }, [todayBookings])

  const statCards = [
    {
      label: "Today's bookings",
      value: todayBookings.length,
      icon: CalendarDays,
      helper: selectedDate.toLocaleDateString(),
    },
    {
      label: 'Revenue today',
      value: `$${totalRevenue}`,
      icon: Sparkles,
      helper: `${todayBookings.filter((b) => b.status === 'confirmed').length} confirmed`,
    },
    {
      label: 'Active stylists',
      value: stylists.length,
      icon: Users,
      helper: 'All available today',
    },
  ]

  return (
    <SiteShell
      title="Staff Dashboard"
      description="A management view for bookings, services, schedules, and stylist operations."
      navHref="/staff"
      navLabel="Overview"
      backHref="/"
      accent="fuchsia"
    >
      <div className="grid gap-4 md:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="border-slate-200 bg-white/80 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.16)] backdrop-blur-2xl">
              <CardHeader className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-cyan-700">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <CardDescription className="text-slate-500">{stat.label}</CardDescription>
                  <CardTitle className="display-font text-4xl text-slate-900">
                    {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : stat.value}
                  </CardTitle>
                  <p className="mt-2 text-sm text-slate-600">{stat.helper}</p>
                </div>
              </CardHeader>
            </Card>
          )
        })}
      </div>

      <div className="mt-6">
        <Tabs defaultValue="calendar" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3 rounded-full border border-slate-200 bg-white/80 p-1">
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="stylists">Stylists</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <Card className="border-slate-200 bg-white/80 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.16)] backdrop-blur-2xl">
                <CardHeader>
                  <CardTitle className="display-font text-2xl text-slate-900">Select Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-2xl border border-slate-200 bg-white"
                  />
                </CardContent>
              </Card>

              <Card className="border-slate-200 bg-white/80 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.16)] backdrop-blur-2xl">
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <CardTitle className="display-font text-2xl text-slate-900">Appointments</CardTitle>
                      <CardDescription className="text-slate-600">
                        {selectedDate.toLocaleDateString(undefined, {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </CardDescription>
                    </div>
                    <Button className="rounded-full bg-slate-900 text-white hover:bg-slate-800">
                      <Plus className="h-4 w-4" />
                      New booking
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {todayBookings.length > 0 ? (
                    todayBookings
                      .slice()
                      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                      .map((booking) => (
                        <div key={booking.id} className="rounded-[24px] border border-slate-200 bg-white p-4">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="text-2xl font-semibold text-slate-900">
                                {new Date(booking.startTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                              </p>
                              <p className="text-sm text-slate-500">
                                {booking.serviceDuration} min • {booking.serviceName}
                              </p>
                            </div>
                            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                              {booking.status}
                            </span>
                          </div>

                          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                              <Scissors className="h-4 w-4 text-cyan-700" />
                              {booking.customerName}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock3 className="h-4 w-4 text-cyan-700" />
                              {booking.customerPhone}
                            </div>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6 border border-slate-200">
                                <AvatarImage src={booking.stylistAvatar} />
                                <AvatarFallback>{booking.stylistName[0]}</AvatarFallback>
                              </Avatar>
                              {booking.stylistName}
                            </div>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
                      <CalendarDays className="mx-auto mb-3 h-10 w-10 text-slate-300" />
                      No appointments scheduled for this date.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card className="border-slate-200 bg-white/80 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.16)] backdrop-blur-2xl">
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <CardTitle className="display-font text-2xl text-slate-900">Service management</CardTitle>
                    <CardDescription className="text-slate-600">
                      Manage salon services, pricing, and duration.
                    </CardDescription>
                  </div>
                  <Button className="rounded-full bg-slate-900 text-white hover:bg-slate-800" asChild>
                    <Link href="/staff/services">
                      <Plus className="h-4 w-4" />
                      Add service
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 text-left text-sm text-slate-500">
                        <th className="px-4 py-3">Service</th>
                        <th className="px-4 py-3">Duration</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map((service) => (
                        <tr key={service.id} className="border-b border-slate-100">
                          <td className="px-4 py-3 font-semibold text-slate-900">{service.name}</td>
                          <td className="px-4 py-3 text-slate-600">{service.duration} min</td>
                          <td className="px-4 py-3 text-slate-900">${service.price}</td>
                          <td className="px-4 py-3 text-slate-600">{service.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stylists" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              {stylists.map((stylist) => (
                <Card key={stylist.id} className="border-slate-200 bg-white/80 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.16)] backdrop-blur-2xl">
                  <CardHeader className="text-center">
                    <div className="flex justify-center">
                      <Avatar className="h-20 w-20 border border-slate-200">
                        <AvatarImage src={stylist.avatar} alt={stylist.name} />
                        <AvatarFallback>{stylist.name[0]}</AvatarFallback>
                      </Avatar>
                    </div>
                    <CardTitle className="display-font text-2xl text-slate-900">{stylist.name}</CardTitle>
                    <CardDescription className="text-slate-600">{stylist.specialty}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock3 className="h-4 w-4 text-cyan-700" />
                      {stylist.workingHours.start} - {stylist.workingHours.end}
                    </div>
                    <Button variant="outline" className="w-full rounded-full border-slate-300 bg-white text-slate-900 hover:bg-slate-50">
                      View schedule
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SiteShell>
  )
}
