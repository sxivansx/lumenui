import { GlassButton } from '@shivansh.life/lumenui'

export default function GlassButtonDemo() {
  return (
    <div
      className="flex min-h-[320px] w-full items-center justify-center overflow-hidden rounded-xl bg-cover bg-center p-10"
      style={{ backgroundImage: "url('/glass-backdrop.jpg')" }}
    >
      <GlassButton textColor="#2a1408">Get started</GlassButton>
    </div>
  )
}
