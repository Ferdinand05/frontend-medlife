import AlertComponent from '@/components/AlertComponent.vue'
import { render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

describe('Test Alert Component', () => {
  it('render alert with default props (error)', () => {
    render(AlertComponent, {
      slots: {
        default: 'something went wrong',
      },
    })

    const alert = screen.getByRole('alert')

    expect(alert).toBeInTheDocument()
    expect(alert).toHaveClass('alert-error')
    expect(screen.getByText('something went wrong', { exact: false })).toBeInTheDocument()
  })

  it('render alert with success props', () => {
    render(AlertComponent, {
      props: {
        type: 'success',
      },
      slots: {
        default: 'success message',
      },
    })
    const alert = screen.getByRole('alert')

    expect(alert).toHaveClass('alert-success')
    expect(screen.getByText('Success Message', { exact: false })).toBeInTheDocument()
  })

  it('render alert with warning props', () => {
    render(AlertComponent, {
      props: {
        type: 'warning',
      },
      slots: {
        default: 'be careful!',
      },
    })
    const alert = screen.getByRole('alert')

    expect(alert).toHaveClass('alert-warning')
    expect(screen.getByText('be careful!', { exact: false })).toBeInTheDocument()
  })

  it('renders correct type for each type', () => {
    const { rerender, container } = render(AlertComponent, {
      props: {
        type: 'error',
      },
    })

    expect(container.querySelectorAll('svg')).toHaveLength(1)

    rerender({ type: 'warning' })
    expect(container.querySelectorAll('svg')).toHaveLength(1)

    rerender({ type: 'success' })
    expect(container.querySelectorAll('svg')).toHaveLength(1)
  })
})
