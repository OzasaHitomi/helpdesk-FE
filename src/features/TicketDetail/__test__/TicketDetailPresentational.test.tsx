import { TicketDetailPresentational } from '../TicketDetailPresentational'
import { TicketDetailInfo } from '../ui/TicketDetailInfo'
import { TicketDetailHistory } from '../ui/TicketDetailHistory'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { type TicketDetailView } from '../types/TicketDetailView'
import { type TicketCommentView } from '../types/TicketCommentView'

// TicketDetailPresentationalの表示内容（取得中・取得失敗・正常時の出し分け、
// TicketDetailInfo・TicketDetailHistoryへの橋渡し）のみをテストする
// （TicketDetailInfo/TicketDetailHistory自体の見た目はそれぞれのtestが担保する）

vi.mock('../ui/TicketDetailInfo', () => ({
  TicketDetailInfo: vi.fn(() => <div data-testid='mocked-ticket-detail-info' />),
}))

vi.mock('../ui/TicketDetailHistory', () => ({
  TicketDetailHistory: vi.fn(() => <div data-testid='mocked-ticket-detail-history' />),
}))

const mockTicketDetailInfo = vi.mocked(TicketDetailInfo)
const mockTicketDetailHistory = vi.mocked(TicketDetailHistory)

const mockTicket: TicketDetailView = {
  id: 1,
  title: 'ログインできない',
  detail: 'パスワードを変更したらログインできなくなりました',
  visibility: 'private',
  status: 'new_question',
  createdAt: new Date('2026-07-29T00:00:00'),
}

const mockComments: TicketCommentView[] = [
  {
    id: 1,
    content: 'ご質問ありがとうございます。確認いたします。',
    commenterName: '山田太郎',
    createdAt: new Date('2026-08-04T16:12:45'),
  },
]

describe('TicketDetailPresentational', () => {
  describe('正常系', () => {
    it('IDが見出しに表示されること', () => {
      customRender(
        <TicketDetailPresentational
          data={{ role: 'employee', ticket: mockTicket, comments: mockComments }}
          uiState={{ isLoading: false, isError: false }}
        />,
      )

      expect(screen.getByText('ID：1')).toBeInTheDocument()
    })

    it('TicketDetailInfoにticket・roleがそのまま渡されること', () => {
      customRender(
        <TicketDetailPresentational
          data={{ role: 'employee', ticket: mockTicket, comments: mockComments }}
          uiState={{ isLoading: false, isError: false }}
        />,
      )

      expect(screen.getByTestId('mocked-ticket-detail-info')).toBeInTheDocument()
      expect(mockTicketDetailInfo).toHaveBeenCalledWith(
        { data: { ticket: mockTicket, role: 'employee' } },
        undefined,
      )
    })

    it('TicketDetailHistoryにcommentsがそのまま渡されること', () => {
      customRender(
        <TicketDetailPresentational
          data={{ role: 'employee', ticket: mockTicket, comments: mockComments }}
          uiState={{ isLoading: false, isError: false }}
        />,
      )

      expect(screen.getByTestId('mocked-ticket-detail-history')).toBeInTheDocument()
      expect(mockTicketDetailHistory).toHaveBeenCalledWith(
        { data: { comments: mockComments } },
        undefined,
      )
    })
  })

  // ── 準正常系（取得中・取得失敗時の表示の出し分け） ─────────────────
  describe('準正常系', () => {
    it('isLoadingがtrueの場合、ローディング表示になり、TicketDetailInfoは表示されないこと', () => {
      customRender(
        <TicketDetailPresentational
          data={{ role: 'employee', ticket: undefined, comments: [] }}
          uiState={{ isLoading: true, isError: false }}
        />,
      )

      expect(screen.getByRole('status')).toBeInTheDocument()
      expect(screen.queryByTestId('mocked-ticket-detail-info')).not.toBeInTheDocument()
    })

    it('isErrorがtrueの場合、エラーメッセージが表示され、TicketDetailInfoは表示されないこと', () => {
      customRender(
        <TicketDetailPresentational
          data={{ role: 'employee', ticket: undefined, comments: [] }}
          uiState={{ isLoading: false, isError: true }}
        />,
      )

      expect(screen.getByText('チケットの取得に失敗しました')).toBeInTheDocument()
      expect(screen.queryByTestId('mocked-ticket-detail-info')).not.toBeInTheDocument()
    })

    it('ticketがundefinedの場合(isError=falseでも)、エラーメッセージが表示されること', () => {
      customRender(
        <TicketDetailPresentational
          data={{ role: 'employee', ticket: undefined, comments: [] }}
          uiState={{ isLoading: false, isError: false }}
        />,
      )

      expect(screen.getByText('チケットの取得に失敗しました')).toBeInTheDocument()
    })

    it('isLoadingとisErrorが両方trueの場合、ローディング表示が優先されること', () => {
      customRender(
        <TicketDetailPresentational
          data={{ role: 'employee', ticket: undefined, comments: [] }}
          uiState={{ isLoading: true, isError: true }}
        />,
      )

      expect(screen.getByRole('status')).toBeInTheDocument()
      expect(screen.queryByText('チケットの取得に失敗しました')).not.toBeInTheDocument()
    })
  })
})
