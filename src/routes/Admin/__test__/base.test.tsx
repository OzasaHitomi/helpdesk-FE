import { AdminRoute } from '../base'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

// AdminRouteが担う「どのパスにどのコンポーネントを割り当てるか」というルーティング設定のみをテストする
// （各コンポーネントの内部実装は個別のテストファイルが担保するため、全てモック化する）
vi.mock('@/features/Admin/Account/AdminAccountContainer', () => ({
  AdminAccountContainer: () => <div data-testid='mocked-admin-account-container' />,
}))

vi.mock('@/components/pages/NotFoundPage', () => ({
  NotFoundPage: () => <div data-testid='mocked-not-found-page' />,
}))

const renderAdminRoute = (initialEntry: string) => {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <AdminRoute />
    </MemoryRouter>,
  )
}

describe('AdminRoute', () => {
  describe('正常系', () => {
    it('accountsにアクセスした場合、AdminAccountContainerが表示されること', () => {
      // AdminRouteは実運用では<Route path='/admin/*'>配下にネストされ、'/admin'は既に消費された状態で
      // 内部の<Routes>に渡ってくる。単体テストではその前提を再現するため、'/admin'を除いたパスで検証する。
      renderAdminRoute('/accounts')
      expect(screen.getByTestId('mocked-admin-account-container')).toBeInTheDocument()
    })
  })

  describe('準正常系', () => {
    it('accounts配下の未定義のサブパスにアクセスした場合、AdminAccountContainerではなくNotFoundPageが表示されること', () => {
      renderAdminRoute('/accounts/mdjje')
      expect(screen.queryByTestId('mocked-admin-account-container')).not.toBeInTheDocument()
      expect(screen.getByTestId('mocked-not-found-page')).toBeInTheDocument()
    })

    it('定義されていないパスにアクセスした場合、NotFoundPageが表示されること', () => {
      renderAdminRoute('/unknown')
      expect(screen.getByTestId('mocked-not-found-page')).toBeInTheDocument()
    })
  })
})
