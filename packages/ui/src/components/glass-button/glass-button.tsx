'use client'

import * as React from 'react'
import { cn } from '../../lib/utils'

/** Configuration knobs. All optional — defaults reproduce a clean frosted-glass
 *  pill that reads well over imagery, gradients, or any busy backdrop. */
interface GlassButtonOwnProps {
  /** Translucent fill behind the frost. Lower alpha = more see-through. */
  tint?: string
  /** Backdrop blur radius, in px — the "frost". */
  blur?: number
  /** Hairline border color (kept translucent for the glass edge). */
  borderColor?: string
  /** Label color. Defaults to the theme `foreground` so it stays readable. */
  textColor?: string
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

// Based on the attributes common to `<button>` and `<a>` so a single prop set
// can target either element; `type`/`disabled`/`href` are declared explicitly above.
export type GlassButtonProps = GlassButtonOwnProps &
  Omit<React.HTMLAttributes<HTMLElement>, keyof GlassButtonOwnProps>

/**
 * A clean glass-style button with a transparent, frosted look: a translucent
 * tint, a backdrop blur, a lit top edge, and a soft drop shadow for depth.
 *
 * Text, text color, and padding are all configurable, and the surface blurs
 * whatever sits behind it — so it sits naturally over photos, gradients, or
 * any busy layout while staying theme- and dark-mode-aware.
 */
const GlassButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, GlassButtonProps>(
  (
    {
      tint = 'rgba(255, 255, 255, 0.12)',
      blur = 12,
      borderColor = 'rgba(255, 255, 255, 0.25)',
      textColor = 'var(--color-foreground)',
      padding = '14px 28px',
      radius = '14px',
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
    const blurPx = `${Math.max(0, blur)}px`

    const rootStyle = {
      padding,
      borderRadius: radius,
      color: textColor,
      background: tint,
      borderColor,
      // saturate lifts the colors bleeding through the frost so it reads as glass,
      // not a flat scrim. Prefixed copy kept for Safari, which still needs it.
      backdropFilter: `blur(${blurPx}) saturate(180%)`,
      WebkitBackdropFilter: `blur(${blurPx}) saturate(180%)`,
      // Liquid-glass depth: an outer drop seats the pane above the backdrop,
      // a bright top rim catches light, a faint base edge adds thickness, and a
      // hairline inset ring traces the whole glass edge.
      boxShadow:
        '0 8px 32px -12px rgba(0, 0, 0, 0.45), inset 0 1px 0.5px 0 rgba(255, 255, 255, 0.55), inset 0 -1px 1px 0 rgba(255, 255, 255, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.12)',
      ...style,
    } as React.CSSProperties

    const rootClassName = cn(
      'group relative isolate inline-flex cursor-pointer select-none items-center justify-center gap-2 overflow-hidden border text-base font-medium no-underline outline-none [-webkit-tap-highlight-color:transparent] [transition:transform_200ms_cubic-bezier(0.23,1,0.32,1),box-shadow_200ms_cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-px active:translate-y-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none motion-reduce:hover:translate-y-0',
      className,
    )

    const content = (
      <>
        {/* Static sheen: a diagonal specular catch in the top-left, fading out,
            so the glass looks lit even at rest. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] bg-[linear-gradient(135deg,rgba(255,255,255,0.45),rgba(255,255,255,0.08)_30%,rgba(255,255,255,0)_60%)]"
        />
        {/* Hover bloom: brightens the frost on hover/focus without touching the
            inline tint (so consumer overrides win). */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] bg-white/10 opacity-0 [transition:opacity_300ms_cubic-bezier(0.23,1,0.32,1)] group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
        />
        <span className="relative z-[1]">{children}</span>
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
GlassButton.displayName = 'GlassButton'

export { GlassButton }
