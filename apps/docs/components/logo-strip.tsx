'use client'

import { motion } from 'framer-motion'
import {
  type SimpleIcon,
  siNextdotjs,
  siRadixui,
  siReact,
  siTailwindcss,
  siTypescript,
} from 'simple-icons'

const STACK: SimpleIcon[] = [siReact, siNextdotjs, siRadixui, siTailwindcss, siTypescript]

/** "Built with a modern stack" — bordered grid cells with white brand logos. */
export function LogoStrip() {
  return (
    <section className="border-white/10 border-b bg-black">
      <div className="mx-auto grid max-w-screen-xl grid-cols-2 divide-white/10 md:grid-cols-6 md:divide-x">
        <div className="col-span-2 flex items-center border-white/10 border-b px-6 py-8 md:col-span-1 md:border-b-0">
          <span className="font-mono text-sm text-white/60 leading-snug">
            Built with a
            <br />
            modern stack
          </span>
        </div>
        {STACK.map((icon, i) => (
          <motion.div
            key={icon.title}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="flex items-center justify-center border-white/10 border-t px-6 py-8 md:border-t-0"
          >
            <svg
              role="img"
              aria-label={icon.title}
              viewBox="0 0 24 24"
              className="size-8 fill-white/80 transition-colors hover:fill-white"
            >
              <title>{icon.title}</title>
              <path d={icon.path} />
            </svg>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
