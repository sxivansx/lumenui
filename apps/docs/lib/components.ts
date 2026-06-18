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
    slug: 'magnetic-button',
    name: 'Magnetic Button',
    description: 'A button that leans toward the cursor and scales up while the cursor is near.',
    importNames: ['MagneticButton'],
    examples: [
      { name: 'magnetic-button-demo' },
      { name: 'magnetic-button-variants', title: 'Customization' },
    ],
    parent: 'button',
  },
  {
    slug: 'glass-button',
    name: 'Glass Button',
    description:
      'A clean glass-style button with a transparent, frosted surface that blurs whatever sits behind it.',
    importNames: ['GlassButton'],
    examples: [
      { name: 'glass-button-demo' },
      { name: 'glass-button-variants', title: 'Customization' },
    ],
    parent: 'button',
  },
  {
    slug: 'shiny-button',
    name: 'Shiny Button',
    description:
      'A high-impact CTA pill with a conic-gradient streak that rotates around the border, a shimmering dot field, and a glow that rises on hover.',
    importNames: ['ShinyButton'],
    examples: [
      { name: 'shiny-button-demo' },
      { name: 'shiny-button-variants', title: 'Customization' },
    ],
    parent: 'button',
  },
  {
    slug: 'arrow-button',
    name: 'Arrow Button',
    description:
      'A pill CTA with a trailing circular badge whose background warms to an accent and whose arrow glides forward on hover.',
    importNames: ['ArrowButton'],
    examples: [{ name: 'arrow-button-demo' }],
    parent: 'button',
  },
  {
    slug: 'gooey-button',
    name: 'Gooey Button',
    description:
      'A two-stage confirm pill that warms to an accent, morphs its label, and oozes a circular action button out of its edge through a gooey filter.',
    importNames: ['GooeyButton'],
    examples: [
      { name: 'gooey-button-demo' },
      { name: 'gooey-button-variants', title: 'Customization' },
    ],
    parent: 'button',
  },
  {
    slug: 'shape-text',
    name: 'Shape Text',
    description:
      'Editorial text that flows around the real contours of transparent images — and reflows live as you drag them across the canvas.',
    importNames: ['ShapeText'],
    examples: [
      { name: 'shape-text-demo' },
      { name: 'shape-text-variants', title: 'Debug & tuning' },
    ],
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
    slug: 'neumorphic-toggle',
    name: 'Neumorphic Toggle',
    description:
      'A soft, tactile on/off toggle whose grip-textured knob springs out of a recessed groove as the track fills with color.',
    importNames: ['NeumorphicToggle'],
    examples: [{ name: 'neumorphic-toggle-demo' }],
    parent: 'switch',
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
