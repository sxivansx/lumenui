'use client'

import * as React from 'react'
import { cn } from '../../lib/utils'

/** Configuration knobs (ported from the Framer property controls). All optional —
 *  defaults reproduce a black pill that leans toward the cursor and grows a touch
 *  while the cursor is inside its surrounding magnetic field. */
interface MagneticButtonOwnProps {
  /** How strongly the button follows the cursor, as a fraction of the cursor's
   *  offset from the button's center. 0 = stays put, 1 = sticks to the cursor. */
  strength?: number
  /** Radius of the invisible magnetic field around the button, in px. The button
   *  starts drifting toward the cursor as soon as it enters this margin. */
  range?: number
  /** Scale the button grows to while the cursor is in range. */
  hoverScale?: number
  /** Scale the button shrinks to while pressed. */
  tapScale?: number
  /** Glide duration for the follow / settle-back motion, in ms. */
  transitionDuration?: number
  /** Resting surface color. Defaults to the `primary` token. */
  backgroundColor?: string
  /** Resting label color. Defaults to the `primary-foreground` token. */
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
export type MagneticButtonProps = MagneticButtonOwnProps &
  Omit<React.HTMLAttributes<HTMLElement>, keyof MagneticButtonOwnProps>

/**
 * A button that leans toward the cursor and scales up while the cursor is within
 * an invisible field around it, then springs back to center on leave.
 *
 * The follow offset is written straight to the DOM node as CSS variables (no React
 * re-render per mouse move); a single `transform` composes that translate with the
 * hover/press scale, and a CSS transition interpolates every change for the spring
 * feel. Colors default to theme tokens so the button stays themeable and dark-mode
 * aware, and the whole effect collapses to a static button under reduced motion.
 */
const MagneticButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, MagneticButtonProps>(
  (
    {
      strength = 0.4,
      range = 20,
      hoverScale = 1.06,
      tapScale = 0.96,
      transitionDuration = 300,
      backgroundColor = 'var(--color-primary)',
      textColor = 'var(--color-primary-foreground)',
      padding = '16px 32px',
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
    const nodeRef = React.useRef<HTMLButtonElement | HTMLAnchorElement | null>(null)

    // Merge the forwarded ref with our internal one so consumers still reach the
    // focusable element while we read its rect for the magnetic math.
    const setRef = React.useCallback(
      (node: HTMLButtonElement | HTMLAnchorElement | null) => {
        nodeRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref)
          (ref as React.MutableRefObject<HTMLButtonElement | HTMLAnchorElement | null>).current =
            node
      },
      [ref],
    )

    // Pull the button toward the cursor by a fraction of its offset from center.
    // Written as CSS vars on the node (not state) so tracking never re-renders.
    const pull = (e: React.MouseEvent<HTMLElement>) => {
      const node = nodeRef.current
      if (!node || disabled) return
      const rect = node.getBoundingClientRect()
      const relX = e.clientX - (rect.left + rect.width / 2)
      const relY = e.clientY - (rect.top + rect.height / 2)
      node.style.setProperty('--mb-x', `${relX * strength}px`)
      node.style.setProperty('--mb-y', `${relY * strength}px`)
    }

    const release = () => {
      const node = nodeRef.current
      if (!node) return
      node.style.setProperty('--mb-x', '0px')
      node.style.setProperty('--mb-y', '0px')
    }

    const rootStyle = {
      padding,
      borderRadius: radius,
      background: backgroundColor,
      color: textColor,
      // Dynamic values read by the utility classes below.
      '--mb-hover-scale': String(hoverScale),
      '--mb-tap-scale': String(tapScale),
      '--mb-duration': `${transitionDuration}ms`,
      ...style,
    } as React.CSSProperties

    const rootClassName = cn(
      'inline-flex cursor-pointer select-none items-center justify-center gap-2 text-base font-medium no-underline outline-none [-webkit-tap-highlight-color:transparent]',
      // Magnetic translate (--mb-x/--mb-y, set in JS) composed with the hover/press
      // scale (--mb-scale, set in CSS) in ONE transform so the two never clash, and
      // a transition interpolates each change for the springy follow + settle-back.
      '[--mb-scale:1] [transform:translate(var(--mb-x,0px),var(--mb-y,0px))_scale(var(--mb-scale))] [transition:transform_var(--mb-duration)_cubic-bezier(0.23,1,0.32,1)]',
      'hover:[--mb-scale:var(--mb-hover-scale)] active:[--mb-scale:var(--mb-tap-scale)]',
      'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      'disabled:pointer-events-none disabled:opacity-50',
      // Reduced motion: no drift, no scale, no glide — a plain static button.
      'motion-reduce:!transform-none motion-reduce:!transition-none',
      className,
    )

    const element = href ? (
      <a
        ref={setRef}
        href={href}
        target={target}
        rel={rel ?? (target === '_blank' ? 'noreferrer noopener' : undefined)}
        className={rootClassName}
        style={rootStyle}
        aria-disabled={disabled || undefined}
        {...rest}
      >
        {children}
      </a>
    ) : (
      <button
        ref={setRef}
        type={type ?? 'button'}
        disabled={disabled}
        className={rootClassName}
        style={rootStyle}
        {...rest}
      >
        {children}
      </button>
    )

    // The field is a transparent shell padded by `range`, so the cursor is tracked
    // for a margin around the button — that margin is the "magnetic" reach. Its
    // handlers are a progressive enhancement; the button inside stays fully usable
    // (and keyboard-operable) without them.
    return (
      // biome-ignore lint/a11y/noStaticElementInteractions: decorative pointer-only field; the focusable control lives inside.
      <span
        className="inline-flex items-center justify-center"
        style={{ padding: range }}
        onMouseMove={pull}
        onMouseLeave={release}
      >
        {element}
      </span>
    )
  },
)
MagneticButton.displayName = 'MagneticButton'

export { MagneticButton }
