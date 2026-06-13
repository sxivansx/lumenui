import type { ReactNode } from 'react'
import { Sidebar } from '@/components/sidebar'
import { ThemeToggle } from '@/components/theme-toggle'
import { GITHUB_URL } from '@/lib/site'

export default function ComponentsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-screen-2xl">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-end gap-4 border-b bg-background/80 px-6 backdrop-blur">
          <nav className="flex items-center gap-1">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-full px-3 py-1.5 text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-foreground"
            >
              GitHub
            </a>
            <a
              href="https://www.npmjs.com/package/lumenui"
              target="_blank"
              rel="noreferrer"
              className="rounded-full px-3 py-1.5 text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-foreground"
            >
              npm
            </a>
            <ThemeToggle />
          </nav>
        </header>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}
