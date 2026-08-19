import { TicketDetailUnpublishButton } from '../TicketDetailUnpublishButton'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'

// TicketDetailUnpublishButtonの表示内容(選択状態・disabled)と、ボタン押下時にhandlers.onClickが
// 呼ばれるかのみをテストする
// （isSelected/isEditable/disabledの計算自体はTicketDetailInfo.test.tsxが担保する）

const mockOnClick = vi.fn()

const renderButton = (
  overrides?: Partial<{ isSelected: boolean; isEditable: boolean; disabled: boolean }>,
) => {
  customRender(
    <TicketDetailUnpublishButton
      isSelected={false}
      isEditable={false}
      disabled={false}
      handlers={{ onClick: mockOnClick }}
      {...overrides}
    />,
  )
}

describe('TicketDetailUnpublishButton', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('正常系', () => {
    it('「非公開」ボタンが表示されること', () => {
      renderButton()

      expect(screen.getByRole('button', { name: '非公開' })).toBeInTheDocument()
    })

    it('isSelectedがtrueの場合、aria-pressedがtrueになること', () => {
      renderButton({ isSelected: true })

      expect(screen.getByRole('button', { name: '非公開' })).toHaveAttribute('aria-pressed', 'true')
    })

    it('isSelectedがfalseの場合、aria-pressedがfalseになること', () => {
      renderButton({ isSelected: false })

      expect(screen.getByRole('button', { name: '非公開' })).toHaveAttribute(
        'aria-pressed',
        'false',
      )
    })

    it('disabledがtrueの場合、ボタンが無効化されること', () => {
      renderButton({ disabled: true })

      expect(screen.getByRole('button', { name: '非公開' })).toBeDisabled()
    })

    it('disabledがfalseの場合、ボタンが無効化されないこと', () => {
      renderButton({ disabled: false })

      expect(screen.getByRole('button', { name: '非公開' })).not.toBeDisabled()
    })

    it('ボタンを押すとhandlers.onClickが呼ばれること', () => {
      renderButton()

      fireEvent.click(screen.getByRole('button', { name: '非公開' }))

      expect(mockOnClick).toHaveBeenCalled()
    })
  })
})
