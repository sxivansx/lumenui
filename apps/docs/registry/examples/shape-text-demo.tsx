'use client'

import { ShapeText, type ShapeTextImage } from '@shivansh.life/lumenui'
import * as React from 'react'

const TEXT = `Great typography has always been a conversation between words and the space around them. On the printed page a column of text would bend gracefully around an illustration, a drop cap, a photograph set into the margin. The eye followed the contour and the page felt composed rather than poured.

The web mostly forgot how to do this. Text became rectangles stacked inside other rectangles, and images were pushed above or below the words instead of living among them. Layouts grew tidy, and a little lifeless.

This component brings the old craft back. Drop in a transparent PNG or SVG and the paragraph wraps around its real silhouette, not its bounding box, slipping into every hollow and hugging every curve. Drag a shape across the canvas, or upload one of your own, and the text reflows beneath your cursor in real time.`

// Ships with a real transparent PNG (the leaf) and an SVG shape, so the wrap
// works the same whether the contour comes from vector art or a raster cut-out.
const DEFAULT_IMAGES: ShapeTextImage[] = [
  { src: '/shape-text/leaf.png', alt: 'A leaf (PNG)', x: 0.71, y: 0.29, width: 0.24 },
  { src: '/shape-text/blob.svg', alt: 'A blob (SVG)', x: 0.28, y: 0.76, width: 0.28 },
]

export default function ShapeTextDemo() {
  const [uploads, setUploads] = React.useState<ShapeTextImage[]>([])
  // Track every object URL we mint and revoke them only on unmount, so URLs
  // still referenced by the canvas are never freed out from under it.
  const urlsRef = React.useRef<string[]>([])
  React.useEffect(
    () => () => {
      for (const url of urlsRef.current) URL.revokeObjectURL(url)
    },
    [],
  )

  const onUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const src = URL.createObjectURL(file)
    urlsRef.current.push(src)
    setUploads((prev) => [
      ...prev,
      // Stagger new drops slightly so several uploads don't stack exactly.
      { src, alt: file.name, x: 0.5 + prev.length * 0.04, y: 0.45, width: 0.28 },
    ])
    event.target.value = '' // let the same file be chosen again
  }

  const images = React.useMemo(() => [...DEFAULT_IMAGES, ...uploads], [uploads])

  return (
    <div className="flex w-full max-w-2xl flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border bg-card px-3 py-1.5 font-medium text-sm shadow-sm transition-colors hover:bg-muted">
          Upload a transparent PNG
          <input
            type="file"
            accept="image/png,image/webp,image/svg+xml"
            className="hidden"
            onChange={onUpload}
          />
        </label>
        <span className="text-muted-foreground text-xs">
          Drag any object — or drop in your own transparent PNG.
        </span>
      </div>
      <ShapeText
        height={460}
        align="justify"
        fontSize={17}
        lineHeight={1.6}
        wrapPadding={12}
        text={TEXT}
        images={images}
      />
    </div>
  )
}
