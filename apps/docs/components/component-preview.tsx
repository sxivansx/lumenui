'use client'

import { cn } from 'lumenui'
import * as React from 'react'
import { Index } from '@/__registry__'
import { CopyButton } from './copy-button'

const TABS = ['preview', 'code'] as const
type Tab = (typeof TABS)[number]

export function ComponentPreview({ name }: { name: string }) {
  const [tab, setTab] = React.useState<Tab>('preview')
  const entry = Index[name]

  if (!entry) {
    return (
      <p className="my-6 rounded-md border border-destructive/50 p-4 text-sm text-destructive">
        Unknown example: <code>{name}</code>
      </p>
    )
  }

  const Demo = entry.component

  return (
    <div className="my-6 overflow-hidden rounded-xl border">
      <div className="flex items-center gap-1 border-b bg-muted/40 px-2">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              'border-transparent border-b-2 px-3 py-2 text-sm font-medium capitalize transition-colors',
              tab === t
                ? 'border-foreground text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'preview' ? (
        <div className="flex min-h-[220px] items-center justify-center p-10">
          <React.Suspense
            fallback={<span className="text-sm text-muted-foreground">Loading…</span>}
          >
            <Demo />
          </React.Suspense>
        </div>
      ) : (
        <div className="relative">
          <CopyButton value={entry.source} className="absolute top-3 right-3 z-10" />
          <div
            className="[&_pre]:!m-0 [&_pre]:!rounded-none [&_pre]:!border-0"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted build-time Shiki output, never user input
            dangerouslySetInnerHTML={{ __html: entry.html }}
          />
        </div>
      )}
    </div>
  )
}
