import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'
import { LiquidButton } from './liquid-button'

describe('LiquidButton', () => {
  it('renders its label', () => {
    render(<LiquidButton>Get in touch</LiquidButton>)
    expect(screen.getByRole('button', { name: 'Get in touch' })).toBeInTheDocument()
  })

  it('defaults to type="button"', () => {
    render(<LiquidButton>Submit</LiquidButton>)
    expect(screen.getByRole('button', { name: 'Submit' })).toHaveAttribute('type', 'button')
  })

  it('merges consumer classes', () => {
    render(<LiquidButton className="w-full">Wide</LiquidButton>)
    expect(screen.getByRole('button', { name: 'Wide' }).className).toContain('w-full')
  })

  it('fires onClick', async () => {
    const onClick = vi.fn()
    render(<LiquidButton onClick={onClick}>Tap</LiquidButton>)
    await userEvent.click(screen.getByRole('button', { name: 'Tap' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('does not fire onClick when disabled', async () => {
    const onClick = vi.fn()
    render(
      <LiquidButton disabled onClick={onClick}>
        Off
      </LiquidButton>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Off' }))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('renders as a link when href is set', () => {
    render(
      <LiquidButton href="/contact" target="_blank">
        Contact
      </LiquidButton>,
    )
    const link = screen.getByRole('link', { name: 'Contact' })
    expect(link).toHaveAttribute('href', '/contact')
    // _blank links get safe rel defaults automatically.
    expect(link).toHaveAttribute('rel', 'noreferrer noopener')
  })

  it('maps config props to CSS custom properties', () => {
    render(
      <LiquidButton blobSize={40} blobScale={5} blobRise={250} blobColor="tomato">
        Tuned
      </LiquidButton>,
    )
    const style = screen.getByRole('button', { name: 'Tuned' }).getAttribute('style') ?? ''
    expect(style).toContain('--lmb-blob-size: 40px')
    expect(style).toContain('--lmb-scale: 5')
    expect(style).toContain('--lmb-rise: -250%')
    expect(style).toContain('--lmb-blob: tomato')
  })

  it('hides decorative blob and filter layers from the accessibility tree', () => {
    const { container } = render(<LiquidButton>Decorated</LiquidButton>)
    // The blob layer span and the SVG filter are aria-hidden so only the label is announced.
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBeGreaterThanOrEqual(2)
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<LiquidButton>Accessible</LiquidButton>)
    expect((await axe(container)).violations).toEqual([])
  })
})
