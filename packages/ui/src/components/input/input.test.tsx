import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'
import { Label } from '../label/label'
import { Input } from './input'

describe('Input', () => {
  it('accepts user input', async () => {
    render(<Input aria-label="name" />)
    const input = screen.getByLabelText('name')
    await userEvent.type(input, 'hello')
    expect(input).toHaveValue('hello')
  })

  it('respects the disabled state', () => {
    render(<Input aria-label="frozen" disabled />)
    expect(screen.getByLabelText('frozen')).toBeDisabled()
  })

  it('has no accessibility violations when labelled', async () => {
    const { container } = render(
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" />
      </div>,
    )
    expect((await axe(container)).violations).toEqual([])
  })
})
