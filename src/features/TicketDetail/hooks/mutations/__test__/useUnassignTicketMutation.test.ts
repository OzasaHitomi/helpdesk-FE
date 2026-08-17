import { useUnassignTicketMutation } from '../useUnassignTicketMutation'
import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { act, waitFor } from '@testing-library/react'
import * as ticketsService from '@/services/internal/backend/v1/tickets'
import { type UnassignTicketResponse } from '@/services/internal/backend/v1/types/response/tickets'
import { ticketDetailQueryKeys } from '../../queries/queryKeys'

// BEと通信する関数(unassignTicket)をモックし、useUnassignTicketMutationが正しい引数で
// unassignTicketを呼び出し、結果(成功/失敗)を正しく受け取れるか・成功時にチケット詳細と対応履歴の
// 両方のキャッシュを無効化するかをテストする（unassignTicket自体の通信処理はテストしない）

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

const mockResponse: UnassignTicketResponse = {
  id: 1,
  status: 'new_question',
  supportUserId: null,
  supportUserName: null,
  updatedAt: new Date('2026-08-14T00:00:00Z'),
}

describe('useUnassignTicketMutation', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.clearAllMocks()
  })

  // ── 正常系 ────────────────────────────────────────────────────────────────
  describe('正常系', () => {
    it('mutateAsyncを呼ぶとunassignTicketが正しい引数で呼ばれ、成功すること', async () => {
      const unassignTicketSpy = vi
        .spyOn(ticketsService, 'unassignTicket')
        .mockResolvedValue(mockResponse)

      const { result } = customRenderHook(() => useUnassignTicketMutation(1))

      await act(async () => {
        await result.current.mutateAsync()
      })

      expect(unassignTicketSpy).toHaveBeenCalledWith(1)
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
    it('unassignTicketが失敗した場合、mutateAsyncがエラーになり、キャッシュは無効化されないこと', async () => {
      vi.spyOn(ticketsService, 'unassignTicket').mockRejectedValue(new Error('failed'))

      const { result } = customRenderHook(() => useUnassignTicketMutation(1))

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
