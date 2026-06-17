'use client'

import { cn } from '@shivansh.life/lumenui'
import * as React from 'react'

export type TocItem = { id: string; title: string }

/** "On This Page" right rail with scroll-spy active highlighting. */
export function Toc({ items }: { items: TocItem[] }) {
  const [active, setActive] = React.useState(items[0]?.id)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: '0px 0px -70% 0px', threshold: 0 },
    )
    for (const item of items) {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [items])

  if (items.length === 0) return null

  return (
    <aside className="sticky top-20 hidden h-fit w-56 shrink-0 xl:block">
      <p className="mb-3 font-mono text-muted-foreground text-xs">On this page</p>
      <ul className="space-y-2 border-l">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                '-ml-px block border-l-2 pl-4 text-sm transition-colors',
                active === item.id
                  ? 'border-accent-brand text-accent-brand'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  )
}
