'use client'

import { useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Check, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './dialog'
import { Button } from './button'
import { Label } from './label'
import { Input } from './input'
import { Calendar } from './calendar'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'
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

interface BookingDialogProps {
  isOpen: boolean
  onClose: () => void
  preSelectedServiceId?: string | null
}

function toDateTime(date: Date, time: string) {
  const [hours, minutes] = time.split(':').map(Number)
  const result = new Date(date)
  result.setHours(hours, minutes, 0, 0)
  return result
}

function toLocalDateTimeString(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}:00`
}

function toLocalDateString(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function BookingDialog({
  isOpen,
  onClose,
  preSelectedServiceId,
}: BookingDialogProps) {
  const [step, setStep] = useState(1)
  const [services, setServices] = useState<Service[]>([])
  const [stylists, setStylists] = useState<Stylist[]>([])
  const [selectedService, setSelectedService] = useState(preSelectedServiceId || '')
  const [selectedStylist, setSelectedStylist] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState('')
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(false)
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const service = useMemo(
    () => services.find((item) => item.id === selectedService),
    [services, selectedService]
  )
  const stylist = useMemo(
    () => stylists.find((item) => item.id === selectedStylist),
    [stylists, selectedStylist]
  )

  useEffect(() => {
    if (!isOpen) return

    const loadCatalog = async () => {
      setIsLoadingCatalog(true)

      try {
        const [servicesResponse, stylistsResponse] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/stylists'),
        ])

        if (!servicesResponse.ok || !stylistsResponse.ok) {
          throw new Error('Failed to load booking data')
        }

        setServices(await servicesResponse.json())
        setStylists(await stylistsResponse.json())
      } catch {
        toast.error('Could not load booking options')
      } finally {
        setIsLoadingCatalog(false)
      }
    }

    setStep(1)
    setSelectedService(preSelectedServiceId || '')
    setSelectedStylist('')
    setSelectedDate(undefined)
    setSelectedTime('')
    setAvailableSlots([])
    setCustomerName('')
    setCustomerPhone('')
    setCustomerEmail('')

    void loadCatalog()
  }, [isOpen, preSelectedServiceId])

  useEffect(() => {
    if (!selectedDate || !selectedStylist || !service) {
      setAvailableSlots([])
      return
    }

    const controller = new AbortController()

    const loadAvailability = async () => {
      setIsLoadingSlots(true)

      try {
        const response = await fetch(
          `/api/availability/check?date=${toLocalDateString(selectedDate)}&stylistId=${selectedStylist}&duration=${service.duration}`,
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
          setIsLoadingSlots(false)
        }
      }
    }

    void loadAvailability()

    return () => controller.abort()
  }, [selectedDate, selectedStylist, service])

  const handleConfirmBooking = async () => {
    if (
      !customerName ||
      !customerPhone ||
      !selectedService ||
      !selectedStylist ||
      !selectedDate ||
      !selectedTime
    ) {
      toast.error('Please fill in all fields')
      return
    }

    setIsSubmitting(true)

    try {
      const bookingStart = toDateTime(selectedDate, selectedTime)
      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerEmail,
          serviceId: selectedService,
          stylistId: selectedStylist,
          startTime: toLocalDateTimeString(bookingStart),
          status: 'confirmed',
        }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || 'Booking could not be created')
      }

      toast.success('Booking confirmed!', {
        description: `${customerName}, your appointment is set for ${format(selectedDate, 'MMMM d, yyyy')} at ${selectedTime}`,
      })

      setStep(1)
      setSelectedService('')
      setSelectedStylist('')
      setSelectedDate(undefined)
      setSelectedTime('')
      setCustomerName('')
      setCustomerPhone('')
      setCustomerEmail('')
      onClose()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Booking failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setStep(1)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-slate-200 bg-white/95 text-slate-900 backdrop-blur-2xl">
        <DialogHeader>
          <DialogTitle>Book Your Appointment</DialogTitle>
          <DialogDescription>
            Step {step} of 4: {step === 1 ? 'Select Service' : step === 2 ? 'Choose Stylist' : step === 3 ? 'Pick Date & Time' : 'Your Details'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {isLoadingCatalog ? (
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading booking options...
            </div>
          ) : null}

          {step === 1 && (
            <div className="space-y-4">
              <Label>Choose a service</Label>
              <div className="grid grid-cols-1 gap-3">
                {services.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedService(item.id)
                      setStep(2)
                    }}
                    className={`rounded-[20px] border-2 p-4 text-left transition-all hover:border-cyan-300 ${
                      selectedService === item.id ? 'border-cyan-400 bg-cyan-50' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-semibold">{item.name}</div>
                        <div className="text-sm text-slate-600">{item.description}</div>
                        <div className="mt-1 text-sm text-slate-500">{item.duration} minutes</div>
                      </div>
                      <div className="font-semibold text-cyan-700">${item.price}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Label>Choose your stylist</Label>
              <div className="grid grid-cols-1 gap-3">
                {stylists.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedStylist(item.id)
                      setStep(3)
                    }}
                    className={`rounded-[20px] border-2 p-4 text-left transition-all hover:border-cyan-300 ${
                      selectedStylist === item.id ? 'border-cyan-400 bg-cyan-50' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={item.avatar} alt={item.name} />
                        <AvatarFallback>{item.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{item.name}</div>
                        <div className="text-sm text-slate-600">Specialty: {item.specialty}</div>
                        <div className="text-sm text-slate-500">
                          {item.workingHours.start} - {item.workingHours.end}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <Label>Select date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="mt-2 w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date() || date < new Date('1900-01-01')}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {selectedDate && (
                <div>
                  <Label>Select time</Label>
                  {isLoadingSlots ? (
                    <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading available times...
                    </div>
                  ) : availableSlots.length > 0 ? (
                    <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => {
                            setSelectedTime(slot)
                            setStep(4)
                          }}
                          className={`rounded-2xl border-2 p-3 text-sm transition-all hover:border-cyan-300 ${
                            selectedTime === slot ? 'border-cyan-400 bg-cyan-50' : 'border-slate-200'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-slate-500">
                      No available slots for this date. Please choose another date.
                    </div>
                  )}
                </div>
              )}

              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your name"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="mt-2"
                />
              </div>

              <div className="space-y-2 rounded-lg border border-cyan-100 bg-cyan-50 p-4">
                <h4 className="font-semibold">Booking Summary</h4>
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="text-slate-600">Service:</span> {service?.name}
                  </div>
                  <div>
                    <span className="text-slate-600">Stylist:</span> {stylist?.name}
                  </div>
                  <div>
                    <span className="text-slate-600">Date:</span>{' '}
                    {selectedDate && format(selectedDate, 'MMMM d, yyyy')}
                  </div>
                  <div>
                    <span className="text-slate-600">Time:</span> {selectedTime}
                  </div>
                  <div>
                    <span className="text-slate-600">Duration:</span> {service?.duration} minutes
                  </div>
                  <div className="border-t border-cyan-200 pt-2">
                    <span className="text-slate-600">Total:</span>{' '}
                    <span className="font-semibold text-cyan-700">${service?.price}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(3)} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={handleConfirmBooking}
                  disabled={isSubmitting}
                  className="flex-1 bg-slate-900 text-white hover:bg-slate-800"
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="mr-2 h-4 w-4" />
                  )}
                  Confirm Booking
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

