import { MagneticButton } from '@shivansh.life/lumenui'
import { ArrowUpRight } from 'lucide-react'

export default function MagneticButtonVariants() {
  return (
    <div className="flex flex-wrap items-center gap-8">
      {/* Stronger pull across a wider field */}
      <MagneticButton strength={0.6} range={36}>
        Strong pull
      </MagneticButton>

      {/* Outline / inverted colors */}
      <MagneticButton
        className="shadow-[inset_0_0_0_1px_var(--color-border)]"
        backgroundColor="#ffffff"
        textColor="#0a0a0a"
      >
        Outline
      </MagneticButton>

      {/* href renders a real <a> — the arrow marks it as a navigational link */}
      <MagneticButton href="#">
        <span className="inline-flex items-center gap-1.5">
          Read the docs
          <ArrowUpRight className="size-4" />
        </span>
      </MagneticButton>
    </div>
  )
}
