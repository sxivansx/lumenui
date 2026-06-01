import { Input, Label } from 'lumenui'

export default function LabelDemo() {
  return (
    <div className="grid w-[260px] gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="Email" />
    </div>
  )
}
