import { AccountActivateButton } from '../AccountActivateButton'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { type AccountItemView } from '../../../types/AccountItemView'

// AccountActivateButtonの表示内容と、ボタン押下時にhandlers.onClickが呼ばれるかのみをテストする
// （ボタンを表示するかどうかの出し分けはAccountsTable.test.tsxが担保する）

const mockOnClick = vi.fn()
const mockAccount: AccountItemView = {
  id: 1,
  name: '山田太郎',
  email: 'yamada@example.com',
  role: 'employee',
  isActive: false,
}

const renderButton = (uiStateOverrides?: Partial<{ isSubmitting: boolean }>) => {
  customRender(
    <AccountActivateButton
      account={mockAccount}
      uiState={{ isSubmitting: false, ...uiStateOverrides }}
      handlers={{ onClick: mockOnClick }}
    />,
  )
}

describe('AccountActivateButton', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('正常系', () => {
    it('「再開」ボタンが表示されること', () => {
      renderButton()

      expect(screen.getByRole('button', { name: '再開' })).toBeInTheDocument()
    })

    it('ボタンを押すとhandlers.onClickが対象のaccountで呼ばれること', () => {
      renderButton()

      fireEvent.click(screen.getByRole('button', { name: '再開' }))
      expect(mockOnClick).toHaveBeenCalledWith(mockAccount)
    })

    it('isSubmittingがtrueの場合、ボタンが無効化されること', () => {
      renderButton({ isSubmitting: true })

      expect(screen.getByRole('button', { name: '再開' })).toBeDisabled()
    })
  })
})
