import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'
import { ArrowButton } from './arrow-button'

describe('ArrowButton', () => {
  it('renders its label', () => {
    render(<ArrowButton>Showcase</ArrowButton>)
    expect(screen.getByRole('button', { name: 'Showcase' })).toBeInTheDocument()
  })

  it('defaults to type="button"', () => {
    render(<ArrowButton>Submit</ArrowButton>)
    expect(screen.getByRole('button', { name: 'Submit' })).toHaveAttribute('type', 'button')
  })

  it('merges consumer classes', () => {
    render(<ArrowButton className="w-full">Wide</ArrowButton>)
    expect(screen.getByRole('button', { name: 'Wide' }).className).toContain('w-full')
  })

  it('fires onClick', async () => {
    const onClick = vi.fn()
    render(<ArrowButton onClick={onClick}>Tap</ArrowButton>)
    await userEvent.click(screen.getByRole('button', { name: 'Tap' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('does not fire onClick when disabled', async () => {
    const onClick = vi.fn()
    render(
      <ArrowButton disabled onClick={onClick}>
        Off
      </ArrowButton>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Off' }))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('renders as a link when href is set', () => {
    render(
      <ArrowButton href="/showcase" target="_blank">
        Showcase
      </ArrowButton>,
    )
    const link = screen.getByRole('link', { name: 'Showcase' })
    expect(link).toHaveAttribute('href', '/showcase')
    // _blank links get safe rel defaults automatically.
    expect(link).toHaveAttribute('rel', 'noreferrer noopener')
  })

  it('maps color props to CSS custom properties', () => {
    render(
      <ArrowButton iconBackground="#000" iconBackgroundHover="#f97316" iconColor="#fff">
        Tuned
      </ArrowButton>,
    )
    const style = screen.getByRole('button', { name: 'Tuned' }).getAttribute('style') ?? ''
    expect(style).toContain('--ab-badge-bg: #000')
    expect(style).toContain('--ab-badge-bg-hover: #f97316')
    expect(style).toContain('--ab-arrow: #fff')
  })

  it('renders a default arrow glyph that can be overridden', () => {
    const { rerender, container } = render(<ArrowButton>Default</ArrowButton>)
    expect(container.querySelector('svg')).toBeInTheDocument()

    rerender(<ArrowButton icon={<span data-testid="custom-icon">→</span>}>Custom</ArrowButton>)
    // The custom node is rendered for both the resting and trailing arrow slots.
    expect(screen.getAllByTestId('custom-icon').length).toBeGreaterThan(0)
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<ArrowButton>Accessible</ArrowButton>)
    expect((await axe(container)).violations).toEqual([])
  })
})
