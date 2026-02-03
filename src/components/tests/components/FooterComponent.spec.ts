import FooterComponent from '@/components/FooterComponent.vue'
import { getByText, render, screen } from '@testing-library/vue'
import { assert, describe, expect, it } from 'vitest'

describe('Footer Component', () => {
  it('Renders Footer Navigation links', () => {
    render(FooterComponent)

    expect(screen.getByText('About us')).toBeInTheDocument()
    expect(screen.getByText('How it works')).toBeInTheDocument()
    expect(screen.getByText('CTA')).toBeInTheDocument()
  })

  it('show current year', () => {
    const year = new Date().getFullYear()
    render(FooterComponent)

    expect(screen.getByText(new RegExp(`Copyright © ${year}`))).toBeInTheDocument()
  })

  it('has 3 svg icons', () => {
    const { container } = render(FooterComponent)

    const svgs = container.querySelectorAll('svg')

    expect(svgs).toHaveLength(3)
  })
})
