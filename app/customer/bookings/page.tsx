'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CalendarDays, Clock3, Loader2, MapPin, RefreshCcw, Trash2 } from 'lucide-react'
import { SiteShell } from '@/components/site-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card'
import { Button } from '@/components/button'
import { toast } from 'sonner'

interface Booking {
  id: string
  customerName: string
  customerPhone: string
  serviceName: string
  stylistName: string
  startTime: string
  status: string
  servicePrice: number
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState('')

  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/bookings')
        if (!response.ok) {
          throw new Error('Failed to load bookings')
        }
        setBookings(await response.json())
      } catch {
        toast.error('Could not load bookings')
      } finally {
        setLoading(false)
      }
    }

    void loadBookings()

    const source = new EventSource('/api/events')
    source.onmessage = () => void loadBookings()
    source.onerror = () => source.close()

    return () => source.close()
  }, [])

  const handleReschedule = async (bookingId: string) => {
    const nextTime = window.prompt('Enter the new date and time (YYYY-MM-DD HH:mm)')
    if (!nextTime) return

    const parsed = new Date(nextTime.replace(' ', 'T').length === 16 ? `${nextTime.replace(' ', 'T')}:00` : nextTime)
    if (Number.isNaN(parsed.getTime())) {
      toast.error('Please enter a valid date and time')
      return
    }

    try {
      const response = await fetch(`/api/bookings/reschedule?id=${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startTime: parsed.toISOString() }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || 'Could not reschedule booking')
      }

      toast.success('Booking rescheduled successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not reschedule booking')
    }
  }

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return

    setCancellingId(bookingId)
    try {
      const response = await fetch(`/api/bookings/cancel?id=${bookingId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || 'Could not cancel booking')
      }

      setBookings((prev) => prev.map((booking) => (booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking)))
      toast.success('Booking cancelled successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not cancel booking')
    } finally {
      setCancellingId('')
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'border-emerald-200 bg-emerald-50 text-emerald-700'
      case 'pending':
        return 'border-amber-200 bg-amber-50 text-amber-700'
      default:
        return 'border-slate-200 bg-slate-100 text-slate-700'
    }
  }

  return (
    <SiteShell
      title="My Bookings"
      description="Keep track of your upcoming and past appointments in a clean glass list."
      navHref="/customer"
      navLabel="Customer"
      backHref="/customer"
      accent="fuchsia"
    >
      {loading ? (
        <Card className="border-slate-200 bg-white/80 text-center shadow-[0_24px_80px_-40px_rgba(15,23,42,0.16)] backdrop-blur-2xl">
          <CardContent className="p-12">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-slate-500" />
          </CardContent>
        </Card>
      ) : bookings.length === 0 ? (
        <Card className="border-slate-200 bg-white/80 text-center shadow-[0_24px_80px_-40px_rgba(15,23,42,0.16)] backdrop-blur-2xl">
          <CardContent className="p-12">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-50 text-cyan-700">
              <CalendarDays className="h-7 w-7" />
            </div>
            <h2 className="display-font text-3xl text-slate-900">No bookings yet</h2>
            <p className="mt-2 text-slate-600">Start by booking your first appointment.</p>
            <Button className="mt-6 rounded-full bg-slate-900 text-white hover:bg-slate-800" asChild>
              <Link href="/customer/book">Book now</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id} className="border-slate-200 bg-white/80 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.16)] backdrop-blur-2xl">
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <CardTitle className="display-font text-2xl text-slate-900">{booking.serviceName}</CardTitle>
                    <CardDescription className="text-slate-600">
                      {booking.stylistName} • {new Date(booking.startTime).toLocaleDateString()} •{' '}
                      {new Date(booking.startTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
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
                    <div className="text-xs uppercase tracking-[0.28em] text-slate-500">Time</div>
                    <div className="mt-1 flex items-center gap-2 text-slate-900">
                      <Clock3 className="h-4 w-4 text-cyan-700" />
                      {new Date(booking.startTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                    </div>
                  </div>
                  <div className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="text-xs uppercase tracking-[0.28em] text-slate-500">Stylist</div>
                    <div className="mt-1 flex items-center gap-2 text-slate-900">
                      <MapPin className="h-4 w-4 text-cyan-700" />
                      {booking.stylistName}
                    </div>
                  </div>
                  <div className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="text-xs uppercase tracking-[0.28em] text-slate-500">Price</div>
                    <div className="mt-1 text-slate-900">
                      <span className="text-lg font-semibold">${booking.servicePrice}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {booking.status === 'confirmed' ? (
                    <>
                      <Button onClick={() => handleReschedule(booking.id)} className="rounded-full bg-slate-900 text-white hover:bg-slate-800">
                        <RefreshCcw className="h-4 w-4" />
                        Reschedule
                      </Button>
                      <Button
                        onClick={() => handleCancel(booking.id)}
                        disabled={cancellingId === booking.id}
                        variant="outline"
                        className="rounded-full border-slate-300 bg-white text-slate-900 hover:bg-slate-50"
                      >
                        {cancellingId === booking.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        Cancel
                      </Button>
                    </>
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
