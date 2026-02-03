import { render, screen } from '@testing-library/vue'
import { describe, it, expect } from 'vitest'
import ModalDialog from '@/components/ModalDialog.vue'

describe('ModalDialog Component', () => {
  it('renders dialog title', () => {
    render(ModalDialog, {
      props: {
        title: 'User',
        for: 'Create',
      },
    })

    expect(screen.getByText('Create User')).toBeInTheDocument()
  })
})
