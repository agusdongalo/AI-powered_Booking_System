'use client'

import { useState } from 'react'

const services = [
  { id: 1, name: 'Haircut', duration: 45, price: 20 },
  { id: 2, name: 'Hair Color', duration: 90, price: 80 },
  { id: 3, name: 'Balayage', duration: 120, price: 120 },
  { id: 4, name: 'Hair Treatment', duration: 60, price: 50 },
]

const stylists = [
  { id: 1, name: 'Anna', specialty: 'Coloring' },
  { id: 2, name: 'Mike', specialty: "Men's haircut" },
  { id: 3, name: 'Liza', specialty: 'Styling' },
]

const timeSlots = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
]

export default function BookingPage() {
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState<number | null>(null)
  const [selectedStylist, setSelectedStylist] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(
      `Booking confirmed!\nService: ${selectedService}\nStylist: ${selectedStylist}\nDate: ${selectedDate}\nTime: ${selectedTime}`
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Book Your Appointment</h1>

      {/* Progress Bar */}
      <div className="mb-8 flex justify-between items-center">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= s
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              {s}
            </div>
            {s < 5 && (
              <div
                className={`w-16 h-1 ${
                  step > s ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Select Service */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Step 1: Select Service
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => {
                  setSelectedService(service.id)
                  setStep(2)
                }}
                className={`p-4 rounded-lg border-2 text-left transition ${
                  selectedService === service.id
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 bg-white hover:border-purple-300'
                }`}
              >
                <h3 className="font-semibold text-gray-800">{service.name}</h3>
                <p className="text-sm text-gray-600">
                  {service.duration} min • ${service.price}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Select Stylist */}
      {step === 2 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Step 2: Choose Stylist
          </h2>
          <div className="space-y-3">
            {stylists.map((stylist) => (
              <button
                key={stylist.id}
                onClick={() => {
                  setSelectedStylist(stylist.id)
                  setStep(3)
                }}
                className={`w-full p-4 rounded-lg border-2 text-left transition ${
                  selectedStylist === stylist.id
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 bg-white hover:border-purple-300'
                }`}
              >
                <h3 className="font-semibold text-gray-800">{stylist.name}</h3>
                <p className="text-sm text-gray-600">{stylist.specialty}</p>
              </button>
            ))}
          </div>
          <button
            onClick={() => setStep(1)}
            className="mt-4 text-purple-600 hover:text-purple-700"
          >
            ← Back
          </button>
        </div>
      )}

      {/* Step 3: Select Date & Time */}
      {step === 3 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Step 3: Select Date & Time
          </h2>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Available Times
            </label>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => {
                    setSelectedTime(time)
                    setStep(4)
                  }}
                  className={`p-2 rounded-lg border-2 text-sm transition ${
                    selectedTime === time
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 bg-white hover:border-purple-300'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => setStep(2)}
            className="text-purple-600 hover:text-purple-700"
          >
            ← Back
          </button>
        </div>
      )}

      {/* Step 4: Customer Details */}
      {step === 4 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Step 4: Your Details
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                placeholder="john@example.com"
              />
            </div>
          </div>
          <button
            onClick={() => setStep(3)}
            className="mt-4 text-purple-600 hover:text-purple-700"
          >
            ← Back
          </button>
        </div>
      )}

      {/* Step 5: Review & Confirm */}
      {step === 5 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Step 5: Confirm Booking
          </h2>
          <div className="bg-gray-50 rounded-lg p-6 space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Service:</span>
              <span className="font-semibold">
                {services.find((s) => s.id === selectedService)?.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Stylist:</span>
              <span className="font-semibold">
                {stylists.find((s) => s.id === selectedStylist)?.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date & Time:</span>
              <span className="font-semibold">
                {selectedDate} at {selectedTime}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-semibold">{customerName}</span>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition mb-2"
          >
            Confirm Booking
          </button>
          <button
            onClick={() => setStep(4)}
            className="w-full text-purple-600 hover:text-purple-700 py-2"
          >
            ← Back
          </button>
        </div>
      )}

      {/* Next Button for Steps 1-4 */}
      {step < 5 && step > 1 && (
        <button
          onClick={() => setStep(step + 1)}
          className="mt-6 w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
        >
          Next
        </button>
      )}
    </div>
  )
}
