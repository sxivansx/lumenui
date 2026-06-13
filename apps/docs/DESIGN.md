# Docs website — design language

> Scope: this document governs the **docs website** (`apps/docs`) only — the marketing/
> documentation surface. It does **not** govern the published library components in
> `packages/ui`, which are styled independently and customized by hand. Keep the two
> separate: changing the website look should never require touching the library, and
> vice-versa.

The website has two distinct surfaces:

1. **Landing (`/`) — immersive dark "engineering blueprint."** Pure-black canvas, a faint
   ruled grid (`.blueprint-grid`), an oversized faint wordmark watermark, square bordered
   icon-button nav (the GitHub/stars button shows a **live star count** fetched from the
   GitHub API), a "Built with a modern stack" bordered logo grid, and a bordered component
   showcase grid. The whole page is wrapped in `dark` so library previews render on-brand
   regardless of the user's theme.
2. **Docs (`/components/*`) — clean three-column layout.** Left component nav (sidebar with
   active-row highlight), center content, right "On This Page" scroll-spy TOC, plus a
   "Copy Page" button and prev/next pager. Light by default, theme-toggleable.

Both lean on the same restrained foundations below — **type, whitespace, mono technical
labels, and one gradient accent** do the decorative work. No radial glows, no glass, no
heavy drop-shadows.

## Foundations

### Fonts
- **Geist** (sans) — everything narrative: display, body, nav, labels. Via `geist/font/sans`.
- **Geist Mono** — the "technical voice": section eyebrows, code/install snippets, preview
  tab labels. Via `geist/font/mono`.
- Wired in `app/layout.tsx` as `GeistSans.variable` + `GeistMono.variable` on `<html>`, then
  mapped to Tailwind `font-sans` / `font-mono` in `app/global.css` (`@theme inline`). Heading
  tracking is `-0.025em` (Geist runs tight).

### Color
- Surface + text come from the **shared library tokens** (`packages/ui/src/tokens.css`,
  imported by `global.css`): `bg-background` / `bg-card` / `bg-muted`, `text-foreground` /
  `text-muted-foreground`, `border`. These already are the near-white/ink/gray system.
- Website-only additions live in `global.css` `@theme inline`:
  - `--color-accent-brand` `#2449D1` (+ `--color-accent-brand-deep` `#1b3aa8`) — **lumenui's brand
    accent**. Used on the hero's highlighted nav button, the primary CTA, the "it's all yours"
    text highlight, and the docs active-state indicators (TOC link, preview tab). `--color-link`
    shares the same blue. Apply via `bg-accent-brand` / `text-accent-brand` / `border-accent-brand`.
  - `--gradient-*` stops (develop / preview / ship) — power the single hero accent only.
- Selection is ink-on-light (inverted in dark mode), set in `@layer base`.

### The gradient — used once, at hero scale
The multi-stop mesh gradient is the brand's **only** decorative element. On this site it
appears as the `.text-gradient` utility on a single hero word ("own."). Rules:
- Never miniaturise it to an icon or swatch.
- Never use it as a radial glow / ambient blob behind a card. (`.text-gradient` is a
  `linear-gradient` clipped to text — a deliberate 2D graphic, not atmosphere.)
- One accent per page, maximum.

### Type voice
- Headlines: **sentence case**, weight 600 (`font-semibold`), aggressive negative tracking
  (`tracking-[-0.04em]` hero, `-0.03em` page titles, `-0.025em` global h1–h3 baseline).
  The hero headline ends with a period — part of the voice.
- Never all-caps. Eyebrows/labels use **Geist Mono in sentence case** (e.g. the sidebar
  "Components" label, the home "Install" label) — the mono face signals "technical" without
  the wide-tracked-uppercase tell.
- Body: weight 400, `text-muted-foreground` for secondary copy, relaxed leading.

### Elevation
- `.shadow-stack` (in `global.css`) — three stacked low-opacity offsets. Used on cards,
  code blocks, the preview frame. Never a single heavy drop-shadow.

### Shape
- `rounded-full` ghost pills for nav rows (sidebar + header links).
- `rounded-lg` / `rounded-xl` for cards, code blocks, the preview frame.

## Where each piece lives
| Surface | File | Treatment |
|---|---|---|
| App shell (fonts only) | `app/layout.tsx` | Geist vars + Providers; no chrome — each surface owns its own |
| Design layer (tokens, gradient, grid, HUD, shadow, selection) | `app/global.css` | website-scoped `@theme` + `@layer` additions |
| Landing page | `app/page.tsx` | async server component; fetches star count; `dark` wrapper assembling Hero → LogoStrip → ComponentGrid → install → footer |
| Dark hero + icon nav | `components/hero.tsx` | client; `.blueprint-grid`, watermark, bordered icon buttons, live star count via `stars` prop |
| Repo config + star count | `lib/site.ts` | `GITHUB_URL`, `getStarCount()` (ISR-cached, null on failure), `FALLBACK_STARS`, `formatStars()` |
| "Built with" logo grid | `components/logo-strip.tsx` | bordered divided grid cells |
| Component showcase grid | `components/component-grid.tsx` | bordered cells, one per component, linking to docs |
| Docs shell | `app/components/layout.tsx` | header (mono wordmark + ghost-pill links + theme toggle) + left Sidebar |
| Component nav | `components/sidebar.tsx` | client; mono label; ghost-pill rows; active row via `usePathname` |
| Component page | `app/components/[slug]/page.tsx` | 3-col: content + Copy Page + pager, right TOC; sections carry `id` + `scroll-mt-20` |
| On This Page TOC | `components/toc.tsx` | client scroll-spy via `IntersectionObserver` (xl+ only) |
| Prev/next pager | `components/doc-pager.tsx` | derived from `components` array order |
| Copy Page | `components/copy-page-button.tsx` | copies a markdown rendering of the page |
| Live preview | `components/component-preview.tsx` | `bg-card` + `.shadow-stack` frame; mono tab labels; `bg-muted/30` stage |

### Hero backdrop (landing only)
- A 20px ruled grid (`var(--primary)` lines) **masked** by two dashed `repeating-linear-gradient`s
  (`maskComposite: intersect`) so it reads as a dashed grid, then faded with a top radial ellipse.
- A second radial-vignette overlay (`radial-gradient(125% 125% at 50% 10%, …)`) at low opacity
  (`0.18`) frames the content; kept dim on purpose so near-white `--primary` doesn't wash the edges.
- Square bordered icon buttons; the primary (GitHub/stars) gets a single cyan-bordered accent.
- Inline styles live in `components/hero.tsx` (the mask is too compositional for a utility class).

## Do / Don't (website)
- **Do** keep the gradient to one hero accent; keep eyebrows in sentence-case mono; layer
  `.shadow-stack`; cycle surfaces background → card → muted for depth.
- **Don't** add a sixth accent color, set headlines in all-caps, use radial glows /
  glassmorphism / colored left-border cards, or restyle `packages/ui` to match the site.

## Verify after changes
```bash
cd apps/docs
bun run typecheck   # runs build-registry + tsc
bun run build       # 19 static pages; Geist fonts bundle offline
bunx biome check <edited files>
```
Note: `next-env.d.ts` is regenerated by Next tooling on typecheck/build — leave it
unmodified (restore with `git checkout` if it drifts).
