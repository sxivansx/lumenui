import { Button } from 'lumenui'
import Link from 'next/link'
import { ComponentPreview } from '@/components/component-preview'

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <h1 className="font-bold text-4xl tracking-tight">lumenui</h1>
        <p className="text-lg text-muted-foreground">
          Accessible, themeable React components built on Radix UI and Tailwind CSS v4. Designed for
          Next.js and any modern React 19 app.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/components/button">Browse components</Link>
          </Button>
          <Button variant="outline" asChild>
            <a href="https://www.npmjs.com/package/lumenui" target="_blank" rel="noreferrer">
              View on npm
            </a>
          </Button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-medium text-muted-foreground text-sm uppercase tracking-wider">
          Install
        </h2>
        <pre className="overflow-x-auto rounded-lg border bg-muted/40 p-4 text-sm">
          <code>bun add lumenui</code>
        </pre>
        <p className="text-muted-foreground text-sm">
          Then import the stylesheet once and use any component.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-xl">Example</h2>
        <ComponentPreview name="button-variants" />
      </section>
    </div>
  )
}
