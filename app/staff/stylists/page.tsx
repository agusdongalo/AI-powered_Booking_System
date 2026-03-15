'use client'

import { useState } from 'react'

interface Stylist {
  id: number
  name: string
  specialty: string
  workingHours: string
  phone: string
}

export default function StylistsPage() {
  const [stylists, setStylists] = useState<Stylist[]>([
    {
      id: 1,
      name: 'Anna',
      specialty: 'Coloring',
      workingHours: '9:00 AM - 5:00 PM',
      phone: '555-0101',
    },
    {
      id: 2,
      name: 'Mike',
      specialty: "Men's haircut",
      workingHours: '9:00 AM - 6:00 PM',
      phone: '555-0102',
    },
    {
      id: 3,
      name: 'Liza',
      specialty: 'Styling',
      workingHours: '10:00 AM - 5:00 PM',
      phone: '555-0103',
    },
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
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Stylists</h1>
        <button
          onClick={handleAddStylist}
          className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition font-semibold"
        >
          + Add Stylist
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-8 border-l-4 border-pink-600">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {editingId ? 'Edit Stylist' : 'Add New Stylist'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-600"
                placeholder="e.g., Anna"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Specialty
              </label>
              <input
                type="text"
                value={formData.specialty}
                onChange={(e) =>
                  setFormData({ ...formData, specialty: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-600"
                placeholder="e.g., Coloring"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Working Hours
              </label>
              <input
                type="text"
                value={formData.workingHours}
                onChange={(e) =>
                  setFormData({ ...formData, workingHours: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-600"
                placeholder="e.g., 9:00 AM - 5:00 PM"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-600"
                placeholder="e.g., 555-0100"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSaveStylist}
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

      {/* Stylists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stylists.map((stylist) => (
          <div key={stylist.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {stylist.name}
                </h2>
                <p className="text-pink-600 font-medium">{stylist.specialty}</p>
              </div>
              <div className="text-3xl">👩‍💼</div>
            </div>
            <div className="space-y-2 text-gray-600 mb-4">
              <p>
                <span className="font-medium">Hours:</span> {stylist.workingHours}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {stylist.phone}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEditStylist(stylist)}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteStylist(stylist.id)}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
