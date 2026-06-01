# lumenui

A reusable, accessible, themeable React/Next.js UI component library — published to npm as [`lumenui`](https://www.npmjs.com/package/lumenui).

Built on **Radix UI** primitives and **Tailwind CSS v4**, shipped as ESM with first-class React Server Component support.

## Monorepo

| Path | Package | Description |
| --- | --- | --- |
| `packages/ui` | `lumenui` | The published component library. |
| `apps/docs` | `docs` (private) | Next.js 16 + Fumadocs documentation site with live previews. |

Tooling: **Bun** workspaces, **Turborepo**, **tsdown** (Rolldown), **Biome**, **Vitest**, **Changesets**.

## Develop

```bash
bun install
bun run dev        # build the lib once, then run docs + lib watch together
bun run build      # build everything
bun run test       # unit + a11y tests
bun run lint       # biome
bun run typecheck  # tsc
```

## Add a component

1. Create `packages/ui/src/components/<name>/<name>.tsx` (+ `index.ts`) following the existing pattern (`'use client'` only if interactive, `forwardRef`, `cn`, cva variants, Radix from the unified `radix-ui` package).
2. Re-export it from `packages/ui/src/index.ts`.
3. Add a `apps/docs/registry/examples/<name>-demo.tsx` and a docs page.

## Release

```bash
bun run changeset   # describe the change
# CI handles version bump + publish on merge to main
```

## License

MIT
