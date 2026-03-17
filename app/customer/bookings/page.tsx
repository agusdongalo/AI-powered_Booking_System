'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CalendarDays, Clock3, MapPin, Sparkles, Trash2, RefreshCcw } from 'lucide-react'
import { SiteShell } from '@/components/site-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card'
import { Button } from '@/components/button'

interface Booking {
  id: string
  service: string
  stylist: string
  date: string
  time: string
  status: 'confirmed' | 'pending' | 'completed'
  price: number
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([
    { id: '1', service: 'Haircut', stylist: 'Mike', date: '2024-03-20', time: '2:00 PM', status: 'confirmed', price: 20 },
    { id: '2', service: 'Hair Color', stylist: 'Anna', date: '2024-03-25', time: '10:00 AM', status: 'confirmed', price: 80 },
    { id: '3', service: 'Balayage', stylist: 'Anna', date: '2024-02-28', time: '11:00 AM', status: 'completed', price: 120 },
  ])

  const handleReschedule = (bookingId: string) => {
    alert(`Rescheduling booking ${bookingId}... (Feature coming soon)`)
  }

  const handleCancel = (bookingId: string) => {
    if (confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      setBookings((prev) => prev.filter((booking) => booking.id !== bookingId))
      alert('Booking cancelled successfully')
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'border-emerald-200 bg-emerald-50 text-emerald-700'
      case 'pending':
        return 'border-amber-200 bg-amber-50 text-amber-700'
      case 'completed':
        return 'border-slate-200 bg-slate-100 text-slate-700'
      default:
        return 'border-slate-200 bg-slate-100 text-slate-700'
    }
  }

  return (
    <SiteShell
      title="My Bookings"
      description="Keep track of your upcoming and completed appointments in a clean glass list."
      navHref="/customer"
      navLabel="Customer"
      backHref="/customer"
      accent="fuchsia"
    >
      {bookings.length === 0 ? (
        <Card className="border-slate-200 bg-white/80 text-center shadow-[0_24px_80px_-40px_rgba(15,23,42,0.16)] backdrop-blur-2xl">
          <CardContent className="p-12">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-50 text-cyan-700">
              <CalendarDays className="h-7 w-7" />
            </div>
            <h2 className="display-font text-3xl text-slate-900">
              No bookings yet
            </h2>
            <p className="mt-2 text-slate-600">
              Start by booking your first appointment.
            </p>
            <Button className="mt-6 rounded-full bg-slate-900 text-white hover:bg-slate-800" asChild>
              <Link href="/customer/book">Book now</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card
              key={booking.id}
              className="border-slate-200 bg-white/80 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.16)] backdrop-blur-2xl"
            >
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <CardTitle className="display-font text-2xl text-slate-900">
                      {booking.service}
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      {booking.stylist} • {booking.date} • {booking.time}
                    </CardDescription>
                  </div>
                  <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(booking.status)}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="text-xs uppercase tracking-[0.28em] text-slate-500">
                      Time
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-slate-900">
                      <Clock3 className="h-4 w-4 text-cyan-700" />
                      {booking.time}
                    </div>
                  </div>
                  <div className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="text-xs uppercase tracking-[0.28em] text-slate-500">
                      Stylist
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-slate-900">
                      <MapPin className="h-4 w-4 text-cyan-700" />
                      {booking.stylist}
                    </div>
                  </div>
                  <div className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="text-xs uppercase tracking-[0.28em] text-slate-500">
                      Price
                    </div>
                    <div className="mt-1 text-slate-900">
                      <span className="text-lg font-semibold">${booking.price}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {booking.status === 'confirmed' ? (
                    <>
                      <Button
                        onClick={() => handleReschedule(booking.id)}
                        className="rounded-full bg-slate-900 text-white hover:bg-slate-800"
                      >
                        <RefreshCcw className="h-4 w-4" />
                        Reschedule
                      </Button>
                      <Button
                        onClick={() => handleCancel(booking.id)}
                        variant="outline"
                        className="rounded-full border-slate-300 bg-white text-slate-900 hover:bg-slate-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Cancel
                      </Button>
                    </>
                  ) : null}

                  {booking.status === 'completed' ? (
                    <Button
                      className="rounded-full bg-slate-900 text-white hover:bg-slate-800"
                      asChild
                    >
                      <Link href="/customer/book">Book again</Link>
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </SiteShell>
  )
}
