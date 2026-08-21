import { useGetUsersHandler } from '../useGetUsersHandler'
import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { type GetUsersResponseItem } from '@/services/internal/backend/v1/types/response/users'

// 通信(useGetUsersQuery)はモックし、handlerが担当する
// 「View型への詰め替え」「未取得時の空配列」のみをテストする

const { mockUseGetUsersQuery } = vi.hoisted(() => ({
  mockUseGetUsersQuery: vi.fn(),
}))

vi.mock('../../queries/useGetUsersQuery', () => ({
  useGetUsersQuery: mockUseGetUsersQuery,
}))

const mockUsersResponse: GetUsersResponseItem[] = [
  { id: 1, name: '山田太郎', email: 'yamada@example.com', role: 'employee', isActive: true },
  { id: 2, name: '鈴木花子', email: 'suzuki@example.com', role: 'support', isActive: false },
]

describe('useGetUsersHandler', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('正常系', () => {
    it('取得したアカウントがそのままView型に詰め替えられること', () => {
      mockUseGetUsersQuery.mockReturnValue({
        data: mockUsersResponse,
        isFetching: false,
        isError: false,
      })

      const { result } = customRenderHook(() => useGetUsersHandler())

      expect(result.current.data.accounts).toEqual(mockUsersResponse)
    })

    it('uiStateにisFetching/isErrorがそのまま渡されること', () => {
      mockUseGetUsersQuery.mockReturnValue({
        data: mockUsersResponse,
        isFetching: true,
        isError: false,
      })

      const { result } = customRenderHook(() => useGetUsersHandler())

      expect(result.current.uiState).toEqual({ isFetching: true, isError: false })
    })
  })

  describe('準正常系', () => {
    it('dataが未取得(undefined)の場合、空配列を返すこと', () => {
      mockUseGetUsersQuery.mockReturnValue({
        data: undefined,
        isFetching: true,
        isError: false,
      })

      const { result } = customRenderHook(() => useGetUsersHandler())

      expect(result.current.data.accounts).toEqual([])
    })
  })
})
