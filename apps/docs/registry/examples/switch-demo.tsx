import { Label, Switch } from '@shivansh.life/lumenui'

export default function SwitchDemo() {
  return (
    <div className="flex items-center gap-2">
      <Switch id="airplane" />
      <Label htmlFor="airplane">Airplane mode</Label>
    </div>
  )
}
