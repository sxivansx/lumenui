'use client'

import * as React from 'react'
import { cn } from '../../lib/utils'

/* ── Geometry helpers ───────────────────────────────────────────────────────
 * A horizontal "span" of space, in px, expressed as [start, end]. The layout
 * engine works almost entirely in these 1-D intervals: each image contributes
 * the intervals it occludes on a given text line, and the text fills whatever
 * is left over. Keeping everything in flat number tuples keeps the per-frame
 * math cheap enough to re-run on every pointer move. */
type Interval = [number, number]

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max)

/** Sort and union overlapping/touching intervals into a minimal disjoint set. */
function mergeIntervals(list: Interval[]): Interval[] {
  if (list.length < 2) return list
  const sorted = [...list].sort((a, b) => a[0] - b[0])
  const out: Interval[] = [sorted[0] as Interval]
  for (let i = 1; i < sorted.length; i++) {
    const cur = sorted[i] as Interval
    const last = out[out.length - 1] as Interval
    if (cur[0] <= last[1]) last[1] = Math.max(last[1], cur[1])
    else out.push(cur)
  }
  return out
}

/** The complement of `blocked` within [0, width] — the gaps text can flow into. */
function freeSegments(blocked: Interval[], width: number): Interval[] {
  const merged = mergeIntervals(blocked.map(([a, b]) => [clamp(a, 0, width), clamp(b, 0, width)]))
  const segs: Interval[] = []
  let cursor = 0
  for (const [a, b] of merged) {
    if (a > cursor) segs.push([cursor, a])
    cursor = Math.max(cursor, b)
    if (cursor >= width) break
  }
  if (cursor < width) segs.push([cursor, width])
  // Drop hairline slivers that can't hold any glyph.
  return segs.filter(([a, b]) => b - a > 1)
}

/* ── Alpha mask ──────────────────────────────────────────────────────────────
 * Each transparent image is rasterised once into a small offscreen canvas and
 * reduced to per-row "opaque runs": for every scanline of the downsampled mask
 * we record the x-ranges (normalised 0–1) whose alpha clears the threshold.
 * This is what lets text hug the *actual* silhouette — including interior holes
 * (a ring, a letter) — rather than the image's bounding box. Storing runs
 * normalised means moving or scaling the image is just an affine transform of
 * the cached data, with no re-sampling. */
interface Mask {
  rows: Interval[][]
  rowCount: number
}

function buildMask(img: HTMLImageElement, threshold: number, sampleStep: number): Mask | null {
  const nw = img.naturalWidth
  const nh = img.naturalHeight
  if (!nw || !nh) return null

  // `sampleStep` is the source-pixel stride: larger = coarser mask = cheaper.
  // Cap the long edge so huge images can't blow up getImageData.
  const step = Math.max(1, sampleStep)
  const longest = Math.max(nw, nh)
  const cap = 400
  const scale = Math.min(1 / step, cap / longest)
  const mw = Math.max(1, Math.round(nw * scale))
  const mh = Math.max(1, Math.round(nh * scale))

  const canvas = document.createElement('canvas')
  canvas.width = mw
  canvas.height = mh
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return null
  ctx.drawImage(img, 0, 0, mw, mh)

  let data: Uint8ClampedArray
  try {
    data = ctx.getImageData(0, 0, mw, mh).data
  } catch {
    // Cross-origin image tainted the canvas — fall back to no wrapping.
    return null
  }

  const alphaCut = clamp(threshold, 0, 1) * 255
  const rows: Interval[][] = new Array(mh)
  for (let y = 0; y < mh; y++) {
    const runs: Interval[] = []
    let start = -1
    const rowOffset = y * mw * 4
    for (let x = 0; x < mw; x++) {
      const opaque = (data[rowOffset + x * 4 + 3] ?? 0) > alphaCut
      if (opaque && start < 0) start = x
      else if (!opaque && start >= 0) {
        runs.push([start / mw, x / mw])
        start = -1
      }
    }
    if (start >= 0) runs.push([start / mw, 1])
    rows[y] = runs
  }
  return { rows, rowCount: mh }
}

/* ── Public types ─────────────────────────────────────────────────────────── */

export interface ShapeTextImage {
  src: string
  alt?: string
  /** Initial center X as a fraction of the canvas width (0–1). Default 0.5. */
  x?: number
  /** Initial center Y as a fraction of the canvas height (0–1). Default 0.5. */
  y?: number
  /** Rendered width as a fraction of the canvas width (0–1). Default 0.3. */
  width?: number
}

interface ShapeTextOwnProps {
  /** The body copy. Blank lines (`\n\n`) start a new paragraph. */
  text: string
  /** Transparent images the text flows around. */
  images?: ShapeTextImage[]
  /** Gap kept between the text and each contour, in px (like `shape-margin`). */
  wrapPadding?: number
  /** Alpha cutoff (0–1) for what counts as "solid". Raise it to let text flow
   *  into faint regions like shadows or glows. */
  alphaThreshold?: number
  /** Source-pixel stride when sampling contours. Lower = sharper, higher = cheaper. */
  sampleStep?: number
  /** Overlay the sampled wrap zones for inspection. */
  debug?: boolean
  /** Allow visitors to drag (and resize) the images on a live canvas. */
  draggable?: boolean
  /** Keep images inside the canvas bounds (`overflow: hidden`). */
  clip?: boolean
  /** Canvas height. Number → px. Default 460. */
  height?: number | string
  /** Body font size in px. Default 18. */
  fontSize?: number
  /** Line-height multiple. Default 1.55. */
  lineHeight?: number
  /** Text alignment within each flowed segment. */
  align?: 'left' | 'justify'
  /** Text color. Defaults to the inherited `currentColor`. */
  color?: string
  /** Inner inset for the text/image area, in px. Default 0. */
  padding?: number
}

export type ShapeTextProps = ShapeTextOwnProps &
  Omit<React.HTMLAttributes<HTMLDivElement>, keyof ShapeTextOwnProps>

/* ── Internal per-image record (mutated imperatively during drag) ──────────── */
interface ImageRecord {
  spec: ShapeTextImage
  /** Center X / Y and width, stored as fractions of the stage so positions stay
   *  proportional across resizes with no scaling math (and no drift). */
  cx: number
  cy: number
  wf: number
  /** natural height / natural width */
  aspect: number
  /** px geometry, recomputed from the fractions on every layout pass. */
  left: number
  top: number
  w: number
  h: number
  mask: Mask | null
  loaded: boolean
}

interface Placement {
  x: number
  y: number
  seg: number
}

interface DebugLine {
  top: number
  bottom: number
  blocked: Interval[]
  free: Interval[]
}

/**
 * Editorial-grade text wrapping that flows body copy around the real contours
 * of transparent images — including interior holes — and reflows live as the
 * images are dragged or resized.
 *
 * It's a tiny line-breaking engine rather than CSS floats (which can only wrap
 * one side of one box): each image is reduced to per-row alpha runs, and for
 * every text line the engine subtracts the occluded x-ranges from the column
 * width and greedily fills the gaps that remain. Word positions are written
 * straight to the DOM as transforms, so a drag reflows the whole column without
 * a React re-render.
 */
const ShapeText = React.forwardRef<HTMLDivElement, ShapeTextProps>(
  (
    {
      text,
      images = [],
      wrapPadding = 8,
      alphaThreshold = 0.5,
      sampleStep = 4,
      debug = false,
      draggable = true,
      clip = true,
      height = 460,
      fontSize = 18,
      lineHeight = 1.55,
      align = 'left',
      color,
      padding = 0,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const rootRef = React.useRef<HTMLDivElement | null>(null)
    const stageRef = React.useRef<HTMLDivElement | null>(null)
    const wordRefs = React.useRef<(HTMLSpanElement | null)[]>([])
    const spaceRef = React.useRef<HTMLSpanElement | null>(null)
    const debugRef = React.useRef<HTMLCanvasElement | null>(null)
    const wrapRefs = React.useRef<(HTMLDivElement | null)[]>([])
    const imgElRefs = React.useRef<(HTMLImageElement | null)[]>([])

    const recsRef = React.useRef<ImageRecord[]>([])
    const widthsRef = React.useRef<{ words: number[]; space: number } | null>(null)
    const rafRef = React.useRef<number | null>(null)
    const dragRef = React.useRef<{
      idx: number
      mode: 'move' | 'resize'
      px: number
      py: number
      left: number
      top: number
      w: number
      h: number
    } | null>(null)

    // Split into paragraphs → words, flattened with a paragraph index so the
    // engine can force a break (and extra leading) between paragraphs.
    const tokens = React.useMemo(() => {
      const paras = text.split(/\n{2,}/)
      const words: { text: string; para: number }[] = []
      paras.forEach((p, pi) => {
        for (const w of p.trim().split(/\s+/)) if (w) words.push({ text: w, para: pi })
      })
      return words
    }, [text])

    // (Re)initialise the mutable image records when the image set changes.
    // Done in render via a key so positions survive unrelated re-renders.
    const imgKey = images.map((i) => i.src).join('|')
    const keyRef = React.useRef<string | null>(null)
    if (keyRef.current !== imgKey) {
      keyRef.current = imgKey
      recsRef.current = images.map((spec) => ({
        spec,
        cx: spec.x ?? 0.5,
        cy: spec.y ?? 0.5,
        wf: spec.width ?? 0.3,
        aspect: 1,
        left: 0,
        top: 0,
        w: 0,
        h: 0,
        mask: null,
        loaded: false,
      }))
    }

    const lineHeightPx = fontSize * lineHeight
    const paragraphGap = lineHeightPx * 0.55

    // Core layout: place every word for the current image positions.
    const layout = React.useCallback(() => {
      const stage = stageRef.current
      const widths = widthsRef.current
      if (!stage || !widths) return
      const W = stage.clientWidth
      const H = stage.clientHeight
      if (W <= 0) return

      // Resolve each image's px geometry from its fractional position, then
      // write it to the DOM. Recomputing every pass keeps it resize-proof.
      for (let i = 0; i < recsRef.current.length; i++) {
        const r = recsRef.current[i]
        const wrap = wrapRefs.current[i]
        if (!r) continue
        r.w = r.wf * W
        r.h = r.w * (r.aspect || 1)
        r.left = r.cx * W - r.w / 2
        r.top = r.cy * H - r.h / 2
        if (!wrap) continue
        wrap.style.width = `${r.w}px`
        wrap.style.height = `${r.h}px`
        wrap.style.transform = `translate(${r.left}px, ${r.top}px)`
      }

      const { words: wordW, space: spaceW } = widths
      const placements: (Placement | null)[] = new Array(tokens.length).fill(null)
      const debugLines: DebugLine[] = []
      const EPS = 0.5

      let y = 0
      let i = 0
      let guard = 0
      while (i < tokens.length && guard++ < 100000) {
        const para = tokens[i]?.para ?? 0
        const lineTop = y
        const lineBottom = y + lineHeightPx

        // Which x-ranges are occluded across this line's vertical band?
        const blocked: Interval[] = []
        for (const r of recsRef.current) {
          if (!r.mask) continue
          const localTop = lineTop - r.top
          const localBottom = lineBottom - r.top
          if (localBottom <= 0 || localTop >= r.h) continue
          const rc = r.mask.rowCount
          const r0 = clamp(Math.floor((clamp(localTop, 0, r.h) / r.h) * rc), 0, rc - 1)
          const r1 = clamp(Math.floor((clamp(localBottom, 0, r.h) / r.h - 1e-6) * rc), 0, rc - 1)
          for (let row = r0; row <= r1; row++) {
            const runs = r.mask.rows[row]
            if (!runs) continue
            for (const [a, b] of runs) {
              blocked.push([r.left + a * r.w - wrapPadding, r.left + b * r.w + wrapPadding])
            }
          }
        }

        const segs = freeSegments(blocked, W)
        if (debug) debugLines.push({ top: lineTop, bottom: lineBottom, blocked, free: segs })

        // Greedily pour words into each gap, left to right.
        const lineStart = i
        let placedAny = false
        let wi = i
        for (let s = 0; s < segs.length; s++) {
          const seg = segs[s] as Interval
          let x = seg[0]
          let atStart = true
          while (wi < tokens.length && tokens[wi]?.para === para) {
            const ww = wordW[wi] ?? 0
            const advance = atStart ? ww : spaceW + ww
            if (x + advance <= seg[1] + EPS) {
              if (!atStart) x += spaceW
              placements[wi] = { x, y, seg: s }
              x += ww
              atStart = false
              placedAny = true
              wi++
            } else break
          }
        }

        // Guarantee forward progress even when nothing fit (e.g. a word wider
        // than every gap, or a line fully behind an image): force-place one word.
        if (!placedAny) {
          const widest = segs.reduce<Interval | null>(
            (best, s) => (!best || s[1] - s[0] > best[1] - best[0] ? s : best),
            null,
          )
          placements[lineStart] = { x: widest ? widest[0] : 0, y, seg: 0 }
          wi = lineStart + 1
        }

        const lastOfPara = wi >= tokens.length || tokens[wi]?.para !== para
        if (align === 'justify' && !lastOfPara) {
          justifyLine(placements, lineStart, wi, segs, wordW)
        }

        i = wi
        y = lastOfPara && i < tokens.length ? lineBottom + paragraphGap : lineBottom
      }

      // Apply placements to the word spans as transforms.
      for (let k = 0; k < tokens.length; k++) {
        const span = wordRefs.current[k]
        if (!span) continue
        const p = placements[k]
        if (!p) {
          span.style.opacity = '0'
          continue
        }
        span.style.opacity = '1'
        span.style.transform = `translate(${p.x}px, ${p.y}px)`
      }

      if (debug) drawDebug(debugRef.current, W, H, debugLines)
    }, [tokens, lineHeightPx, paragraphGap, wrapPadding, align, debug])

    const scheduleLayout = React.useCallback(() => {
      if (rafRef.current != null) return
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        layout()
      })
    }, [layout])

    // Measure intrinsic word widths once the spans exist with their final font,
    // then lay out synchronously so there's no flash of unpositioned text.
    // `layout`'s identity already changes when the font size/line-height do
    // (via `lineHeightPx`), so it re-measures whenever the metrics shift.
    React.useLayoutEffect(() => {
      const words = tokens.map((_, k) => wordRefs.current[k]?.getBoundingClientRect().width ?? 0)
      const space = spaceRef.current?.getBoundingClientRect().width ?? 0
      widthsRef.current = { words, space }
      layout()
    }, [tokens, layout])

    // Re-measure after web fonts finish loading (metrics shift under fallbacks).
    React.useEffect(() => {
      const fonts = (document as Document & { fonts?: FontFaceSet }).fonts
      if (!fonts?.ready) return
      let alive = true
      fonts.ready.then(() => {
        if (!alive) return
        const words = tokens.map((_, k) => wordRefs.current[k]?.getBoundingClientRect().width ?? 0)
        const space = spaceRef.current?.getBoundingClientRect().width ?? 0
        widthsRef.current = { words, space }
        layout()
      })
      return () => {
        alive = false
      }
    }, [tokens, layout])

    // Reflow on container resize. Geometry is derived from fractions each pass,
    // so positions stay proportional automatically — nothing to scale here.
    React.useEffect(() => {
      const stage = stageRef.current
      if (!stage || typeof ResizeObserver === 'undefined') return
      const ro = new ResizeObserver(() => scheduleLayout())
      ro.observe(stage)
      return () => ro.disconnect()
    }, [scheduleLayout])

    // Reflow when wrap/threshold knobs change (masks are rebuilt separately).
    React.useEffect(() => {
      scheduleLayout()
    }, [scheduleLayout])

    // Build masks for any image that's already decoded — on mount (covers
    // images served from cache, whose `load` event can fire before React
    // attaches `onLoad`) and whenever the alpha sampling parameters change.
    // biome-ignore lint/correctness/useExhaustiveDependencies: imgKey re-runs this when the image set changes; recsRef is a ref, so it isn't reactive on its own.
    React.useEffect(() => {
      let changed = false
      recsRef.current.forEach((r, i) => {
        const el = imgElRefs.current[i]
        if (el?.complete && el.naturalWidth) {
          r.loaded = true
          r.aspect = el.naturalHeight / el.naturalWidth
          r.mask = buildMask(el, alphaThreshold, sampleStep)
          changed = true
        }
      })
      if (changed) scheduleLayout()
    }, [alphaThreshold, sampleStep, scheduleLayout, imgKey])

    React.useEffect(() => {
      return () => {
        if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      }
    }, [])

    const handleImageLoad = (idx: number) => {
      const r = recsRef.current[idx]
      const el = imgElRefs.current[idx]
      if (!r || !el) return
      r.loaded = true
      r.aspect = el.naturalWidth ? el.naturalHeight / el.naturalWidth : 1
      r.mask = buildMask(el, alphaThreshold, sampleStep)
      scheduleLayout()
    }

    const startDrag = (e: React.PointerEvent, idx: number, mode: 'move' | 'resize') => {
      if (!draggable) return
      const r = recsRef.current[idx]
      const wrap = wrapRefs.current[idx]
      if (!r || !wrap) return
      e.preventDefault()
      e.stopPropagation()
      wrap.setPointerCapture(e.pointerId)
      wrap.style.cursor = mode === 'move' ? 'grabbing' : 'nwse-resize'
      dragRef.current = {
        idx,
        mode,
        px: e.clientX,
        py: e.clientY,
        left: r.left,
        top: r.top,
        w: r.w,
        h: r.h,
      }
    }

    const onPointerMove = (e: React.PointerEvent) => {
      const d = dragRef.current
      if (!d) return
      const r = recsRef.current[d.idx]
      const stage = stageRef.current
      if (!r || !stage) return
      const W = stage.clientWidth
      const H = stage.clientHeight
      if (W <= 0 || H <= 0) return
      const dx = e.clientX - d.px
      const dy = e.clientY - d.py
      if (d.mode === 'move') {
        // Store the new center as a fraction, clamped so the image's center
        // can't leave the stage (it always stays grabbable).
        r.cx = clamp(d.left + dx + d.w / 2, 0, W) / W
        r.cy = clamp(d.top + dy + d.h / 2, 0, H) / H
      } else {
        // Resize about the center (keeps cx/cy fixed); fraction of stage width.
        r.wf = clamp(d.w + dx, 40, W * 1.5) / W
      }
      scheduleLayout()
    }

    const endDrag = (e: React.PointerEvent, idx: number) => {
      const wrap = wrapRefs.current[idx]
      if (wrap) {
        if (wrap.hasPointerCapture?.(e.pointerId)) wrap.releasePointerCapture(e.pointerId)
        wrap.style.cursor = draggable ? 'grab' : 'default'
      }
      dragRef.current = null
    }

    const stageStyle: React.CSSProperties = {
      position: 'absolute',
      inset: padding,
      fontSize,
      lineHeight: String(lineHeight),
      color,
    }

    return (
      <div
        ref={(node) => {
          rootRef.current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
        }}
        className={cn('relative w-full select-none', className)}
        style={{
          height: typeof height === 'number' ? `${height}px` : height,
          overflow: clip ? 'hidden' : 'visible',
          ...style,
        }}
        {...rest}
      >
        <div ref={stageRef} style={stageStyle}>
          {/* Text column — painted beneath the images, never intercepts pointers. */}
          {tokens.map((t, k) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: token list is positional and stable for a given `text`
              key={k}
              ref={(el) => {
                wordRefs.current[k] = el
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                whiteSpace: 'pre',
                willChange: 'transform',
                pointerEvents: 'none',
                opacity: 0,
              }}
            >
              {t.text}
            </span>
          ))}
          {/* Probe used to measure the rendered width of a single space. */}
          <span
            ref={spaceRef}
            aria-hidden
            style={{ position: 'absolute', top: 0, left: 0, whiteSpace: 'pre', opacity: 0 }}
          >
            {' '}
          </span>

          {debug && (
            <canvas
              ref={debugRef}
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
              }}
            />
          )}

          {/* Draggable images — painted on top so they read as the focal object. */}
          {images.map((img, idx) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: image set is keyed by src via imgKey reset above
              key={`${img.src}-${idx}`}
              ref={(el) => {
                wrapRefs.current[idx] = el
              }}
              onPointerDown={(e) => startDrag(e, idx, 'move')}
              onPointerMove={onPointerMove}
              onPointerUp={(e) => endDrag(e, idx)}
              onPointerCancel={(e) => endDrag(e, idx)}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                touchAction: draggable ? 'none' : undefined,
                cursor: draggable ? 'grab' : 'default',
                willChange: 'transform',
              }}
            >
              <img
                ref={(el) => {
                  imgElRefs.current[idx] = el
                }}
                src={img.src}
                alt={img.alt ?? ''}
                draggable={false}
                onLoad={() => handleImageLoad(idx)}
                style={{
                  display: 'block',
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              />
              {draggable && (
                <span
                  aria-hidden
                  onPointerDown={(e) => startDrag(e, idx, 'resize')}
                  style={{
                    position: 'absolute',
                    right: -7,
                    bottom: -7,
                    width: 14,
                    height: 14,
                    borderRadius: 4,
                    background: 'var(--color-background, #fff)',
                    border: '1.5px solid currentColor',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
                    cursor: 'nwse-resize',
                    opacity: 0.55,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    )
  },
)
ShapeText.displayName = 'ShapeText'

/** Spread each segment's words to fill it (skips single-word and last lines). */
function justifyLine(
  placements: (Placement | null)[],
  start: number,
  end: number,
  segs: Interval[],
  wordW: number[],
): void {
  const bySeg = new Map<number, number[]>()
  for (let k = start; k < end; k++) {
    const p = placements[k]
    if (!p) continue
    const arr = bySeg.get(p.seg)
    if (arr) arr.push(k)
    else bySeg.set(p.seg, [k])
  }
  for (const [segIdx, idxs] of bySeg) {
    const seg = segs[segIdx]
    if (!seg || idxs.length < 2) continue
    const last = idxs[idxs.length - 1] as number
    const naturalEnd = (placements[last]?.x ?? 0) + (wordW[last] ?? 0)
    const extra = seg[1] - naturalEnd
    if (extra <= 0) continue
    const perGap = extra / (idxs.length - 1)
    idxs.forEach((k, gi) => {
      const p = placements[k]
      if (p) p.x += perGap * gi
    })
  }
}

/** Paint the sampled wrap zones: blocked ranges filled, free gaps outlined. */
function drawDebug(
  canvas: HTMLCanvasElement | null,
  W: number,
  H: number,
  lines: DebugLine[],
): void {
  if (!canvas) return
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
  canvas.width = Math.max(1, Math.round(W * dpr))
  canvas.height = Math.max(1, Math.round(H * dpr))
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.scale(dpr, dpr)
  ctx.clearRect(0, 0, W, H)
  for (const line of lines) {
    const h = line.bottom - line.top
    ctx.fillStyle = 'rgba(220, 38, 38, 0.14)'
    for (const [a, b] of mergeIntervals(line.blocked)) {
      ctx.fillRect(clamp(a, 0, W), line.top, clamp(b, 0, W) - clamp(a, 0, W), h)
    }
    ctx.strokeStyle = 'rgba(37, 99, 235, 0.5)'
    ctx.lineWidth = 1
    for (const [a, b] of line.free) {
      ctx.strokeRect(a + 0.5, line.top + 0.5, b - a - 1, h - 1)
    }
  }
}

export { ShapeText }
