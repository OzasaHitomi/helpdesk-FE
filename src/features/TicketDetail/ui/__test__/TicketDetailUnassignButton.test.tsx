import { TicketDetailUnassignButton } from '../TicketDetailUnassignButton'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'

// TicketDetailUnassignButtonの表示内容と、ボタン押下時にhandlers.onClickが呼ばれるかのみをテストする
// （ボタンを表示する条件の決定ロジックはuseUnassignTicketHandler.test.tsが担保する）

const mockOnClick = vi.fn()

const renderButton = (
  overrides?: Partial<{ isUnassignableByMe: boolean }>,
  uiStateOverrides?: Partial<{ isSubmitting: boolean }>,
) => {
  customRender(
    <TicketDetailUnassignButton
      data={{ isUnassignableByMe: true, ...overrides }}
      uiState={{ isSubmitting: false, ...uiStateOverrides }}
      handlers={{ onClick: mockOnClick }}
    />,
  )
}

describe('TicketDetailUnassignButton', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('正常系', () => {
    it('isUnassignableByMeがtrueの場合、「担当解除」ボタンが表示されること', () => {
      renderButton({ isUnassignableByMe: true })

      expect(screen.getByRole('button', { name: '担当解除' })).toBeInTheDocument()
    })

    it('ボタンを押すとhandlers.onClickが呼ばれること', () => {
      renderButton({ isUnassignableByMe: true })

      fireEvent.click(screen.getByRole('button', { name: '担当解除' }))
      expect(mockOnClick).toHaveBeenCalled()
    })

    it('isSubmittingがtrueの場合、ボタンが無効化されること', () => {
      renderButton({ isUnassignableByMe: true }, { isSubmitting: true })

      expect(screen.getByRole('button', { name: '担当解除' })).toBeDisabled()
    })
  })

  // ── 準正常系（ボタンの出し分け） ───────────────────────────
  describe('準正常系', () => {
    it('isUnassignableByMeがfalseの場合、ボタンは表示されないこと', () => {
      renderButton({ isUnassignableByMe: false })

      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })
  })
})
