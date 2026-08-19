import { useUnpublishTicketMutation } from '../useUnpublishTicketMutation'
import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { act, waitFor } from '@testing-library/react'
import * as ticketsService from '@/services/internal/backend/v1/tickets'
import { type UnpublishTicketResponse } from '@/services/internal/backend/v1/types/response/tickets'
import { ticketDetailQueryKeys } from '../../queries/queryKeys'

// BEと通信する関数(unpublishTicket)をモックし、useUnpublishTicketMutationが正しい引数で
// unpublishTicketを呼び出し、結果(成功/失敗)を正しく受け取れるか・成功時にチケット詳細と対応履歴の
// 両方のキャッシュを無効化するかをテストする（unpublishTicket自体の通信処理はテストしない）

const { mockInvalidateQueries } = vi.hoisted(() => ({
  mockInvalidateQueries: vi.fn(),
}))

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>()
  return {
    ...actual,
    useQueryClient: () => ({ invalidateQueries: mockInvalidateQueries }),
  }
})

const mockResponse: UnpublishTicketResponse = {
  id: 1,
  visibility: 'private',
  updatedAt: new Date('2026-08-18T00:00:00Z'),
}

describe('useUnpublishTicketMutation', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.clearAllMocks()
  })

  // ── 正常系 ────────────────────────────────────────────────────────────────
  describe('正常系', () => {
    it('mutateAsyncを呼ぶとunpublishTicketが正しい引数で呼ばれ、成功すること', async () => {
      const unpublishTicketSpy = vi
        .spyOn(ticketsService, 'unpublishTicket')
        .mockResolvedValue(mockResponse)

      const { result } = customRenderHook(() => useUnpublishTicketMutation(1))

      await act(async () => {
        await result.current.mutateAsync()
      })

      expect(unpublishTicketSpy).toHaveBeenCalledWith(1)
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: ticketDetailQueryKeys.detail(1),
      })
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: ticketDetailQueryKeys.comments(1),
      })
    })
  })

  // ── 異常系 ────────────────────────────────────────────────────────────────
  describe('異常系', () => {
    it('unpublishTicketが失敗した場合、mutateAsyncがエラーになり、キャッシュは無効化されないこと', async () => {
      vi.spyOn(ticketsService, 'unpublishTicket').mockRejectedValue(new Error('failed'))

      const { result } = customRenderHook(() => useUnpublishTicketMutation(1))

      await act(async () => {
        await expect(result.current.mutateAsync()).rejects.toThrow('failed')
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })
      expect(mockInvalidateQueries).not.toHaveBeenCalled()
    })
  })
})
