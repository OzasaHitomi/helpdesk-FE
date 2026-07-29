import { CreateTicketDialog } from '../CreateTicketDialog'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { type CreateTicketForm } from '../../types/CreateTicketForm'
import { type TicketFieldErrors } from '@/features/Root/types/TicketFieldErrors'

// CreateTicketDialogの表示内容と、ユーザー操作時にhandlersが正しい引数で呼ばれるかのみをテストする
// （登録成功/失敗時の挙動やエラーメッセージの生成ロジック・フォームリセットの中身はuseCreateTicketHandler.test.tsが担保する）

const mockTicketForm: CreateTicketForm = {
  title: 'ログインできない',
  detail: 'パスワードを変更したらログインできなくなりました',
  visibility: 'private',
}

const mockOnSubmitTicket = vi.fn()
const mockSetTicketForm = vi.fn()
const mockOnOpenDialog = vi.fn()
const mockOnCloseDialog = vi.fn()

// 第1引数(overrides)でdata、第2引数(uiStateOverrides)でuiStateだけを個別に上書きできるようにしている
// （両方ともdataとして1つにまとめてしまうと、テストごとに書く内容が増えて読みにくくなるため分けている）
const renderDialog = (
  overrides?: Partial<{
    ticketForm: CreateTicketForm
    isDialogOpen: boolean
    fieldErrors: TicketFieldErrors
  }>,
  uiStateOverrides?: Partial<{ isSubmitting: boolean }>,
) => {
  customRender(
    <CreateTicketDialog
      data={{
        ticketForm: mockTicketForm,
        isDialogOpen: false,
        fieldErrors: {},
        ...overrides,
      }}
      uiState={{ isSubmitting: false, ...uiStateOverrides }}
      handlers={{
        onSubmitTicket: mockOnSubmitTicket,
        setTicketForm: mockSetTicketForm,
        onOpenDialog: mockOnOpenDialog,
        onCloseDialog: mockOnCloseDialog,
      }}
    />,
  )
}

describe('CreateTicketDialog', () => {
  // ── 正常系 ────────────────────────────────────────────────────────────────
  describe('正常系', () => {
    it('isDialogOpenがfalseの場合、ダイアログの中身は表示されずADDボタンのみ表示されること', () => {
      renderDialog({ isDialogOpen: false })

      expect(screen.getByText('ADD')).toBeInTheDocument()
      expect(screen.queryByText('Ticket新規登録')).not.toBeInTheDocument()
    })

    it('ADDボタンを押すと、onOpenDialogが呼ばれること', () => {
      renderDialog({ isDialogOpen: false })

      fireEvent.click(screen.getByText('ADD'))
      expect(mockOnOpenDialog).toHaveBeenCalled()
    })

    it('isDialogOpenがtrueの場合、タイトル・各フィールド・フッターのボタンが表示されること', () => {
      renderDialog({ isDialogOpen: true })

      expect(screen.getByText('Ticket新規登録')).toBeInTheDocument()
      expect(screen.getByText('公開設定')).toBeInTheDocument()
      expect(screen.getByText('要件')).toBeInTheDocument()
      expect(screen.getByText('詳細')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '送信' })).toBeInTheDocument()
    })

    it('渡されたticketFormの値が要件・詳細の入力欄に表示されること', () => {
      renderDialog({ isDialogOpen: true })

      expect(screen.getByDisplayValue(mockTicketForm.title)).toBeInTheDocument()
      expect(screen.getByDisplayValue(mockTicketForm.detail)).toBeInTheDocument()
    })

    it('visibilityがprivateの場合、非公開ボタンだけが選択状態(aria-pressed=true)であること', () => {
      renderDialog({ isDialogOpen: true, ticketForm: { ...mockTicketForm, visibility: 'private' } })

      expect(screen.getByRole('button', { name: '非公開' })).toHaveAttribute('aria-pressed', 'true')
      expect(screen.getByRole('button', { name: '公開' })).toHaveAttribute('aria-pressed', 'false')
    })

    it('visibilityがpublicの場合、公開ボタンだけが選択状態(aria-pressed=true)であること', () => {
      renderDialog({ isDialogOpen: true, ticketForm: { ...mockTicketForm, visibility: 'public' } })

      expect(screen.getByRole('button', { name: '公開' })).toHaveAttribute('aria-pressed', 'true')
      expect(screen.getByRole('button', { name: '非公開' })).toHaveAttribute(
        'aria-pressed',
        'false',
      )
    })

    it('公開ボタンを押すと、visibilityをpublicにしたsetTicketFormが呼ばれること', () => {
      renderDialog({ isDialogOpen: true })

      fireEvent.click(screen.getByRole('button', { name: '公開' }))
      expect(mockSetTicketForm).toHaveBeenCalledWith({ ...mockTicketForm, visibility: 'public' })
    })

    it('要件の入力欄を変更すると、titleを更新したsetTicketFormが呼ばれること', () => {
      renderDialog({ isDialogOpen: true })

      fireEvent.change(screen.getByDisplayValue(mockTicketForm.title), {
        target: { value: '新しい要件' },
      })
      expect(mockSetTicketForm).toHaveBeenCalledWith({ ...mockTicketForm, title: '新しい要件' })
    })

    it('詳細の入力欄を変更すると、detailを更新したsetTicketFormが呼ばれること', () => {
      renderDialog({ isDialogOpen: true })

      fireEvent.change(screen.getByDisplayValue(mockTicketForm.detail), {
        target: { value: '新しい詳細' },
      })
      expect(mockSetTicketForm).toHaveBeenCalledWith({ ...mockTicketForm, detail: '新しい詳細' })
    })

    it('送信ボタンを押すとonSubmitTicketがticketFormを引数に呼ばれること', () => {
      renderDialog({ isDialogOpen: true })

      fireEvent.click(screen.getByRole('button', { name: '送信' }))
      expect(mockOnSubmitTicket).toHaveBeenCalledWith(mockTicketForm)
    })

    it('isSubmittingがtrueの場合、送信ボタンが無効化されること', () => {
      renderDialog({ isDialogOpen: true }, { isSubmitting: true })

      expect(screen.getByRole('button', { name: '送信' })).toBeDisabled()
    })

    it('Cancelボタンを押すとonCloseDialogが呼ばれること', () => {
      renderDialog({ isDialogOpen: true })

      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
      expect(mockOnCloseDialog).toHaveBeenCalled()
    })

    it('fieldErrorsが空の場合、いずれのフィールドにもエラーメッセージが表示されないこと', () => {
      renderDialog({ isDialogOpen: true, fieldErrors: {} })

      expect(screen.queryByText('入力してください')).not.toBeInTheDocument()
    })
  })

  // ── 準正常系（エラー表示のような、失敗ではないが特別な表示状態） ─────────
  describe('準正常系', () => {
    it('fieldErrors.titleが存在する場合、要件の欄にその内容が表示されること', () => {
      renderDialog({ isDialogOpen: true, fieldErrors: { title: '入力してください' } })

      expect(screen.getByText('入力してください')).toBeInTheDocument()
    })

    it('fieldErrorsに複数フィールド分のエラーがある場合、それぞれの内容が表示されること', () => {
      renderDialog({
        isDialogOpen: true,
        fieldErrors: { title: '255文字以内で入力してください', detail: '入力してください' },
      })

      expect(screen.getByText('255文字以内で入力してください')).toBeInTheDocument()
      expect(screen.getByText('入力してください')).toBeInTheDocument()
    })
  })
})
