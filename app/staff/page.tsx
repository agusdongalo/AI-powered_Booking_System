'use client'

import Link from 'next/link'

export default function StaffDashboard() {
  const stats = [
    { label: 'Today\'s Bookings', value: '12', icon: '📅', color: 'bg-blue-100' },
    { label: 'This Week', value: '58', icon: '📊', color: 'bg-green-100' },
    {
      label: 'Active Stylists',
      value: '3',
      icon: '👩‍💼',
      color: 'bg-purple-100',
    },
    { label: 'Services', value: '4', icon: '✂️', color: 'bg-pink-100' },
  ]

  const upcomingBookings = [
    {
      id: '1',
      customer: 'John Doe',
      service: 'Haircut',
      stylist: 'Mike',
      time: '9:00 AM',
      status: 'confirmed',
    },
    {
      id: '2',
      customer: 'Sarah Smith',
      service: 'Hair Color',
      stylist: 'Anna',
      time: '10:30 AM',
      status: 'confirmed',
    },
    {
      id: '3',
      customer: 'Emma Johnson',
      service: 'Balayage',
      stylist: 'Anna',
      time: '1:00 PM',
      status: 'pending',
    },
  ]

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, idx) => (
          <div key={idx} className={`${stat.color} rounded-lg p-6 shadow`}>
            <div className="text-4xl mb-2">{stat.icon}</div>
            <p className="text-gray-600 text-sm">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
        <Link href="/staff/schedule">
          <div className="bg-blue-600 text-white rounded-lg p-6 cursor-pointer hover:bg-blue-700 transition">
            <div className="text-3xl mb-2">📆</div>
            <h3 className="font-semibold">View Schedule</h3>
            <p className="text-sm text-blue-100">Daily calendar view</p>
          </div>
        </Link>
        <Link href="/staff/services">
          <div className="bg-green-600 text-white rounded-lg p-6 cursor-pointer hover:bg-green-700 transition">
            <div className="text-3xl mb-2">✂️</div>
            <h3 className="font-semibold">Services</h3>
            <p className="text-sm text-green-100">Manage services</p>
          </div>
        </Link>
        <Link href="/staff/stylists">
          <div className="bg-purple-600 text-white rounded-lg p-6 cursor-pointer hover:bg-purple-700 transition">
            <div className="text-3xl mb-2">👩‍💼</div>
            <h3 className="font-semibold">Stylists</h3>
            <p className="text-sm text-purple-100">Manage stylists</p>
          </div>
        </Link>
        <div className="bg-pink-600 text-white rounded-lg p-6 cursor-pointer hover:bg-pink-700 transition">
          <div className="text-3xl mb-2">👥</div>
          <h3 className="font-semibold">Customers</h3>
          <p className="text-sm text-pink-100">Manage customers</p>
        </div>
      </div>

      {/* Upcoming Bookings */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Today's Bookings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Stylist
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {upcomingBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-200">
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {booking.time}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {booking.customer}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {booking.service}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {booking.stylist}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button className="text-pink-600 hover:text-pink-700 font-semibold">
                      Confirm
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
