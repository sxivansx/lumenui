import Link from 'next/link'
import { components } from '@/lib/components'

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 overflow-y-auto border-r px-4 py-6 md:block">
      <Link href="/" className="mb-6 block px-2 font-semibold text-lg tracking-tight">
        lumenui
      </Link>
      <nav className="space-y-1">
        <p className="px-2 py-1 font-medium text-muted-foreground text-xs uppercase tracking-wider">
          Components
        </p>
        {components.map((c) => (
          <Link
            key={c.slug}
            href={`/components/${c.slug}`}
            className="block rounded-md px-2 py-1.5 text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-foreground"
          >
            {c.name}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
