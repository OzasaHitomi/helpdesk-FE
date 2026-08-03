import { TicketDetailPresentational } from '../TicketDetailPresentational'
import { TicketDetailInfo } from '../ui/TicketDetailInfo'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { type TicketDetailView } from '../types/TicketDetailView'

// TicketDetailPresentationalの表示内容（取得中・取得失敗・正常時の出し分け、TicketDetailInfoへの橋渡し）のみをテストする
// （TicketDetailInfo自体の見た目はTicketDetailInfo.test.tsxが担保する）

vi.mock('../ui/TicketDetailInfo', () => ({
  TicketDetailInfo: vi.fn(() => <div data-testid='mocked-ticket-detail-info' />),
}))

const mockTicketDetailInfo = vi.mocked(TicketDetailInfo)

const mockTicket: TicketDetailView = {
  id: 1,
  title: 'ログインできない',
  detail: 'パスワードを変更したらログインできなくなりました',
  visibility: 'private',
  status: 'new_question',
  createdAt: new Date('2026-07-29T00:00:00'),
}

describe('TicketDetailPresentational', () => {
  describe('正常系', () => {
    it('IDが見出しに表示されること', () => {
      customRender(
        <TicketDetailPresentational
          data={{ role: 'employee', ticket: mockTicket }}
          uiState={{ isLoading: false, isError: false }}
        />,
      )

      expect(screen.getByText('ID：1')).toBeInTheDocument()
    })

    it('TicketDetailInfoにticket・roleがそのまま渡されること', () => {
      customRender(
        <TicketDetailPresentational
          data={{ role: 'employee', ticket: mockTicket }}
          uiState={{ isLoading: false, isError: false }}
        />,
      )

      expect(screen.getByTestId('mocked-ticket-detail-info')).toBeInTheDocument()
      expect(mockTicketDetailInfo).toHaveBeenCalledWith(
        { data: { ticket: mockTicket, role: 'employee' } },
        undefined,
      )
    })
  })

  // ── 準正常系（取得中・取得失敗時の表示の出し分け） ─────────────────
  describe('準正常系', () => {
    it('isLoadingがtrueの場合、ローディング表示になり、TicketDetailInfoは表示されないこと', () => {
      customRender(
        <TicketDetailPresentational
          data={{ role: 'employee', ticket: undefined }}
          uiState={{ isLoading: true, isError: false }}
        />,
      )

      expect(screen.getByRole('status')).toBeInTheDocument()
      expect(screen.queryByTestId('mocked-ticket-detail-info')).not.toBeInTheDocument()
    })

    it('isErrorがtrueの場合、エラーメッセージが表示され、TicketDetailInfoは表示されないこと', () => {
      customRender(
        <TicketDetailPresentational
          data={{ role: 'employee', ticket: undefined }}
          uiState={{ isLoading: false, isError: true }}
        />,
      )

      expect(screen.getByText('チケットの取得に失敗しました')).toBeInTheDocument()
      expect(screen.queryByTestId('mocked-ticket-detail-info')).not.toBeInTheDocument()
    })

    it('ticketがundefinedの場合(isError=falseでも)、エラーメッセージが表示されること', () => {
      customRender(
        <TicketDetailPresentational
          data={{ role: 'employee', ticket: undefined }}
          uiState={{ isLoading: false, isError: false }}
        />,
      )

      expect(screen.getByText('チケットの取得に失敗しました')).toBeInTheDocument()
    })

    it('isLoadingとisErrorが両方trueの場合、ローディング表示が優先されること', () => {
      customRender(
        <TicketDetailPresentational
          data={{ role: 'employee', ticket: undefined }}
          uiState={{ isLoading: true, isError: true }}
        />,
      )

      expect(screen.getByRole('status')).toBeInTheDocument()
      expect(screen.queryByText('チケットの取得に失敗しました')).not.toBeInTheDocument()
    })
  })
})
