'use client'

import { useState } from 'react'
import { SiteShell } from '@/components/site-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card'
import { Button } from '@/components/button'

interface Service {
  id: number
  name: string
  duration: number
  price: number
  description: string
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([
    { id: 1, name: 'Haircut', duration: 45, price: 20, description: 'Standard haircut and styling' },
    { id: 2, name: 'Hair Color', duration: 90, price: 80, description: 'Full hair coloring service' },
    { id: 3, name: 'Balayage', duration: 120, price: 120, description: 'Balayage highlighting technique' },
    { id: 4, name: 'Hair Treatment', duration: 60, price: 50, description: 'Deep conditioning and treatment' },
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    duration: '',
    price: '',
    description: '',
  })

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

  const handleSaveService = () => {
    if (editingId) {
      setServices((prev) =>
        prev.map((s) =>
          s.id === editingId
            ? {
                ...s,
                name: formData.name,
                duration: parseInt(formData.duration),
                price: parseInt(formData.price),
                description: formData.description,
              }
            : s
        )
      )
    } else {
      const newService: Service = {
        id: Math.max(...services.map((s) => s.id), 0) + 1,
        name: formData.name,
        duration: parseInt(formData.duration),
        price: parseInt(formData.price),
        description: formData.description,
      }
      setServices((prev) => [...prev, newService])
    }
    setShowForm(false)
  }

  const handleDeleteService = (id: number) => {
    if (confirm('Are you sure you want to delete this service?')) {
      setServices((prev) => prev.filter((s) => s.id !== id))
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
                  <label className="block text-sm font-medium text-slate-700 capitalize">
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
              <div className="md:col-span-2 flex gap-3 pt-2">
                <Button onClick={handleSaveService} className="rounded-full bg-slate-900 text-white hover:bg-slate-800">
                  Save
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
          </CardContent>
        </Card>
      </div>
    </SiteShell>
  )
}
