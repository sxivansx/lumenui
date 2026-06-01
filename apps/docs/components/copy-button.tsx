'use client'

import { Check, Copy } from 'lucide-react'
import { cn } from 'lumenui'
import * as React from 'react'

export function CopyButton({ value, className }: { value: string; className?: string }) {
  const [copied, setCopied] = React.useState(false)

  return (
    <button
      type="button"
      aria-label={copied ? 'Copied' : 'Copy code'}
      onClick={() => {
        void navigator.clipboard.writeText(value)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
      className={cn(
        'inline-flex size-8 items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors hover:text-foreground',
        className,
      )}
    >
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
    </button>
  )
}
