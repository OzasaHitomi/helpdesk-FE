import { TicketDetailAssignButton } from '../TicketDetailAssignButton'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'

// TicketDetailAssignButtonの表示内容と、ボタン押下時にhandlers.onClickが呼ばれるかのみをテストする
// （ボタンを表示する条件の決定ロジックはuseAssignTicketHandler.test.tsが担保する）

const mockOnClick = vi.fn()

const renderButton = (
  overrides?: Partial<{ isAssignableToMe: boolean }>,
  uiStateOverrides?: Partial<{ isSubmitting: boolean }>,
) => {
  customRender(
    <TicketDetailAssignButton
      data={{ isAssignableToMe: true, ...overrides }}
      uiState={{ isSubmitting: false, ...uiStateOverrides }}
      handlers={{ onClick: mockOnClick }}
    />,
  )
}

describe('TicketDetailAssignButton', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('正常系', () => {
    it('isAssignableToMeがtrueの場合、「担当者になる」ボタンが表示されること', () => {
      renderButton({ isAssignableToMe: true })

      expect(screen.getByRole('button', { name: '担当者になる' })).toBeInTheDocument()
    })

    it('ボタンを押すとhandlers.onClickが呼ばれること', () => {
      renderButton({ isAssignableToMe: true })

      fireEvent.click(screen.getByRole('button', { name: '担当者になる' }))
      expect(mockOnClick).toHaveBeenCalled()
    })

    it('isSubmittingがtrueの場合、ボタンが無効化されること', () => {
      renderButton({ isAssignableToMe: true }, { isSubmitting: true })

      expect(screen.getByRole('button', { name: '担当者になる' })).toBeDisabled()
    })
  })

  // ── 準正常系（ボタンの出し分け） ───────────────────────────
  describe('準正常系', () => {
    it('isAssignableToMeがfalseの場合、ボタンは表示されないこと', () => {
      renderButton({ isAssignableToMe: false })

      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })
  })
})
