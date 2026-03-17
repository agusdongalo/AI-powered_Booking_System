'use client'

import { useState } from 'react'
import { SiteShell } from '@/components/site-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card'
import { Button } from '@/components/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/avatar'

interface Stylist {
  id: number
  name: string
  specialty: string
  workingHours: string
  phone: string
}

export default function StylistsPage() {
  const [stylists, setStylists] = useState<Stylist[]>([
    { id: 1, name: 'Anna', specialty: 'Coloring', workingHours: '9:00 AM - 5:00 PM', phone: '555-0101' },
    { id: 2, name: 'Mike', specialty: "Men's haircut", workingHours: '9:00 AM - 6:00 PM', phone: '555-0102' },
    { id: 3, name: 'Liza', specialty: 'Styling', workingHours: '10:00 AM - 5:00 PM', phone: '555-0103' },
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    workingHours: '',
    phone: '',
  })

  const handleAddStylist = () => {
    setEditingId(null)
    setFormData({ name: '', specialty: '', workingHours: '', phone: '' })
    setShowForm(true)
  }

  const handleEditStylist = (stylist: Stylist) => {
    setEditingId(stylist.id)
    setFormData({
      name: stylist.name,
      specialty: stylist.specialty,
      workingHours: stylist.workingHours,
      phone: stylist.phone,
    })
    setShowForm(true)
  }

  const handleSaveStylist = () => {
    if (editingId) {
      setStylists((prev) =>
        prev.map((s) =>
          s.id === editingId
            ? {
                ...s,
                name: formData.name,
                specialty: formData.specialty,
                workingHours: formData.workingHours,
                phone: formData.phone,
              }
            : s
        )
      )
    } else {
      const newStylist: Stylist = {
        id: Math.max(...stylists.map((s) => s.id), 0) + 1,
        name: formData.name,
        specialty: formData.specialty,
        workingHours: formData.workingHours,
        phone: formData.phone,
      }
      setStylists((prev) => [...prev, newStylist])
    }
    setShowForm(false)
  }

  const handleDeleteStylist = (id: number) => {
    if (confirm('Are you sure you want to delete this stylist?')) {
      setStylists((prev) => prev.filter((s) => s.id !== id))
    }
  }

  return (
    <SiteShell
      title="Stylist Management"
      description="Update stylist profiles, specialty, and working hours."
      navHref="/staff"
      navLabel="Staff"
      backHref="/staff"
      accent="fuchsia"
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="display-font text-3xl text-slate-900">Stylists</h2>
          <Button onClick={handleAddStylist} className="rounded-full bg-slate-900 text-white hover:bg-slate-800">
            + Add stylist
          </Button>
        </div>

        {showForm ? (
          <Card className="border-slate-200 bg-white/80 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.16)] backdrop-blur-2xl">
            <CardHeader>
              <CardTitle className="display-font text-2xl text-slate-900">
                {editingId ? 'Edit stylist' : 'Add new stylist'}
              </CardTitle>
              <CardDescription className="text-slate-600">
                Keep your team profile up to date.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {(['name', 'specialty', 'workingHours', 'phone'] as const).map((field) => (
                <div key={field} className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 capitalize">
                    {field}
                  </label>
                  <input
                    type="text"
                    value={formData[field]}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                    className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-slate-900 outline-none focus:border-cyan-500"
                  />
                </div>
              ))}
              <div className="md:col-span-2 flex gap-3 pt-2">
                <Button onClick={handleSaveStylist} className="rounded-full bg-slate-900 text-white hover:bg-slate-800">
                  Save
                </Button>
                <Button variant="outline" onClick={() => setShowForm(false)} className="rounded-full border-slate-300 bg-white text-slate-900 hover:bg-slate-50">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {stylists.map((stylist) => (
            <Card
              key={stylist.id}
              className="border-slate-200 bg-white/80 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.16)] backdrop-blur-2xl"
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border border-slate-200">
                    <AvatarImage src={`https://i.pravatar.cc/150?img=${stylist.id}`} alt={stylist.name} />
                    <AvatarFallback>{stylist.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="display-font text-2xl text-slate-900">
                      {stylist.name}
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      {stylist.specialty}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  <div className="font-medium text-slate-900">Working hours</div>
                  {stylist.workingHours}
                </div>
                <div className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  <div className="font-medium text-slate-900">Phone</div>
                  {stylist.phone}
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleEditStylist(stylist)} className="flex-1 rounded-full bg-slate-900 text-white hover:bg-slate-800">
                    Edit
                  </Button>
                  <Button onClick={() => handleDeleteStylist(stylist.id)} variant="outline" className="flex-1 rounded-full border-red-200 bg-white text-red-700 hover:bg-red-50">
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </SiteShell>
  )
}
