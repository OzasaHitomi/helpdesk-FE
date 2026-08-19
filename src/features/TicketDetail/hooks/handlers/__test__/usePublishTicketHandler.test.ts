import { usePublishTicketHandler } from '../usePublishTicketHandler'
import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { act } from '@testing-library/react'

// mutateAsync/toaster.createのスパイを先に定義し、モジュールをまるごと差し替える
// (mutateAsyncの中身=通信処理はusePublishTicketMutation.test.tsが担保するのでここではモックする)
const { mockMutateAsync, mockToasterCreate, mockIsPending } = vi.hoisted(() => ({
  mockMutateAsync: vi.fn(),
  mockToasterCreate: vi.fn(),
  mockIsPending: { current: false },
}))

vi.mock('../../mutations/usePublishTicketMutation', () => ({
  usePublishTicketMutation: () => ({
    mutateAsync: mockMutateAsync,
    isPending: mockIsPending.current,
  }),
}))

vi.mock('@/components/ui/toaster', () => ({
  toaster: { create: mockToasterCreate },
}))

describe('usePublishTicketHandler', () => {
  afterEach(() => {
    vi.clearAllMocks()
    mockIsPending.current = false
  })

  describe('公開処理中の状態', () => {
    it('公開処理中の場合、uiState.isSubmittingがtrueになること', () => {
      mockIsPending.current = true
      const { result } = customRenderHook(() => usePublishTicketHandler(1))

      expect(result.current.uiState.isSubmitting).toBe(true)
    })

    it('公開処理中でない場合、uiState.isSubmittingがfalseになること', () => {
      const { result } = customRenderHook(() => usePublishTicketHandler(1))

      expect(result.current.uiState.isSubmitting).toBe(false)
    })
  })

  // ── onClick(公開)の挙動 ──────────────────────────────────────────
  describe('公開ボタンの操作', () => {
    it('公開に成功した場合、mutateAsyncが呼ばれ、成功トーストが出ること', async () => {
      mockMutateAsync.mockResolvedValueOnce(undefined)
      const { result } = customRenderHook(() => usePublishTicketHandler(1))

      await act(async () => {
        await result.current.handlers.onClick()
      })

      expect(mockMutateAsync).toHaveBeenCalled()
      expect(mockToasterCreate).toHaveBeenCalledWith({
        type: 'success',
        title: 'チケット：1 を公開に設定しました',
      })
    })

    it('BEが422 BUSINESS_ERRORを返す場合、detailの文言のエラートーストが出ること', async () => {
      mockMutateAsync.mockRejectedValueOnce({
        isAxiosError: true,
        response: {
          data: { detail: '既に公開設定です', type: 'BUSINESS_ERROR' },
        },
      })
      const { result } = customRenderHook(() => usePublishTicketHandler(1))

      await act(async () => {
        await result.current.handlers.onClick()
      })

      expect(mockToasterCreate).toHaveBeenCalledWith({
        type: 'error',
        title: '既に公開設定です',
      })
    })

    it('BEが403等でdetail(文字列)を返す場合、その文言のエラートーストが出ること', async () => {
      mockMutateAsync.mockRejectedValueOnce({
        isAxiosError: true,
        response: { data: { detail: 'サポート担当、または管理者のみ公開設定を変更できます' } },
      })
      const { result } = customRenderHook(() => usePublishTicketHandler(1))

      await act(async () => {
        await result.current.handlers.onClick()
      })

      expect(mockToasterCreate).toHaveBeenCalledWith({
        type: 'error',
        title: 'サポート担当、または管理者のみ公開設定を変更できます',
      })
    })

    it('axios以外のエラーの場合、汎用エラートーストが出ること', async () => {
      mockMutateAsync.mockRejectedValueOnce(new Error('network error'))
      const { result } = customRenderHook(() => usePublishTicketHandler(1))

      await act(async () => {
        await result.current.handlers.onClick()
      })

      expect(mockToasterCreate).toHaveBeenCalledWith({
        type: 'error',
        title: '公開設定の変更に失敗しました',
      })
    })
  })
})
