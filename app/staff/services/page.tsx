'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { SiteShell } from '@/components/site-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card'
import { Button } from '@/components/button'
import { toast } from 'sonner'

interface Service {
  id: string
  name: string
  duration: number
  price: number
  description: string
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    duration: '',
    price: '',
    description: '',
  })

  useEffect(() => {
    const loadServices = async () => {
      setLoading(true)

      try {
        const response = await fetch('/api/services')
        if (!response.ok) throw new Error('Failed to load services')
        setServices(await response.json())
      } catch {
        toast.error('Could not load services')
      } finally {
        setLoading(false)
      }
    }

    void loadServices()
  }, [])

  const handleAddService = () => {
    setEditingId(null)
    setFormData({ name: '', duration: '', price: '', description: '' })
    setShowForm(true)
  }

  const handleEditService = (service: Service) => {
    setEditingId(service.id)
    setFormData({
      name: service.name,
      duration: service.duration.toString(),
      price: service.price.toString(),
      description: service.description,
    })
    setShowForm(true)
  }

  const handleSaveService = async () => {
    setSaving(true)

    try {
      const response = await fetch(
        editingId ? `/api/services?id=${editingId}` : '/api/services',
        {
          method: editingId ? 'PATCH' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      )

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || 'Could not save service')
      }

      const saved = await response.json()

      setServices((prev) =>
        editingId
          ? prev.map((service) => (service.id === editingId ? saved : service))
          : [...prev, saved]
      )
      setShowForm(false)
      toast.success('Service saved')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not save service')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return

    try {
      const response = await fetch(`/api/services?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || 'Could not delete service')
      }

      setServices((prev) => prev.filter((service) => service.id !== id))
      toast.success('Service deleted')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not delete service')
    }
  }

  return (
    <SiteShell
      title="Service Management"
      description="Update treatment pricing, duration, and descriptions from a glass control panel."
      navHref="/staff"
      navLabel="Staff"
      backHref="/staff"
      accent="fuchsia"
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="display-font text-3xl text-slate-900">Services</h2>
          <Button onClick={handleAddService} className="rounded-full bg-slate-900 text-white hover:bg-slate-800">
            + Add service
          </Button>
        </div>

        {showForm ? (
          <Card className="border-slate-200 bg-white/80 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.16)] backdrop-blur-2xl">
            <CardHeader>
              <CardTitle className="display-font text-2xl text-slate-900">
                {editingId ? 'Edit service' : 'Add new service'}
              </CardTitle>
              <CardDescription className="text-slate-600">
                Keep the booking menu current.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {(['name', 'duration', 'price', 'description'] as const).map((field) => (
                <div key={field} className="space-y-2">
                  <label className="block text-sm font-medium capitalize text-slate-700">
                    {field}
                  </label>
                  <input
                    type={field === 'duration' || field === 'price' ? 'number' : 'text'}
                    value={formData[field]}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                    className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-slate-900 outline-none focus:border-cyan-500"
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-2 md:col-span-2">
                <Button onClick={handleSaveService} disabled={saving} className="rounded-full bg-slate-900 text-white hover:bg-slate-800">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
                </Button>
                <Button variant="outline" onClick={() => setShowForm(false)} className="rounded-full border-slate-300 bg-white text-slate-900 hover:bg-slate-50">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <Card className="border-slate-200 bg-white/80 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.16)] backdrop-blur-2xl">
          <CardContent className="overflow-x-auto p-0">
            {loading ? (
              <div className="flex items-center gap-2 p-6 text-slate-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading services...
              </div>
            ) : (
              <table className="w-full">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    {['Service', 'Duration', 'Price', 'Description', 'Action'].map((header) => (
                      <th key={header} className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service.id} className="border-b border-slate-100">
                      <td className="px-6 py-4 font-semibold text-slate-900">{service.name}</td>
                      <td className="px-6 py-4 text-slate-600">{service.duration} min</td>
                      <td className="px-6 py-4 text-slate-900">${service.price}</td>
                      <td className="px-6 py-4 text-slate-600">{service.description}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => handleEditService(service)} className="rounded-full border-slate-300 bg-white text-slate-900 hover:bg-slate-50">
                            Edit
                          </Button>
                          <Button variant="outline" onClick={() => handleDeleteService(service.id)} className="rounded-full border-red-200 bg-white text-red-700 hover:bg-red-50">
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </SiteShell>
  )
}
