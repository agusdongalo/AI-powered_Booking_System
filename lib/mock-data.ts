export interface Service {
  id: string;
  name: string;
  duration: number; // in minutes
  price: number;
  description: string;
}

export interface Stylist {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  workingHours: {
    start: string;
    end: string;
  };
}

export interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  serviceId: string;
  stylistId: string;
  startTime: Date;
  endTime: Date;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export const services: Service[] = [
  {
    id: '1',
    name: 'Haircut',
    duration: 45,
    price: 20,
    description: 'Professional haircut with wash and style',
  },
  {
    id: '2',
    name: 'Balayage',
    duration: 120,
    price: 120,
    description: 'Hand-painted highlights for a natural, sun-kissed look',
  },
  {
    id: '3',
    name: 'Hair Color',
    duration: 90,
    price: 80,
    description: 'Full color treatment with professional products',
  },
  {
    id: '4',
    name: 'Hair Treatment',
    duration: 30,
    price: 35,
    description: 'Deep conditioning treatment for healthy, shiny hair',
  },
  {
    id: '5',
    name: 'Blowout',
    duration: 30,
    price: 40,
    description: 'Professional styling and blowdry',
  },
  {
    id: '6',
    name: 'Highlights',
    duration: 100,
    price: 95,
    description: 'Classic foil highlights',
  },
];

export const stylists: Stylist[] = [
  {
    id: '1',
    name: 'Anna',
    specialty: 'Coloring',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    workingHours: {
      start: '09:00',
      end: '18:00',
    },
  },
  {
    id: '2',
    name: 'Mike',
    specialty: "Men's Haircut",
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    workingHours: {
      start: '10:00',
      end: '19:00',
    },
  },
  {
    id: '3',
    name: 'Liza',
    specialty: 'Styling',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    workingHours: {
      start: '09:00',
      end: '17:00',
    },
  },
];

// Generate sample bookings for today and tomorrow
const today = new Date();
today.setHours(0, 0, 0, 0);

export const bookings: Booking[] = [
  {
    id: '1',
    customerName: 'Sarah Johnson',
    customerPhone: '555-0101',
    serviceId: '1',
    stylistId: '2',
    startTime: new Date(today.getTime() + 10 * 60 * 60 * 1000), // 10 AM
    endTime: new Date(today.getTime() + 10.75 * 60 * 60 * 1000), // 10:45 AM
    status: 'confirmed',
  },
  {
    id: '2',
    customerName: 'Emily Davis',
    customerPhone: '555-0102',
    serviceId: '2',
    stylistId: '1',
    startTime: new Date(today.getTime() + 11 * 60 * 60 * 1000), // 11 AM
    endTime: new Date(today.getTime() + 13 * 60 * 60 * 1000), // 1 PM
    status: 'confirmed',
  },
  {
    id: '3',
    customerName: 'Michael Brown',
    customerPhone: '555-0103',
    serviceId: '5',
    stylistId: '3',
    startTime: new Date(today.getTime() + 14 * 60 * 60 * 1000), // 2 PM
    endTime: new Date(today.getTime() + 14.5 * 60 * 60 * 1000), // 2:30 PM
    status: 'confirmed',
  },
  {
    id: '4',
    customerName: 'Jessica White',
    customerPhone: '555-0104',
    serviceId: '3',
    stylistId: '1',
    startTime: new Date(today.getTime() + 15 * 60 * 60 * 1000), // 3 PM
    endTime: new Date(today.getTime() + 16.5 * 60 * 60 * 1000), // 4:30 PM
    status: 'confirmed',
  },
];

// Helper function to generate available time slots
export function generateTimeSlots(
  date: Date,
  stylistId: string,
  serviceDuration: number
): string[] {
  const slots: string[] = [];
  const stylist = stylists.find((s) => s.id === stylistId);
  if (!stylist) return slots;

  const [startHour, startMinute] = stylist.workingHours.start.split(':').map(Number);
  const [endHour, endMinute] = stylist.workingHours.end.split(':').map(Number);

  const dayStart = new Date(date);
  dayStart.setHours(startHour, startMinute, 0, 0);

  const dayEnd = new Date(date);
  dayEnd.setHours(endHour, endMinute, 0, 0);

  // Generate slots every 30 minutes
  let currentTime = new Date(dayStart);
  while (currentTime.getTime() + serviceDuration * 60 * 1000 <= dayEnd.getTime()) {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    // Check if slot is available (not booked)
    const isBooked = bookings.some((booking) => {
      if (booking.stylistId !== stylistId) return false;
      if (booking.status === 'cancelled') return false;

      const slotStart = new Date(date);
      slotStart.setHours(hours, minutes, 0, 0);
      const slotEnd = new Date(slotStart.getTime() + serviceDuration * 60 * 1000);

      return (
        (slotStart >= booking.startTime && slotStart < booking.endTime) ||
        (slotEnd > booking.startTime && slotEnd <= booking.endTime) ||
        (slotStart <= booking.startTime && slotEnd >= booking.endTime)
      );
    });

    if (!isBooked) {
      slots.push(timeString);
    }

    currentTime = new Date(currentTime.getTime() + 30 * 60 * 1000);
  }

  return slots;
}
