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

vi.mock('@/routes/Admin/base', () => ({
  AdminRoute: () => <div data-testid='mocked-admin-route' />,
}))

vi.mock('@/features/Root/RootContainer', () => ({
  RootContainer: () => <div data-testid='mocked-root-container' />,
}))

vi.mock('@/features/TicketDetail/TicketDetailContainer', () => ({
  TicketDetailContainer: () => <div data-testid='mocked-ticket-detail-container' />,
}))

vi.mock('@/components/pages/NotFoundPage', () => ({
  NotFoundPage: () => <div data-testid='mocked-not-found-page' />,
}))

vi.mock('@/routes/RequireAuth', () => ({
  RequireAuth: () => (
    <div data-testid='mocked-require-auth'>
      <Outlet />
    </div>
  ),
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
    it('/にアクセスした場合、RequireAuth・BaseLayoutを経由してRootContainerが表示されること', () => {
      renderAppRouter('/')
      expect(screen.getByTestId('mocked-require-auth')).toBeInTheDocument()
      expect(screen.getByTestId('mocked-base-layout')).toBeInTheDocument()
      expect(screen.getByTestId('mocked-root-container')).toBeInTheDocument()
    })

    it('/login配下にアクセスした場合、RequireAuthを経由せずLoginRouteが表示されること', () => {
      renderAppRouter('/login')
      expect(screen.getByTestId('mocked-login-route')).toBeInTheDocument()
      expect(screen.queryByTestId('mocked-require-auth')).not.toBeInTheDocument()
    })

    it('/tickets/:idにアクセスした場合、RequireAuth・BaseLayoutを経由してTicketDetailContainerが表示されること', () => {
      renderAppRouter('/tickets/1')
      expect(screen.getByTestId('mocked-require-auth')).toBeInTheDocument()
      expect(screen.getByTestId('mocked-base-layout')).toBeInTheDocument()
      expect(screen.getByTestId('mocked-ticket-detail-container')).toBeInTheDocument()
    })

    it('/admin配下にアクセスした場合、RequireAuth・BaseLayoutを経由してAdminRouteが表示されること', () => {
      renderAppRouter('/admin/account')
      expect(screen.getByTestId('mocked-require-auth')).toBeInTheDocument()
      expect(screen.getByTestId('mocked-base-layout')).toBeInTheDocument()
      expect(screen.getByTestId('mocked-admin-route')).toBeInTheDocument()
    })

    it('/404に直接アクセスした場合、RequireAuth・BaseLayoutを経由してNotFoundPageが表示されること', () => {
      renderAppRouter('/404')
      expect(screen.getByTestId('mocked-require-auth')).toBeInTheDocument()
      expect(screen.getByTestId('mocked-base-layout')).toBeInTheDocument()
      expect(screen.getByTestId('mocked-not-found-page')).toBeInTheDocument()
    })
  })

  describe('準正常系', () => {
    it('定義されていないパスにアクセスした場合、/404へ遷移しNotFoundPageが表示されること', () => {
      renderAppRouter('/unknown-path')
      expect(screen.getByTestId('mocked-require-auth')).toBeInTheDocument()
      expect(screen.getByTestId('mocked-base-layout')).toBeInTheDocument()
      expect(screen.getByTestId('mocked-not-found-page')).toBeInTheDocument()
    })
  })
})
