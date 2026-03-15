import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/sonner'

export const metadata: Metadata = {
  title: 'Salon Booking + AI Assistant',
  description: 'Book your salon appointment with AI assistance',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
