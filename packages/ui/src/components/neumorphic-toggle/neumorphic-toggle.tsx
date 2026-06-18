'use client'

import { Switch as SwitchPrimitive } from 'radix-ui'
import * as React from 'react'
import { cn } from '../../lib/utils'

/** Configuration knobs (ported from the Framer property controls). The only
 *  override is the active color — everything else is fixed so the toggle keeps
 *  one consistent neumorphic size and depth, exactly like the source component. */
interface NeumorphicToggleOwnProps {
  /** Track fill in the on state. Defaults to a solid blue. */
  activeColor?: string
}

// Built on Radix Switch so it stays a real, accessible toggle (role="switch",
// keyboard, controlled/uncontrolled, form integration) — we only restyle it.
export type NeumorphicToggleProps = NeumorphicToggleOwnProps &
  Omit<React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>, keyof NeumorphicToggleOwnProps>

// Light neumorphic surface. The look depends on the control sharing a color
// family with its backdrop, so these stay fixed rather than tracking the theme.
// (The off-track color #e6e7ec lives as a literal Tailwind class below, since
// arbitrary utilities must be statically scannable.)
const KNOB = '#eef0f4'

// The track is a carved-in groove. Off, it carries the full neumorphic recess
// (dark inset top-left, a faint light inset bottom-right). On, the fill is kept
// plain — only the dark inset for depth, no white light-edge, so the solid color
// never blooms a white halo. The off/on grooves are applied as data-state
// classes below; arbitrary box-shadow utilities must be statically scannable.
const OFF_GROOVE =
  'data-[state=unchecked]:shadow-[inset_3px_3px_7px_rgba(0,0,0,0.15),inset_-3px_-3px_6px_rgba(255,255,255,0.5),0_1px_1px_rgba(0,0,0,0.04)]'
const ON_GROOVE =
  'data-[state=checked]:shadow-[inset_3px_3px_7px_rgba(0,0,0,0.18),0_1px_1px_rgba(0,0,0,0.04)]'
const KNOB_SHADOW = '0 3px 6px rgba(0,0,0,0.16), 0 1px 2px rgba(0,0,0,0.12)'

/**
 * A neumorphic on/off toggle: a knob that bulges out of a recessed groove and
 * springs across as the track fills with color.
 *
 * The knob carries a milled grip texture, the slide uses an overshooting spring
 * curve, and the soft inner/outer shadows are tuned to a single top-left light
 * source. It collapses to an instant, motion-free swap under reduced motion.
 */
const NeumorphicToggle = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitive.Root>,
  NeumorphicToggleProps
>(({ activeColor = '#2449D0', className, style, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(
      'relative inline-flex h-11 w-20 shrink-0 cursor-pointer items-center rounded-2xl p-1.5 outline-none transition-colors duration-300 ease-out',
      // Off keeps the surface color; on reveals the active fill (set via CSS var).
      'data-[state=unchecked]:bg-[#e6e7ec] data-[state=checked]:bg-[var(--nt-active)]',
      OFF_GROOVE,
      ON_GROOVE,
      'focus-visible:ring-2 focus-visible:ring-[var(--nt-active)]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      'disabled:cursor-not-allowed disabled:opacity-60',
      'motion-reduce:transition-none',
      className,
    )}
    style={{ '--nt-active': activeColor, ...style } as React.CSSProperties}
    {...props}
  >
    <SwitchPrimitive.Thumb
      className={cn(
        'pointer-events-none flex h-8 w-8 items-center justify-center rounded-xl',
        'transition-transform duration-300 will-change-transform [transition-timing-function:cubic-bezier(0.34,1.45,0.5,1)]',
        'data-[state=unchecked]:translate-x-0 data-[state=checked]:translate-x-9',
        'motion-reduce:transition-none',
      )}
      style={{ backgroundColor: KNOB, boxShadow: KNOB_SHADOW }}
    >
      {/* Milled grip: a 2×3 field of engraved dimples (dark pit, lit lower lip). */}
      <span aria-hidden="true" className="grid grid-cols-2 gap-x-[5px] gap-y-[4px]">
        {Array.from({ length: 6 }, (_, i) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length decorative grid, never reordered
            key={i}
            className="h-[3px] w-[3px] rounded-full"
            style={{
              backgroundColor: 'rgba(0,0,0,0.16)',
              boxShadow: '0 1px 0.5px rgba(255,255,255,0.85)',
            }}
          />
        ))}
      </span>
    </SwitchPrimitive.Thumb>
  </SwitchPrimitive.Root>
))
NeumorphicToggle.displayName = 'NeumorphicToggle'

export { NeumorphicToggle }
