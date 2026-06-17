import { ShinyButton } from '@shivansh.life/lumenui'

export default function ShinyButtonVariants() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Faster, gold shine */}
      <ShinyButton shine="#fde68a" accent="#b45309" speed={2.5}>
        Upgrade to Pro
      </ShinyButton>

      {/* Light surface, dark label */}
      <ShinyButton
        surface="linear-gradient(180deg, #ffffff, #e7e7e7)"
        textColor="#0a0a0a"
        accent="#a1a1aa"
        rim="rgba(0, 0, 0, 0.12)"
      >
        Join the waitlist
      </ShinyButton>

      {/* Rendered as a link, squared off */}
      <ShinyButton href="#" radius="12px" padding="14px 24px">
        Read the docs
      </ShinyButton>
    </div>
  )
}
