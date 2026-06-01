import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'

describe('Card', () => {
  it('renders composed content', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Body</CardContent>
      </Card>,
    )
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(screen.getByText('Body')).toBeInTheDocument()
  })

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Card>
        <CardContent>Content</CardContent>
      </Card>,
    )
    expect((await axe(container)).violations).toEqual([])
  })
})
