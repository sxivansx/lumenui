import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'
import { ShinyButton } from './shiny-button'

describe('ShinyButton', () => {
  it('renders its label', () => {
    render(<ShinyButton>Get unlimited access</ShinyButton>)
    expect(screen.getByRole('button', { name: 'Get unlimited access' })).toBeInTheDocument()
  })

  it('defaults to type="button"', () => {
    render(<ShinyButton>Submit</ShinyButton>)
    expect(screen.getByRole('button', { name: 'Submit' })).toHaveAttribute('type', 'button')
  })

  it('merges consumer classes', () => {
    render(<ShinyButton className="w-full">Wide</ShinyButton>)
    expect(screen.getByRole('button', { name: 'Wide' }).className).toContain('w-full')
  })

  it('fires onClick', async () => {
    const onClick = vi.fn()
    render(<ShinyButton onClick={onClick}>Tap</ShinyButton>)
    await userEvent.click(screen.getByRole('button', { name: 'Tap' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('does not fire onClick when disabled', async () => {
    const onClick = vi.fn()
    render(
      <ShinyButton disabled onClick={onClick}>
        Off
      </ShinyButton>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Off' }))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('renders as a link when href is set', () => {
    render(
      <ShinyButton href="/pricing" target="_blank">
        Pricing
      </ShinyButton>,
    )
    const link = screen.getByRole('link', { name: 'Pricing' })
    expect(link).toHaveAttribute('href', '/pricing')
    // _blank links get safe rel defaults automatically.
    expect(link).toHaveAttribute('rel', 'noreferrer noopener')
  })

  it('maps config props to CSS custom properties', () => {
    render(
      <ShinyButton shine="#facc15" accent="tomato" speed={2}>
        Tuned
      </ShinyButton>,
    )
    const style = screen.getByRole('button', { name: 'Tuned' }).getAttribute('style') ?? ''
    expect(style).toContain('--lumen-shiny-shine: #facc15')
    expect(style).toContain('--lumen-shiny-accent: tomato')
    expect(style).toContain('--lumen-shiny-speed: 2s')
  })

  it('injects the animation stylesheet', () => {
    render(<ShinyButton>Decorated</ShinyButton>)
    // The keyframes/@property block is hoisted by React; assert it reached the document.
    expect(document.documentElement.innerHTML).toContain('lumen-shiny-spin')
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<ShinyButton>Accessible</ShinyButton>)
    expect((await axe(container)).violations).toEqual([])
  })
})
