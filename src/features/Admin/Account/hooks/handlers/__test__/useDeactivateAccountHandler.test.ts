import { useDeactivateAccountHandler } from '../useDeactivateAccountHandler'
import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { describe, it, expect } from 'vitest'
import { act } from '@testing-library/react'

// API機能は別タスクで対応するため、現時点ではプレースホルダーの挙動（常に非送信中・onClickが例外を投げない）のみをテストする

describe('useDeactivateAccountHandler', () => {
  describe('正常系', () => {
    it('uiState.isSubmittingが常にfalseであること', () => {
      const { result } = customRenderHook(() => useDeactivateAccountHandler())

      expect(result.current.uiState.isSubmitting).toBe(false)
    })

    it('onClickを呼んでもエラーにならないこと', async () => {
      const { result } = customRenderHook(() => useDeactivateAccountHandler())

      await act(async () => {
        await expect(result.current.handlers.onClick()).resolves.toBeUndefined()
      })
    })
  })
})
