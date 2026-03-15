'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-4">Salon Booking</h1>
        <p className="text-xl text-purple-100 mb-12">
          AI-Powered Appointment Management
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Customer Section */}
          <Link href="/customer">
            <div className="bg-white rounded-lg shadow-xl p-8 hover:shadow-2xl transition-shadow cursor-pointer">
              <div className="text-5xl mb-4">👤</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Customer
              </h2>
              <p className="text-gray-600 mb-4">
                Book appointments, chat with AI, manage your bookings
              </p>
              <span className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold">
                Get Started
              </span>
            </div>
          </Link>

          {/* Staff Section */}
          <Link href="/staff">
            <div className="bg-white rounded-lg shadow-xl p-8 hover:shadow-2xl transition-shadow cursor-pointer">
              <div className="text-5xl mb-4">👔</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Staff Dashboard
              </h2>
              <p className="text-gray-600 mb-4">
                Manage schedule, stylists, services, and bookings
              </p>
              <span className="inline-block bg-pink-600 text-white px-6 py-2 rounded-lg font-semibold">
                Dashboard
              </span>
            </div>
          </Link>
        </div>

        <div className="mt-16 text-purple-100">
          <p>v0.1.0 • Powered by Next.js + AI</p>
        </div>
      </div>
    </div>
  )
}
