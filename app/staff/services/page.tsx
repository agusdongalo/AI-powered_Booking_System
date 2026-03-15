'use client'

import { useState } from 'react'

interface Service {
  id: number
  name: string
  duration: number
  price: number
  description: string
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([
    {
      id: 1,
      name: 'Haircut',
      duration: 45,
      price: 20,
      description: 'Standard haircut and styling',
    },
    {
      id: 2,
      name: 'Hair Color',
      duration: 90,
      price: 80,
      description: 'Full hair coloring service',
    },
    {
      id: 3,
      name: 'Balayage',
      duration: 120,
      price: 120,
      description: 'Balayage highlighting technique',
    },
    {
      id: 4,
      name: 'Hair Treatment',
      duration: 60,
      price: 50,
      description: 'Deep conditioning and treatment',
    },
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
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Services</h1>
        <button
          onClick={handleAddService}
          className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition font-semibold"
        >
          + Add Service
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-8 border-l-4 border-pink-600">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {editingId ? 'Edit Service' : 'Add New Service'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Service Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-600"
                placeholder="e.g., Hair Color"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-600"
                placeholder="e.g., 90"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Price ($)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-600"
                placeholder="e.g., 80"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-600"
                placeholder="Brief description"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSaveService}
              className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition font-semibold"
            >
              Save
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Services Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Service
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Price
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Description
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id} className="border-b border-gray-200">
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  {service.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {service.duration} min
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  ${service.price}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {service.description}
                </td>
                <td className="px-6 py-4 text-sm flex gap-2">
                  <button
                    onClick={() => handleEditService(service)}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteService(service.id)}
                    className="text-red-600 hover:text-red-700 font-semibold"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
