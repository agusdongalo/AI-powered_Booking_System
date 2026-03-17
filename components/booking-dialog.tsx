'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './dialog';
import { Button } from './button';
import { Label } from './label';
import { Input } from './input';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { services, stylists, generateTimeSlots } from '@/lib/mock-data';
import { toast } from 'sonner';

interface BookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedServiceId?: string | null;
}

export function BookingDialog({ isOpen, onClose, preSelectedServiceId }: BookingDialogProps) {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(preSelectedServiceId || '');
  const [selectedStylist, setSelectedStylist] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const service = services.find((s) => s.id === selectedService);
  const stylist = stylists.find((s) => s.id === selectedStylist);
  const availableSlots = selectedDate && selectedStylist && service
    ? generateTimeSlots(selectedDate, selectedStylist, service.duration)
    : [];

  useEffect(() => {
    if (!isOpen) return;

    setStep(1);
    setSelectedService(preSelectedServiceId || '');
    setSelectedStylist('');
    setSelectedDate(undefined);
    setSelectedTime('');
    setCustomerName('');
    setCustomerPhone('');
  }, [isOpen, preSelectedServiceId]);

  const handleConfirmBooking = () => {
    if (!customerName || !customerPhone || !selectedService || !selectedStylist || !selectedDate || !selectedTime) {
      toast.error('Please fill in all fields');
      return;
    }

    // In a real app, this would save to the database
    toast.success('Booking confirmed!', {
      description: `${customerName}, your appointment is set for ${format(selectedDate, 'MMMM d, yyyy')} at ${selectedTime}`,
    });

    // Reset form
    setStep(1);
    setSelectedService('');
    setSelectedStylist('');
    setSelectedDate(undefined);
    setSelectedTime('');
    setCustomerName('');
    setCustomerPhone('');
    onClose();
  };

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Your Appointment</DialogTitle>
          <DialogDescription>
            Step {step} of 4: {
              step === 1 ? 'Select Service' :
              step === 2 ? 'Choose Stylist' :
              step === 3 ? 'Pick Date & Time' :
              'Your Details'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Step 1: Select Service */}
          {step === 1 && (
            <div className="space-y-4">
              <Label>Choose a service</Label>
              <div className="grid grid-cols-1 gap-3">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => {
                      setSelectedService(service.id);
                      setStep(2);
                    }}
                    className={`p-4 border-2 rounded-lg text-left transition-all hover:border-pink-500 ${
                      selectedService === service.id
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">{service.name}</div>
                        <div className="text-sm text-gray-600">{service.description}</div>
                        <div className="text-sm text-gray-500 mt-1">{service.duration} minutes</div>
                      </div>
                      <div className="text-pink-600 font-semibold">${service.price}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Choose Stylist */}
          {step === 2 && (
            <div className="space-y-4">
              <Label>Choose your stylist</Label>
              <div className="grid grid-cols-1 gap-3">
                {stylists.map((stylist) => (
                  <button
                    key={stylist.id}
                    onClick={() => {
                      setSelectedStylist(stylist.id);
                      setStep(3);
                    }}
                    className={`p-4 border-2 rounded-lg text-left transition-all hover:border-pink-500 ${
                      selectedStylist === stylist.id
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={stylist.avatar} alt={stylist.name} />
                        <AvatarFallback>{stylist.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{stylist.name}</div>
                        <div className="text-sm text-gray-600">Specialty: {stylist.specialty}</div>
                        <div className="text-sm text-gray-500">
                          {stylist.workingHours.start} - {stylist.workingHours.end}
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

          {/* Step 3: Pick Date & Time */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <Label>Select date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal mt-2"
                    >
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
                  {availableSlots.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => {
                            setSelectedTime(slot);
                            setStep(4);
                          }}
                          className={`p-3 border-2 rounded-lg text-sm transition-all hover:border-pink-500 ${
                            selectedTime === slot
                              ? 'border-pink-500 bg-pink-50'
                              : 'border-gray-200'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
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

          {/* Step 4: Customer Details */}
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

              <div className="bg-pink-50 p-4 rounded-lg space-y-2">
                <h4 className="font-semibold">Booking Summary</h4>
                <div className="text-sm space-y-1">
                  <div><span className="text-gray-600">Service:</span> {service?.name}</div>
                  <div><span className="text-gray-600">Stylist:</span> {stylist?.name}</div>
                  <div><span className="text-gray-600">Date:</span> {selectedDate && format(selectedDate, 'MMMM d, yyyy')}</div>
                  <div><span className="text-gray-600">Time:</span> {selectedTime}</div>
                  <div><span className="text-gray-600">Duration:</span> {service?.duration} minutes</div>
                  <div className="pt-2 border-t border-pink-200">
                    <span className="text-gray-600">Total:</span> <span className="font-semibold text-pink-600">${service?.price}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(3)} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={handleConfirmBooking}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Confirm Booking
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
