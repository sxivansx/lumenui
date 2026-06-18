'use client'

import * as React from 'react'
import { cn } from '../../lib/utils'

/** Configuration knobs. All optional — defaults reproduce a light pill with a
 *  dark circular badge whose arrow slides forward and whose background warms to
 *  an accent on hover/focus. */
interface ArrowButtonOwnProps {
  /** Pill background. Any CSS `background` value (color or gradient). */
  surface?: string
  /** Label color. */
  textColor?: string
  /** Resting background of the circular icon badge. */
  iconBackground?: string
  /** Background the badge animates to on hover/focus — the color change. */
  iconBackgroundHover?: string
  /** Resting arrow color. */
  iconColor?: string
  /** Arrow color on hover/focus. */
  iconColorHover?: string
  /** Glyph shown in the badge. Defaults to a right arrow. */
  icon?: React.ReactNode
  /** CSS padding shorthand for the pill. */
  padding?: string
  /** CSS border-radius for the pill. */
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
export type ArrowButtonProps = ArrowButtonOwnProps &
  Omit<React.HTMLAttributes<HTMLElement>, keyof ArrowButtonOwnProps>

/** Default glyph: a thin right arrow that inherits the badge's text color. */
const ArrowGlyph = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="size-[1.125rem]"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
)

/**
 * A pill CTA with a label and a trailing circular badge. On hover/focus the
 * badge background warms to an accent color while the arrow glides forward —
 * the resting arrow slides out to the right as a duplicate enters from the left,
 * giving a continuous "moving forward" feel.
 *
 * Surface, label, badge, and both arrow colors are driven by CSS custom
 * properties so each instance recolors independently and stays theme- and
 * dark-mode-aware. The whole motion collapses to a static, single-arrow badge
 * under `prefers-reduced-motion` (the color change still applies, instantly).
 */
const ArrowButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ArrowButtonProps>(
  (
    {
      surface = 'var(--color-secondary)',
      textColor = 'var(--color-secondary-foreground)',
      iconBackground = 'var(--color-primary)',
      iconBackgroundHover = '#f97316',
      iconColor = 'var(--color-primary-foreground)',
      iconColorHover = '#ffffff',
      icon = ArrowGlyph,
      padding = '6px 6px 6px 22px',
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
      background: surface,
      color: textColor,
      // Label face: Inter where the consumer provides it (the docs load it as
      // --font-inter), gracefully falling back to the system sans elsewhere.
      // Spread by `...style` last, so a consumer can still override the family.
      fontFamily: 'var(--font-inter, ui-sans-serif, system-ui, -apple-system, sans-serif)',
      // Soft float so the pill reads on light surfaces (matches the reference);
      // spread after by `...style` so a consumer can drop or replace it.
      boxShadow: '0 1px 2px rgb(0 0 0 / 0.08), 0 10px 28px -12px rgb(0 0 0 / 0.22)',
      // Read by the badge / arrow utility classes below. `--ab-shift` is the slide
      // distance — a fixed length (not a % of the glyph) so the exit is reliable
      // regardless of icon size; it's zeroed under reduced motion (see root class).
      '--ab-badge-bg': iconBackground,
      '--ab-badge-bg-hover': iconBackgroundHover,
      '--ab-arrow': iconColor,
      '--ab-arrow-hover': iconColorHover,
      '--ab-shift': '2.5rem',
      ...style,
    } as React.CSSProperties

    const rootClassName = cn(
      'group relative inline-flex cursor-pointer select-none items-center gap-3 whitespace-nowrap border-0 text-base font-medium no-underline outline-none [-webkit-tap-highlight-color:transparent]',
      '[transition:transform_200ms_cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98]',
      'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      // Reduced motion: collapse the slide distance to 0 so nothing glides.
      'disabled:pointer-events-none disabled:opacity-50 motion-reduce:[--ab-shift:0px] motion-reduce:transition-none motion-reduce:active:scale-100',
      className,
    )

    const content = (
      <>
        <span className="relative">{children}</span>
        {/* Circular badge. Background + arrow color transition on hover/focus. */}
        <span
          aria-hidden="true"
          className={cn(
            'relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-full',
            'bg-[var(--ab-badge-bg)] text-[var(--ab-arrow)]',
            '[transition:background-color_300ms_cubic-bezier(0.23,1,0.32,1),color_300ms_cubic-bezier(0.23,1,0.32,1)]',
            'group-hover:bg-[var(--ab-badge-bg-hover)] group-hover:text-[var(--ab-arrow-hover)]',
            'group-focus-visible:bg-[var(--ab-badge-bg-hover)] group-focus-visible:text-[var(--ab-arrow-hover)]',
            'motion-reduce:transition-none',
          )}
        >
          {/* Resting arrow — glides out to the right on hover/focus. */}
          <span className="col-start-1 row-start-1 [translate:0] [transition:translate_350ms_cubic-bezier(0.23,1,0.32,1)] group-hover:[translate:var(--ab-shift)] group-focus-visible:[translate:var(--ab-shift)] motion-reduce:transition-none">
            {icon}
          </span>
          {/* Trailing arrow — waits off to the left, arrives at center on hover/focus. */}
          <span className="col-start-1 row-start-1 [translate:calc(-1*var(--ab-shift))] [transition:translate_350ms_cubic-bezier(0.23,1,0.32,1)] group-hover:[translate:0] group-focus-visible:[translate:0] motion-reduce:hidden motion-reduce:transition-none">
            {icon}
          </span>
        </span>
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
ArrowButton.displayName = 'ArrowButton'

export { ArrowButton }
