import { GooeyButton } from '@shivansh.life/lumenui'
import { ArrowRight, Trash2 } from 'lucide-react'

export default function GooeyButtonVariants() {
  return (
    <div className="flex flex-wrap items-center gap-12">
      {/* Destructive default, but with a trash glyph and a taller pill */}
      <GooeyButton height={56} icon={<Trash2 strokeWidth={2.25} />}>
        Delete file
      </GooeyButton>

      {/* Light surface with a directional glyph and a gooey-following rim — the
          border wraps the whole shape, so the white pill reads on light backdrops */}
      <GooeyButton
        surface="#ffffff"
        textColor="#0a0a0a"
        surfaceActive="#0a0a0a"
        textColorActive="#ffffff"
        iconColor="#ffffff"
        icon={<ArrowRight strokeWidth={2.5} />}
        confirmLabel="Go ahead?"
        confirmActionLabel="Proceed"
        borderColor="#d4d4d8"
      >
        Continue
      </GooeyButton>
    </div>
  )
}
