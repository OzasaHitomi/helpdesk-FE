import { useGetTicketCommentsHandler } from '../useGetTicketCommentsHandler'
import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { type GetTicketCommentsResponseItem } from '@/services/internal/backend/v1/types/response/ticketComments'

// 通信(useGetTicketCommentsQuery)はモックし、handlerが担当する
// 「View型への詰め替え」「未取得時は空配列」のみをテストする

const { mockUseGetTicketCommentsQuery } = vi.hoisted(() => ({
  mockUseGetTicketCommentsQuery: vi.fn(),
}))

vi.mock('../../queries/useGetTicketCommentsQuery', () => ({
  useGetTicketCommentsQuery: mockUseGetTicketCommentsQuery,
}))

const mockCommentsResponse: GetTicketCommentsResponseItem[] = [
  {
    id: 1,
    content: 'ご質問ありがとうございます。確認いたします。',
    commenterName: '山田太郎',
    createdAt: new Date('2026-08-04T16:12:45Z'),
  },
]

describe('useGetTicketCommentsHandler', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('正常系', () => {
    it('取得した対応履歴がView型に詰め替えられて返されること', () => {
      mockUseGetTicketCommentsQuery.mockReturnValue({
        data: mockCommentsResponse,
        isLoading: false,
        isError: false,
      })

      const { result } = customRenderHook(() => useGetTicketCommentsHandler(1))

      expect(result.current.data.comments).toEqual(mockCommentsResponse)
    })

    it('uiStateにisLoading/isErrorがそのまま渡されること', () => {
      mockUseGetTicketCommentsQuery.mockReturnValue({
        data: mockCommentsResponse,
        isLoading: true,
        isError: false,
      })

      const { result } = customRenderHook(() => useGetTicketCommentsHandler(1))

      expect(result.current.uiState).toEqual({ isLoading: true, isError: false })
    })
  })
})
