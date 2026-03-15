import Link from 'next/link'

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-purple-600">
                💇 Salon Booking
              </span>
            </Link>
            <div className="flex gap-6">
              <Link
                href="/customer"
                className="text-gray-700 hover:text-purple-600 transition"
              >
                Home
              </Link>
              <Link
                href="/customer/book"
                className="text-gray-700 hover:text-purple-600 transition"
              >
                Book
              </Link>
              <Link
                href="/customer/chat"
                className="text-gray-700 hover:text-purple-600 transition"
              >
                Chat
              </Link>
              <Link
                href="/customer/bookings"
                className="text-gray-700 hover:text-purple-600 transition"
              >
                My Bookings
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
