import { AccountDeactivateButton } from '../AccountDeactivateButton'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'

// AccountDeactivateButtonの表示内容と、ボタン押下時にhandlers.onClickが呼ばれるかのみをテストする
// （ボタンを表示するかどうかの出し分けはAccountsTable.test.tsxが担保する）

const mockOnClick = vi.fn()

const renderButton = (uiStateOverrides?: Partial<{ isSubmitting: boolean }>) => {
  customRender(
    <AccountDeactivateButton
      uiState={{ isSubmitting: false, ...uiStateOverrides }}
      handlers={{ onClick: mockOnClick }}
    />,
  )
}

describe('AccountDeactivateButton', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('正常系', () => {
    it('「停止」ボタンが表示されること', () => {
      renderButton()

      expect(screen.getByRole('button', { name: '停止' })).toBeInTheDocument()
    })

    it('ボタンを押すとhandlers.onClickが呼ばれること', () => {
      renderButton()

      fireEvent.click(screen.getByRole('button', { name: '停止' }))
      expect(mockOnClick).toHaveBeenCalled()
    })

    it('isSubmittingがtrueの場合、ボタンが無効化されること', () => {
      renderButton({ isSubmitting: true })

      expect(screen.getByRole('button', { name: '停止' })).toBeDisabled()
    })
  })
})
