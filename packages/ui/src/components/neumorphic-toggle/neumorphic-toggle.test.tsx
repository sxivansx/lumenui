import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'
import { NeumorphicToggle } from './neumorphic-toggle'

describe('NeumorphicToggle', () => {
  it('renders as an accessible switch, unchecked by default', () => {
    render(<NeumorphicToggle aria-label="Wi-Fi" />)
    const toggle = screen.getByRole('switch', { name: 'Wi-Fi' })
    expect(toggle).toHaveAttribute('aria-checked', 'false')
  })

  it('toggles on click', async () => {
    render(<NeumorphicToggle aria-label="Wi-Fi" />)
    const toggle = screen.getByRole('switch', { name: 'Wi-Fi' })
    await userEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-checked', 'true')
  })

  it('toggles with the keyboard', async () => {
    render(<NeumorphicToggle aria-label="Wi-Fi" />)
    const toggle = screen.getByRole('switch', { name: 'Wi-Fi' })
    toggle.focus()
    await userEvent.keyboard(' ')
    expect(toggle).toHaveAttribute('aria-checked', 'true')
  })

  it('fires onCheckedChange with the next state', async () => {
    const onCheckedChange = vi.fn()
    render(<NeumorphicToggle aria-label="Wi-Fi" onCheckedChange={onCheckedChange} />)
    await userEvent.click(screen.getByRole('switch', { name: 'Wi-Fi' }))
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it('respects the controlled checked prop', () => {
    render(<NeumorphicToggle aria-label="Wi-Fi" checked onCheckedChange={() => {}} />)
    expect(screen.getByRole('switch', { name: 'Wi-Fi' })).toHaveAttribute('aria-checked', 'true')
  })

  it('does not toggle when disabled', async () => {
    const onCheckedChange = vi.fn()
    render(<NeumorphicToggle aria-label="Wi-Fi" disabled onCheckedChange={onCheckedChange} />)
    await userEvent.click(screen.getByRole('switch', { name: 'Wi-Fi' }))
    expect(onCheckedChange).not.toHaveBeenCalled()
  })

  it('applies a custom active color to the on-state CSS variable', () => {
    render(<NeumorphicToggle aria-label="Wi-Fi" activeColor="#c0392b" />)
    const style = screen.getByRole('switch', { name: 'Wi-Fi' }).getAttribute('style') ?? ''
    expect(style).toContain('--nt-active: #c0392b')
  })

  it('merges consumer classes', () => {
    render(<NeumorphicToggle aria-label="Wi-Fi" className="mx-auto" />)
    expect(screen.getByRole('switch', { name: 'Wi-Fi' }).className).toContain('mx-auto')
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<NeumorphicToggle aria-label="Wi-Fi" />)
    expect((await axe(container)).violations).toEqual([])
  })
})
