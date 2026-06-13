import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ComponentPreview } from '@/components/component-preview'
import { CopyPageButton } from '@/components/copy-page-button'
import { DocPager } from '@/components/doc-pager'
import { Toc, type TocItem } from '@/components/toc'
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

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default async function ComponentPage({ params }: Params) {
  const { slug } = await params
  const index = components.findIndex((c) => c.slug === slug)
  if (index === -1) notFound()

  const comp = components[index]
  if (!comp) notFound()
  const prev = index > 0 ? components[index - 1] : undefined
  const next = index < components.length - 1 ? components[index + 1] : undefined

  // Build section anchors for the "On This Page" rail.
  const exampleSections = comp.examples.map((ex, i) => {
    const title = ex.title ?? (i === 0 ? 'Usage' : `Example ${i + 1}`)
    return { id: slugify(`${title}-${i}`), title, name: ex.name }
  })
  const toc: TocItem[] = [
    { id: 'installation', title: 'Installation' },
    ...exampleSections.map((s) => ({ id: s.id, title: s.title })),
  ]

  const markdown = [
    `# ${comp.name}`,
    '',
    comp.description,
    '',
    '## Installation',
    '',
    '```tsx',
    `import { ${comp.importNames.join(', ')} } from 'lumenui'`,
    '```',
  ].join('\n')

  return (
    <div className="flex gap-10 px-6 py-10">
      <article className="min-w-0 flex-1 space-y-8 lg:max-w-3xl">
        <div className="flex items-start justify-between gap-4">
          <header className="space-y-3">
            <h1 className="font-semibold text-4xl tracking-[-0.03em]">{comp.name}</h1>
            <p className="text-pretty text-lg text-muted-foreground leading-relaxed">
              {comp.description}
            </p>
          </header>
          <CopyPageButton markdown={markdown} />
        </div>

        <section id="installation" className="scroll-mt-20 space-y-3">
          <h2 className="font-semibold text-xl tracking-tight">Installation</h2>
          <pre className="overflow-x-auto rounded-lg border bg-card p-4 font-mono text-sm shadow-stack">
            <code>{`import { ${comp.importNames.join(', ')} } from 'lumenui'`}</code>
          </pre>
        </section>

        {exampleSections.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-20 space-y-3">
            <h2 className="font-semibold text-xl tracking-tight">{s.title}</h2>
            <ComponentPreview name={s.name} />
          </section>
        ))}

        <DocPager prev={prev} next={next} />
      </article>

      <Toc items={toc} />
    </div>
  )
}
