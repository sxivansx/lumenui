import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'
import { Label } from '../label/label'
import { Checkbox } from './checkbox'

describe('Checkbox', () => {
  it('toggles when clicked', async () => {
    render(<Checkbox aria-label="accept" />)
    const cb = screen.getByRole('checkbox', { name: 'accept' })
    expect(cb).toHaveAttribute('data-state', 'unchecked')
    await userEvent.click(cb)
    expect(cb).toHaveAttribute('data-state', 'checked')
  })

  it('has no accessibility violations when labelled', async () => {
    const { container } = render(
      <div>
        <Checkbox id="terms" />
        <Label htmlFor="terms">Accept terms</Label>
      </div>,
    )
    expect((await axe(container)).violations).toEqual([])
  })
})
