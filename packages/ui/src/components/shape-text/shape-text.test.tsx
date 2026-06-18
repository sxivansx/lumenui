import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'
import { ShapeText } from './shape-text'

const TEXT = 'Typography that behaves like a medium rather than a static element.'

describe('ShapeText', () => {
  it('renders every word of the body copy', () => {
    render(<ShapeText text={TEXT} />)
    expect(screen.getByText('Typography')).toBeInTheDocument()
    expect(screen.getByText('medium')).toBeInTheDocument()
    expect(screen.getByText('element.')).toBeInTheDocument()
  })

  it('renders the wrapped images with their alt text', () => {
    render(
      <ShapeText
        text={TEXT}
        images={[
          { src: '/a.svg', alt: 'A leaf' },
          { src: '/b.svg', alt: 'A ring' },
        ]}
      />,
    )
    expect(screen.getByAltText('A leaf')).toBeInTheDocument()
    expect(screen.getByAltText('A ring')).toBeInTheDocument()
  })

  it('treats blank lines as paragraph breaks without dropping words', () => {
    render(<ShapeText text={'First paragraph here.\n\nSecond paragraph here.'} />)
    expect(screen.getByText('First')).toBeInTheDocument()
    expect(screen.getByText('Second')).toBeInTheDocument()
  })

  it('forwards arbitrary props to the root element', () => {
    render(<ShapeText text={TEXT} data-testid="canvas" aria-label="Editorial layout" />)
    const root = screen.getByTestId('canvas')
    expect(root).toHaveAttribute('aria-label', 'Editorial layout')
  })

  it('renders with debug, justify, and dragging disabled without throwing', () => {
    expect(() =>
      render(
        <ShapeText
          text={TEXT}
          align="justify"
          debug
          draggable={false}
          images={[{ src: '/a.svg', alt: 'Shape' }]}
          alphaThreshold={0.8}
          sampleStep={6}
        />,
      ),
    ).not.toThrow()
  })

  it('has no accessibility violations', async () => {
    const { container } = render(
      <ShapeText text={TEXT} images={[{ src: '/a.svg', alt: 'Decorative shape' }]} />,
    )
    expect((await axe(container)).violations).toEqual([])
  })
})
