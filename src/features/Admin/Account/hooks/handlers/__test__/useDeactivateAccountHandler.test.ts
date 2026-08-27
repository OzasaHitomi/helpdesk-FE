import { useDeactivateAccountHandler } from '../useDeactivateAccountHandler'
import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { act } from '@testing-library/react'
import { type AccountItemView } from '../../../types/AccountItemView'

// mutateAsync/toaster.createのスパイを先に定義し、モジュールをまるごと差し替える
// (mutateAsyncの中身=通信処理はuseDeactivateAccountMutation.test.tsが担保するのでここではモックする)
// ※vi.mockはファイル先頭に巻き上げられるため、参照するモック関数はvi.hoistedで用意する
//
// mockIsPending: 通常のプリミティブなboolean変数だと「テストごとに値を書き換える」ができないため、
// { current: boolean } というオブジェクトに包んでいる（テスト内でmockIsPending.current = trueのように書き換える）
const { mockMutateAsync, mockToasterCreate, mockIsPending } = vi.hoisted(() => ({
  mockMutateAsync: vi.fn(),
  mockToasterCreate: vi.fn(),
  mockIsPending: { current: false },
}))

vi.mock('../../mutations/useDeactivateAccountMutation', () => ({
  useDeactivateAccountMutation: () => ({
    mutateAsync: mockMutateAsync,
    isPending: mockIsPending.current,
  }),
}))

vi.mock('@/components/ui/toaster', () => ({
  toaster: { create: mockToasterCreate },
}))

const mockAccount: AccountItemView = {
  id: 1,
  name: '山田太郎',
  email: 'yamada@example.com',
  role: 'employee',
  isActive: true,
}

describe('useDeactivateAccountHandler', () => {
  afterEach(() => {
    vi.clearAllMocks()
    // mockIsPending.currentは各テストで独自に書き換えるため、次のテストに影響しないようここでも初期値に戻す
    mockIsPending.current = false
  })

  // ── 正常系 ────────────────────────────────────────────────────────────────
  describe('正常系', () => {
    it('登録処理中でない場合、uiState.isSubmittingがfalseであること', () => {
      const { result } = customRenderHook(() => useDeactivateAccountHandler())

      expect(result.current.uiState.isSubmitting).toBe(false)
    })

    it('登録処理中の場合、uiState.isSubmittingがtrueになること', () => {
      mockIsPending.current = true
      const { result } = customRenderHook(() => useDeactivateAccountHandler())

      expect(result.current.uiState.isSubmitting).toBe(true)
    })

    it('利用停止に成功した場合、mutateAsyncが正しい引数で呼ばれ、成功トーストが出ること', async () => {
      mockMutateAsync.mockResolvedValueOnce(undefined)
      const { result } = customRenderHook(() => useDeactivateAccountHandler())

      await act(async () => {
        await result.current.handlers.onClick(mockAccount)
      })

      expect(mockMutateAsync).toHaveBeenCalledWith(mockAccount.id)
      expect(mockToasterCreate).toHaveBeenCalledWith({
        type: 'success',
        title: '山田太郎を利用停止にしました',
      })
    })
  })

  // ── 異常系 ────────────────────────────────────────────────────────────────
  describe('異常系', () => {
    it('BEが403等でdetail(文字列)を返す場合、その文言のエラートーストが出ること', async () => {
      mockMutateAsync.mockRejectedValueOnce({
        isAxiosError: true,
        response: { data: { detail: '対象のアカウントが見つかりません' } },
      })
      const { result } = customRenderHook(() => useDeactivateAccountHandler())

      await act(async () => {
        await result.current.handlers.onClick(mockAccount)
      })

      expect(mockToasterCreate).toHaveBeenCalledWith({
        type: 'error',
        title: '対象のアカウントが見つかりません',
      })
    })

    it('axios以外のエラーの場合、汎用エラートーストが出ること', async () => {
      mockMutateAsync.mockRejectedValueOnce(new Error('network error'))
      const { result } = customRenderHook(() => useDeactivateAccountHandler())

      await act(async () => {
        await result.current.handlers.onClick(mockAccount)
      })

      expect(mockToasterCreate).toHaveBeenCalledWith({
        type: 'error',
        title: 'アカウントの利用停止に失敗しました',
      })
    })
  })
})
