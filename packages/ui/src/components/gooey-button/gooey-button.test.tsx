import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'
import { GooeyButton } from './gooey-button'

describe('GooeyButton', () => {
  it('renders its resting label', () => {
    render(<GooeyButton>Delete</GooeyButton>)
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
  })

  it('defaults the pill to type="button"', () => {
    render(<GooeyButton>Delete</GooeyButton>)
    expect(screen.getByRole('button', { name: 'Delete' })).toHaveAttribute('type', 'button')
  })

  it('merges consumer classes onto the pill', () => {
    render(<GooeyButton className="w-full">Delete</GooeyButton>)
    expect(screen.getByRole('button', { name: 'Delete' }).className).toContain('w-full')
  })

  it('arms on click — the label morphs and aria-pressed flips', async () => {
    render(<GooeyButton confirmLabel="Sure?">Delete</GooeyButton>)
    const pill = screen.getByRole('button', { name: 'Delete' })
    expect(pill).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(pill)
    // The accessible name follows the visible label (the other is aria-hidden).
    expect(screen.getByRole('button', { name: 'Sure?' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('hides the action button from AT and tab order until armed', async () => {
    render(<GooeyButton confirmActionLabel="Confirm">Delete</GooeyButton>)
    expect(screen.queryByRole('button', { name: 'Confirm' })).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))
    const action = screen.getByRole('button', { name: 'Confirm' })
    expect(action).toHaveAttribute('tabindex', '0')
    expect(action).not.toBeDisabled()
  })

  it('fires onConfirm and disarms when the action is clicked', async () => {
    const onConfirm = vi.fn()
    render(
      <GooeyButton confirmActionLabel="Confirm" onConfirm={onConfirm}>
        Delete
      </GooeyButton>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))
    await userEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    expect(onConfirm).toHaveBeenCalledOnce()
    // Disarmed again: the action button leaves the accessible tree.
    expect(screen.queryByRole('button', { name: 'Confirm' })).not.toBeInTheDocument()
  })

  it('toggles back to resting when the pill is clicked again', async () => {
    render(<GooeyButton confirmLabel="Sure?">Delete</GooeyButton>)
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))
    await userEvent.click(screen.getByRole('button', { name: 'Sure?' }))
    expect(screen.getByRole('button', { name: 'Delete' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('reports armed-state changes through onArmedChange', async () => {
    const onArmedChange = vi.fn()
    render(<GooeyButton onArmedChange={onArmedChange}>Delete</GooeyButton>)
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(onArmedChange).toHaveBeenLastCalledWith(true)
  })

  it('does not arm when disabled', async () => {
    render(<GooeyButton disabled>Delete</GooeyButton>)
    const pill = screen.getByRole('button', { name: 'Delete' })
    await userEvent.click(pill)
    expect(pill).toHaveAttribute('aria-pressed', 'false')
  })

  it('maps config props to CSS custom properties', () => {
    render(
      <GooeyButton height={60} duration={600}>
        Delete
      </GooeyButton>,
    )
    // Vars live on the wrapper that hosts the pill.
    const root = screen.getByRole('button', { name: 'Delete' }).parentElement as HTMLElement
    const style = root.getAttribute('style') ?? ''
    expect(style).toContain('--gb-h: 60px')
    expect(style).toContain('--gb-dur: 600ms')
  })

  it('has no accessibility violations in either state', async () => {
    const { container } = render(<GooeyButton>Delete</GooeyButton>)
    expect((await axe(container)).violations).toEqual([])
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect((await axe(container)).violations).toEqual([])
  })
})
