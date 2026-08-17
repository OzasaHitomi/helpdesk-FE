import { TicketDetailAssignButton } from '../TicketDetailAssignButton'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'

// TicketDetailAssignButtonの表示内容と、ボタン押下時にhandlers.onClickが呼ばれるかのみをテストする
// （ボタンを表示するかどうかの出し分けはTicketDetailPresentational.test.tsxが担保する）

const mockOnClick = vi.fn()

const renderButton = (uiStateOverrides?: Partial<{ isSubmitting: boolean }>) => {
  customRender(
    <TicketDetailAssignButton
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
    it('「担当者になる」ボタンが表示されること', () => {
      renderButton()

      expect(screen.getByRole('button', { name: '担当者になる' })).toBeInTheDocument()
    })

    it('ボタンを押すとhandlers.onClickが呼ばれること', () => {
      renderButton()

      fireEvent.click(screen.getByRole('button', { name: '担当者になる' }))
      expect(mockOnClick).toHaveBeenCalled()
    })

    it('isSubmittingがtrueの場合、ボタンが無効化されること', () => {
      renderButton({ isSubmitting: true })

      expect(screen.getByRole('button', { name: '担当者になる' })).toBeDisabled()
    })
  })
})
