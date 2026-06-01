import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ComponentPreview } from '@/components/component-preview'
import { components } from '@/lib/components'

type Params = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return components.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const comp = components.find((c) => c.slug === slug)
  if (!comp) return {}
  return { title: comp.name, description: comp.description }
}

export default async function ComponentPage({ params }: Params) {
  const { slug } = await params
  const comp = components.find((c) => c.slug === slug)
  if (!comp) notFound()

  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-bold text-3xl tracking-tight">{comp.name}</h1>
        <p className="text-lg text-muted-foreground">{comp.description}</p>
      </header>

      <pre className="overflow-x-auto rounded-lg border bg-muted/40 p-4 text-sm">
        <code>{`import { ${comp.importNames.join(', ')} } from 'lumenui'`}</code>
      </pre>

      {comp.examples.map((ex) => (
        <section key={ex.name} className="space-y-3">
          {ex.title ? <h2 className="font-semibold text-xl">{ex.title}</h2> : null}
          <ComponentPreview name={ex.name} />
        </section>
      ))}
    </article>
  )
}
