'use client'

import { useState } from 'react'

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
    {
      id: '1',
      service: 'Haircut',
      stylist: 'Mike',
      date: '2024-03-20',
      time: '2:00 PM',
      status: 'confirmed',
      price: 20,
    },
    {
      id: '2',
      service: 'Hair Color',
      stylist: 'Anna',
      date: '2024-03-25',
      time: '10:00 AM',
      status: 'confirmed',
      price: 80,
    },
    {
      id: '3',
      service: 'Balayage',
      stylist: 'Anna',
      date: '2024-02-28',
      time: '11:00 AM',
      status: 'completed',
      price: 120,
    },
  ])

  const handleReschedule = (bookingId: string) => {
    alert(`Rescheduling booking ${bookingId}... (Feature coming soon)`)
  }

  const handleCancel = (bookingId: string) => {
    if (
      confirm(
        'Are you sure you want to cancel this booking? This action cannot be undone.'
      )
    ) {
      setBookings((prev) =>
        prev.filter((booking) => booking.id !== bookingId)
      )
      alert('Booking cancelled successfully')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-5xl mb-4">📭</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            No bookings yet
          </h2>
          <p className="text-gray-600 mb-6">
            Start by booking your first appointment!
          </p>
          <a
            href="/customer/book"
            className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Book Now
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Booking Details */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    {booking.service}
                  </h2>
                  <div className="space-y-2 text-gray-600">
                    <p>
                      <span className="font-medium">Stylist:</span> {booking.stylist}
                    </p>
                    <p>
                      <span className="font-medium">Date:</span> {booking.date}
                    </p>
                    <p>
                      <span className="font-medium">Time:</span> {booking.time}
                    </p>
                    <p>
                      <span className="font-medium">Price:</span> $
                      {booking.price}
                    </p>
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="flex flex-col justify-between">
                  <div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {booking.status === 'confirmed' && (
                      <>
                        <button
                          onClick={() => handleReschedule(booking.id)}
                          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => handleCancel(booking.id)}
                          className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-semibold"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {booking.status === 'completed' && (
                      <button className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition font-semibold">
                        Book Again
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
