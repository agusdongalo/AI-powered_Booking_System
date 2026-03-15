import Link from 'next/link'

export default function StaffLayout({
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
              <span className="text-2xl font-bold text-pink-600">
                👔 Staff Dashboard
              </span>
            </Link>
            <div className="flex gap-6">
              <Link
                href="/staff"
                className="text-gray-700 hover:text-pink-600 transition"
              >
                Overview
              </Link>
              <Link
                href="/staff/schedule"
                className="text-gray-700 hover:text-pink-600 transition"
              >
                Schedule
              </Link>
              <Link
                href="/staff/services"
                className="text-gray-700 hover:text-pink-600 transition"
              >
                Services
              </Link>
              <Link
                href="/staff/stylists"
                className="text-gray-700 hover:text-pink-600 transition"
              >
                Stylists
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
