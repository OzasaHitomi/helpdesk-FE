import { AccountsTable } from '../AccountsTable'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { type AccountItemView } from '../../types/AccountItemView'

// AccountsTableの表示内容（列見出し・値の変換・停止/再開ボタンの出し分け）のみをテストする
// （日本語変換自体のロジックはtransformUserRoleToJa.test.tsが担保する。
// ボタン自体の見た目・操作はAccountActivateButton.test.tsx/AccountDeactivateButton.test.tsxが担保する）

const mockAccounts: AccountItemView[] = [
  { id: 1, name: '山田太郎', email: 'yamada@example.com', role: 'employee', isActive: true },
  { id: 2, name: '鈴木花子', email: 'suzuki@example.com', role: 'support', isActive: false },
]

// 「停止」ボタンが複数行に出るケース専用（行ごとに正しいaccount.idが渡るかを確認するため2件ともisActive: true）
const mockActiveAccounts: AccountItemView[] = [
  { id: 1, name: '山田太郎', email: 'yamada@example.com', role: 'employee', isActive: true },
  { id: 3, name: '佐藤次郎', email: 'sato@example.com', role: 'employee', isActive: true },
]

const mockActivate = {
  uiState: { isSubmitting: false },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  handlers: { onClick: async () => {} },
}

const mockDeactivateOnClick = vi.fn()

const mockDeactivate = {
  uiState: { isSubmitting: false },
  handlers: { onClick: mockDeactivateOnClick },
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

    it('isActiveがtrueのアカウントには「停止」ボタンが表示されること', () => {
      customRender(
        <AccountsTable
          accounts={mockAccounts}
          activate={mockActivate}
          deactivate={mockDeactivate}
        />,
      )

      expect(screen.getByRole('button', { name: '停止' })).toBeInTheDocument()
    })

    it('isActiveがfalseのアカウントには「再開」ボタンが表示されること', () => {
      customRender(
        <AccountsTable
          accounts={mockAccounts}
          activate={mockActivate}
          deactivate={mockDeactivate}
        />,
      )

      expect(screen.getByRole('button', { name: '再開' })).toBeInTheDocument()
    })

    it('各行の「停止」ボタンを押すと、その行のaccount.idでdeactivate.handlers.onClickが呼ばれること', () => {
      customRender(
        <AccountsTable
          accounts={mockActiveAccounts}
          activate={mockActivate}
          deactivate={mockDeactivate}
        />,
      )

      const deactivateButtons = screen.getAllByRole('button', { name: '停止' })
      expect(deactivateButtons).toHaveLength(2)

      fireEvent.click(deactivateButtons[0])
      expect(mockDeactivateOnClick).toHaveBeenCalledWith(1)

      fireEvent.click(deactivateButtons[1])
      expect(mockDeactivateOnClick).toHaveBeenCalledWith(3)
    })
  })
})
