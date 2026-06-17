'use client'

import * as React from 'react'
import { cn } from '../../lib/utils'

/** Configuration knobs (ported from the Framer property controls). All optional —
 *  defaults reproduce the stock black pill with three rising white blobs. */
interface LiquidButtonOwnProps {
  /** Diameter of each blob, in px. */
  blobSize?: number
  /** Horizontal gap of the outer blobs from center, in px. */
  blobSpacing?: number
  /** How far below the bottom edge the blobs start, in px. */
  blobBottomOffset?: number
  /** How far the blobs travel upward on hover, as a % of their own height. */
  blobRise?: number
  /** Scale the blobs grow to on hover. */
  blobScale?: number
  /** Stagger between each blob's animation, in ms. */
  hoverDelayStep?: number
  /** Label color crossfade duration, in ms. */
  transitionDuration?: number
  /** Blob rise/scale duration, in ms. */
  blobTransitionDuration?: number
  /** Resting surface color. Defaults to the `primary` token. */
  backgroundColor?: string
  /** Resting label color. Defaults to the `primary-foreground` token. */
  textColor?: string
  /** Blob color. Defaults to the `primary-foreground` token. */
  blobColor?: string
  /** Label color once the blobs fill the button. Defaults to the `primary` token. */
  hoverTextColor?: string
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
export type LiquidButtonProps = LiquidButtonOwnProps &
  Omit<React.HTMLAttributes<HTMLElement>, keyof LiquidButtonOwnProps>

/**
 * A pill button whose label inverts as three blobs rise and merge into a single
 * liquid mass via an SVG "goo" filter on hover/focus.
 *
 * Every dimension, duration, and color is configurable; colors default to the
 * theme tokens so the effect stays themeable and dark-mode aware out of the box.
 */
const LiquidButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, LiquidButtonProps>(
  (
    {
      blobSize = 24,
      blobSpacing = 56,
      blobBottomOffset = 32,
      blobRise = 200,
      blobScale = 3.5,
      hoverDelayStep = 50,
      transitionDuration = 500,
      blobTransitionDuration = 700,
      backgroundColor = 'var(--color-primary)',
      textColor = 'var(--color-primary-foreground)',
      blobColor = 'var(--color-primary-foreground)',
      hoverTextColor = 'var(--color-primary)',
      padding = '16px 24px',
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
    // Unique filter id per instance so multiple buttons don't share one `<filter>`.
    const filterId = `lumen-goo-${React.useId().replace(/:/g, '')}`

    const rootStyle = {
      padding,
      borderRadius: radius,
      background: backgroundColor,
      // Dynamic values are passed as CSS variables the utility classes read from.
      '--lmb-blob-size': `${blobSize}px`,
      '--lmb-rise': `-${blobRise}%`,
      '--lmb-scale': `${blobScale}`,
      '--lmb-blob': blobColor,
      '--lmb-text': textColor,
      '--lmb-hover-text': hoverTextColor,
      '--lmb-text-duration': `${transitionDuration}ms`,
      '--lmb-blob-duration': `${blobTransitionDuration}ms`,
      ...style,
    } as React.CSSProperties

    const rootClassName = cn(
      'group relative isolate inline-flex cursor-pointer select-none items-center justify-center overflow-hidden text-base font-medium no-underline outline-none [-webkit-tap-highlight-color:transparent] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
      className,
    )

    const content = (
      <>
        {/* Blob layer — the goo filter welds the blurred blobs back into crisp merged shapes. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{ filter: `url(#${filterId})` }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              // Resting and hover transforms use the IDENTICAL function list (translate, scale)
              // so the browser interpolates each function smoothly. Mismatched lists (or a
              // singular scale(0)) force discrete matrix interpolation — i.e. an instant jump.
              className="absolute size-[var(--lmb-blob-size)] rounded-full bg-[var(--lmb-blob)] will-change-transform [transform:translate(-50%,0)_scale(0)] [transition:transform_var(--lmb-blob-duration)_cubic-bezier(0.23,1,0.32,1)] group-hover:[transform:translate(-50%,var(--lmb-rise))_scale(var(--lmb-scale))] motion-reduce:transition-none"
              style={{
                left:
                  i === 0
                    ? `calc(50% - ${blobSpacing}px)`
                    : i === 2
                      ? `calc(50% + ${blobSpacing}px)`
                      : '50%',
                bottom: `-${Math.abs(blobBottomOffset)}px`,
                transitionDelay: `${Math.max(0, hoverDelayStep) * i}ms`,
              }}
            />
          ))}
        </span>

        <span className="relative z-[2] text-[var(--lmb-text)] [transition:color_var(--lmb-text-duration)_cubic-bezier(0.23,1,0.32,1)] group-hover:text-[var(--lmb-hover-text)] motion-reduce:transition-none">
          {children}
        </span>

        {/* Goo filter: blur the blobs, then crank alpha contrast so soft edges snap
            back into a single liquid shape, clipped to the source for clean bounds. */}
        <svg
          aria-hidden="true"
          focusable="false"
          width="0"
          height="0"
          className="pointer-events-none absolute"
        >
          <defs>
            <filter id={filterId}>
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
                result="goo"
              />
              <feComposite in="SourceGraphic" in2="goo" operator="atop" />
            </filter>
          </defs>
        </svg>
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
LiquidButton.displayName = 'LiquidButton'

export { LiquidButton }
