import { AppRouter } from '../router'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Outlet } from 'react-router-dom'

// AppRouterが担う「どのパスにどのコンポーネントを割り当てるか」というルーティング設定のみをテストする
// （各コンポーネントの内部実装は個別のテストファイルが担保するため、全てモック化する）
vi.mock('@/components/templates/BaseLayout', () => ({
  BaseLayout: () => (
    <div data-testid='mocked-base-layout'>
      <Outlet />
    </div>
  ),
}))

vi.mock('@/routes/Login/base', () => ({
  LoginRoute: () => <div data-testid='mocked-login-route' />,
}))

vi.mock('@/features/Root/RootContainer', () => ({
  RootContainer: () => <div data-testid='mocked-root-container' />,
}))

const renderAppRouter = (initialEntry: string) => {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <AppRouter />
    </MemoryRouter>,
  )
}

describe('AppRouter', () => {
  describe('正常系', () => {
    it('/にアクセスした場合、BaseLayoutを経由してRootContainerが表示されること', () => {
      renderAppRouter('/')
      expect(screen.getByTestId('mocked-base-layout')).toBeInTheDocument()
      expect(screen.getByTestId('mocked-root-container')).toBeInTheDocument()
    })

    it('/login配下にアクセスした場合、LoginRouteが表示されること', () => {
      renderAppRouter('/login')
      expect(screen.getByTestId('mocked-login-route')).toBeInTheDocument()
    })
  })

  describe('準正常系', () => {
    it('定義されていないパスにアクセスした場合、BaseLayoutを経由して404 Not Foundが表示されること', () => {
      renderAppRouter('/unknown-path')
      expect(screen.getByTestId('mocked-base-layout')).toBeInTheDocument()
      expect(screen.getByText('404 Not Found')).toBeInTheDocument()
    })
  })
})
