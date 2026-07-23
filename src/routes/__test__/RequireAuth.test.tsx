import { RequireAuth } from '../RequireAuth'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { Provider as ChakraUIProvider } from '@/components/ui/provider'

// useMeQueryをモックし、確認中/成功/失敗それぞれでRequireAuthが
// 正しく表示を出し分ける（Outlet表示 or /loginへリダイレクト）かのみをテストする
// （GET /auth/me自体の通信処理はuseMeQuery.test.tsが担保する）

interface MockUseMeQueryReturn {
  isLoading: boolean
  isError: boolean
}

const mockUseMeQuery = vi.fn<() => MockUseMeQueryReturn>()

vi.mock('@/share/hooks/queries/useMeQuery', () => ({
  useMeQuery: () => mockUseMeQuery(),
}))

const renderRequireAuth = (initialEntry: string) => {
  return render(
    // isLoading時にLoadingSpinner（Chakra UIのSpinner）を描画するが、
    // ChakraのコンポーネントはuseContextでテーマ設定を読むため、
    // ここで囲っていないと「ChakraProviderが無い」というエラーになる
    <ChakraUIProvider>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route element={<RequireAuth />}>
            <Route path='/' element={<div data-testid='protected-page' />} />
          </Route>
          <Route path='/login' element={<div data-testid='login-page' />} />
        </Routes>
      </MemoryRouter>
    </ChakraUIProvider>,
  )
}

describe('RequireAuth', () => {
  describe('正常系', () => {
    it('確認中（isLoading）の場合、配下の画面もログイン画面も表示せず、ローディング画面が表示されること', () => {
      mockUseMeQuery.mockReturnValue({ isLoading: true, isError: false })
      renderRequireAuth('/')
      expect(screen.queryByTestId('protected-page')).not.toBeInTheDocument()
      expect(screen.queryByTestId('login-page')).not.toBeInTheDocument()
      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('セッションが有効な場合、配下の画面（Outlet）が表示されること', () => {
      mockUseMeQuery.mockReturnValue({ isLoading: false, isError: false })
      renderRequireAuth('/')
      expect(screen.getByTestId('protected-page')).toBeInTheDocument()
    })
  })

  describe('準正常系', () => {
    it('セッションが無効（401）な場合、/loginへリダイレクトされること', () => {
      mockUseMeQuery.mockReturnValue({ isLoading: false, isError: true })
      renderRequireAuth('/')
      expect(screen.getByTestId('login-page')).toBeInTheDocument()
      expect(screen.queryByTestId('protected-page')).not.toBeInTheDocument()
    })
  })
})
