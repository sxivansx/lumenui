import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'
import { MagneticButton } from './magnetic-button'

/** The magnetic field is the button's parent span; movement vars land on the button. */
const fieldOf = (el: HTMLElement) => el.parentElement as HTMLElement

describe('MagneticButton', () => {
  it('renders its label', () => {
    render(<MagneticButton>Get started</MagneticButton>)
    expect(screen.getByRole('button', { name: 'Get started' })).toBeInTheDocument()
  })

  it('defaults to type="button"', () => {
    render(<MagneticButton>Submit</MagneticButton>)
    expect(screen.getByRole('button', { name: 'Submit' })).toHaveAttribute('type', 'button')
  })

  it('merges consumer classes', () => {
    render(<MagneticButton className="w-full">Wide</MagneticButton>)
    expect(screen.getByRole('button', { name: 'Wide' }).className).toContain('w-full')
  })

  it('fires onClick', async () => {
    const onClick = vi.fn()
    render(<MagneticButton onClick={onClick}>Tap</MagneticButton>)
    await userEvent.click(screen.getByRole('button', { name: 'Tap' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('does not fire onClick when disabled', async () => {
    const onClick = vi.fn()
    render(
      <MagneticButton disabled onClick={onClick}>
        Off
      </MagneticButton>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Off' }))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('renders as a link when href is set', () => {
    render(
      <MagneticButton href="/contact" target="_blank">
        Contact
      </MagneticButton>,
    )
    const link = screen.getByRole('link', { name: 'Contact' })
    expect(link).toHaveAttribute('href', '/contact')
    // _blank links get safe rel defaults automatically.
    expect(link).toHaveAttribute('rel', 'noreferrer noopener')
  })

  it('maps config props to CSS custom properties', () => {
    render(
      <MagneticButton hoverScale={1.2} tapScale={0.9} transitionDuration={500}>
        Tuned
      </MagneticButton>,
    )
    const style = screen.getByRole('button', { name: 'Tuned' }).getAttribute('style') ?? ''
    expect(style).toContain('--mb-hover-scale: 1.2')
    expect(style).toContain('--mb-tap-scale: 0.9')
    expect(style).toContain('--mb-duration: 500ms')
  })

  it('translates toward the cursor on mouse move within the field', () => {
    render(<MagneticButton strength={0.5}>Pull</MagneticButton>)
    const btn = screen.getByRole('button', { name: 'Pull' })
    // jsdom has no layout, so the button's rect is all zeros → center is (0,0)
    // and the offset is simply the cursor coordinates scaled by `strength`.
    fireEvent.mouseMove(fieldOf(btn), { clientX: 100, clientY: 40 })
    expect(btn.style.getPropertyValue('--mb-x')).toBe('50px')
    expect(btn.style.getPropertyValue('--mb-y')).toBe('20px')
  })

  it('springs back to center on mouse leave', () => {
    render(<MagneticButton strength={0.5}>Pull</MagneticButton>)
    const btn = screen.getByRole('button', { name: 'Pull' })
    const field = fieldOf(btn)
    fireEvent.mouseMove(field, { clientX: 100, clientY: 100 })
    expect(btn.style.getPropertyValue('--mb-x')).toBe('50px')
    fireEvent.mouseLeave(field)
    expect(btn.style.getPropertyValue('--mb-x')).toBe('0px')
    expect(btn.style.getPropertyValue('--mb-y')).toBe('0px')
  })

  it('does not follow the cursor when disabled', () => {
    render(
      <MagneticButton disabled strength={0.5}>
        Off
      </MagneticButton>,
    )
    const btn = screen.getByRole('button', { name: 'Off' })
    fireEvent.mouseMove(fieldOf(btn), { clientX: 100, clientY: 100 })
    expect(btn.style.getPropertyValue('--mb-x')).toBe('')
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<MagneticButton>Accessible</MagneticButton>)
    expect((await axe(container)).violations).toEqual([])
  })
})
