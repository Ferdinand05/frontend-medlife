import { render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import NavbarComponent from '@/components/NavbarComponent.vue'
import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'
import { createTestingPinia } from '@pinia/testing'

describe('Navbar Component', () => {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div />' } },
      { path: '/login', name: 'login', component: { template: '<div />' } },
      { name: 'user.dashboard', path: '/user', component: { template: '<div />' } },
      { name: 'admin.dashboard', path: '/admin', component: { template: '<div />' } },
      { name: 'user.settings', path: '/settings', component: { template: '<div />' } },
    ],
  })

  it('Show login link, if user is not authenticated', () => {
    render(NavbarComponent, {
      global: {
        plugins: [
          router,
          createTestingPinia({
            initialState: {
              auth: {
                token: null,
                user: null,
              },
            },
          }),
        ],
      },
    })

    expect(screen.getByText('Login')).toBeInTheDocument()
  })

  it('Hide Admin dashboard , when role is user', () => {
    render(NavbarComponent, {
      global: {
        plugins: [
          router,
          createTestingPinia({
            initialState: {
              auth: {
                token: 'sadsad',
                user: {
                  username: 'ferdinand',
                  role: 'user',
                },
              },
            },
          }),
        ],
      },
    })

    expect(screen.queryByText('Admin')).toBeNull()
  })

  it('show username when user is logged in', () => {
    render(NavbarComponent, {
      global: {
        plugins: [
          router,
          createTestingPinia({
            initialState: {
              auth: {
                token: 'fake-token',
                user: {
                  username: 'ferdinand',
                  role: 'user',
                },
              },
            },
          }),
        ],
      },
    })

    expect(screen.getByText('ferdinand')).toBeInTheDocument()
  })

  it('shows Admin dashboard , when role is admin', () => {
    render(NavbarComponent, {
      global: {
        plugins: [
          router,
          createTestingPinia({
            initialState: {
              auth: {
                token: 'fek-token',
                user: {
                  username: 'ferdinand',
                  role: 'admin',
                },
              },
            },
          }),
        ],
      },
    })

    expect(screen.getByText('Admin')).toBeInTheDocument()
  })

  it('show navigation links', () => {
    render(NavbarComponent, {
      global: {
        plugins: [
          router,
          createTestingPinia({
            initialState: {
              auth: {
                token: 'fek-token',
                user: {
                  username: 'ferdinand',
                  role: 'admin',
                },
              },
            },
          }),
        ],
      },
    })

    const link1 = screen.getAllByText('Home')
    expect(link1).toHaveLength(2)
    const link2 = screen.getAllByText('About')
    expect(link2).toHaveLength(2)
    const link3 = screen.getAllByText('How it works')
    expect(link3).toHaveLength(2)
  })
})
