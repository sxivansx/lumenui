import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './button'

describe('Button', () => {
  it('renders its children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('applies variant and size classes', () => {
    render(
      <Button variant="destructive" size="lg">
        Danger
      </Button>,
    )
    const btn = screen.getByRole('button', { name: 'Danger' })
    expect(btn.className).toContain('bg-destructive')
    expect(btn.className).toContain('h-10')
  })

  it('renders as the child element when asChild is set', () => {
    render(
      <Button asChild>
        <a href="/home">Home</a>
      </Button>,
    )
    const link = screen.getByRole('link', { name: 'Home' })
    expect(link).toBeInTheDocument()
    expect(link.className).toContain('inline-flex')
  })

  it('fires onClick', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Tap</Button>)
    await userEvent.click(screen.getByRole('button', { name: 'Tap' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<Button>Accessible</Button>)
    expect((await axe(container)).violations).toEqual([])
  })
})
