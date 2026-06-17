'use client'

import { GlassButton } from '@shivansh.life/lumenui'
import { useState } from 'react'

// Apple-style mesh-gradient wallpapers — the glass refracts whatever sits behind it.
const WALLPAPERS = [
  'radial-gradient(120% 120% at 15% 10%, #8aa0ff 0%, transparent 45%), radial-gradient(120% 120% at 85% 15%, #3b4fd6 0%, transparent 50%), radial-gradient(140% 130% at 50% 110%, #060a24 0%, transparent 60%), linear-gradient(160deg, #1f2f9e, #0a1030)',
  'radial-gradient(120% 120% at 20% 15%, #ffd6a0 0%, transparent 45%), radial-gradient(120% 120% at 82% 12%, #ff7e9d 0%, transparent 50%), radial-gradient(140% 130% at 50% 110%, #3a1040 0%, transparent 60%), linear-gradient(160deg, #ff5e7e, #3a1040)',
  'radial-gradient(120% 120% at 18% 20%, #8dffd0 0%, transparent 45%), radial-gradient(120% 120% at 85% 18%, #2bb6ff 0%, transparent 50%), radial-gradient(140% 130% at 50% 110%, #04222c 0%, transparent 60%), linear-gradient(160deg, #0e7a86, #05202a)',
]

export default function GlassButtonDemo() {
  const [active, setActive] = useState(0)

  return (
    <div className="relative w-full overflow-hidden rounded-xl">
      {/* Wallpapers crossfade behind the glass. */}
      {WALLPAPERS.map((bg, i) => (
        <div
          key={bg}
          aria-hidden
          className="absolute inset-0 transition-opacity duration-700"
          style={{ background: bg, opacity: i === active ? 1 : 0 }}
        />
      ))}

      <div className="relative flex min-h-[300px] items-center justify-center p-10">
        <GlassButton textColor="#ffffff">Get started</GlassButton>
      </div>

      {/* Wallpaper switcher. */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {WALLPAPERS.map((bg, i) => (
          <button
            key={bg}
            type="button"
            aria-label={`Wallpaper ${i + 1}`}
            aria-pressed={i === active}
            onClick={() => setActive(i)}
            className={`h-2 rounded-full ring-1 ring-white/30 transition-all ${
              i === active ? 'w-5 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
