import { TicketDetailAssignButton } from '../TicketDetailAssignButton'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'

// TicketDetailAssignButtonの表示内容と、ボタン押下時にhandlers.onClickが呼ばれるかのみをテストする
// （ボタンを表示する条件・ラベルの決定ロジックはuseAssignTicketHandler.test.tsが担保する）

const mockOnClick = vi.fn()

const renderButton = (
  overrides?: Partial<{ buttonLabel: string | null; supportUserName: string | null }>,
  uiStateOverrides?: Partial<{ isSubmitting: boolean }>,
  onClick: (() => Promise<void>) | undefined = mockOnClick,
) => {
  customRender(
    <TicketDetailAssignButton
      data={{ buttonLabel: null, supportUserName: null, ...overrides }}
      uiState={{ isSubmitting: false, ...uiStateOverrides }}
      handlers={{ onClick }}
    />,
  )
}

describe('TicketDetailAssignButton', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('正常系', () => {
    it('buttonLabelが「担当者になる」の場合、そのラベルのボタンが表示されること', () => {
      renderButton({ buttonLabel: '担当者になる' })

      expect(screen.getByRole('button', { name: '担当者になる' })).toBeInTheDocument()
    })

    it('ボタンを押すとhandlers.onClickが呼ばれること', () => {
      renderButton({ buttonLabel: '担当者になる' })

      fireEvent.click(screen.getByRole('button', { name: '担当者になる' }))
      expect(mockOnClick).toHaveBeenCalled()
    })

    it('isSubmittingがtrueの場合、ボタンが無効化されること', () => {
      renderButton({ buttonLabel: '担当者になる' }, { isSubmitting: true })

      expect(screen.getByRole('button', { name: '担当者になる' })).toBeDisabled()
    })

    it('buttonLabelとsupportUserNameが両方ある場合、区切り(|)付きで担当者名が表示されること', () => {
      renderButton({ buttonLabel: '担当解除', supportUserName: '山田太郎' })

      expect(screen.getByRole('button', { name: '担当解除' })).toBeInTheDocument()
      expect(screen.getByText('|')).toBeInTheDocument()
      expect(screen.getByText('山田太郎')).toBeInTheDocument()
    })

    it('onClickが未接続(undefined)でもボタンは表示され、クリックしてもエラーにならないこと', () => {
      customRender(
        <TicketDetailAssignButton
          data={{ buttonLabel: '担当解除', supportUserName: null }}
          uiState={{ isSubmitting: false }}
          handlers={{ onClick: undefined }}
        />,
      )

      expect(() => fireEvent.click(screen.getByRole('button', { name: '担当解除' }))).not.toThrow()
      expect(mockOnClick).not.toHaveBeenCalled()
    })
  })

  // ── 準正常系（ボタン・担当者名の出し分け） ───────────────────────────
  describe('準正常系', () => {
    it('buttonLabelがnullの場合、ボタンは表示されないこと', () => {
      renderButton({ buttonLabel: null, supportUserName: null })

      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('buttonLabelがnullでsupportUserNameのみある場合、区切り(|)なしで名前だけ表示されること', () => {
      renderButton({ buttonLabel: null, supportUserName: '山田太郎' })

      expect(screen.queryByRole('button')).not.toBeInTheDocument()
      expect(screen.queryByText('|')).not.toBeInTheDocument()
      expect(screen.getByText('山田太郎')).toBeInTheDocument()
    })

    it('buttonLabel・supportUserNameどちらもnullの場合、何も表示されないこと', () => {
      renderButton({ buttonLabel: null, supportUserName: null })

      expect(screen.queryByRole('button')).not.toBeInTheDocument()
      expect(screen.queryByText('|')).not.toBeInTheDocument()
    })
  })
})
