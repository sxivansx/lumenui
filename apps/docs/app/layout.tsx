import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './global.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: { default: 'lumenui', template: '%s · lumenui' },
  description: 'Accessible, themeable React UI components built on Radix UI and Tailwind CSS v4.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
