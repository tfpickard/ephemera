import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ephemera - Where Nothing Lasts Forever',
  description: 'A platform for truly temporary digital experiences. Share moments that fade, evolve, and disappear.',
  keywords: ['ephemeral', 'temporary', 'digital art', 'impermanence', 'mindfulness'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
