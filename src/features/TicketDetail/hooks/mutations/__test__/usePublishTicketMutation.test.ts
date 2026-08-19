import { usePublishTicketMutation } from '../usePublishTicketMutation'
import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { act, waitFor } from '@testing-library/react'
import * as ticketsService from '@/services/internal/backend/v1/tickets'
import { type PublishTicketResponse } from '@/services/internal/backend/v1/types/response/tickets'
import { ticketDetailQueryKeys } from '../../queries/queryKeys'

// BEと通信する関数(publishTicket)をモックし、usePublishTicketMutationが正しい引数で
// publishTicketを呼び出し、結果(成功/失敗)を正しく受け取れるか・成功時にチケット詳細と対応履歴の
// 両方のキャッシュを無効化するかをテストする（publishTicket自体の通信処理はテストしない）

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

const mockResponse: PublishTicketResponse = {
  id: 1,
  visibility: 'public',
  updatedAt: new Date('2026-08-18T00:00:00Z'),
}

describe('usePublishTicketMutation', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.clearAllMocks()
  })

  // ── 正常系 ────────────────────────────────────────────────────────────────
  describe('正常系', () => {
    it('mutateAsyncを呼ぶとpublishTicketが正しい引数で呼ばれ、成功すること', async () => {
      const publishTicketSpy = vi
        .spyOn(ticketsService, 'publishTicket')
        .mockResolvedValue(mockResponse)

      const { result } = customRenderHook(() => usePublishTicketMutation(1))

      await act(async () => {
        await result.current.mutateAsync()
      })

      expect(publishTicketSpy).toHaveBeenCalledWith(1)
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
    it('publishTicketが失敗した場合、mutateAsyncがエラーになり、キャッシュは無効化されないこと', async () => {
      vi.spyOn(ticketsService, 'publishTicket').mockRejectedValue(new Error('failed'))

      const { result } = customRenderHook(() => usePublishTicketMutation(1))

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
