import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs'

function Example() {
  return (
    <Tabs defaultValue="a">
      <TabsList>
        <TabsTrigger value="a">A</TabsTrigger>
        <TabsTrigger value="b">B</TabsTrigger>
      </TabsList>
      <TabsContent value="a">Panel A</TabsContent>
      <TabsContent value="b">Panel B</TabsContent>
    </Tabs>
  )
}

describe('Tabs', () => {
  it('switches panels when a tab is selected', async () => {
    render(<Example />)
    expect(screen.getByText('Panel A')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('tab', { name: 'B' }))
    expect(screen.getByText('Panel B')).toBeInTheDocument()
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<Example />)
    expect((await axe(container)).violations).toEqual([])
  })
})
