'use client'

import { cn } from '@shivansh.life/lumenui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { components } from '@/lib/components'

function NavLink({ slug, name, active }: { slug: string; name: string; active: boolean }) {
  return (
    <Link
      href={`/components/${slug}`}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'block rounded-full px-3 py-1.5 text-sm transition-colors',
        active
          ? 'bg-muted font-medium text-foreground'
          : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
      )}
    >
      {name}
    </Link>
  )
}

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 overflow-y-auto border-r px-4 py-6 md:block">
      <Link href="/" className="mb-8 block px-2 font-semibold text-lg tracking-tight">
        lumenui
      </Link>
      <nav className="space-y-0.5">
        <p className="px-3 pb-2 font-mono text-muted-foreground text-xs">Components</p>
        {components
          .filter((c) => !c.parent)
          .map((c) => {
            const children = components.filter((child) => child.parent === c.slug)
            return (
              <div key={c.slug}>
                <NavLink
                  slug={c.slug}
                  name={c.name}
                  active={pathname === `/components/${c.slug}`}
                />
                {children.length > 0 && (
                  <div className="mt-0.5 ml-3 space-y-0.5 border-border/60 border-l pl-2">
                    {children.map((child) => (
                      <NavLink
                        key={child.slug}
                        slug={child.slug}
                        name={child.name}
                        active={pathname === `/components/${child.slug}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
      </nav>
    </aside>
  )
}
