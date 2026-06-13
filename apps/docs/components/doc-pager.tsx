import { ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'

type PagerLink = { slug: string; name: string }

export function DocPager({ prev, next }: { prev?: PagerLink; next?: PagerLink }) {
  return (
    <nav className="mt-12 flex items-center justify-between gap-4 border-t pt-6">
      {prev ? (
        <Link
          href={`/components/${prev.slug}`}
          className="group flex flex-col gap-1 rounded-md border px-4 py-3 transition-colors hover:bg-muted/50"
        >
          <span className="flex items-center gap-1 font-mono text-muted-foreground text-xs">
            <ArrowLeft className="size-3" /> Previous
          </span>
          <span className="font-medium text-sm">{prev.name}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={`/components/${next.slug}`}
          className="group flex flex-col items-end gap-1 rounded-md border px-4 py-3 text-right transition-colors hover:bg-muted/50"
        >
          <span className="flex items-center gap-1 font-mono text-muted-foreground text-xs">
            Next <ArrowRight className="size-3" />
          </span>
          <span className="font-medium text-sm">{next.name}</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  )
}
