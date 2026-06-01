import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/**/*.{ts,tsx}', '!src/**/*.test.{ts,tsx}'],
  format: 'esm',
  platform: 'neutral',
  dts: true,
  // 1:1 module output preserves per-file "use client" directives — required for
  // correct React Server Component client boundaries in the Next.js App Router.
  unbundle: true,
  // react/react-dom (peerDependencies) and all `dependencies` are externalized
  // automatically by tsdown, so they are never bundled into the output.
})
