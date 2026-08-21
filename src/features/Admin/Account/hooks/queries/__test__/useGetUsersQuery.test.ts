import { useGetUsersQuery } from '../useGetUsersQuery'
import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { waitFor } from '@testing-library/react'
import * as userService from '@/services/internal/backend/v1/users'
import { type GetUsersResponseItem } from '@/services/internal/backend/v1/types/response/users'

// BEと通信する関数(getUsers)をモックし、useGetUsersQueryがマウント時に自動でgetUsersを呼び出し、
// 結果(成功/失敗)を正しく受け取れるかのみをテストする（getUsers自体の通信処理はテストしない）

const mockUsersResponse: GetUsersResponseItem[] = [
  { id: 1, name: '山田太郎', email: 'yamada@example.com', role: 'employee', isActive: true },
]

describe('useGetUsersQuery', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('正常系', () => {
    it('マウント時に自動でgetUsersが呼ばれ、成功した場合はdataに結果が反映されること', async () => {
      const getUsersSpy = vi.spyOn(userService, 'getUsers').mockResolvedValue(mockUsersResponse)

      const { result } = customRenderHook(() => useGetUsersQuery())

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
      expect(getUsersSpy).toHaveBeenCalled()
      expect(result.current.data).toEqual(mockUsersResponse)
    })
  })

  describe('異常系', () => {
    it('getUsersが失敗した場合、isErrorがtrueになること', async () => {
      vi.spyOn(userService, 'getUsers').mockRejectedValue(new Error('failed'))

      const { result } = customRenderHook(() => useGetUsersQuery())

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })
    })
  })
})
