import { Separator } from '@shivansh.life/lumenui'

export default function SeparatorDemo() {
  return (
    <div className="w-[320px]">
      <div className="space-y-1">
        <p className="font-medium text-sm leading-none">lumenui</p>
        <p className="text-muted-foreground text-sm">A React component library.</p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center gap-4 text-sm">
        <span>Docs</span>
        <Separator orientation="vertical" />
        <span>Source</span>
        <Separator orientation="vertical" />
        <span>npm</span>
      </div>
    </div>
  )
}
