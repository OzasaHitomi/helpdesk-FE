import { useGetTicketHandler } from '../useGetTicketHandler'
import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { type GetTicketResponse } from '@/services/internal/backend/v1/types/response/tickets'

// 通信(useGetTicketQuery)はモックし、handlerが担当する
// 「View型への詰め替え」「未取得時のundefined」のみをテストする

const { mockUseGetTicketQuery } = vi.hoisted(() => ({
  mockUseGetTicketQuery: vi.fn(),
}))

vi.mock('../../queries/useGetTicketQuery', () => ({
  useGetTicketQuery: mockUseGetTicketQuery,
}))

const mockTicketResponse: GetTicketResponse = {
  id: 1,
  title: 'ログインできない',
  detail: 'パスワードを変更したらログインできなくなりました',
  visibility: 'private',
  status: 'new_question',
  supportUserId: null,
  supportUserName: null,
  createdAt: new Date('2026-07-29T00:00:00Z'),
}

describe('useGetTicketHandler', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('正常系', () => {
    it('取得したチケットがView型に詰め替えられて返されること', () => {
      mockUseGetTicketQuery.mockReturnValue({
        data: mockTicketResponse,
        isLoading: false,
        isError: false,
      })

      const { result } = customRenderHook(() => useGetTicketHandler(1))

      expect(result.current.data.ticket).toEqual(mockTicketResponse)
    })

    it('uiStateにisLoading/isErrorがそのまま渡されること', () => {
      mockUseGetTicketQuery.mockReturnValue({
        data: mockTicketResponse,
        isLoading: true,
        isError: false,
      })

      const { result } = customRenderHook(() => useGetTicketHandler(1))

      expect(result.current.uiState).toEqual({ isLoading: true, isError: false })
    })
  })

  describe('準正常系', () => {
    it('dataが未取得(undefined)の場合、ticketがundefinedを返すこと', () => {
      mockUseGetTicketQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
      })

      const { result } = customRenderHook(() => useGetTicketHandler(1))

      expect(result.current.data.ticket).toBeUndefined()
    })
  })
})
