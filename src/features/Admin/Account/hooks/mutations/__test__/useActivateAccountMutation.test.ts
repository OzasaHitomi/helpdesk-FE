import { useActivateAccountMutation } from '../useActivateAccountMutation'
import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { act, waitFor } from '@testing-library/react'
import * as userService from '@/services/internal/backend/v1/users'
import { type ActivateUserResponse } from '@/services/internal/backend/v1/types/response/users'
import { userQueryKeys } from '../../queries/queryKeys'

// BEと通信する関数(activateUser)をモックし、useActivateAccountMutationが正しい引数でactivateUserを呼び出し、
// 結果(成功/失敗)を正しく受け取れるか・成功時にアカウント一覧のキャッシュを無効化するかをテストする
// （activateUser自体の通信処理はテストしない）

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

const mockUserId = 1

const mockResponse: ActivateUserResponse = {
  id: mockUserId,
  name: '山田太郎',
  email: 'yamada@example.com',
  role: 'employee',
  isActive: true,
}

describe('useActivateAccountMutation', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.clearAllMocks()
  })

  // ── 正常系 ────────────────────────────────────────────────────────────────
  describe('正常系', () => {
    it('mutateAsyncを呼ぶとactivateUserが正しい引数で呼ばれ、成功すること', async () => {
      const activateUserSpy = vi.spyOn(userService, 'activateUser').mockResolvedValue(mockResponse)

      const { result } = customRenderHook(() => useActivateAccountMutation())

      await act(async () => {
        await result.current.mutateAsync(mockUserId)
      })

      expect(activateUserSpy).toHaveBeenCalledWith(mockUserId)
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
      expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: userQueryKeys.all })
    })
  })

  // ── 異常系 ────────────────────────────────────────────────────────────────
  describe('異常系', () => {
    it('activateUserが失敗した場合、mutateAsyncがエラーになること', async () => {
      vi.spyOn(userService, 'activateUser').mockRejectedValue(new Error('failed'))

      const { result } = customRenderHook(() => useActivateAccountMutation())

      await act(async () => {
        await expect(result.current.mutateAsync(mockUserId)).rejects.toThrow('failed')
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })
      expect(mockInvalidateQueries).not.toHaveBeenCalled()
    })
  })
})
