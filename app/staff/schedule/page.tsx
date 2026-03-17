'use client'

import { CalendarDays, Clock3, Plus } from 'lucide-react'
import { SiteShell } from '@/components/site-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card'
import { Button } from '@/components/button'

export default function SchedulePage() {
  const stylists = [
    { id: 1, name: 'Anna', specialty: 'Coloring' },
    { id: 2, name: 'Mike', specialty: "Men's haircut" },
    { id: 3, name: 'Liza', specialty: 'Styling' },
  ]

  const timeSlots = ['9:00', '10:00', '11:00', '1:00', '2:00', '3:00', '4:00', '5:00']

  const bookings: { [key: string]: { customer: string; service: string }[] } = {
    'Anna-9:00': [{ customer: 'John', service: 'Haircut' }],
    'Mike-10:00': [{ customer: 'Sarah', service: 'Color' }],
    'Liza-1:00': [{ customer: 'Emma', service: 'Styling' }],
  }

  return (
    <SiteShell
      title="Daily Schedule"
      description="A clean, grid-based view of today’s appointments."
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
                <CardTitle className="display-font text-3xl text-slate-900">
                  Today: March 15, 2024
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Friday
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button className="rounded-full bg-slate-900 text-white hover:bg-slate-800">
                  Previous
                </Button>
                <Button variant="outline" className="rounded-full border-slate-300 bg-white text-slate-900 hover:bg-slate-50">
                  Today
                </Button>
                <Button className="rounded-full bg-slate-900 text-white hover:bg-slate-800">
                  Next
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="overflow-x-auto rounded-[28px] border border-slate-200 bg-white/80 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.16)] backdrop-blur-2xl">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="w-24 px-4 py-3 text-left text-sm font-semibold text-slate-900">
                  Time
                </th>
                {stylists.map((stylist) => (
                  <th key={stylist.id} className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                    <div>{stylist.name}</div>
                    <div className="text-xs font-normal text-slate-500">{stylist.specialty}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((time, idx) => (
                <tr key={idx} className="border-b border-slate-100">
                  <td className="px-4 py-4 text-sm font-semibold text-slate-900">{time}</td>
                  {stylists.map((stylist) => {
                    const key = `${stylist.name}-${time}`
                    const slot = bookings[key]
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
        </div>

        <Card className="border-slate-200 bg-white/80 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.16)] backdrop-blur-2xl">
          <CardHeader>
            <CardTitle className="display-font text-2xl text-slate-900">
              Legend
            </CardTitle>
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
