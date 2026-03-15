'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Users, Scissors, Clock, ArrowLeft, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Calendar } from './calendar';
import { services, stylists, bookings } from '@/lib/mock-data';

export function StaffDashboard() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const todayBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.startTime);
    return (
      bookingDate.getDate() === selectedDate.getDate() &&
      bookingDate.getMonth() === selectedDate.getMonth() &&
      bookingDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  const getServiceName = (serviceId: string) => {
    return services.find((s) => s.id === serviceId)?.name || 'Unknown';
  };

  const getStylistName = (stylistId: string) => {
    return stylists.find((s) => s.id === stylistId)?.name || 'Unknown';
  };

  const getStylist = (stylistId: string) => {
    return stylists.find((s) => s.id === stylistId);
  };

  const totalRevenue = todayBookings
    .filter((b) => b.status === 'confirmed')
    .reduce((sum, booking) => {
      const service = services.find((s) => s.id === booking.serviceId);
      return sum + (service?.price || 0);
    }, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              asChild
            >
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl mb-1">Staff Dashboard</h1>
              <p className="text-purple-100">Glamour Studio Management</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader className="pb-3">
                <CardDescription className="text-purple-100">Today's Bookings</CardDescription>
                <CardTitle className="text-3xl text-white">{todayBookings.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-purple-100 text-sm">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{format(selectedDate, 'MMMM d, yyyy')}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader className="pb-3">
                <CardDescription className="text-purple-100">Revenue Today</CardDescription>
                <CardTitle className="text-3xl text-white">${totalRevenue}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-purple-100 text-sm">
                  <Scissors className="h-4 w-4" />
                  <span>{todayBookings.filter((b) => b.status === 'confirmed').length} confirmed</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader className="pb-3">
                <CardDescription className="text-purple-100">Active Stylists</CardDescription>
                <CardTitle className="text-3xl text-white">{stylists.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-purple-100 text-sm">
                  <Users className="h-4 w-4" />
                  <span>All available today</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="calendar" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="stylists">Stylists</TabsTrigger>
          </TabsList>

          {/* Calendar View */}
          <TabsContent value="calendar" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar */}
              <Card>
                <CardHeader>
                  <CardTitle>Select Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>

              {/* Bookings List */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Appointments</CardTitle>
                      <CardDescription>
                        {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                      </CardDescription>
                    </div>
                    <Button className="bg-gradient-to-r from-pink-500 to-purple-600">
                      <Plus className="mr-2 h-4 w-4" />
                      New Booking
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {todayBookings.length > 0 ? (
                    <div className="space-y-4">
                      {todayBookings
                        .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
                        .map((booking) => {
                          const stylist = getStylist(booking.stylistId);
                          const service = services.find((s) => s.id === booking.serviceId);
                          
                          return (
                            <div
                              key={booking.id}
                              className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex-shrink-0">
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-purple-600">
                                    {format(booking.startTime, 'HH:mm')}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {service?.duration} min
                                  </div>
                                </div>
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <h4 className="font-semibold">{booking.customerName}</h4>
                                    <p className="text-sm text-gray-600">{booking.customerPhone}</p>
                                  </div>
                                  <span
                                    className={`inline-block px-3 py-1 text-sm rounded-full ${
                                      booking.status === 'confirmed'
                                        ? 'bg-green-100 text-green-800'
                                        : booking.status === 'pending'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'border border-gray-300 text-gray-700'
                                    }`}
                                  >
                                    {booking.status}
                                  </span>
                                </div>
                                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
                                  <div className="flex items-center gap-2">
                                    <Scissors className="h-4 w-4 text-gray-400" />
                                    <span>{getServiceName(booking.serviceId)}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                      <AvatarImage src={stylist?.avatar} />
                                      <AvatarFallback>{stylist?.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <span>{getStylistName(booking.stylistId)}</span>
                                  </div>
                                  <div className="text-purple-600 font-semibold">
                                    ${service?.price}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No appointments scheduled for this date</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Services Management */}
          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Service Management</CardTitle>
                    <CardDescription>Manage salon services, pricing, and duration</CardDescription>
                  </div>
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-600">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Service
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Service</th>
                        <th className="text-left py-3 px-4">Description</th>
                        <th className="text-left py-3 px-4">Duration</th>
                        <th className="text-left py-3 px-4">Price</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map((service) => (
                        <tr key={service.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-semibold">{service.name}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{service.description}</td>
                          <td className="py-3 px-4">{service.duration} min</td>
                          <td className="py-3 px-4 font-semibold text-purple-600">${service.price}</td>
                          <td className="py-3 px-4">
                            <Button variant="ghost" size="sm">Edit</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stylists Management */}
          <TabsContent value="stylists" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Stylist Management</CardTitle>
                    <CardDescription>Manage staff members and their schedules</CardDescription>
                  </div>
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-600">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Stylist
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stylists.map((stylist) => (
                    <Card key={stylist.id}>
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={stylist.avatar} alt={stylist.name} />
                            <AvatarFallback>{stylist.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{stylist.name}</CardTitle>
                            <CardDescription>{stylist.specialty}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>
                            {stylist.workingHours.start} - {stylist.workingHours.end}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">
                            {todayBookings.filter((b) => b.stylistId === stylist.id).length} bookings today
                          </span>
                        </div>
                        <Button variant="outline" className="w-full">
                          View Schedule
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
