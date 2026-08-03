import { TicketsTable } from '../TicketsTable'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { type TicketItemView } from '../../types/TicketItemView'

// TicketsTableの表示内容（列見出し・値の変換・未割当時の表示）のみをテストする
// （日本語変換自体のロジックはtransformTicketVisibilityToJa.test.ts/transformTicketStatusToJa.test.tsが担保する。
// 0件時の空状態表示はRootPresentational.test.tsxが担保する）

const mockTickets: TicketItemView[] = [
  {
    id: 1,
    title: 'ログインできない',
    visibility: 'private',
    status: 'new_question',
    createdAt: new Date('2026-07-29T00:00:00Z'),
    questionerName: '山田太郎',
    supportUserName: null,
  },
  {
    id: 2,
    title: 'パスワードを忘れた',
    visibility: 'public',
    status: 'in_progress',
    createdAt: new Date('2026-01-05T00:00:00Z'),
    questionerName: '鈴木花子',
    supportUserName: '田中一郎',
  },
]

describe('TicketsTable', () => {
  describe('正常系', () => {
    it('列見出しが表示されること', () => {
      customRender(<TicketsTable tickets={mockTickets} />)

      expect(screen.getByText('質問日')).toBeInTheDocument()
      expect(screen.getByText('タイトル')).toBeInTheDocument()
      expect(screen.getByText('公開状況')).toBeInTheDocument()
      expect(screen.getByText('ステータス')).toBeInTheDocument()
      expect(screen.getByText('質問者')).toBeInTheDocument()
      expect(screen.getByText('サポート担当')).toBeInTheDocument()
    })

    it('各チケットの内容が表示されること', () => {
      customRender(<TicketsTable tickets={mockTickets} />)

      expect(screen.getByText('ログインできない')).toBeInTheDocument()
      expect(screen.getByText('非公開')).toBeInTheDocument()
      expect(screen.getByText('新規質問')).toBeInTheDocument()
      expect(screen.getByText('山田太郎')).toBeInTheDocument()
    })

    it('質問日が半角スペース区切り・0埋めの形式で表示されること', () => {
      customRender(<TicketsTable tickets={mockTickets} />)

      expect(screen.getByText('2026 07 29')).toBeInTheDocument()
      expect(screen.getByText('2026 01 05')).toBeInTheDocument()
    })

    it('サポート担当が割り当てられている場合、その名前が表示されること', () => {
      customRender(<TicketsTable tickets={mockTickets} />)

      expect(screen.getByText('田中一郎')).toBeInTheDocument()
    })

    it('タイトルが該当チケットの詳細画面へのリンクになっていること', () => {
      customRender(<TicketsTable tickets={mockTickets} />)

      expect(screen.getByText('ログインできない').closest('a')).toHaveAttribute(
        'href',
        '/tickets/1',
      )
      expect(screen.getByText('パスワードを忘れた').closest('a')).toHaveAttribute(
        'href',
        '/tickets/2',
      )
    })
  })

  describe('準正常系', () => {
    it('サポート担当が未割当(null)の場合、「-」が表示されること', () => {
      customRender(<TicketsTable tickets={mockTickets} />)

      expect(screen.getByText('-')).toBeInTheDocument()
    })
  })
})
