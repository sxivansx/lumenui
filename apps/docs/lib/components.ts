export interface ComponentExample {
  /** Registry key — must match a file in registry/examples/<name>.tsx */
  name: string
  title?: string
}

export interface ComponentDoc {
  slug: string
  name: string
  description: string
  /** Named exports shown in the import snippet. */
  importNames: string[]
  examples: ComponentExample[]
  /** Slug of the component this one nests under in the sidebar (e.g. a variant). */
  parent?: string
}

export const components: ComponentDoc[] = [
  {
    slug: 'button',
    name: 'Button',
    description: 'Trigger an action or event, with multiple variants and sizes.',
    importNames: ['Button'],
    examples: [{ name: 'button-demo' }, { name: 'button-variants', title: 'Variants' }],
  },
  {
    slug: 'liquid-button',
    name: 'Liquid Button',
    description: 'A pill button whose label inverts as blobs rise and merge into one liquid mass.',
    importNames: ['LiquidButton'],
    examples: [
      { name: 'liquid-button-demo' },
      { name: 'liquid-button-variants', title: 'Customization' },
    ],
    parent: 'button',
  },
  {
    slug: 'badge',
    name: 'Badge',
    description: 'A small label for statuses, counts, or categories.',
    importNames: ['Badge'],
    examples: [{ name: 'badge-demo' }],
  },
  {
    slug: 'card',
    name: 'Card',
    description: 'A flexible container for grouping related content.',
    importNames: [
      'Card',
      'CardHeader',
      'CardTitle',
      'CardDescription',
      'CardContent',
      'CardFooter',
    ],
    examples: [{ name: 'card-demo' }],
  },
  {
    slug: 'input',
    name: 'Input',
    description: 'A styled text input for forms.',
    importNames: ['Input'],
    examples: [{ name: 'input-demo' }],
  },
  {
    slug: 'textarea',
    name: 'Textarea',
    description: 'A multi-line text input.',
    importNames: ['Textarea'],
    examples: [{ name: 'textarea-demo' }],
  },
  {
    slug: 'label',
    name: 'Label',
    description: 'An accessible label associated with a form control.',
    importNames: ['Label'],
    examples: [{ name: 'label-demo' }],
  },
  {
    slug: 'checkbox',
    name: 'Checkbox',
    description: 'A control that toggles between checked and unchecked.',
    importNames: ['Checkbox'],
    examples: [{ name: 'checkbox-demo' }],
  },
  {
    slug: 'switch',
    name: 'Switch',
    description: 'A toggle between two states.',
    importNames: ['Switch'],
    examples: [{ name: 'switch-demo' }],
  },
  {
    slug: 'select',
    name: 'Select',
    description: 'A dropdown for choosing one value from a list.',
    importNames: ['Select', 'SelectTrigger', 'SelectValue', 'SelectContent', 'SelectItem'],
    examples: [{ name: 'select-demo' }],
  },
  {
    slug: 'dialog',
    name: 'Dialog',
    description: 'A modal window overlaid on the page.',
    importNames: ['Dialog', 'DialogTrigger', 'DialogContent', 'DialogHeader', 'DialogTitle'],
    examples: [{ name: 'dialog-demo' }],
  },
  {
    slug: 'dropdown-menu',
    name: 'Dropdown Menu',
    description: 'A menu of actions triggered by a button.',
    importNames: ['DropdownMenu', 'DropdownMenuTrigger', 'DropdownMenuContent', 'DropdownMenuItem'],
    examples: [{ name: 'dropdown-menu-demo' }],
  },
  {
    slug: 'tooltip',
    name: 'Tooltip',
    description: 'A floating label shown on hover or focus.',
    importNames: ['Tooltip', 'TooltipTrigger', 'TooltipContent', 'TooltipProvider'],
    examples: [{ name: 'tooltip-demo' }],
  },
  {
    slug: 'popover',
    name: 'Popover',
    description: 'Rich floating content anchored to a trigger.',
    importNames: ['Popover', 'PopoverTrigger', 'PopoverContent'],
    examples: [{ name: 'popover-demo' }],
  },
  {
    slug: 'tabs',
    name: 'Tabs',
    description: 'Switch between related panels of content.',
    importNames: ['Tabs', 'TabsList', 'TabsTrigger', 'TabsContent'],
    examples: [{ name: 'tabs-demo' }],
  },
  {
    slug: 'avatar',
    name: 'Avatar',
    description: 'An image element with a text fallback.',
    importNames: ['Avatar', 'AvatarImage', 'AvatarFallback'],
    examples: [{ name: 'avatar-demo' }],
  },
  {
    slug: 'separator',
    name: 'Separator',
    description: 'A visual divider between content.',
    importNames: ['Separator'],
    examples: [{ name: 'separator-demo' }],
  },
]
