import App from '../App'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'

// AppがAppRouterを表示するだけであることをテストする（ルーティングの中身はrouter.test.tsxが担保する）
vi.mock('@/routes/router', () => ({
  AppRouter: () => <div data-testid='mocked-app-router' />,
}))

describe('App', () => {
  describe('正常系', () => {
    it('AppRouterが表示されること', () => {
      customRender(<App />)
      expect(screen.getByTestId('mocked-app-router')).toBeInTheDocument()
    })
  })
})
