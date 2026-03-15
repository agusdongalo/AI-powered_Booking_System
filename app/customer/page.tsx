'use client'

import Link from 'next/link'

export default function CustomerHome() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Welcome to Your Salon
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Book */}
        <Link href="/customer/book">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
            <div className="text-4xl mb-4">📅</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Quick Book
            </h2>
            <p className="text-gray-600">
              Book an appointment for your favorite service
            </p>
          </div>
        </Link>

        {/* Chat with AI */}
        <Link href="/customer/chat">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
            <div className="text-4xl mb-4">🤖</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Chat with AI
            </h2>
            <p className="text-gray-600">
              Ask about services, availability, and pricing
            </p>
          </div>
        </Link>

        {/* My Bookings */}
        <Link href="/customer/bookings">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
            <div className="text-4xl mb-4">📋</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              My Bookings
            </h2>
            <p className="text-gray-600">
              View, reschedule, or cancel your appointments
            </p>
          </div>
        </Link>
      </div>

      {/* Featured Services */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Our Popular Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Haircut', duration: '45 min', price: '$20' },
            { name: 'Hair Color', duration: '1.5 hr', price: '$80' },
            { name: 'Balayage', duration: '2 hr', price: '$120' },
            { name: 'Hair Treatment', duration: '1 hr', price: '$50' },
          ].map((service) => (
            <div
              key={service.name}
              className="bg-purple-50 rounded-lg p-4 border border-purple-200"
            >
              <h3 className="font-semibold text-gray-800">{service.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{service.duration}</p>
              <p className="text-lg font-bold text-purple-600 mt-2">
                {service.price}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
