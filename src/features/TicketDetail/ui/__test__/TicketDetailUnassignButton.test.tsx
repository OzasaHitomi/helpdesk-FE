import { TicketDetailUnassignButton } from '../TicketDetailUnassignButton'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'

// TicketDetailUnassignButtonの表示内容と、ボタン押下時にhandlers.onClickが呼ばれるかのみをテストする
// （ボタンを表示するかどうかの出し分けはTicketDetailPresentational.test.tsxが担保する）

const mockOnClick = vi.fn()

const renderButton = (uiStateOverrides?: Partial<{ isSubmitting: boolean }>) => {
  customRender(
    <TicketDetailUnassignButton
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
    it('「担当解除」ボタンが表示されること', () => {
      renderButton()

      expect(screen.getByRole('button', { name: '担当解除' })).toBeInTheDocument()
    })

    it('ボタンを押すとhandlers.onClickが呼ばれること', () => {
      renderButton()

      fireEvent.click(screen.getByRole('button', { name: '担当解除' }))
      expect(mockOnClick).toHaveBeenCalled()
    })

    it('isSubmittingがtrueの場合、ボタンが無効化されること', () => {
      renderButton({ isSubmitting: true })

      expect(screen.getByRole('button', { name: '担当解除' })).toBeDisabled()
    })
  })
})
