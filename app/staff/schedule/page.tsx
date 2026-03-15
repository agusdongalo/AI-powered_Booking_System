'use client'

export default function SchedulePage() {
  const stylists = [
    { id: 1, name: 'Anna', specialty: 'Coloring' },
    { id: 2, name: 'Mike', specialty: "Men's haircut" },
    { id: 3, name: 'Liza', specialty: 'Styling' },
  ]

  const timeSlots = ['9:00', '10:00', '11:00', '1:00', '2:00', '3:00', '4:00', '5:00']

  const bookings: { [key: string]: { customer: string; service: string }[] } = {
    'Anna-9:00': [{ customer: 'John', service: 'Haircut' }],
    'Mike-10:00': [{ customer: 'Sarah', service: 'Color' }],
    'Liza-1:00': [{ customer: 'Emma', service: 'Styling' }],
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Daily Schedule</h1>

      {/* Calendar Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Today: March 15, 2024
            </h2>
            <p className="text-gray-600">Friday</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700">
              ← Previous
            </button>
            <button className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700">
              Today
            </button>
            <button className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700">
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 w-20">
                Time
              </th>
              {stylists.map((stylist) => (
                <th
                  key={stylist.id}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-900"
                >
                  <div>{stylist.name}</div>
                  <div className="text-xs text-gray-600 font-normal">
                    {stylist.specialty}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((time, idx) => (
              <tr
                key={idx}
                className={`border-b border-gray-200 ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                  {time}
                </td>
                {stylists.map((stylist) => {
                  const key = `${stylist.name}-${time}`
                  const slot = bookings[key]
                  return (
                    <td
                      key={`${stylist.id}-${time}`}
                      className="px-4 py-4 text-sm"
                    >
                      {slot ? (
                        <div className="bg-green-100 border border-green-300 rounded p-2">
                          <p className="font-semibold text-green-900">
                            {slot[0].customer}
                          </p>
                          <p className="text-xs text-green-700">
                            {slot[0].service}
                          </p>
                        </div>
                      ) : (
                        <button className="w-full h-12 bg-gray-100 hover:bg-pink-50 border border-gray-300 rounded text-gray-400 hover:text-pink-600 transition">
                          +
                        </button>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">Legend</h3>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span className="text-sm text-gray-700">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
            <span className="text-sm text-gray-700">Available</span>
          </div>
        </div>
      </div>
    </div>
  )
}
