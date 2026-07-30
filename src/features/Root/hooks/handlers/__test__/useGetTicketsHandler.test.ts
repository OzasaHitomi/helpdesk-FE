import { useGetTicketsHandler } from '../useGetTicketsHandler'
import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { type GetTicketsResponseItem } from '@/services/internal/backend/v1/types/response/tickets'

// 通信(useGetTicketsQuery)はモックし、handlerが担当する
// 「View型への詰め替え」「質問日が新しい順の並び替え」「未取得時の空配列」のみをテストする

const { mockUseGetTicketsQuery } = vi.hoisted(() => ({
  mockUseGetTicketsQuery: vi.fn(),
}))

vi.mock('../../queries/useGetTicketsQuery', () => ({
  useGetTicketsQuery: mockUseGetTicketsQuery,
}))

const mockTicketsResponse: GetTicketsResponseItem[] = [
  {
    id: 1,
    title: '古い質問',
    visibility: 'public',
    status: 'resolved',
    createdAt: new Date('2026-01-05T00:00:00Z'),
    questionerName: '鈴木花子',
    supportUserName: '田中一郎',
  },
  {
    id: 2,
    title: '新しい質問',
    visibility: 'private',
    status: 'new_question',
    createdAt: new Date('2026-07-29T00:00:00Z'),
    questionerName: '山田太郎',
    supportUserName: null,
  },
]

describe('useGetTicketsHandler', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('正常系', () => {
    it('取得したチケットが質問日の新しい順に並び替えられること', () => {
      mockUseGetTicketsQuery.mockReturnValue({
        data: mockTicketsResponse,
        isFetching: false,
        isError: false,
      })

      const { result } = customRenderHook(() => useGetTicketsHandler())

      expect(result.current.data.tickets.map((t) => t.id)).toEqual([2, 1])
    })

    it('uiStateにisFetching/isErrorがそのまま渡されること', () => {
      mockUseGetTicketsQuery.mockReturnValue({
        data: mockTicketsResponse,
        isFetching: true,
        isError: false,
      })

      const { result } = customRenderHook(() => useGetTicketsHandler())

      expect(result.current.uiState).toEqual({ isFetching: true, isError: false })
    })
  })

  describe('準正常系', () => {
    it('dataが未取得(undefined)の場合、空配列を返すこと', () => {
      mockUseGetTicketsQuery.mockReturnValue({
        data: undefined,
        isFetching: true,
        isError: false,
      })

      const { result } = customRenderHook(() => useGetTicketsHandler())

      expect(result.current.data.tickets).toEqual([])
    })
  })
})
