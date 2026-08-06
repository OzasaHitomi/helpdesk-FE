import { TicketDetailCommentForm } from '../TicketDetailCommentForm'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { type TicketCommentFieldErrors } from '../../types/TicketCommentFieldErrors'

// TicketDetailCommentFormの表示内容と、ユーザー操作時にhandlersが正しい引数で呼ばれるかのみをテストする
// （登録成功/失敗時の挙動やエラーメッセージの生成ロジックはuseCreateTicketCommentHandler.test.tsが担保する）

const mockSetContent = vi.fn()
const mockOnSubmit = vi.fn()

const renderForm = (
  overrides?: Partial<{ content: string; fieldErrors: TicketCommentFieldErrors }>,
  uiStateOverrides?: Partial<{ isSubmitting: boolean }>,
) => {
  customRender(
    <TicketDetailCommentForm
      data={{ content: '', fieldErrors: {}, ...overrides }}
      uiState={{ isSubmitting: false, ...uiStateOverrides }}
      handlers={{ setContent: mockSetContent, onSubmit: mockOnSubmit }}
    />,
  )
}

describe('TicketDetailCommentForm', () => {
  // ── 正常系 ────────────────────────────────────────────────────────────────
  describe('正常系', () => {
    it('見出し「質疑応答」と入力欄・送信ボタンが表示されること', () => {
      renderForm()

      expect(screen.getByText('質疑応答')).toBeInTheDocument()
      expect(screen.getByRole('textbox')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '送信' })).toBeInTheDocument()
    })

    it('渡されたcontentの値が入力欄に表示されること', () => {
      renderForm({ content: '質問内容' })

      expect(screen.getByDisplayValue('質問内容')).toBeInTheDocument()
    })

    it('入力欄を変更すると、setContentが変更後の値で呼ばれること', () => {
      renderForm()

      fireEvent.change(screen.getByRole('textbox'), { target: { value: '新しい質問' } })
      expect(mockSetContent).toHaveBeenCalledWith('新しい質問')
    })

    it('送信ボタンを押すとonSubmitが呼ばれること', () => {
      renderForm()

      fireEvent.click(screen.getByRole('button', { name: '送信' }))
      expect(mockOnSubmit).toHaveBeenCalled()
    })

    it('isSubmittingがtrueの場合、送信ボタンが無効化されること', () => {
      renderForm({}, { isSubmitting: true })

      expect(screen.getByRole('button', { name: '送信' })).toBeDisabled()
    })

    it('fieldErrorsが空の場合、エラーメッセージが表示されないこと', () => {
      renderForm({ fieldErrors: {} })

      expect(screen.queryByText('入力してください')).not.toBeInTheDocument()
    })
  })

  // ── 準正常系（エラー表示のような、失敗ではないが特別な表示状態） ─────────
  describe('準正常系', () => {
    it('fieldErrors.contentが存在する場合、入力欄の直下にその内容が表示されること', () => {
      renderForm({ fieldErrors: { content: '入力してください' } })

      expect(screen.getByText('入力してください')).toBeInTheDocument()
    })
  })
})
