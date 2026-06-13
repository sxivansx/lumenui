'use client'

import { cn } from 'lumenui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { components } from '@/lib/components'

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 overflow-y-auto border-r px-4 py-6 md:block">
      <Link href="/" className="mb-8 block px-2 font-semibold text-lg tracking-tight">
        lumenui
      </Link>
      <nav className="space-y-0.5">
        <p className="px-3 pb-2 font-mono text-muted-foreground text-xs">Components</p>
        {components.map((c) => {
          const href = `/components/${c.slug}`
          const active = pathname === href
          return (
            <Link
              key={c.slug}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'block rounded-full px-3 py-1.5 text-sm transition-colors',
                active
                  ? 'bg-muted font-medium text-foreground'
                  : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
              )}
            >
              {c.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
