'use client'

import { Check, Copy } from 'lucide-react'
import { cn } from 'lumenui'
import * as React from 'react'

/** Copies a markdown rendering of the page — mirrors the "Copy Page" affordance. */
export function CopyPageButton({ markdown }: { markdown: string }) {
  const [copied, setCopied] = React.useState(false)

  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard.writeText(markdown)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
      className={cn(
        'inline-flex h-8 items-center gap-2 rounded-md border bg-background px-3 text-muted-foreground text-sm transition-colors hover:text-foreground',
      )}
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {copied ? 'Copied' : 'Copy Page'}
    </button>
  )
}
