import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/sonner'

export const metadata: Metadata = {
  title: 'Glamour Studio | Premium Booking System',
  description: 'Minimalist salon booking with AI concierge and staff scheduling.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
