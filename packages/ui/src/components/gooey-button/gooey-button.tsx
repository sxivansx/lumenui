'use client'

import { Check } from 'lucide-react'
import * as React from 'react'
import { cn } from '../../lib/utils'

/** Configuration knobs (distilled from the Framer "Gooey Button" property
 *  controls). All optional — defaults reproduce a dark pill that, when clicked,
 *  warms to the destructive color, swaps its label to a confirm prompt, and
 *  oozes a circular action button out of its right edge via a gooey SVG filter.
 *  Clicking that action button fires `onConfirm`; clicking the pill again (or
 *  outside, or pressing Escape) cancels. */
interface GooeyButtonOwnProps {
  /** Resting label, and the button's accessible name before it is armed. */
  children: React.ReactNode
  /** Label shown once armed — a short confirm prompt. */
  confirmLabel?: string
  /** Fired when the action button is clicked (the confirmed action). */
  onConfirm?: () => void
  /** Notified whenever the armed (awaiting-confirmation) state flips. */
  onArmedChange?: (armed: boolean) => void
  /** Glyph rendered inside the action button. Defaults to a check. */
  icon?: React.ReactNode
  /** Accessible name for the circular action button. */
  confirmActionLabel?: string
  /** Resting pill color. Defaults to the `primary` token. */
  surface?: string
  /** Pill + action color once armed. Defaults to the `destructive` token. */
  surfaceActive?: string
  /** Resting label color. Defaults to the `primary-foreground` token. */
  textColor?: string
  /** Label color once armed. Defaults to the `destructive-foreground` token. */
  textColorActive?: string
  /** Action glyph color. Defaults to the `destructive-foreground` token. */
  iconColor?: string
  /** Pill height in px — also drives the action circle size and the goo blur. */
  height?: number
  /** Horizontal padding of the pill (any CSS length). */
  paddingInline?: string
  /** Transition duration in ms for the morph and the slide-out. */
  duration?: number
  /** Border radius of the pill. */
  radius?: string
  /** Optional rim color. The border follows the merged gooey silhouette (it is a
   *  second blob layer behind the surface), so it wraps the pill, the bridge, and
   *  the action circle as one shape. Omit for no border. */
  borderColor?: string
  /** Rim thickness in px when `borderColor` is set. */
  borderWidth?: number
  disabled?: boolean
  /** Button type for the pill. */
  type?: 'button' | 'submit' | 'reset'
}

// Built on the native button attributes, minus the ones we own. `onClick` is
// omitted because clicking the pill is what arms/cancels it — consumers hook the
// confirmed action through `onConfirm` instead.
export type GooeyButtonProps = GooeyButtonOwnProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof GooeyButtonOwnProps | 'onClick'>

/** The metaball filter that makes the action button look like it stretches out
 *  of the pill: blur the shapes, push alpha through a steep contrast curve so the
 *  blurred edges snap back to a hard threshold (the "goo"), then composite the
 *  original sharp shapes back on top. Applied only to the decorative blob layer —
 *  never the text — so labels and icons stay crisp. */
const GooeyFilter = ({ id, blur }: { id: string; blur: number }) => (
  <svg aria-hidden="true" focusable="false" className="absolute h-0 w-0">
    <defs>
      <filter id={id} colorInterpolationFilters="sRGB">
        <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="blur" />
        <feColorMatrix
          in="blur"
          mode="matrix"
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
          result="goo"
        />
        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
      </filter>
    </defs>
  </svg>
)

/**
 * A two-stage confirm button. Click the pill and it warms to an accent color,
 * its label morphs to a confirm prompt, and a circular action button oozes out
 * of the right edge — the two shapes share a gooey SVG filter, so the action
 * appears to stretch away from the pill like liquid before snapping free. Click
 * the action button to confirm (`onConfirm`); click the pill again, click
 * outside, or press Escape to cancel.
 *
 * The merging pill and circle are a separate, filter-only blob layer, so only
 * solid shapes pass through the goo while the label and icon render crisply on
 * top. Every color, size, and timing value is a CSS custom property, so each
 * instance recolors and retimes independently and stays theme- and dark-mode
 * aware. Under `prefers-reduced-motion` the morph and slide apply instantly with
 * no transition.
 */
const GooeyButton = React.forwardRef<HTMLButtonElement, GooeyButtonProps>(
  (
    {
      children,
      confirmLabel = 'Sure?',
      onConfirm,
      onArmedChange,
      icon = <Check strokeWidth={3} />,
      confirmActionLabel = 'Confirm',
      surface = 'var(--color-primary)',
      surfaceActive = 'var(--color-destructive)',
      textColor = 'var(--color-primary-foreground)',
      textColorActive = 'var(--color-destructive-foreground)',
      iconColor = 'var(--color-destructive-foreground)',
      height = 48,
      paddingInline = '1.5rem',
      duration = 450,
      radius = '9999px',
      borderColor,
      borderWidth = 2,
      disabled = false,
      type = 'button',
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const [armed, setArmed] = React.useState(false)
    const rootRef = React.useRef<HTMLDivElement>(null)

    // React.useId yields colons (":r0:") that are invalid inside url(#…); strip
    // them so the filter reference resolves.
    const filterId = `lumen-gooey-${React.useId().replace(/:/g, '')}`

    // Notify on changes only — skip the initial mount so onArmedChange fires for
    // real transitions (toggle, outside-click, Escape, confirm) and not on render.
    const mounted = React.useRef(false)
    React.useEffect(() => {
      if (!mounted.current) {
        mounted.current = true
        return
      }
      onArmedChange?.(armed)
    }, [armed, onArmedChange])

    // While armed, a click outside the component or an Escape press cancels.
    React.useEffect(() => {
      if (!armed) return
      const onPointerDown = (e: MouseEvent) => {
        if (rootRef.current && !rootRef.current.contains(e.target as Node)) setArmed(false)
      }
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setArmed(false)
      }
      document.addEventListener('mousedown', onPointerDown)
      document.addEventListener('keydown', onKeyDown)
      return () => {
        document.removeEventListener('mousedown', onPointerDown)
        document.removeEventListener('keydown', onKeyDown)
      }
    }, [armed])

    const rootStyle = {
      '--gb-h': `${height}px`,
      '--gb-px': paddingInline,
      '--gb-radius': radius,
      // Slide a touch farther than the circle's own width so it fully clears the
      // pill before settling — the gap is what lets the goo bridge snap.
      '--gb-shift': `calc(${height}px * 1.18)`,
      '--gb-dur': `${duration}ms`,
      // Slight overshoot so the action button springs out with a liquid bounce.
      '--gb-ease': 'cubic-bezier(0.34, 1.4, 0.64, 1)',
      // Bouncier curve for the icon's pop-in (overshoots past 1 then settles).
      '--gb-spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      '--gb-surface': surface,
      '--gb-surface-active': surfaceActive,
      '--gb-text': textColor,
      '--gb-text-active': textColorActive,
      '--gb-icon': iconColor,
      '--gb-icon-size': `${Math.round(height * 0.4)}px`,
      '--gb-border': borderColor ?? 'transparent',
      '--gb-bw': `${borderWidth}px`,
      ...style,
    } as React.CSSProperties

    return (
      <div
        ref={rootRef}
        data-armed={armed || undefined}
        style={rootStyle}
        className={cn(
          'group relative inline-flex h-[var(--gb-h)] items-center align-middle',
          // Tactile press: the whole pill dips on mousedown (anywhere inside),
          // then springs back — :active matches the root while a child is pressed.
          '[transition:scale_150ms_cubic-bezier(0.34,1.4,0.64,1)] active:scale-[0.96] motion-reduce:active:scale-100 motion-reduce:transition-none',
          disabled && 'pointer-events-none opacity-50',
        )}
      >
        <GooeyFilter id={filterId} blur={Number((height * 0.16).toFixed(2))} />

        {/* Border layer: the same blob shapes in the rim color, each grown by the
            border width and run through the goo on their own. Sitting behind the
            surface blobs, the larger metaball peeks out as a rim that follows the
            whole merged silhouette — pill, bridge, and circle as one. */}
        {borderColor ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0"
            style={{ filter: `url(#${filterId})` }}
          >
            <span className="absolute inset-[calc(-1*var(--gb-bw))] rounded-[calc(var(--gb-radius)+var(--gb-bw))] bg-[var(--gb-border)]" />
            <span className="absolute top-[calc(-1*var(--gb-bw))] right-[calc(-1*var(--gb-bw))] aspect-square h-[calc(100%+2*var(--gb-bw))] translate-x-0 rounded-full bg-[var(--gb-border)] [transition:translate_var(--gb-dur)_var(--gb-ease)] group-data-[armed]:translate-x-[var(--gb-shift)] motion-reduce:transition-none" />
          </div>
        ) : null}

        {/* Filter-only blob layer: solid shapes that merge through the goo. The
            circle starts inscribed in the pill's right end (same color → unseen),
            then both warm to the accent and the circle slides clear when armed. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{ filter: `url(#${filterId})` }}
        >
          <span className="absolute inset-0 rounded-[var(--gb-radius)] bg-[var(--gb-surface)] [transition:background-color_var(--gb-dur)_ease] group-data-[armed]:bg-[var(--gb-surface-active)] motion-reduce:transition-none" />
          <span className="absolute top-0 right-0 aspect-square h-full translate-x-0 rounded-full bg-[var(--gb-surface)] [transition:translate_var(--gb-dur)_var(--gb-ease),background-color_var(--gb-dur)_ease] group-data-[armed]:translate-x-[var(--gb-shift)] group-data-[armed]:bg-[var(--gb-surface-active)] motion-reduce:transition-none" />
        </div>

        {/* The pill: transparent (color comes from the blob behind it), holds the
            morphing label and arms/cancels on click. */}
        <button
          ref={ref}
          type={type}
          disabled={disabled}
          aria-pressed={armed}
          onClick={() => setArmed((prev) => !prev)}
          className={cn(
            'relative z-[2] inline-flex h-full cursor-pointer select-none items-center justify-center whitespace-nowrap rounded-[var(--gb-radius)] border-0 bg-transparent px-[var(--gb-px)] font-medium text-[var(--gb-text)] outline-none [-webkit-tap-highlight-color:transparent] [transition:color_var(--gb-dur)_ease] group-data-[armed]:text-[var(--gb-text-active)]',
            'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none',
            className,
          )}
          {...rest}
        >
          {/* Both labels share one grid cell so the pill sizes to the wider of the
              two and never reflows. They cross-fade with a blur AND a short
              vertical roll — the resting label lifts up and out as the confirm
              label rises into place — so the swap reads as motion, not a dissolve.
              The roll runs a touch quicker than the slide so it lands first. */}
          <span className="grid place-items-center overflow-hidden">
            <span
              aria-hidden={armed}
              className="col-start-1 row-start-1 [transition:opacity_calc(var(--gb-dur)*0.7)_ease,filter_calc(var(--gb-dur)*0.7)_ease,translate_calc(var(--gb-dur)*0.7)_var(--gb-ease)] group-data-[armed]:-translate-y-[60%] group-data-[armed]:opacity-0 group-data-[armed]:blur-[6px] motion-reduce:!translate-y-0 motion-reduce:transition-none"
            >
              {children}
            </span>
            <span
              aria-hidden={!armed}
              className="col-start-1 row-start-1 translate-y-[60%] opacity-0 blur-[6px] [transition:opacity_calc(var(--gb-dur)*0.7)_ease,filter_calc(var(--gb-dur)*0.7)_ease,translate_calc(var(--gb-dur)*0.7)_var(--gb-ease)] group-data-[armed]:translate-y-0 group-data-[armed]:opacity-100 group-data-[armed]:blur-[0px] motion-reduce:!translate-y-0 motion-reduce:transition-none"
            >
              {confirmLabel}
            </span>
          </span>
        </button>

        {/* The action button tracks the circle blob exactly. Hidden and
            unfocusable until armed, so keyboard and AT users only reach it once
            the confirm step is live. */}
        <button
          type="button"
          aria-label={confirmActionLabel}
          aria-hidden={!armed}
          tabIndex={armed ? 0 : -1}
          disabled={!armed || disabled}
          onClick={() => {
            onConfirm?.()
            setArmed(false)
          }}
          className={cn(
            // Tracks the circle blob's slide. No opacity here — the icon owns its
            // own reveal — and pointer-events stay off until armed so clicks in the
            // overlap fall through to the pill (no dead zone on its right edge).
            'absolute top-0 right-0 z-[2] grid aspect-square h-full translate-x-0 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-[var(--gb-icon)] outline-none pointer-events-none [transition:translate_var(--gb-dur)_var(--gb-ease)] group-data-[armed]:translate-x-[var(--gb-shift)] group-data-[armed]:pointer-events-auto',
            'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none',
          )}
        >
          {/* Pops in after the blob has oozed clear: scales up from small, spins
              from -90° to 0, and fades — with an enter delay so it lands once the
              circle has separated. Exit has no delay, so it snaps away on cancel. */}
          <span className="grid -rotate-90 scale-[0.4] place-items-center opacity-0 [transition:scale_var(--gb-dur)_var(--gb-spring),rotate_var(--gb-dur)_var(--gb-spring),opacity_calc(var(--gb-dur)*0.5)_ease] group-data-[armed]:rotate-0 group-data-[armed]:scale-100 group-data-[armed]:opacity-100 group-data-[armed]:[transition-delay:calc(var(--gb-dur)*0.3)] [&_svg]:size-[var(--gb-icon-size)] motion-reduce:transition-none">
            {icon}
          </span>
        </button>
      </div>
    )
  },
)
GooeyButton.displayName = 'GooeyButton'

export { GooeyButton }
