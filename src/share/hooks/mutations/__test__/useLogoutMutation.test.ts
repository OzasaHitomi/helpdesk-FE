import { useLogoutMutation } from '../useLogoutMutation'
import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { act, waitFor } from '@testing-library/react'
import * as authService from '@/services/internal/backend/v1/auth'

// BEと通信する関数(postLogout)をモックし、useLogoutMutationが正しくpostLogoutを呼び出し、
// 結果(成功/失敗)を正しく受け取れるかのみをテストする（postLogout自体の通信処理はテストしない）

describe('useLogoutMutation', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('正常系', () => {
    it('mutateAsyncを呼ぶとpostLogoutが呼ばれ、成功すること', async () => {
      const postLogoutSpy = vi.spyOn(authService, 'postLogout').mockResolvedValue(undefined)

      const { result } = customRenderHook(() => useLogoutMutation())

      await act(async () => {
        await result.current.mutateAsync()
      })

      expect(postLogoutSpy).toHaveBeenCalled()
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
    })
  })

  describe('異常系', () => {
    it('postLogoutが失敗した場合、mutateAsyncがエラーになること', async () => {
      vi.spyOn(authService, 'postLogout').mockRejectedValue(new Error('failed'))

      const { result } = customRenderHook(() => useLogoutMutation())

      await act(async () => {
        await expect(result.current.mutateAsync()).rejects.toThrow('failed')
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })
    })
  })
})
