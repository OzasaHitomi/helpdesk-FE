import { AdminRoute } from '../base'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

// AdminRouteが担う「どのパスにどのコンポーネントを割り当てるか」というルーティング設定のみをテストする
// （各コンポーネントの内部実装は個別のテストファイルが担保するため、全てモック化する）
vi.mock('@/features/Admin/Account/AdminAccountContainer', () => ({
  AdminAccountContainer: () => <div data-testid='mocked-admin-account-container' />,
}))

// AdminRouteは実運用では<Route path='/admin/*'>配下にネストされており、
// 配下で未定義パスにアクセスした場合は/admin/*の外側にある/404へ<Navigate>する。
// 単体テストでもこのネスト構造と、遷移先の/404ルートを再現した上で検証する。
const renderAdminRoute = (initialEntry: string) => {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path='/admin/*' element={<AdminRoute />} />
        <Route path='/404' element={<div data-testid='mocked-not-found-page' />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('AdminRoute', () => {
  describe('正常系', () => {
    it('accountsにアクセスした場合、AdminAccountContainerが表示されること', () => {
      renderAdminRoute('/admin/accounts')
      expect(screen.getByTestId('mocked-admin-account-container')).toBeInTheDocument()
    })
  })

  describe('準正常系', () => {
    it('accounts配下の未定義のサブパスにアクセスした場合、AdminAccountContainerではなく/404へ遷移しNotFoundPageが表示されること', () => {
      renderAdminRoute('/admin/accounts/mdjje')
      expect(screen.queryByTestId('mocked-admin-account-container')).not.toBeInTheDocument()
      expect(screen.getByTestId('mocked-not-found-page')).toBeInTheDocument()
    })

    it('定義されていないパスにアクセスした場合、/404へ遷移しNotFoundPageが表示されること', () => {
      renderAdminRoute('/admin/unknown')
      expect(screen.getByTestId('mocked-not-found-page')).toBeInTheDocument()
    })
  })
})
