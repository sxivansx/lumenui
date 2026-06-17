'use client'

import * as React from 'react'
import { cn } from '../../lib/utils'

/* Keyframes, `@property` registrations, and the pseudo-element layers can't be
 * expressed as inline styles or Tailwind utilities, so they ship here as a
 * single stylesheet. React 19 hoists any `<style href precedence>` into <head>
 * and de-dupes by `href`, so rendering 100 buttons still injects this once.
 *
 * Everything themeable is read from `--lumen-shiny-*` custom properties, which
 * the component sets per-instance via inline style — so this block stays static
 * and shared while each button can be recolored/retimed independently. */
const SHINY_BUTTON_CSS = `
@property --lumen-shiny-angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}
@property --lumen-shiny-spread {
  syntax: "<percentage>";
  initial-value: 14%;
  inherits: false;
}

@keyframes lumen-shiny-spin {
  to { --lumen-shiny-angle: 360deg; }
}
@keyframes lumen-shiny-breathe {
  0%, 100% { opacity: 0.16; }
  50% { opacity: 0.32; }
}

.lumen-shiny-cta {
  position: relative;
  isolation: isolate;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid transparent;
  overflow: hidden;
  font-weight: 500;
  line-height: 1.2;
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  /* padding-box holds the surface fill; the conic streak lives in the border-box
     ring. A constant faint rim keeps the pill readable on any background while a
     bright band sweeps around it. */
  background:
    var(--lumen-shiny-surface, linear-gradient(180deg, #1c1c1c, #0a0a0a)) padding-box,
    conic-gradient(
      from var(--lumen-shiny-angle),
      var(--lumen-shiny-rim, rgba(255, 255, 255, 0.14)) 0deg,
      var(--lumen-shiny-accent, #8a8a8a) calc(var(--lumen-shiny-spread) * 0.5),
      var(--lumen-shiny-shine, #ffffff) var(--lumen-shiny-spread),
      var(--lumen-shiny-accent, #8a8a8a) calc(var(--lumen-shiny-spread) * 1.5),
      var(--lumen-shiny-rim, rgba(255, 255, 255, 0.14)) calc(var(--lumen-shiny-spread) * 2.4)
    ) border-box;
  animation: lumen-shiny-spin var(--lumen-shiny-speed, 4s) linear infinite;
  transition:
    --lumen-shiny-spread 600ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 220ms ease;
}

/* Dotted speckle clustered toward the top, gently breathing. */
.lumen-shiny-cta::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  border-radius: inherit;
  pointer-events: none;
  background-image: radial-gradient(circle, var(--lumen-shiny-shine, #ffffff) 0.6px, transparent 0.7px);
  background-size: 7px 7px;
  -webkit-mask-image: radial-gradient(42% 85% at 78% -12%, #000, transparent 70%);
          mask-image: radial-gradient(42% 85% at 78% -12%, #000, transparent 70%);
  opacity: 0.22;
  animation: lumen-shiny-breathe calc(var(--lumen-shiny-speed, 4s) * 1.4) ease-in-out infinite;
}

/* Soft glow that rises from beneath the label on hover/focus. */
.lumen-shiny-cta::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  border-radius: inherit;
  pointer-events: none;
  background: radial-gradient(70% 60% at 50% 118%, var(--lumen-shiny-accent, #8a8a8a), transparent 70%);
  opacity: 0;
  transition: opacity 500ms cubic-bezier(0.22, 1, 0.36, 1);
}

.lumen-shiny-cta:where(:hover, :focus-visible) {
  --lumen-shiny-spread: 26%;
  transform: translateY(-1px);
}
.lumen-shiny-cta:where(:hover, :focus-visible)::after {
  opacity: 0.55;
}
.lumen-shiny-cta:active {
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .lumen-shiny-cta,
  .lumen-shiny-cta::before {
    animation: none;
  }
  .lumen-shiny-cta {
    transition: none;
  }
}
`

interface ShinyButtonOwnProps {
  /** Pill fill. Any CSS `background` value (color or gradient). */
  surface?: string
  /** Label color. */
  textColor?: string
  /** Peak color of the travelling border streak. */
  shine?: string
  /** Shoulder color of the streak and the hover glow. */
  accent?: string
  /** Constant faint rim color for the rest of the border. */
  rim?: string
  /** Seconds for one full revolution of the streak. */
  speed?: number
  /** CSS padding shorthand. */
  padding?: string
  /** CSS border-radius. */
  radius?: string
  /** Render as an `<a>` with this href instead of a `<button>`. */
  href?: string
  target?: React.HTMLAttributeAnchorTarget
  rel?: string
  /** Button type (ignored when rendering as a link). */
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

// Built on the attributes common to `<button>` and `<a>` so one prop set targets
// either element; `type`/`disabled`/`href` are declared explicitly above.
export type ShinyButtonProps = ShinyButtonOwnProps &
  Omit<React.HTMLAttributes<HTMLElement>, keyof ShinyButtonOwnProps>

/**
 * A high-impact CTA pill: a conic-gradient streak rotates around the border, a
 * dotted field shimmers near the top, and a soft glow rises beneath the label on
 * hover. Surface, shine, accent, speed, and geometry are all configurable; the
 * animation respects `prefers-reduced-motion`.
 */
const ShinyButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ShinyButtonProps>(
  (
    {
      surface = 'linear-gradient(180deg, #1c1c1c, #0a0a0a)',
      textColor = '#f4f4f5',
      shine = '#ffffff',
      accent = '#8a8a8a',
      rim = 'rgba(255, 255, 255, 0.14)',
      speed = 4,
      padding = '14px 28px',
      radius = '9999px',
      href,
      target,
      rel,
      type,
      disabled,
      className,
      children,
      style,
      ...rest
    },
    ref,
  ) => {
    const rootStyle = {
      padding,
      borderRadius: radius,
      color: textColor,
      // Dynamic values are passed as CSS variables the stylesheet reads from.
      // `--lumen-shiny-angle`/`--lumen-shiny-spread` are intentionally NOT set
      // here: the keyframes drive the angle and the :hover rule transitions the
      // spread, both of which an inline value would override.
      '--lumen-shiny-surface': surface,
      '--lumen-shiny-shine': shine,
      '--lumen-shiny-accent': accent,
      '--lumen-shiny-rim': rim,
      '--lumen-shiny-speed': `${speed}s`,
      ...style,
    } as React.CSSProperties

    const rootClassName = cn(
      'lumen-shiny-cta text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
      className,
    )

    const content = (
      <>
        {/* Hoisted + de-duped by React 19 — injected once regardless of count. */}
        <style href="lumenui-shiny-button" precedence="medium">
          {SHINY_BUTTON_CSS}
        </style>
        <span className="relative z-[2]">{children}</span>
      </>
    )

    if (href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={rel ?? (target === '_blank' ? 'noreferrer noopener' : undefined)}
          className={rootClassName}
          style={rootStyle}
          aria-disabled={disabled || undefined}
          {...rest}
        >
          {content}
        </a>
      )
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type ?? 'button'}
        disabled={disabled}
        className={rootClassName}
        style={rootStyle}
        {...rest}
      >
        {content}
      </button>
    )
  },
)
ShinyButton.displayName = 'ShinyButton'

export { ShinyButton }
