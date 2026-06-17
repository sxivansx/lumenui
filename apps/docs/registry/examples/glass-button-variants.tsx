import { GlassButton } from '@shivansh.life/lumenui'

// A single wallpaper so the frosted surface has something to refract.
const WALLPAPER =
  'radial-gradient(120% 120% at 15% 10%, #8aa0ff 0%, transparent 45%), radial-gradient(120% 120% at 85% 15%, #3b4fd6 0%, transparent 50%), radial-gradient(140% 130% at 50% 110%, #060a24 0%, transparent 60%), linear-gradient(160deg, #1f2f9e, #0a1030)'

export default function GlassButtonVariants() {
  return (
    <div
      className="relative flex min-h-[260px] w-full flex-wrap items-center justify-center gap-4 overflow-hidden rounded-xl p-10"
      style={{ background: WALLPAPER }}
    >
      {/* Default frost */}
      <GlassButton textColor="#ffffff">Continue</GlassButton>

      {/* Darker, smoked tint with a stronger blur — same rectangle as the rest */}
      <GlassButton textColor="#ffffff" tint="rgba(10, 12, 20, 0.4)" blur={18}>
        Smoked
      </GlassButton>

      {/* Rendered as a link */}
      <GlassButton href="#" textColor="#ffffff">
        As a link
      </GlassButton>
    </div>
  )
}
