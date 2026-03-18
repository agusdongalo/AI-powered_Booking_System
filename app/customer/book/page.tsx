'use client'

import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, CheckCircle2, Clock3, Loader2, Sparkles, UserRound } from 'lucide-react'
import { SiteShell } from '@/components/site-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card'
import { Button } from '@/components/button'
import { toast } from 'sonner'

interface Service {
  id: string
  name: string
  duration: number
  price: number
  description: string
}

interface Stylist {
  id: string
  name: string
  specialty: string
  avatar: string
  workingHours: {
    start: string
    end: string
  }
}

function toDateTime(date: string, time: string) {
  return new Date(`${date}T${time.length === 5 ? `${time}:00` : time}`)
}

export default function BookingPage() {
  const [step, setStep] = useState(1)
  const [services, setServices] = useState<Service[]>([])
  const [stylists, setStylists] = useState<Stylist[]>([])
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [selectedService, setSelectedService] = useState<string>('')
  const [selectedStylist, setSelectedStylist] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')

  const currentService = useMemo(
    () => services.find((service) => service.id === selectedService),
    [services, selectedService]
  )
  const currentStylist = useMemo(
    () => stylists.find((stylist) => stylist.id === selectedStylist),
    [stylists, selectedStylist]
  )

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true)

      try {
        const [servicesResponse, stylistsResponse] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/stylists'),
        ])

        if (!servicesResponse.ok || !stylistsResponse.ok) {
          throw new Error('Failed to load booking data')
        }

        const servicesData = await servicesResponse.json()
        const stylistsData = await stylistsResponse.json()

        setServices(servicesData)
        setStylists(stylistsData)
      } catch {
        toast.error('Could not load booking options')
      } finally {
        setLoading(false)
      }
    }

    void loadInitialData()
  }, [])

  useEffect(() => {
    if (!selectedDate || !selectedStylist || !currentService) {
      setAvailableSlots([])
      return
    }

    const controller = new AbortController()

    const loadAvailability = async () => {
      setLoadingSlots(true)

      try {
        const response = await fetch(
          `/api/availability/check?date=${selectedDate}&stylistId=${selectedStylist}&duration=${currentService.duration}`,
          { signal: controller.signal }
        )

        if (!response.ok) {
          throw new Error('Failed to load availability')
        }

        const data = await response.json()
        setAvailableSlots(data.slots || [])
      } catch {
        if (!controller.signal.aborted) {
          setAvailableSlots([])
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingSlots(false)
        }
      }
    }

    void loadAvailability()

    return () => controller.abort()
  }, [selectedDate, selectedStylist, currentService])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentService || !currentStylist || !selectedDate || !selectedTime) {
      toast.error('Please complete the booking details')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerEmail,
          serviceId: currentService.id,
          stylistId: currentStylist.id,
          startTime: toDateTime(selectedDate, selectedTime).toISOString(),
          status: 'confirmed',
        }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || 'Booking failed')
      }

      toast.success('Booking confirmed')
      setStep(1)
      setSelectedService('')
      setSelectedStylist('')
      setSelectedDate('')
      setSelectedTime('')
      setCustomerName('')
      setCustomerPhone('')
      setCustomerEmail('')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Booking failed')
    } finally {
      setSubmitting(false)
    }
  }

  const stepTitles = ['Service', 'Stylist', 'Date & Time', 'Details', 'Confirm']

  return (
    <SiteShell
      title="Book Your Appointment"
      description="Choose a service, pick a stylist, and lock in a time in a streamlined glass booking flow."
      navHref="/customer"
      navLabel="Customer"
      backHref="/customer"
      accent="cyan"
    >
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-slate-200 bg-white/80 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.16)] backdrop-blur-2xl">
          <CardHeader>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm text-cyan-800">
              <Sparkles className="h-4 w-4" />
              Booking progress
            </div>
            <CardTitle className="display-font text-3xl text-slate-900">
              Step {step} of 5
            </CardTitle>
            <CardDescription className="text-slate-600">{stepTitles[step - 1]}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {stepTitles.map((label, index) => {
                const active = step >= index + 1
                return (
                  <div
                    key={label}
                    className={`rounded-full px-4 py-2 text-sm font-medium ${
                      active
                        ? 'bg-slate-900 text-white'
                        : 'border border-slate-200 bg-white text-slate-500'
                    }`}
                  >
                    {index + 1}. {label}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white/80 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.16)] backdrop-blur-2xl">
          <CardHeader>
            <CardTitle className="display-font text-3xl text-slate-900">
              {step === 1 && 'Select a service'}
              {step === 2 && 'Choose your stylist'}
              {step === 3 && 'Pick date & time'}
              {step === 4 && 'Your details'}
              {step === 5 && 'Confirm booking'}
            </CardTitle>
            <CardDescription className="text-slate-600">
              {step === 1 && 'Start by selecting the treatment you want.'}
              {step === 2 && 'Choose the stylist that matches your preference.'}
              {step === 3 && 'Pick the date and an available time slot.'}
              {step === 4 && 'Enter your contact details for the appointment.'}
              {step === 5 && 'Review everything before you submit.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {loading ? (
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading booking options...
              </div>
            ) : null}

            {step === 1 && (
              <div className="grid gap-4 md:grid-cols-2">
                {services.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => {
                      setSelectedService(service.id)
                      setStep(2)
                    }}
                    className={`rounded-[24px] border p-4 text-left transition ${
                      selectedService === service.id
                        ? 'border-cyan-200 bg-cyan-50'
                        : 'border-slate-200 bg-white hover:border-cyan-200 hover:bg-slate-50'
                    }`}
                  >
                    <h3 className="font-semibold text-slate-900">{service.name}</h3>
                    <p className="mt-1 text-sm text-slate-600">{service.description}</p>
                    <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                      <span>{service.duration} min</span>
                      <span className="font-semibold text-slate-900">${service.price}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                {stylists.map((stylist) => (
                  <button
                    key={stylist.id}
                    type="button"
                    onClick={() => {
                      setSelectedStylist(stylist.id)
                      setStep(3)
                    }}
                    className={`flex w-full items-center justify-between rounded-[24px] border p-4 text-left transition ${
                      selectedStylist === stylist.id
                        ? 'border-cyan-200 bg-cyan-50'
                        : 'border-slate-200 bg-white hover:border-cyan-200 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{stylist.name}</p>
                      <p className="text-sm text-slate-600">{stylist.specialty}</p>
                    </div>
                    <UserRound className="h-5 w-5 text-cyan-700" />
                  </button>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-slate-900 outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Available times
                    </label>
                    {loadingSlots ? (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                        Loading times...
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {availableSlots.map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => {
                              setSelectedTime(time)
                              setStep(4)
                            }}
                            className={`rounded-2xl border px-3 py-2 text-sm transition ${
                              selectedTime === time
                                ? 'border-cyan-200 bg-cyan-50 text-cyan-800'
                                : 'border-slate-200 bg-white text-slate-700 hover:border-cyan-200 hover:bg-slate-50'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="rounded-full border-slate-300 bg-white text-slate-900 hover:bg-slate-50"
                >
                  Back
                </Button>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-slate-900 outline-none focus:border-cyan-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-slate-900 outline-none focus:border-cyan-500"
                    placeholder="09xx xxx xxxx"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-slate-900 outline-none focus:border-cyan-500"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep(3)}
                    className="flex-1 rounded-full border-slate-300 bg-white text-slate-900 hover:bg-slate-50"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep(5)}
                    className="flex-1 rounded-full bg-slate-900 text-white hover:bg-slate-800"
                  >
                    Review
                  </Button>
                </div>
              </div>
            )}

            {step === 5 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                  <div className="space-y-2 text-sm text-slate-700">
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">Service</span>
                      <span className="font-medium text-slate-900">{currentService?.name}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">Stylist</span>
                      <span className="font-medium text-slate-900">{currentStylist?.name}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">Date</span>
                      <span className="font-medium text-slate-900">{selectedDate || 'Not selected'}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">Time</span>
                      <span className="font-medium text-slate-900">{selectedTime || 'Not selected'}</span>
                    </div>
                    <div className="flex justify-between gap-4 border-t border-slate-200 pt-3">
                      <span className="text-slate-500">Total</span>
                      <span className="text-lg font-semibold text-slate-900">
                        ${currentService?.price}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep(4)}
                    className="flex-1 rounded-full border-slate-300 bg-white text-slate-900 hover:bg-slate-50"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 rounded-full bg-slate-900 text-white hover:bg-slate-800"
                  >
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    Confirm booking
                  </Button>
                </div>
              </form>
            )}

            <div className="flex items-center gap-2 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-800">
              <CalendarDays className="h-4 w-4" />
              Selected service:
              <span className="font-semibold text-slate-900">
                {currentService?.name || 'None yet'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </SiteShell>
  )
}

