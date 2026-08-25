import { useCreateAccountMutation } from '../useCreateAccountMutation'
import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { act, waitFor } from '@testing-library/react'
import * as userService from '@/services/internal/backend/v1/users'
import { type CreateUserRequest } from '@/services/internal/backend/v1/types/request/users'
import { type CreateUserResponse } from '@/services/internal/backend/v1/types/response/users'
import { userQueryKeys } from '../../queries/queryKeys'

// BEと通信する関数(createUser)をモックし、useCreateAccountMutationが正しい引数でcreateUserを呼び出し、
// 結果(成功/失敗)を正しく受け取れるか・成功時にアカウント一覧のキャッシュを無効化するかをテストする
// （createUser自体の通信処理はテストしない）

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

const mockRequest: CreateUserRequest = {
  name: '山田太郎',
  email: 'yamada@example.com',
  password: 'password123',
  role: 'employee',
}

const mockResponse: CreateUserResponse = {
  id: 1,
  name: mockRequest.name,
  email: mockRequest.email,
  role: mockRequest.role,
  isActive: true,
}

describe('useCreateAccountMutation', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.clearAllMocks()
  })

  // ── 正常系 ────────────────────────────────────────────────────────────────
  describe('正常系', () => {
    it('mutateAsyncを呼ぶとcreateUserが正しい引数で呼ばれ、成功すること', async () => {
      const createUserSpy = vi.spyOn(userService, 'createUser').mockResolvedValue(mockResponse)

      const { result } = customRenderHook(() => useCreateAccountMutation())

      await act(async () => {
        await result.current.mutateAsync(mockRequest)
      })

      expect(createUserSpy).toHaveBeenCalledWith(mockRequest)
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
      expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: userQueryKeys.all })
    })
  })

  // ── 異常系 ────────────────────────────────────────────────────────────────
  describe('異常系', () => {
    it('createUserが失敗した場合、mutateAsyncがエラーになること', async () => {
      vi.spyOn(userService, 'createUser').mockRejectedValue(new Error('failed'))

      const { result } = customRenderHook(() => useCreateAccountMutation())

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
