import { AdminAccountPresentational } from '../AdminAccountPresentational'
import { AccountsTable } from '../ui/AccountsTable'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { type AccountItemView } from '../types/AccountItemView'

// AdminAccountPresentationalの表示内容（見出し・アカウント一覧テーブルへの橋渡し・0件時の空状態表示）のみをテストする
// （AccountsTable自体の見た目はAccountsTable.test.tsxが担保する）

vi.mock('../ui/AccountsTable', () => ({
  AccountsTable: vi.fn(() => <div data-testid='mocked-account-table' />),
}))

const mockAccountsTable = vi.mocked(AccountsTable)

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

const renderPresentational = (accounts: AccountItemView[] = mockAccounts) => {
  customRender(
    <AdminAccountPresentational
      data={{ accounts }}
      activate={mockActivate}
      deactivate={mockDeactivate}
    />,
  )
}

describe('AdminAccountPresentational', () => {
  describe('正常系', () => {
    it('見出し「Account一覧」が表示されること', () => {
      renderPresentational()
      expect(screen.getByText('Account一覧')).toBeInTheDocument()
    })

    it('AccountsTableが表示され、accountsがそのまま渡されること', () => {
      renderPresentational()
      expect(screen.getByTestId('mocked-account-table')).toBeInTheDocument()
      expect(mockAccountsTable).toHaveBeenCalledWith(
        { accounts: mockAccounts, activate: mockActivate, deactivate: mockDeactivate },
        undefined,
      )
    })
  })

  describe('準正常系', () => {
    it('アカウントが0件の場合、空状態のタイトルと説明文が表示されること', () => {
      renderPresentational([])
      expect(screen.getByText('アカウントがありません')).toBeInTheDocument()
      expect(
        screen.getByText('アカウントが発行されると、ここに一覧が表示されます'),
      ).toBeInTheDocument()
    })

    it('アカウントが0件の場合、AccountsTableが表示されないこと', () => {
      renderPresentational([])
      expect(screen.queryByTestId('mocked-account-table')).not.toBeInTheDocument()
    })

    it('アカウントが1件以上の場合、空状態のタイトルは表示されないこと', () => {
      renderPresentational(mockAccounts)
      expect(screen.queryByText('アカウントがありません')).not.toBeInTheDocument()
    })
  })
})
