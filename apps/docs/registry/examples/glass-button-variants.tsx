import { GlassButton } from '@shivansh.life/lumenui'
import { ArrowRight } from 'lucide-react'

export default function GlassButtonVariants() {
  return (
    <div
      className="flex min-h-[260px] w-full flex-wrap items-center justify-center gap-4 overflow-hidden rounded-xl bg-cover bg-center p-10"
      style={{ backgroundImage: "url('/glass-backdrop.jpg')" }}
    >
      {/* Default frost — dark label reads over the light backdrop */}
      <GlassButton textColor="#2a1408">Continue</GlassButton>

      {/* Darker, smoked tint with a stronger blur — same rectangle as the rest */}
      <GlassButton textColor="#ffffff" tint="rgba(10, 12, 20, 0.4)" blur={18}>
        Smoked
      </GlassButton>

      {/* href renders a real <a>; on hover the arrow slides out to the right as a
          fresh arrow slides in from the left, clipped to its own 16px track */}
      <GlassButton href="#" textColor="#2a1408">
        <span className="inline-flex items-center gap-1.5">
          Read the docs
          <span className="relative inline-flex size-4 overflow-hidden">
            <ArrowRight className="absolute left-0 top-0 size-4 transition-transform duration-300 ease-out group-hover:translate-x-full motion-reduce:transition-none" />
            <ArrowRight className="absolute left-0 top-0 size-4 -translate-x-full transition-transform duration-300 ease-out group-hover:translate-x-0 motion-reduce:transition-none" />
          </span>
        </span>
      </GlassButton>
    </div>
  )
}
