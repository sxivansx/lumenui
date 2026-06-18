import { ShapeText } from '@shivansh.life/lumenui'

const TEXT = `Turn on debug mode to see exactly how the text is being shaped. The red bands are the zones each contour blocks out on a given line, expanded by the wrap padding; the blue outlines are the free segments the words are poured into. A five-pointed star is a good stress test, because its concave points force the column to open and close several times on a single line. Lower the sample step for crisper points, raise the alpha threshold to let the text creep further into the edges.`

export default function ShapeTextVariants() {
  return (
    <ShapeText
      className="max-w-2xl"
      height={420}
      align="left"
      fontSize={16}
      lineHeight={1.5}
      wrapPadding={6}
      sampleStep={2}
      alphaThreshold={0.5}
      debug
      text={TEXT}
      images={[
        { src: '/shape-text/star.svg', alt: 'A five-pointed star', x: 0.5, y: 0.5, width: 0.4 },
      ]}
    />
  )
}
