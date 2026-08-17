import { useUpdateTicketStatusHandler } from '../useUpdateTicketStatusHandler'
import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { act } from '@testing-library/react'

// mutateAsync/toaster.createのスパイを先に定義し、モジュールをまるごと差し替える
// (mutateAsyncの中身=通信処理はuseUpdateTicketStatusMutation.test.tsが担保するのでここではモックする)
const { mockMutateAsync, mockToasterCreate, mockIsPending } = vi.hoisted(() => ({
  mockMutateAsync: vi.fn(),
  mockToasterCreate: vi.fn(),
  mockIsPending: { current: false },
}))

vi.mock('../../mutations/useUpdateTicketStatusMutation', () => ({
  useUpdateTicketStatusMutation: () => ({
    mutateAsync: mockMutateAsync,
    isPending: mockIsPending.current,
  }),
}))

vi.mock('@/components/ui/toaster', () => ({
  toaster: { create: mockToasterCreate },
}))

describe('useUpdateTicketStatusHandler', () => {
  afterEach(() => {
    vi.clearAllMocks()
    mockIsPending.current = false
  })

  describe('変更処理中の状態', () => {
    it('変更処理中の場合、uiState.isSubmittingがtrueになること', () => {
      mockIsPending.current = true
      const { result } = customRenderHook(() => useUpdateTicketStatusHandler(1))

      expect(result.current.uiState.isSubmitting).toBe(true)
    })

    it('変更処理中でない場合、uiState.isSubmittingがfalseになること', () => {
      const { result } = customRenderHook(() => useUpdateTicketStatusHandler(1))

      expect(result.current.uiState.isSubmitting).toBe(false)
    })
  })

  // ── onClick(ステータス変更)の挙動 ──────────────────────────────────────
  describe('ステータスボタンの操作', () => {
    it('変更に成功した場合、mutateAsyncが押下したステータスで呼ばれ、成功トーストが出ること', async () => {
      mockMutateAsync.mockResolvedValueOnce(undefined)
      const { result } = customRenderHook(() => useUpdateTicketStatusHandler(1))

      await act(async () => {
        await result.current.handlers.onClick('in_progress')
      })

      expect(mockMutateAsync).toHaveBeenCalledWith('in_progress')
      expect(mockToasterCreate).toHaveBeenCalledWith({
        type: 'success',
        title: 'ステータスを変更しました',
      })
    })

    it('BEが422 BUSINESS_ERRORを返す場合、detailの文言のエラートーストが出ること', async () => {
      mockMutateAsync.mockRejectedValueOnce({
        isAxiosError: true,
        response: {
          data: { detail: 'このステータス変更はできません', type: 'BUSINESS_ERROR' },
        },
      })
      const { result } = customRenderHook(() => useUpdateTicketStatusHandler(1))

      await act(async () => {
        await result.current.handlers.onClick('closed')
      })

      expect(mockToasterCreate).toHaveBeenCalledWith({
        type: 'error',
        title: 'このステータス変更はできません',
      })
    })

    it('BEが403等でdetail(文字列)を返す場合、その文言のエラートーストが出ること', async () => {
      mockMutateAsync.mockRejectedValueOnce({
        isAxiosError: true,
        response: { data: { detail: '担当者または管理者のみステータスを変更できます' } },
      })
      const { result } = customRenderHook(() => useUpdateTicketStatusHandler(1))

      await act(async () => {
        await result.current.handlers.onClick('resolved')
      })

      expect(mockToasterCreate).toHaveBeenCalledWith({
        type: 'error',
        title: '担当者または管理者のみステータスを変更できます',
      })
    })

    it('axios以外のエラーの場合、汎用エラートーストが出ること', async () => {
      mockMutateAsync.mockRejectedValueOnce(new Error('network error'))
      const { result } = customRenderHook(() => useUpdateTicketStatusHandler(1))

      await act(async () => {
        await result.current.handlers.onClick('resolved')
      })

      expect(mockToasterCreate).toHaveBeenCalledWith({
        type: 'error',
        title: 'ステータス変更に失敗しました',
      })
    })
  })
})
