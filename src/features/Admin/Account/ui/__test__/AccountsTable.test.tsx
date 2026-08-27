import { AccountsTable } from '../AccountsTable'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { screen } from '@testing-library/react'
import { type AccountItemView } from '../../types/AccountItemView'

// AccountsTableの表示内容（列見出し・値の変換・停止/再開ボタンの出し分け・propsの受け渡し）のみをテストする
// （日本語変換自体のロジックはtransformUserRoleToJa.test.tsが担保する。
// ボタン自体の見た目・クリック時の挙動はAccountActivateButton.test.tsx/AccountDeactivateButton.test.tsxが担保するため、
// AccountActivateButton/AccountDeactivateButtonはモックし、「どちらが出るか」「propsが正しいか」のみを見る）

const mockAccountActivateButton = vi.fn()
vi.mock('../AccountActivateButton/AccountActivateButton', () => ({
  AccountActivateButton: (props: {
    account: AccountItemView
    uiState: { isSubmitting: boolean }
    handlers: { onClick: (account: AccountItemView) => Promise<void> }
  }) => {
    mockAccountActivateButton(props)
    return <div data-testid={'mocked-account-activate-button'} />
  },
}))

const mockAccountDeactivateButton = vi.fn()
vi.mock('../AccountDeactivateButton/AccountDeactivateButton', () => ({
  AccountDeactivateButton: (props: {
    account: AccountItemView
    uiState: { isSubmitting: boolean }
    handlers: { onClick: (account: AccountItemView) => Promise<void> }
  }) => {
    mockAccountDeactivateButton(props)
    return <div data-testid={'mocked-account-deactivate-button'} />
  },
}))

const mockAccounts: AccountItemView[] = [
  { id: 1, name: '山田太郎', email: 'yamada@example.com', role: 'employee', isActive: true },
  { id: 2, name: '鈴木花子', email: 'suzuki@example.com', role: 'support', isActive: false },
]

// 行ごとに正しいaccountが渡るかを確認するため専用（2件ともisActive: true）
const mockActiveAccounts: AccountItemView[] = [
  { id: 1, name: '山田太郎', email: 'yamada@example.com', role: 'employee', isActive: true },
  { id: 3, name: '佐藤次郎', email: 'sato@example.com', role: 'employee', isActive: true },
]

// 行ごとに正しいaccountが渡るかを確認するため専用（2件ともisActive: false）
const mockInactiveAccounts: AccountItemView[] = [
  { id: 2, name: '鈴木花子', email: 'suzuki@example.com', role: 'support', isActive: false },
  { id: 4, name: '田中一郎', email: 'tanaka@example.com', role: 'employee', isActive: false },
]

const mockActivate = {
  uiState: { isSubmitting: false },
  handlers: { onClick: vi.fn() },
}

const mockDeactivate = {
  uiState: { isSubmitting: false },
  handlers: { onClick: vi.fn() },
}

describe('AccountsTable', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('正常系', () => {
    it('列見出しが表示されること', () => {
      customRender(
        <AccountsTable
          accounts={mockAccounts}
          activate={mockActivate}
          deactivate={mockDeactivate}
        />,
      )

      expect(screen.getByText('名前')).toBeInTheDocument()
      expect(screen.getByText('Email')).toBeInTheDocument()
      expect(screen.getByText('種別')).toBeInTheDocument()
      expect(screen.getByText('利用状況')).toBeInTheDocument()
    })

    it('各アカウントの内容が表示されること', () => {
      customRender(
        <AccountsTable
          accounts={mockAccounts}
          activate={mockActivate}
          deactivate={mockDeactivate}
        />,
      )

      expect(screen.getByText('山田太郎')).toBeInTheDocument()
      expect(screen.getByText('yamada@example.com')).toBeInTheDocument()
      expect(screen.getByText('社員')).toBeInTheDocument()
      expect(screen.getByText('鈴木花子')).toBeInTheDocument()
      expect(screen.getByText('サポート担当')).toBeInTheDocument()
    })

    it('isActiveがtrueのアカウントには停止ボタン(AccountDeactivateButton)が表示されること', () => {
      const activeOnlyAccounts: AccountItemView[] = [
        { id: 1, name: '山田太郎', email: 'yamada@example.com', role: 'employee', isActive: true },
      ]
      customRender(
        <AccountsTable
          accounts={activeOnlyAccounts}
          activate={mockActivate}
          deactivate={mockDeactivate}
        />,
      )

      expect(screen.getAllByTestId('mocked-account-deactivate-button')).toHaveLength(1)
      expect(screen.queryByTestId('mocked-account-activate-button')).not.toBeInTheDocument()
    })

    it('isActiveがfalseのアカウントには再開ボタン(AccountActivateButton)が表示されること', () => {
      const inactiveOnlyAccounts: AccountItemView[] = [
        { id: 2, name: '鈴木花子', email: 'suzuki@example.com', role: 'support', isActive: false },
      ]
      customRender(
        <AccountsTable
          accounts={inactiveOnlyAccounts}
          activate={mockActivate}
          deactivate={mockDeactivate}
        />,
      )

      expect(screen.getAllByTestId('mocked-account-activate-button')).toHaveLength(1)
      expect(screen.queryByTestId('mocked-account-deactivate-button')).not.toBeInTheDocument()
    })

    it('各行のAccountActivateButtonに、その行のaccountとactivate.uiState・activate.handlersが渡ること', () => {
      customRender(
        <AccountsTable
          accounts={mockInactiveAccounts}
          activate={mockActivate}
          deactivate={mockDeactivate}
        />,
      )

      expect(mockAccountActivateButton).toHaveBeenNthCalledWith(1, {
        account: mockInactiveAccounts[0],
        uiState: mockActivate.uiState,
        handlers: mockActivate.handlers,
      })
      expect(mockAccountActivateButton).toHaveBeenNthCalledWith(2, {
        account: mockInactiveAccounts[1],
        uiState: mockActivate.uiState,
        handlers: mockActivate.handlers,
      })
    })

    it('各行のAccountDeactivateButtonに、その行のaccountとdeactivate.uiState・deactivate.handlersが渡ること', () => {
      customRender(
        <AccountsTable
          accounts={mockActiveAccounts}
          activate={mockActivate}
          deactivate={mockDeactivate}
        />,
      )

      expect(mockAccountDeactivateButton).toHaveBeenNthCalledWith(1, {
        account: mockActiveAccounts[0],
        uiState: mockDeactivate.uiState,
        handlers: mockDeactivate.handlers,
      })
      expect(mockAccountDeactivateButton).toHaveBeenNthCalledWith(2, {
        account: mockActiveAccounts[1],
        uiState: mockDeactivate.uiState,
        handlers: mockDeactivate.handlers,
      })
    })
  })
})
