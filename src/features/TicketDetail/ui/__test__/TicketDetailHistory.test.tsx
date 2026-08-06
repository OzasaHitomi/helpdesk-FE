import { TicketDetailHistory } from '../TicketDetailHistory'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { type TicketCommentView } from '../../types/TicketCommentView'

// TicketDetailHistoryの表示内容（対応日・時刻・対応者・内容の表示、全件表示）のみをテストする

const mockComments: TicketCommentView[] = [
  {
    id: 1,
    content: 'ご質問ありがとうございます。確認いたします。',
    commenterName: '山田太郎',
    createdAt: new Date('2026-08-04T16:12:45'),
  },
  {
    id: 2,
    content: 'ログインができない状況です。',
    commenterName: '鈴木花子',
    createdAt: new Date('2026-08-03T10:00:00'),
  },
]

describe('TicketDetailHistory', () => {
  describe('正常系', () => {
    it('各履歴の対応日(空白区切り)・時刻(秒まで)・対応者・内容が表示されること', () => {
      customRender(<TicketDetailHistory data={{ comments: mockComments }} />)

      expect(screen.getByText('2026 08 04')).toBeInTheDocument()
      expect(screen.getByText('16:12:45')).toBeInTheDocument()
      expect(screen.getByText('山田太郎')).toBeInTheDocument()
      expect(screen.getByText('ご質問ありがとうございます。確認いたします。')).toBeInTheDocument()

      expect(screen.getByText('2026 08 03')).toBeInTheDocument()
      expect(screen.getByText('10:00:00')).toBeInTheDocument()
      expect(screen.getByText('鈴木花子')).toBeInTheDocument()
      expect(screen.getByText('ログインができない状況です。')).toBeInTheDocument()
    })

    it('渡された件数分の行が表示されること', () => {
      customRender(<TicketDetailHistory data={{ comments: mockComments }} />)

      expect(screen.getAllByRole('row')).toHaveLength(mockComments.length)
    })

    it('対応履歴が1件以上の場合、空状態のタイトルは表示されないこと', () => {
      customRender(<TicketDetailHistory data={{ comments: mockComments }} />)

      expect(screen.queryByText('対応履歴がありません')).not.toBeInTheDocument()
    })
  })

  // ── 準正常系（対応履歴が0件の場合の空状態表示） ─────────────────────
  describe('準正常系', () => {
    it('対応履歴が0件の場合、行が表示されないこと', () => {
      customRender(<TicketDetailHistory data={{ comments: [] }} />)

      expect(screen.queryAllByRole('row')).toHaveLength(0)
    })

    it('対応履歴が0件の場合、空状態のタイトルと説明文が表示されること', () => {
      customRender(<TicketDetailHistory data={{ comments: [] }} />)

      expect(screen.getByText('対応履歴がありません')).toBeInTheDocument()
      expect(screen.getByText('対応が行われると、ここに履歴が表示されます')).toBeInTheDocument()
    })
  })
})
