import { AccountsTable } from '../AccountsTable'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { type AccountItemView } from '../../types/AccountItemView'

// AccountsTableの表示内容（列見出し・値の変換・停止/再開ボタンの出し分け）のみをテストする
// （日本語変換自体のロジックはtransformUserRoleToJa.test.tsが担保する。
// ボタン自体の見た目・操作はAccountActivateButton.test.tsx/AccountDeactivateButton.test.tsxが担保する）

const mockAccounts: AccountItemView[] = [
  { id: 1, name: '山田太郎', email: 'yamada@example.com', role: 'employee', isActive: true },
  { id: 2, name: '鈴木花子', email: 'suzuki@example.com', role: 'support', isActive: false },
]

describe('AccountsTable', () => {
  describe('正常系', () => {
    it('列見出しが表示されること', () => {
      customRender(<AccountsTable accounts={mockAccounts} />)

      expect(screen.getByText('名前')).toBeInTheDocument()
      expect(screen.getByText('Email')).toBeInTheDocument()
      expect(screen.getByText('種別')).toBeInTheDocument()
      expect(screen.getByText('利用状況')).toBeInTheDocument()
    })

    it('各アカウントの内容が表示されること', () => {
      customRender(<AccountsTable accounts={mockAccounts} />)

      expect(screen.getByText('山田太郎')).toBeInTheDocument()
      expect(screen.getByText('yamada@example.com')).toBeInTheDocument()
      expect(screen.getByText('社員')).toBeInTheDocument()
      expect(screen.getByText('鈴木花子')).toBeInTheDocument()
      expect(screen.getByText('サポート担当')).toBeInTheDocument()
    })

    it('isActiveがtrueのアカウントには「停止」ボタンが表示されること', () => {
      customRender(<AccountsTable accounts={mockAccounts} />)

      expect(screen.getByRole('button', { name: '停止' })).toBeInTheDocument()
    })

    it('isActiveがfalseのアカウントには「再開」ボタンが表示されること', () => {
      customRender(<AccountsTable accounts={mockAccounts} />)

      expect(screen.getByRole('button', { name: '再開' })).toBeInTheDocument()
    })
  })
})
