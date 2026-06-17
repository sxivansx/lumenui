import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'
import { GlassButton } from './glass-button'

describe('GlassButton', () => {
  it('renders its label', () => {
    render(<GlassButton>Get started</GlassButton>)
    expect(screen.getByRole('button', { name: 'Get started' })).toBeInTheDocument()
  })

  it('defaults to type="button"', () => {
    render(<GlassButton>Submit</GlassButton>)
    expect(screen.getByRole('button', { name: 'Submit' })).toHaveAttribute('type', 'button')
  })

  it('merges consumer classes', () => {
    render(<GlassButton className="w-full">Wide</GlassButton>)
    expect(screen.getByRole('button', { name: 'Wide' }).className).toContain('w-full')
  })

  it('fires onClick', async () => {
    const onClick = vi.fn()
    render(<GlassButton onClick={onClick}>Tap</GlassButton>)
    await userEvent.click(screen.getByRole('button', { name: 'Tap' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('does not fire onClick when disabled', async () => {
    const onClick = vi.fn()
    render(
      <GlassButton disabled onClick={onClick}>
        Off
      </GlassButton>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Off' }))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('renders as a link when href is set', () => {
    render(
      <GlassButton href="/pricing" target="_blank">
        Pricing
      </GlassButton>,
    )
    const link = screen.getByRole('link', { name: 'Pricing' })
    expect(link).toHaveAttribute('href', '/pricing')
    // _blank links get safe rel defaults automatically.
    expect(link).toHaveAttribute('rel', 'noreferrer noopener')
  })

  it('applies custom text color, padding, and frost to the inline style', () => {
    render(
      <GlassButton textColor="#0a0a0a" padding="20px 40px" blur={20} tint="rgba(0,0,0,0.2)">
        Tuned
      </GlassButton>,
    )
    const style = screen.getByRole('button', { name: 'Tuned' }).getAttribute('style') ?? ''
    expect(style).toContain('color: rgb(10, 10, 10)')
    expect(style).toContain('padding: 20px 40px')
    expect(style).toContain('blur(20px)')
    // jsdom normalizes the color: spaces are inserted after commas.
    expect(style).toContain('background: rgba(0, 0, 0, 0.2)')
  })

  it('hides the decorative sheen layers from the accessibility tree', () => {
    const { container } = render(<GlassButton>Decorated</GlassButton>)
    // Both the resting sheen and the hover bloom are aria-hidden so only the label is announced.
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBeGreaterThanOrEqual(2)
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<GlassButton>Accessible</GlassButton>)
    expect((await axe(container)).violations).toEqual([])
  })
})
