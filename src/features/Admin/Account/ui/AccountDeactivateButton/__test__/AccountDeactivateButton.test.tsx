import { AccountDeactivateButton } from '../AccountDeactivateButton'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { type AccountItemView } from '../../../types/AccountItemView'

// AccountDeactivateButtonの表示内容と、ボタン押下時にhandlers.onClickが呼ばれるかのみをテストする
// （ボタンを表示するかどうかの出し分けはAccountsTable.test.tsxが担保する）

const mockOnClick = vi.fn()
const mockAccount: AccountItemView = {
  id: 1,
  name: '山田太郎',
  email: 'yamada@example.com',
  role: 'employee',
  isActive: true,
}

const renderButton = (uiStateOverrides?: Partial<{ isSubmitting: boolean }>) => {
  customRender(
    <AccountDeactivateButton
      account={mockAccount}
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

    it('ボタンを押すとhandlers.onClickが対象のaccountで呼ばれること', () => {
      renderButton()

      fireEvent.click(screen.getByRole('button', { name: '停止' }))
      expect(mockOnClick).toHaveBeenCalledWith(mockAccount)
    })

    it('isSubmittingがtrueの場合、ボタンが無効化されること', () => {
      renderButton({ isSubmitting: true })

      expect(screen.getByRole('button', { name: '停止' })).toBeDisabled()
    })
  })
})
