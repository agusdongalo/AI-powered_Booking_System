'use client'

import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, Loader2, Plus } from 'lucide-react'
import { SiteShell } from '@/components/site-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card'
import { Button } from '@/components/button'
import { toast } from 'sonner'

interface Stylist {
  id: string
  name: string
  specialty: string
}

interface Booking {
  id: string
  customerName: string
  serviceName: string
  stylistId: string
  stylistName: string
  startTime: string
  status: string
}

export default function SchedulePage() {
  const [stylists, setStylists] = useState<Stylist[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSchedule = async () => {
      setLoading(true)
      try {
        const [stylistsResponse, bookingsResponse] = await Promise.all([
          fetch('/api/stylists'),
          fetch('/api/bookings'),
        ])

        if (!stylistsResponse.ok || !bookingsResponse.ok) {
          throw new Error('Failed to load schedule')
        }

        setStylists(await stylistsResponse.json())
        setBookings(await bookingsResponse.json())
      } catch {
        toast.error('Could not load schedule')
      } finally {
        setLoading(false)
      }
    }

    void loadSchedule()
  }, [])

  const todayLabel = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const timeSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00']

  const bookingsBySlot = useMemo(() => {
    const map: Record<string, { customer: string; service: string }[]> = {}
    bookings.forEach((booking) => {
      const slot = `${booking.stylistName}-${new Date(booking.startTime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })}`
      map[slot] = map[slot] || []
      map[slot].push({ customer: booking.customerName, service: booking.serviceName })
    })
    return map
  }, [bookings])

  return (
    <SiteShell
      title="Daily Schedule"
      description="A clean, grid-based view of today's appointments."
      navHref="/staff"
      navLabel="Staff"
      backHref="/staff"
      accent="fuchsia"
    >
      <div className="space-y-6">
        <Card className="border-slate-200 bg-white/80 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.16)] backdrop-blur-2xl">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <CardTitle className="display-font text-3xl text-slate-900">Today: {todayLabel}</CardTitle>
                <CardDescription className="text-slate-600">Live staff schedule</CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button className="rounded-full bg-slate-900 text-white hover:bg-slate-800">Previous</Button>
                <Button variant="outline" className="rounded-full border-slate-300 bg-white text-slate-900 hover:bg-slate-50">
                  Today
                </Button>
                <Button className="rounded-full bg-slate-900 text-white hover:bg-slate-800">Next</Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="overflow-x-auto rounded-[28px] border border-slate-200 bg-white/80 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.16)] backdrop-blur-2xl">
          {loading ? (
            <div className="flex items-center gap-2 p-6 text-slate-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading schedule...
            </div>
          ) : (
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="w-24 px-4 py-3 text-left text-sm font-semibold text-slate-900">Time</th>
                  {stylists.map((stylist) => (
                    <th key={stylist.id} className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                      <div>{stylist.name}</div>
                      <div className="text-xs font-normal text-slate-500">{stylist.specialty}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((time) => (
                  <tr key={time} className="border-b border-slate-100">
                    <td className="px-4 py-4 text-sm font-semibold text-slate-900">{time}</td>
                    {stylists.map((stylist) => {
                      const slot = bookingsBySlot[`${stylist.name}-${time}`]
                      return (
                        <td key={`${stylist.id}-${time}`} className="px-4 py-4 text-sm">
                          {slot ? (
                            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3">
                              <p className="font-semibold text-emerald-800">{slot[0].customer}</p>
                              <p className="text-xs text-emerald-700">{slot[0].service}</p>
                            </div>
                          ) : (
                            <button className="flex h-12 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-400 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700">
                              <Plus className="h-4 w-4" />
                            </button>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <Card className="border-slate-200 bg-white/80 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.16)] backdrop-blur-2xl">
          <CardHeader>
            <CardTitle className="display-font text-2xl text-slate-900">Legend</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-6 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded border border-emerald-200 bg-emerald-50" />
              Booked
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded border border-slate-200 bg-white" />
              Available
            </div>
          </CardContent>
        </Card>
      </div>
    </SiteShell>
  )
}
