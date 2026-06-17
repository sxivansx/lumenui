import { LiquidButton } from '@shivansh.life/lumenui'

export default function LiquidButtonVariants() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Bigger, slower goo */}
      <LiquidButton blobSize={18} blobSpacing={72} blobScale={4.5} blobRise={240}>
        Bigger goo
      </LiquidButton>

      {/* Inverted colors */}
      <LiquidButton
        className="border"
        backgroundColor="#ffffff"
        textColor="#0a0a0a"
        blobColor="#0a0a0a"
        hoverTextColor="#ffffff"
      >
        Inverted
      </LiquidButton>

      {/* Rendered as a link */}
      <LiquidButton href="#" padding="14px 28px">
        As a link
      </LiquidButton>
    </div>
  )
}
