import { useMeQuery } from '../useMeQuery'
import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { waitFor } from '@testing-library/react'
import * as authService from '@/services/internal/backend/v1/auth'
import { type GetMeResponse } from '@/services/internal/backend/v1/types/response/auth'

// BEと通信する関数(getMe)をモックし、useMeQueryがマウント時に自動でgetMeを呼び出し、
// 結果(成功/失敗)を正しく受け取れるかのみをテストする（getMe自体の通信処理はテストしない）

const mockMeResponse: GetMeResponse = {
  id: 1,
  role: 'employee',
}

describe('useMeQuery', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('正常系', () => {
    it('マウント時に自動でgetMeが呼ばれ、成功した場合はdataに結果が反映されること', async () => {
      const getMeSpy = vi.spyOn(authService, 'getMe').mockResolvedValue(mockMeResponse)

      const { result } = customRenderHook(() => useMeQuery())

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
      expect(getMeSpy).toHaveBeenCalled()
      expect(result.current.data).toEqual(mockMeResponse)
    })
  })

  describe('異常系', () => {
    it('getMeが失敗（401等）した場合、isErrorがtrueになること', async () => {
      vi.spyOn(authService, 'getMe').mockRejectedValue(new Error('Unauthorized'))

      const { result } = customRenderHook(() => useMeQuery())

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })
    })
  })
})
