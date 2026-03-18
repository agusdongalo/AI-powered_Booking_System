'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { SiteShell } from '@/components/site-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card'
import { Button } from '@/components/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/avatar'
import { toast } from 'sonner'

interface Stylist {
  id: string
  name: string
  specialty: string
  avatar: string
  workingHours: {
    start: string
    end: string
  }
}

export default function StylistsPage() {
  const [stylists, setStylists] = useState<Stylist[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    start: '',
    end: '',
    avatar: '',
  })

  useEffect(() => {
    const loadStylists = async () => {
      setLoading(true)

      try {
        const response = await fetch('/api/stylists')
        if (!response.ok) throw new Error('Failed to load stylists')
        setStylists(await response.json())
      } catch {
        toast.error('Could not load stylists')
      } finally {
        setLoading(false)
      }
    }

    void loadStylists()
  }, [])

  const handleAddStylist = () => {
    setEditingId(null)
    setFormData({ name: '', specialty: '', start: '', end: '', avatar: '' })
    setShowForm(true)
  }

  const handleEditStylist = (stylist: Stylist) => {
    setEditingId(stylist.id)
    setFormData({
      name: stylist.name,
      specialty: stylist.specialty,
      start: stylist.workingHours.start,
      end: stylist.workingHours.end,
      avatar: stylist.avatar,
    })
    setShowForm(true)
  }

  const handleSaveStylist = async () => {
    setSaving(true)

    try {
      const response = await fetch(
        editingId ? `/api/stylists?id=${editingId}` : '/api/stylists',
        {
          method: editingId ? 'PATCH' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            specialty: formData.specialty,
            avatar: formData.avatar,
            workingHours: {
              start: formData.start,
              end: formData.end,
            },
          }),
        }
      )

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || 'Could not save stylist')
      }

      const saved = await response.json()
      setStylists((prev) =>
        editingId
          ? prev.map((stylist) => (stylist.id === editingId ? saved : stylist))
          : [...prev, saved]
      )
      setShowForm(false)
      toast.success('Stylist saved')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not save stylist')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteStylist = async (id: string) => {
    if (!confirm('Are you sure you want to delete this stylist?')) return

    try {
      const response = await fetch(`/api/stylists?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || 'Could not delete stylist')
      }

      setStylists((prev) => prev.filter((stylist) => stylist.id !== id))
      toast.success('Stylist deleted')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not delete stylist')
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
              {(['name', 'specialty', 'start', 'end', 'avatar'] as const).map((field) => (
                <div key={field} className="space-y-2">
                  <label className="block text-sm font-medium capitalize text-slate-700">
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
              <div className="flex gap-3 pt-2 md:col-span-2">
                <Button onClick={handleSaveStylist} disabled={saving} className="rounded-full bg-slate-900 text-white hover:bg-slate-800">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
                </Button>
                <Button variant="outline" onClick={() => setShowForm(false)} className="rounded-full border-slate-300 bg-white text-slate-900 hover:bg-slate-50">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <Card className="border-slate-200 bg-white/80 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.16)] backdrop-blur-2xl md:col-span-2 xl:col-span-3">
              <CardContent className="flex items-center gap-2 p-6 text-slate-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading stylists...
              </CardContent>
            </Card>
          ) : (
            stylists.map((stylist) => (
              <Card
                key={stylist.id}
                className="border-slate-200 bg-white/80 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.16)] backdrop-blur-2xl"
              >
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border border-slate-200">
                      <AvatarImage src={stylist.avatar} alt={stylist.name} />
                      <AvatarFallback>{stylist.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="display-font text-2xl text-slate-900">
                        {stylist.name}
                      </CardTitle>
                      <CardDescription className="text-slate-600">{stylist.specialty}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    <div className="font-medium text-slate-900">Working hours</div>
                    {stylist.workingHours.start} - {stylist.workingHours.end}
                  </div>
                  <div className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    <div className="font-medium text-slate-900">Avatar</div>
                    <span className="break-all">{stylist.avatar}</span>
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
            ))
          )}
        </div>
      </div>
    </SiteShell>
  )
}
