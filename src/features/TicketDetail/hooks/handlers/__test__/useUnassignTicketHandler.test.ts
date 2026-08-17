import { useUnassignTicketHandler } from '../useUnassignTicketHandler'
import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { act } from '@testing-library/react'

// mutateAsync/toaster.createのスパイを先に定義し、モジュールをまるごと差し替える
// (mutateAsyncの中身=通信処理はuseUnassignTicketMutation.test.tsが担保するのでここではモックする)
const { mockMutateAsync, mockToasterCreate, mockIsPending } = vi.hoisted(() => ({
  mockMutateAsync: vi.fn(),
  mockToasterCreate: vi.fn(),
  mockIsPending: { current: false },
}))

vi.mock('../../mutations/useUnassignTicketMutation', () => ({
  useUnassignTicketMutation: () => ({
    mutateAsync: mockMutateAsync,
    isPending: mockIsPending.current,
  }),
}))

vi.mock('@/components/ui/toaster', () => ({
  toaster: { create: mockToasterCreate },
}))

describe('useUnassignTicketHandler', () => {
  afterEach(() => {
    vi.clearAllMocks()
    mockIsPending.current = false
  })

  describe('解除処理中の状態', () => {
    it('解除処理中の場合、uiState.isSubmittingがtrueになること', () => {
      mockIsPending.current = true
      const { result } = customRenderHook(() => useUnassignTicketHandler(1))

      expect(result.current.uiState.isSubmitting).toBe(true)
    })

    it('解除処理中でない場合、uiState.isSubmittingがfalseになること', () => {
      const { result } = customRenderHook(() => useUnassignTicketHandler(1))

      expect(result.current.uiState.isSubmitting).toBe(false)
    })
  })

  // ── onClick(担当解除)の挙動 ──────────────────────────────────────────
  describe('担当解除ボタンの操作', () => {
    it('解除に成功した場合、mutateAsyncが呼ばれ、成功トーストが出ること', async () => {
      mockMutateAsync.mockResolvedValueOnce(undefined)
      const { result } = customRenderHook(() => useUnassignTicketHandler(1))

      await act(async () => {
        await result.current.handlers.onClick()
      })

      expect(mockMutateAsync).toHaveBeenCalled()
      expect(mockToasterCreate).toHaveBeenCalledWith({
        type: 'success',
        title: '担当を解除しました',
      })
    })

    it('BEが422 BUSINESS_ERRORを返す場合、detailの文言のエラートーストが出ること', async () => {
      mockMutateAsync.mockRejectedValueOnce({
        isAxiosError: true,
        response: {
          data: { detail: 'すでに担当が解除されています', type: 'BUSINESS_ERROR' },
        },
      })
      const { result } = customRenderHook(() => useUnassignTicketHandler(1))

      await act(async () => {
        await result.current.handlers.onClick()
      })

      expect(mockToasterCreate).toHaveBeenCalledWith({
        type: 'error',
        title: 'すでに担当が解除されています',
      })
    })

    it('BEが403等でdetail(文字列)を返す場合、その文言のエラートーストが出ること', async () => {
      mockMutateAsync.mockRejectedValueOnce({
        isAxiosError: true,
        response: { data: { detail: '担当を解除する権限がありません' } },
      })
      const { result } = customRenderHook(() => useUnassignTicketHandler(1))

      await act(async () => {
        await result.current.handlers.onClick()
      })

      expect(mockToasterCreate).toHaveBeenCalledWith({
        type: 'error',
        title: '担当を解除する権限がありません',
      })
    })

    it('axios以外のエラーの場合、汎用エラートーストが出ること', async () => {
      mockMutateAsync.mockRejectedValueOnce(new Error('network error'))
      const { result } = customRenderHook(() => useUnassignTicketHandler(1))

      await act(async () => {
        await result.current.handlers.onClick()
      })

      expect(mockToasterCreate).toHaveBeenCalledWith({
        type: 'error',
        title: '担当解除に失敗しました',
      })
    })
  })
})
