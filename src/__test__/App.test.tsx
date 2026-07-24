import App from '../App'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'

// AppがAppRouter・Toasterを表示するだけであることをテストする（ルーティングの中身はrouter.test.tsxが担保する）
vi.mock('@/routes/router', () => ({
  AppRouter: () => <div data-testid='mocked-app-router' />,
}))

// Toasterは/login配下も含めた全ルートで表示できる必要があるため、AppRouterと同階層に配置している
// （ログアウト時、/loginへ遷移した後にトーストを出すため。BaseLayout配下だと/loginでは表示されない）
vi.mock('@/components/ui/toaster', () => ({
  Toaster: () => <div data-testid='mocked-toaster' />,
}))

describe('App', () => {
  describe('正常系', () => {
    it('AppRouterが表示されること', () => {
      customRender(<App />)
      expect(screen.getByTestId('mocked-app-router')).toBeInTheDocument()
    })

    it('Toasterが表示されること', () => {
      customRender(<App />)
      expect(screen.getByTestId('mocked-toaster')).toBeInTheDocument()
    })
  })
})
