import { useLoginMutation } from '../useLoginMutation'
import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { act, waitFor } from '@testing-library/react'
import * as authService from '@/services/internal/backend/v1/auth'
import { type LoginRequest } from '@/services/internal/backend/v1/types/request/auth'

// BEと通信する関数(postLogin)をモックし、useLoginMutationが正しい引数でpostLoginを呼び出し、
// 結果(成功/失敗)を正しく受け取れるかのみをテストする（postLogin自体の通信処理はテストしない）

const mockRequest: LoginRequest = { email: 'test@example.com', password: 'password123' }

describe('useLoginMutation', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('正常系', () => {
    it('mutateAsyncを呼ぶとpostLoginが正しい引数で呼ばれ、成功すること', async () => {
      const postLoginSpy = vi.spyOn(authService, 'postLogin').mockResolvedValue(undefined)

      const { result } = customRenderHook(() => useLoginMutation())

      await act(async () => {
        await result.current.mutateAsync(mockRequest)
      })

      expect(postLoginSpy).toHaveBeenCalledWith(mockRequest)
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
    })
  })

  describe('異常系', () => {
    it('postLoginが失敗した場合、mutateAsyncがエラーになること', async () => {
      vi.spyOn(authService, 'postLogin').mockRejectedValue(new Error('failed'))

      const { result } = customRenderHook(() => useLoginMutation())

      await act(async () => {
        await expect(result.current.mutateAsync(mockRequest)).rejects.toThrow('failed')
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })
    })
  })
})
