import { useCreateTicketCommentMutation } from '../useCreateTicketCommentMutation'
import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { act, waitFor } from '@testing-library/react'
import * as ticketCommentsService from '@/services/internal/backend/v1/ticketComments'
import { type CreateTicketCommentRequest } from '@/services/internal/backend/v1/types/request/ticketComments'
import { type CreateTicketCommentResponse } from '@/services/internal/backend/v1/types/response/ticketComments'
import { ticketDetailQueryKeys } from '../../queries/queryKeys'

// BEと通信する関数(createTicketComment)をモックし、useCreateTicketCommentMutationが正しい引数で
// createTicketCommentを呼び出し、結果(成功/失敗)を正しく受け取れるか・成功時に対応履歴のキャッシュを
// 無効化するかをテストする（createTicketComment自体の通信処理はテストしない）

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

const mockRequest: CreateTicketCommentRequest = {
  content: 'ありがとうございます、解決しました。',
}

const mockResponse: CreateTicketCommentResponse = {
  id: 2,
  ticketId: 1,
  content: mockRequest.content,
  createdByUserId: 1,
}

describe('useCreateTicketCommentMutation', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.clearAllMocks()
  })

  // ── 正常系 ────────────────────────────────────────────────────────────────
  describe('正常系', () => {
    it('mutateAsyncを呼ぶとcreateTicketCommentが正しい引数で呼ばれ、成功すること', async () => {
      const createTicketCommentSpy = vi
        .spyOn(ticketCommentsService, 'createTicketComment')
        .mockResolvedValue(mockResponse)

      const { result } = customRenderHook(() => useCreateTicketCommentMutation())

      await act(async () => {
        await result.current.mutateAsync({ ticketId: 1, request: mockRequest })
      })

      expect(createTicketCommentSpy).toHaveBeenCalledWith(1, mockRequest)
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: ticketDetailQueryKeys.comments(1),
      })
    })
  })

  // ── 異常系 ────────────────────────────────────────────────────────────────
  describe('異常系', () => {
    it('createTicketCommentが失敗した場合、mutateAsyncがエラーになること', async () => {
      vi.spyOn(ticketCommentsService, 'createTicketComment').mockRejectedValue(new Error('failed'))

      const { result } = customRenderHook(() => useCreateTicketCommentMutation())

      await act(async () => {
        await expect(
          result.current.mutateAsync({ ticketId: 1, request: mockRequest }),
        ).rejects.toThrow('failed')
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })
      expect(mockInvalidateQueries).not.toHaveBeenCalled()
    })
  })
})
