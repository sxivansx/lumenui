# lumenui

Accessible, themeable React UI components built on [Radix UI](https://www.radix-ui.com/) and [Tailwind CSS v4](https://tailwindcss.com/). Designed for Next.js (App Router) and any modern React 19 app.

## Install

```bash
bun add lumenui
# or: npm i lumenui / pnpm add lumenui
```

`react` and `react-dom` (`^19`) are peer dependencies.

## Usage

Import the precompiled stylesheet once (e.g. in `app/layout.tsx`), then use components anywhere:

```tsx
import "lumenui/styles.css";
import { Button } from "lumenui";

export default function Page() {
  return <Button>Click me</Button>;
}
```

No Tailwind setup is required in the consuming app — `lumenui/styles.css` ships precompiled.

## Theming

Tokens are CSS custom properties (oklch). Override them after importing the stylesheet:

```css
:root {
  --primary: oklch(0.55 0.2 264);
  --radius: 0.5rem;
}
```

Dark mode uses the `class` strategy — add `class="dark"` to `<html>` (e.g. with `next-themes`).

### Using your own Tailwind pipeline

If your app uses Tailwind v4 and you'd rather generate utilities yourself (e.g. to tree-shake or dedupe preflight), import the raw token layer instead of the precompiled CSS and scan the package source:

```css
@import "tailwindcss";
@import "lumenui/theme.css";
@source "../node_modules/lumenui/dist/**/*.js";
```

## License

MIT
