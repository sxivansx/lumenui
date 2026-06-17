import { MagneticButton } from '@shivansh.life/lumenui'

export default function MagneticButtonVariants() {
  return (
    <div className="flex flex-wrap items-center gap-8">
      {/* Stronger pull across a wider field */}
      <MagneticButton strength={0.6} range={36}>
        Strong pull
      </MagneticButton>

      {/* Outline / inverted colors */}
      <MagneticButton className="border" backgroundColor="#ffffff" textColor="#0a0a0a">
        Outline
      </MagneticButton>

      {/* Rendered as a link */}
      <MagneticButton href="#" padding="14px 28px">
        As a link
      </MagneticButton>
    </div>
  )
}
