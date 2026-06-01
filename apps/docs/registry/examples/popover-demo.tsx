import { Button, Popover, PopoverContent, PopoverTrigger } from 'lumenui'

export default function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-1">
          <p className="font-medium text-sm">Dimensions</p>
          <p className="text-muted-foreground text-sm">Set the dimensions for the layer.</p>
        </div>
      </PopoverContent>
    </Popover>
  )
}
