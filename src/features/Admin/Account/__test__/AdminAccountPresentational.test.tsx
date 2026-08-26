import { AdminAccountPresentational } from '../AdminAccountPresentational'
import { AccountsTable } from '../ui/AccountsTable'
import { CreateAccountDialog } from '../ui/CreateAccountDialog'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { type AccountItemView } from '../types/AccountItemView'
import { type CreateAccountFormInput } from '../types/CreateAccountForm'

// AdminAccountPresentationalの表示内容（見出し・ADDボタンの出し分け・アカウント一覧テーブルへの橋渡し・0件時の空状態表示）のみをテストする
// （AccountsTable自体の見た目はAccountsTable.test.tsx、CreateAccountDialog自体の見た目・操作はCreateAccountDialog.test.tsxが担保する）

vi.mock('../ui/AccountsTable', () => ({
  AccountsTable: vi.fn(() => <div data-testid='mocked-account-table' />),
}))

vi.mock('../ui/CreateAccountDialog', () => ({
  CreateAccountDialog: vi.fn(() => <div data-testid='mocked-create-account-dialog' />),
}))

const mockAccountsTable = vi.mocked(AccountsTable)
const mockCreateAccountDialog = vi.mocked(CreateAccountDialog)

const mockAccounts: AccountItemView[] = [
  { id: 1, name: '山田太郎', email: 'yamada@example.com', role: 'employee', isActive: true },
]

const mockActivate = {
  uiState: { isSubmitting: false },
  handlers: { onClick: vi.fn() },
}

const mockDeactivate = {
  uiState: { isSubmitting: false },
  handlers: { onClick: vi.fn() },
}

const mockAccountForm: CreateAccountFormInput = { name: '', email: '', password: '', role: '' }
const mockCreate = {
  data: { accountForm: mockAccountForm, isDialogOpen: false, fieldErrors: {} },
  uiState: { isSubmitting: false },
  handlers: {
    onSubmitAccount: vi.fn(),
    setAccountForm: vi.fn(),
    onOpenDialog: vi.fn(),
    onCloseDialog: vi.fn(),
  },
}

const renderPresentational = (
  role: 'employee' | 'support' | 'admin' | undefined,
  accounts: AccountItemView[] = mockAccounts,
) => {
  customRender(
    <AdminAccountPresentational
      data={{ accounts, role }}
      activate={mockActivate}
      deactivate={mockDeactivate}
      create={mockCreate}
    />,
  )
}

describe('AdminAccountPresentational', () => {
  describe('正常系', () => {
    it('見出し「Account一覧」が表示されること', () => {
      renderPresentational('admin')
      expect(screen.getByText('Account一覧')).toBeInTheDocument()
    })

    it('roleがadminの場合、アカウント新規登録ダイアログが表示されること', () => {
      renderPresentational('admin')
      expect(screen.getByTestId('mocked-create-account-dialog')).toBeInTheDocument()
    })

    it('CreateAccountDialogにdata/uiState/handlersがそのまま渡されること', () => {
      renderPresentational('admin')
      expect(mockCreateAccountDialog).toHaveBeenCalledWith(mockCreate, undefined)
    })

    it('AccountsTableが表示され、accountsがそのまま渡されること', () => {
      renderPresentational('admin')
      expect(screen.getByTestId('mocked-account-table')).toBeInTheDocument()
      expect(mockAccountsTable).toHaveBeenCalledWith(
        { accounts: mockAccounts, activate: mockActivate, deactivate: mockDeactivate },
        undefined,
      )
    })
  })

  describe('準正常系', () => {
    it('roleがemployeeの場合、アカウント新規登録ダイアログが表示されないこと', () => {
      renderPresentational('employee')
      expect(screen.queryByTestId('mocked-create-account-dialog')).not.toBeInTheDocument()
    })

    it('roleがsupportの場合、アカウント新規登録ダイアログが表示されないこと', () => {
      renderPresentational('support')
      expect(screen.queryByTestId('mocked-create-account-dialog')).not.toBeInTheDocument()
    })

    it('roleがundefined(未取得)の場合、アカウント新規登録ダイアログが表示されないこと', () => {
      renderPresentational(undefined)
      expect(screen.queryByTestId('mocked-create-account-dialog')).not.toBeInTheDocument()
    })

    it('アカウントが0件の場合、空状態のタイトルと説明文が表示されること', () => {
      renderPresentational('admin', [])
      expect(screen.getByText('アカウントがありません')).toBeInTheDocument()
      expect(
        screen.getByText('アカウントが発行されると、ここに一覧が表示されます'),
      ).toBeInTheDocument()
    })

    it('アカウントが0件の場合、AccountsTableが表示されないこと', () => {
      renderPresentational('admin', [])
      expect(screen.queryByTestId('mocked-account-table')).not.toBeInTheDocument()
    })

    it('アカウントが1件以上の場合、空状態のタイトルは表示されないこと', () => {
      renderPresentational('admin', mockAccounts)
      expect(screen.queryByText('アカウントがありません')).not.toBeInTheDocument()
    })
  })
})
