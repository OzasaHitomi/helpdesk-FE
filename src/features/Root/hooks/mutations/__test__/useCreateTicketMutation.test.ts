import { useCreateTicketMutation } from '../useCreateTicketMutation'
import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { act, waitFor } from '@testing-library/react'
import * as ticketService from '@/services/internal/backend/v1/ticket'
import { type CreateTicketRequest } from '@/services/internal/backend/v1/types/request/ticket'
import { type CreateTicketResponse } from '@/services/internal/backend/v1/types/response/ticket'
import { ticketQueryKeys } from '../../queries/queryKeys'

// BEと通信する関数(createTicket)をモックし、useCreateTicketMutationが正しい引数でcreateTicketを呼び出し、
// 結果(成功/失敗)を正しく受け取れるか・成功時にチケット一覧のキャッシュを無効化するかをテストする
// （createTicket自体の通信処理はテストしない）

const { mockInvalidateQueries } = vi.hoisted(() => ({
  mockInvalidateQueries: vi.fn(),
}))

// @tanstack/react-query自体は本物のまま使いつつ（useMutationの実際の動作を確かめたいため）、
// useQueryClientだけを差し替えて、invalidateQueriesが呼ばれたかどうかを検証できるようにする
// importOriginalで元のモジュールを取得し、...actualで展開してから一部だけ上書きするのがポイント
vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>()
  return {
    ...actual,
    useQueryClient: () => ({ invalidateQueries: mockInvalidateQueries }),
  }
})

const mockRequest: CreateTicketRequest = {
  title: 'ログインできない',
  detail: 'パスワードを変更したらログインできなくなりました',
  visibility: 'private',
}

const mockResponse: CreateTicketResponse = {
  id: 1,
  title: mockRequest.title,
  detail: mockRequest.detail,
  visibility: mockRequest.visibility,
  status: 'new_question',
  createdByUserId: 1,
  supportUserId: null,
}

describe('useCreateTicketMutation', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.clearAllMocks()
  })

  // ── 正常系 ────────────────────────────────────────────────────────────────
  describe('正常系', () => {
    it('mutateAsyncを呼ぶとcreateTicketが正しい引数で呼ばれ、成功すること', async () => {
      const createTicketSpy = vi
        .spyOn(ticketService, 'createTicket')
        .mockResolvedValue(mockResponse)

      const { result } = customRenderHook(() => useCreateTicketMutation())

      await act(async () => {
        await result.current.mutateAsync(mockRequest)
      })

      expect(createTicketSpy).toHaveBeenCalledWith(mockRequest)
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
      expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ticketQueryKeys.all })
    })
  })

  // ── 異常系 ────────────────────────────────────────────────────────────────
  describe('異常系', () => {
    it('createTicketが失敗した場合、mutateAsyncがエラーになること', async () => {
      vi.spyOn(ticketService, 'createTicket').mockRejectedValue(new Error('failed'))

      const { result } = customRenderHook(() => useCreateTicketMutation())

      await act(async () => {
        await expect(result.current.mutateAsync(mockRequest)).rejects.toThrow('failed')
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })
      expect(mockInvalidateQueries).not.toHaveBeenCalled()
    })
  })
})
