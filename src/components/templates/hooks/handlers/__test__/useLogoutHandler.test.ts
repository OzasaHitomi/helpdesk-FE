import { useLogoutHandler } from '../useLogoutHandler'
import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { act } from '@testing-library/react'
import { authQueryKeys } from '@/share/hooks/queries/queryKeys'

// mutateAsync/navigate/queryClient.removeQueries/toaster.createのスパイを先に定義し、モジュールをまるごと差し替える
// (mutateAsyncの中身=通信処理はuseLogoutMutation.test.tsが担保するのでここではモックする)
// ※vi.mockはファイル先頭に巻き上げられるため、参照するモック関数はvi.hoistedで用意する
const { mockMutateAsync, mockNavigate, mockRemoveQueries, mockToasterCreate } = vi.hoisted(() => ({
  mockMutateAsync: vi.fn(),
  mockNavigate: vi.fn(),
  mockRemoveQueries: vi.fn(),
  mockToasterCreate: vi.fn(),
}))

vi.mock('@/share/hooks/mutations/useLogoutMutation', () => ({
  useLogoutMutation: () => ({ mutateAsync: mockMutateAsync, isPending: false }),
}))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>()
  return {
    ...actual,
    useQueryClient: () => ({ removeQueries: mockRemoveQueries }),
  }
})

vi.mock('@/components/ui/toaster', () => ({
  toaster: { create: mockToasterCreate },
}))

describe('useLogoutHandler', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('正常系', () => {
    it('ログアウトに成功した場合、meのキャッシュを破棄し、ログイン画面に遷移し、成功トーストを出すこと', async () => {
      mockMutateAsync.mockResolvedValueOnce(undefined)
      const { result } = customRenderHook(() => useLogoutHandler())

      await act(async () => {
        await result.current.handlers.onLogout()
      })

      expect(mockMutateAsync).toHaveBeenCalled()
      expect(mockRemoveQueries).toHaveBeenCalledWith({ queryKey: authQueryKeys.me })
      expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true })
      expect(mockToasterCreate).toHaveBeenCalledWith({
        type: 'success',
        title: 'ログアウトしました',
      })
    })
  })

  describe('異常系', () => {
    it('ログアウトに失敗した場合、キャッシュ破棄・画面遷移は行わず、失敗トーストを出すこと', async () => {
      mockMutateAsync.mockRejectedValueOnce(new Error('failed'))
      const { result } = customRenderHook(() => useLogoutHandler())

      await act(async () => {
        await result.current.handlers.onLogout()
      })

      expect(mockMutateAsync).toHaveBeenCalled()
      expect(mockRemoveQueries).not.toHaveBeenCalled()
      expect(mockNavigate).not.toHaveBeenCalled()
      expect(mockToasterCreate).toHaveBeenCalledWith({
        type: 'error',
        title: 'ログアウトに失敗しました',
      })
    })
  })
})
