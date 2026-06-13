'use client'

import { Moon, Star, Sun } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import * as React from 'react'
import { FALLBACK_STARS, formatStars, GITHUB_URL } from '@/lib/site'

function IconButton({
  children,
  label,
  href,
  highlighted,
  onClick,
}: {
  children: React.ReactNode
  label: string
  href?: string
  highlighted?: boolean
  onClick?: () => void
}) {
  const className = `inline-flex h-9 items-center justify-center gap-2 rounded-md border px-2.5 font-mono text-sm transition-colors ${
    highlighted
      ? 'border-accent-brand/70 bg-accent-brand/10 text-white'
      : 'border-white/15 text-white/70 hover:border-white/30 hover:text-white'
  }`
  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" aria-label={label} className={className}>
        {children}
      </a>
    )
  }
  return (
    <button type="button" aria-label={label} onClick={onClick} className={className}>
      {children}
    </button>
  )
}

export function Hero({ stars }: { stars?: number | null }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  const isDark = !mounted || resolvedTheme === 'dark'

  return (
    <section className="relative isolate flex min-h-[92vh] flex-col overflow-hidden border-white/10 border-b bg-black text-white">
      {/* Backdrop: dashed ruled grid masked to fade at the edges + radial vignette. */}
      <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `
              linear-gradient(to right, var(--primary) 1px, transparent 1px),
              linear-gradient(to bottom, var(--primary) 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
            maskImage: `
              repeating-linear-gradient(to right, black 0px, black 3px, transparent 3px, transparent 8px),
              repeating-linear-gradient(to bottom, black 0px, black 3px, transparent 3px, transparent 8px),
              radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)`,
            WebkitMaskImage: `
              repeating-linear-gradient(to right, black 0px, black 3px, transparent 3px, transparent 8px),
              repeating-linear-gradient(to bottom, black 0px, black 3px, transparent 3px, transparent 8px),
              radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)`,
            maskComposite: 'intersect',
            WebkitMaskComposite: 'source-in',
          }}
        />
      </div>

      {/* Top nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 md:px-10">
        <Link href="/" className="font-mono font-semibold text-lg tracking-tight">
          lumenui
        </Link>
        <div className="flex items-center gap-2">
          <IconButton label="GitHub stars" href={GITHUB_URL} highlighted>
            <Star className="size-4" />
            <span>{formatStars(stars ?? FALLBACK_STARS)}</span>
          </IconButton>
          <IconButton label="Toggle theme" onClick={() => setTheme(isDark ? 'light' : 'dark')}>
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </IconButton>
        </div>
      </nav>

      {/* Hero content */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="text-balance font-semibold text-5xl leading-[1.0] tracking-[-0.03em] md:text-6xl">
          Build stunning
          <br />
          interfaces in minutes
        </h1>
        <p className="mt-8 max-w-md text-pretty text-lg text-white/60 leading-relaxed">
          An accessible, themeable React component library for modern web apps. And it&apos;s all
          yours.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/components/button"
            className="inline-flex h-12 items-center rounded-md bg-accent-brand px-8 font-medium text-sm text-white transition-colors hover:bg-accent-brand-deep md:h-14"
          >
            Browse Components
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-md border border-white/20 px-8 font-medium text-sm text-white transition-colors hover:border-white/40 md:h-14"
          >
            Star On Github
            <Star className="size-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
