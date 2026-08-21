import { useActivateAccountHandler } from '../useActivateAccountHandler'
import { customRenderHook } from '@/tests/helpers/customRenderHook'
import { describe, it, expect } from 'vitest'
import { act } from '@testing-library/react'

// API機能は別タスクで対応するため、現時点ではプレースホルダーの挙動（常に非送信中・onClickが例外を投げない）のみをテストする

describe('useActivateAccountHandler', () => {
  describe('正常系', () => {
    it('uiState.isSubmittingが常にfalseであること', () => {
      const { result } = customRenderHook(() => useActivateAccountHandler())

      expect(result.current.uiState.isSubmitting).toBe(false)
    })

    it('onClickを呼んでもエラーにならないこと', async () => {
      const { result } = customRenderHook(() => useActivateAccountHandler())

      await act(async () => {
        await expect(result.current.handlers.onClick()).resolves.toBeUndefined()
      })
    })
  })
})
