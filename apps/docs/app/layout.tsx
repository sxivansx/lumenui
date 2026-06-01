import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { Sidebar } from '@/components/sidebar'
import { ThemeToggle } from '@/components/theme-toggle'
import './global.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: { default: 'lumenui', template: '%s · lumenui' },
  description: 'Accessible, themeable React UI components built on Radix UI and Tailwind CSS v4.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>
          <div className="mx-auto flex w-full max-w-screen-2xl">
            <Sidebar />
            <div className="flex min-w-0 flex-1 flex-col">
              <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/80 px-6 backdrop-blur">
                <Link href="/" className="font-semibold tracking-tight md:hidden">
                  lumenui
                </Link>
                <div className="hidden md:block" />
                <ThemeToggle />
              </header>
              <main className="min-w-0 flex-1 px-6 py-10">
                <div className="mx-auto w-full max-w-3xl">{children}</div>
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
