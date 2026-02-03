import DashboardStats from '@/components/DashboardStats.vue'
import { render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, markRaw } from 'vue'

describe('Test Dashboard Stat Component', () => {
  const DummyIcon = markRaw(
    defineComponent({
      name: 'DummyIcon',
      render() {
        return h('svg', { 'data-testid': 'stat-icon' })
      },
    }),
  )

  const statsMock = [
    {
      name: 'Users',
      count: 10,
      icon: DummyIcon,
      color: 'blue',
    },
    {
      name: 'Medicines',
      count: 5,
      icon: DummyIcon,
      color: 'green',
    },
    {
      name: 'Expired',
      count: null,
      icon: DummyIcon,
      color: 'red',
    },
  ]

  it('renders cards based on stats length', () => {
    const { container } = render(DashboardStats, {
      props: {
        stats: statsMock,
      },
    })

    const cards = container.querySelectorAll('section > div')
    expect(cards).toHaveLength(3)
  })

  it('displays stats names', () => {
    render(DashboardStats, {
      props: {
        stats: statsMock,
      },
    })

    expect(screen.getByText('Users')).toBeInTheDocument()
    expect(screen.getByText('Medicines')).toBeInTheDocument()
    expect(screen.getByText('Expired')).toBeInTheDocument()
  })

  it('displays stat counts', () => {
    render(DashboardStats, {
      props: { stats: statsMock },
    })

    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('-')).toBeInTheDocument()
  })

  it('renders icons components', () => {
    render(DashboardStats, {
      props: {
        stats: statsMock,
      },
    })

    const icons = screen.getAllByTestId('stat-icon')

    expect(icons).toHaveLength(3)
  })

  it('applied background color class based on stat.color', () => {
    const { container } = render(DashboardStats, {
      props: {
        stats: statsMock,
      },
    })

    const cards = container.querySelectorAll('section > div')
    expect(cards[0]?.className).toContain('bg-blue-300')
    expect(cards[1]?.className).toContain('bg-green-300')
    expect(cards[2]?.className).toContain('bg-red-300')
  })
})
