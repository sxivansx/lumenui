import Link from 'next/link'
import { ComponentGrid } from '@/components/component-grid'
import { Hero } from '@/components/hero'
import { LogoStrip } from '@/components/logo-strip'
import { getStarCount } from '@/lib/site'

export default async function HomePage() {
  const stars = await getStarCount()

  return (
    // Force dark tokens for the whole landing so library previews render on-brand.
    <div className="dark min-h-screen bg-black">
      <Hero stars={stars} />
      <LogoStrip />
      <ComponentGrid />

      <section className="bg-black px-6 pb-28">
        <div className="mx-auto max-w-screen-xl space-y-4">
          <p className="font-mono text-sm text-white/40">Install</p>
          <pre className="overflow-x-auto rounded-lg border border-white/10 bg-white/[0.03] p-5 font-mono text-sm text-white/90">
            <code>bun add @shivansh.life/lumenui</code>
          </pre>
          <p className="text-sm text-white/50">
            Import the stylesheet once, then use any component.{' '}
            <Link
              href="/components/button"
              className="text-white underline-offset-4 hover:underline"
            >
              Read the docs →
            </Link>
          </p>
        </div>
      </section>

      <footer className="border-white/10 border-t bg-black px-6 py-10">
        <div className="mx-auto flex max-w-screen-xl flex-col items-center justify-between gap-4 sm:flex-row">
          <span className="font-mono text-sm text-white/40">lumenui · MIT</span>
          <span className="font-mono text-sm text-white/40">
            Built on Radix UI + Tailwind CSS v4
          </span>
        </div>
      </footer>
    </div>
  )
}
