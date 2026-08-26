import { CreateAccountDialog } from '../CreateAccountDialog'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { type CreateAccountFormInput } from '../../types/CreateAccountForm'
import { type AccountFieldErrors } from '../../types/AccountFieldErrors'

// CreateAccountDialogの表示内容と、ユーザー操作時にhandlersが正しい引数で呼ばれるかのみをテストする
// （登録成功/失敗時の挙動やエラーメッセージの生成ロジック・フォームリセットの中身はuseCreateAccountHandler.test.tsが担保する）

const mockAccountForm: CreateAccountFormInput = {
  name: '山田太郎',
  email: 'yamada@example.com',
  password: 'password123',
  role: 'employee',
}

const mockOnSubmitAccount = vi.fn()
const mockSetAccountForm = vi.fn()
const mockOnOpenDialog = vi.fn()
const mockOnCloseDialog = vi.fn()

// 第1引数(overrides)でdata、第2引数(uiStateOverrides)でuiStateだけを個別に上書きできるようにしている
// （両方ともdataとして1つにまとめてしまうと、テストごとに書く内容が増えて読みにくくなるため分けている）
const renderDialog = (
  overrides?: Partial<{
    accountForm: CreateAccountFormInput
    isDialogOpen: boolean
    fieldErrors: AccountFieldErrors
  }>,
  uiStateOverrides?: Partial<{ isSubmitting: boolean }>,
) => {
  customRender(
    <CreateAccountDialog
      data={{
        accountForm: mockAccountForm,
        isDialogOpen: false,
        fieldErrors: {},
        ...overrides,
      }}
      uiState={{ isSubmitting: false, ...uiStateOverrides }}
      handlers={{
        onSubmitAccount: mockOnSubmitAccount,
        setAccountForm: mockSetAccountForm,
        onOpenDialog: mockOnOpenDialog,
        onCloseDialog: mockOnCloseDialog,
      }}
    />,
  )
}

describe('CreateAccountDialog', () => {
  // ── 正常系 ────────────────────────────────────────────────────────────────
  describe('正常系', () => {
    it('isDialogOpenがfalseの場合、ダイアログの中身は表示されずADDボタンのみ表示されること', () => {
      renderDialog({ isDialogOpen: false })

      expect(screen.getByText('ADD')).toBeInTheDocument()
      expect(screen.queryByText('Account新規登録')).not.toBeInTheDocument()
    })

    it('ADDボタンを押すと、onOpenDialogが呼ばれること', () => {
      renderDialog({ isDialogOpen: false })

      fireEvent.click(screen.getByText('ADD'))
      expect(mockOnOpenDialog).toHaveBeenCalled()
    })

    it('isDialogOpenがtrueの場合、タイトル・各フィールド・フッターのボタンが表示されること', () => {
      renderDialog({ isDialogOpen: true })

      expect(screen.getByText('Account新規登録')).toBeInTheDocument()
      expect(screen.getByText('名前')).toBeInTheDocument()
      expect(screen.getByText('Email')).toBeInTheDocument()
      expect(screen.getByText('Pass')).toBeInTheDocument()
      expect(screen.getByText('種別')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '登録' })).toBeInTheDocument()
    })

    it('渡されたaccountFormの値が名前・Email・Passの入力欄に表示されること', () => {
      renderDialog({ isDialogOpen: true })

      expect(screen.getByDisplayValue(mockAccountForm.name)).toBeInTheDocument()
      expect(screen.getByDisplayValue(mockAccountForm.email)).toBeInTheDocument()
      expect(screen.getByDisplayValue(mockAccountForm.password)).toBeInTheDocument()
    })

    it('渡されたaccountForm.roleの値が種別のプルダウンに選択されていること', () => {
      renderDialog({ isDialogOpen: true })

      expect(screen.getByRole('combobox')).toHaveValue('employee')
    })

    it('名前の入力欄を変更すると、nameを更新したsetAccountFormが呼ばれること', () => {
      renderDialog({ isDialogOpen: true })

      fireEvent.change(screen.getByDisplayValue(mockAccountForm.name), {
        target: { value: '鈴木花子' },
      })
      expect(mockSetAccountForm).toHaveBeenCalledWith({ ...mockAccountForm, name: '鈴木花子' })
    })

    it('Emailの入力欄を変更すると、emailを更新したsetAccountFormが呼ばれること', () => {
      renderDialog({ isDialogOpen: true })

      fireEvent.change(screen.getByDisplayValue(mockAccountForm.email), {
        target: { value: 'suzuki@example.com' },
      })
      expect(mockSetAccountForm).toHaveBeenCalledWith({
        ...mockAccountForm,
        email: 'suzuki@example.com',
      })
    })

    it('Passの入力欄を変更すると、passwordを更新したsetAccountFormが呼ばれること', () => {
      renderDialog({ isDialogOpen: true })

      fireEvent.change(screen.getByDisplayValue(mockAccountForm.password), {
        target: { value: 'newPassword456' },
      })
      expect(mockSetAccountForm).toHaveBeenCalledWith({
        ...mockAccountForm,
        password: 'newPassword456',
      })
    })

    it('種別のプルダウンを変更すると、roleを更新したsetAccountFormが呼ばれること', () => {
      renderDialog({ isDialogOpen: true })

      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'support' } })
      expect(mockSetAccountForm).toHaveBeenCalledWith({ ...mockAccountForm, role: 'support' })
    })

    it('登録ボタンを押すとonSubmitAccountがaccountFormを引数に呼ばれること', () => {
      renderDialog({ isDialogOpen: true })

      fireEvent.click(screen.getByRole('button', { name: '登録' }))
      expect(mockOnSubmitAccount).toHaveBeenCalledWith(mockAccountForm)
    })

    it('isSubmittingがtrueの場合、登録ボタンが無効化されること', () => {
      renderDialog({ isDialogOpen: true }, { isSubmitting: true })

      expect(screen.getByRole('button', { name: '登録' })).toBeDisabled()
    })

    it('Cancelボタンを押すとonCloseDialogが呼ばれること', () => {
      renderDialog({ isDialogOpen: true })

      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
      expect(mockOnCloseDialog).toHaveBeenCalled()
    })

    it('fieldErrorsが空の場合、いずれのフィールドにもエラーメッセージが表示されないこと', () => {
      renderDialog({ isDialogOpen: true, fieldErrors: {} })

      expect(screen.queryByText('入力してください')).not.toBeInTheDocument()
      expect(
        screen.queryByText('選択してください', { selector: '[data-part="error-text"]' }),
      ).not.toBeInTheDocument()
    })
  })

  // ── 準正常系（エラー表示のような、失敗ではないが特別な表示状態） ─────────
  describe('準正常系', () => {
    it('fieldErrors.nameが存在する場合、名前の欄にその内容が表示されること', () => {
      renderDialog({ isDialogOpen: true, fieldErrors: { name: '入力してください' } })

      expect(screen.getByText('入力してください')).toBeInTheDocument()
    })

    it('fieldErrors.roleが存在する場合、種別の欄にその内容が表示されること', () => {
      renderDialog({ isDialogOpen: true, fieldErrors: { role: '選択してください' } })

      expect(
        screen.getByText('選択してください', { selector: '[data-part="error-text"]' }),
      ).toBeInTheDocument()
    })

    it('fieldErrorsに複数フィールド分のエラーがある場合、それぞれの内容が表示されること', () => {
      renderDialog({
        isDialogOpen: true,
        fieldErrors: { email: '入力してください', password: '入力してください' },
      })

      expect(screen.getAllByText('入力してください')).toHaveLength(2)
    })
  })
})
