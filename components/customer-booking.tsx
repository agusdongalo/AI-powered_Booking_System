'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Scissors, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { services, stylists } from '@/lib/mock-data';
import { BookingDialog } from './booking-dialog';

export function CustomerBooking() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const handleBookService = (serviceId: string) => {
    setSelectedService(serviceId);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-pink-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl mb-4">Glamour Studio</h1>
            <p className="text-xl sm:text-2xl mb-8 text-pink-100">
              Your beauty, our passion
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-purple-600 hover:bg-pink-50"
                onClick={() => {
                  document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Calendar className="mr-2 h-5 w-5" />
                Book Appointment
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <Link href="/chat">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Chat with AI Assistant
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="rgb(254, 242, 242)"
            />
          </svg>
        </div>
      </div>

      {/* Services Section */}
      <div id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl mb-4">Our Services</h2>
          <p className="text-gray-600 text-lg">
            Choose from our range of professional hair services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 mb-2">
                      <Scissors className="h-5 w-5 text-pink-500" />
                      {service.name}
                    </CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{service.duration} min</span>
                    </div>
                    <div className="text-2xl text-pink-600">
                      ${service.price}
                    </div>
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                    onClick={() => handleBookService(service.id)}
                  >
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Stylists Section */}
      <div className="bg-pink-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl mb-4">Meet Our Stylists</h2>
            <p className="text-gray-600 text-lg">
              Experienced professionals dedicated to your beauty
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stylists.map((stylist) => (
              <Card key={stylist.id} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <Avatar className="h-24 w-24 border-4 border-pink-200">
                      <AvatarImage src={stylist.avatar} alt={stylist.name} />
                      <AvatarFallback>{stylist.name[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle>{stylist.name}</CardTitle>
                  <CardDescription>
                    <span className="inline-block mt-2 px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full">
                      {stylist.specialty}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        {stylist.workingHours.start} - {stylist.workingHours.end}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl mb-4">Why Choose Glamour Studio?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-100 mb-4">
              <Calendar className="h-8 w-8 text-pink-600" />
            </div>
            <h3 className="text-xl mb-2">Easy Booking</h3>
            <p className="text-gray-600">
              Book appointments instantly online or chat with our AI assistant
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
              <Scissors className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl mb-2">Expert Stylists</h3>
            <p className="text-gray-600">
              Highly trained professionals with years of experience
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-100 mb-4">
              <MessageCircle className="h-8 w-8 text-pink-600" />
            </div>
            <h3 className="text-xl mb-2">24/7 AI Support</h3>
            <p className="text-gray-600">
              Get instant answers to your questions anytime
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            (c) 2026 Glamour Studio. All rights reserved.
          </p>
          <div className="mt-4 space-x-4">
            <Link href="/staff" className="text-gray-400 hover:text-white transition">
              Staff Login
            </Link>
          </div>
        </div>
      </footer>

      <BookingDialog
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preSelectedServiceId={selectedService}
      />
    </div>
  );
}
