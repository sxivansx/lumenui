'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { components } from '@/lib/components'

/** Landing showcase — every component as a bordered blueprint cell. */
export function ComponentGrid() {
  return (
    <section className="bg-black px-6 py-24">
      <div className="mx-auto max-w-screen-xl">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div className="space-y-3">
            <p className="font-mono text-sm text-white/40">Components</p>
            <h2 className="font-semibold text-3xl text-white tracking-[-0.03em] md:text-4xl">
              Everything you need to ship.
            </h2>
          </div>
          <span className="hidden font-mono text-sm text-white/40 sm:block">
            {components.length} components
          </span>
        </div>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-3 lg:grid-cols-4">
          {components.map((c, i) => (
            <motion.div
              key={c.slug}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: (i % 12) * 0.05 }}
              viewport={{ once: true }}
              className="flex flex-col bg-black"
            >
              <Link
                href={`/components/${c.slug}`}
                className="group flex min-h-32 flex-1 flex-col justify-between p-5 transition-colors hover:bg-white/[0.04]"
              >
                <span className="font-mono text-white/30 text-xs transition-colors group-hover:text-white/50">
                  {`{ ${c.name.replace(/\s/g, '')} }`}
                </span>
                <span className="font-medium text-base text-white">{c.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
