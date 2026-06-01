#!/usr/bin/env node
/**
 * Post-build guard for the published `lumenui` artifact.
 *
 * Verifies the two invariants that silently break consumers if violated:
 *   1. Every source component marked `"use client"` keeps that directive as the
 *      FIRST line of its compiled `dist` output (RSC client boundaries).
 *   2. The shipped stylesheets (`styles.css`, `theme.css`) are non-empty.
 *
 * Exits non-zero on any violation so CI fails loudly.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'packages', 'ui')
const srcComponents = join(root, 'src', 'components')
const dist = join(root, 'dist')

/** Recursively collect files matching a predicate. */
function walk(dir, pred, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, pred, acc)
    else if (pred(full)) acc.push(full)
  }
  return acc
}

const firstLine = (file) => readFileSync(file, 'utf8').split('\n', 1)[0].trim()

const errors = []

// 1. "use client" preservation
const clientSources = walk(
  srcComponents,
  (f) => f.endsWith('.tsx') && !f.endsWith('index.ts'),
).filter((f) => /^['"]use client['"]/.test(firstLine(f)))

if (clientSources.length === 0) errors.push('No "use client" source components found — expected several.')

for (const src of clientSources) {
  const rel = relative(srcComponents, src).replace(/\.tsx$/, '.js')
  const out = join(dist, 'components', rel)
  let line
  try {
    line = firstLine(out)
  } catch {
    errors.push(`Missing dist output for client component: ${rel}`)
    continue
  }
  if (line !== '"use client";' && line !== "'use client';") {
    errors.push(`"use client" not first line of dist/components/${rel} (got: ${JSON.stringify(line)})`)
  }
}

// 2. stylesheets non-empty
for (const css of ['styles.css', 'theme.css']) {
  try {
    if (statSync(join(dist, css)).size === 0) errors.push(`${css} is empty`)
  } catch {
    errors.push(`Missing dist/${css}`)
  }
}

if (errors.length) {
  console.error('✗ dist verification failed:')
  for (const e of errors) console.error('  - ' + e)
  process.exit(1)
}
console.log(`✓ dist verification passed (${clientSources.length} client components, styles + theme present)`)
