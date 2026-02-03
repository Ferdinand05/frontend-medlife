import HeaderDashboard from '@/components/HeaderDashboard.vue'
import { fireEvent, render, screen } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'

describe('Test Header Dashboard Component', () => {
  const createModalMock = () => {
    return {
      showModal: vi.fn(),
    } as unknown as HTMLDialogElement
  }

  it('render title and subtitle correctly', () => {
    render(HeaderDashboard, {
      props: {
        title: 'User',
        modal: null,
      },
    })

    expect(screen.getByText('User')).toBeInTheDocument()
    expect(screen.getByText('Manage User Data')).toBeInTheDocument()
  })

  it('render action button with correct label', () => {
    render(HeaderDashboard, {
      props: {
        title: 'Medicine',
        modal: null,
      },
    })

    expect(screen.getByRole('button', { name: 'Create new Medicine' })).toBeInTheDocument()
  })

  it('renders slot content', () => {
    render(HeaderDashboard, {
      props: {
        title: 'User',
        modal: null,
      },
      slots: {
        default: '<div>Header Dashboard</div>',
      },
    })

    expect(screen.getByText('Header Dashboard')).toBeInTheDocument()
  })

  it('calls modal when button is clicked', async () => {
    const modalMock = createModalMock()

    render(HeaderDashboard, {
      props: {
        title: 'User',
        modal: modalMock,
      },
    })

    const btn = screen.getByRole('button', { name: 'Create new User' })

    await fireEvent.click(btn)

    expect(modalMock.showModal).toHaveBeenCalledOnce()
  })
})
