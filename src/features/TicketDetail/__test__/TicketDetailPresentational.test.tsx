import { TicketDetailPresentational } from '../TicketDetailPresentational'
import { TicketDetailInfo } from '../ui/TicketDetailInfo'
import { TicketDetailCommentForm } from '../ui/TicketDetailCommentForm'
import { TicketDetailHistory } from '../ui/TicketDetailHistory'
import { TicketDetailAssignButton } from '../ui/TicketDetailAssignButton'
import { TicketDetailUnassignButton } from '../ui/TicketDetailUnassignButton'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { type TicketDetailView } from '../types/TicketDetailView'
import { type TicketCommentView } from '../types/TicketCommentView'

// TicketDetailPresentationalの表示内容（取得中・取得失敗・正常時の出し分け、
// TicketDetailInfo・TicketDetailCommentForm・TicketDetailHistory・TicketDetailAssignButton・
// TicketDetailUnassignButtonへの橋渡し）のみをテストする
// （各子コンポーネント自体の見た目はそれぞれのtestが担保する）

vi.mock('../ui/TicketDetailInfo', () => ({
  TicketDetailInfo: vi.fn(() => <div data-testid='mocked-ticket-detail-info' />),
}))

vi.mock('../ui/TicketDetailCommentForm', () => ({
  TicketDetailCommentForm: vi.fn(() => <div data-testid='mocked-ticket-detail-comment-form' />),
}))

vi.mock('../ui/TicketDetailHistory', () => ({
  TicketDetailHistory: vi.fn(() => <div data-testid='mocked-ticket-detail-history' />),
}))

vi.mock('../ui/TicketDetailAssignButton', () => ({
  TicketDetailAssignButton: vi.fn(() => <div data-testid='mocked-ticket-detail-assign-button' />),
}))

vi.mock('../ui/TicketDetailUnassignButton', () => ({
  TicketDetailUnassignButton: vi.fn(() => (
    <div data-testid='mocked-ticket-detail-unassign-button' />
  )),
}))

const mockTicketDetailInfo = vi.mocked(TicketDetailInfo)
const mockTicketDetailCommentForm = vi.mocked(TicketDetailCommentForm)
const mockTicketDetailHistory = vi.mocked(TicketDetailHistory)
const mockTicketDetailAssignButton = vi.mocked(TicketDetailAssignButton)
const mockTicketDetailUnassignButton = vi.mocked(TicketDetailUnassignButton)

const mockTicket: TicketDetailView = {
  id: 1,
  title: 'ログインできない',
  detail: 'パスワードを変更したらログインできなくなりました',
  visibility: 'private',
  status: 'new_question',
  createdByUserId: 1,
  supportUserId: null,
  supportUserName: null,
  isAssignableToMe: true,
  isUnassignableByMe: false,
  isStatusEditableByMe: false,
  isPublishableByMe: false,
  isUnpublishableByMe: false,
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

const mockCommentForm = {
  data: { content: '', fieldErrors: {} },
  uiState: { isSubmitting: false },
  handlers: { setContent: vi.fn(), onSubmit: vi.fn() },
}

const mockAssignment = {
  uiState: { isSubmitting: false },
  handlers: { onClick: vi.fn() },
}

const mockUnassignment = {
  uiState: { isSubmitting: false },
  handlers: { onClick: vi.fn() },
}

const mockStatusChange = {
  uiState: { isSubmitting: false },
  handlers: { onClick: vi.fn() },
}

const mockPublish = {
  uiState: { isSubmitting: false },
  handlers: { onClick: vi.fn() },
}

const mockUnpublish = {
  uiState: { isSubmitting: false },
  handlers: { onClick: vi.fn() },
}

describe('TicketDetailPresentational', () => {
  describe('正常系', () => {
    it('IDが見出しに表示されること', () => {
      customRender(
        <TicketDetailPresentational
          data={{ role: 'employee', ticket: mockTicket, comments: mockComments }}
          uiState={{ isLoading: false, isError: false }}
          commentForm={mockCommentForm}
          assignment={mockAssignment}
          unassignment={mockUnassignment}
          statusChange={mockStatusChange}
          publish={mockPublish}
          unpublish={mockUnpublish}
        />,
      )

      expect(screen.getByText('ID：1')).toBeInTheDocument()
    })

    it('TicketDetailInfoにticket・roleがそのまま渡されること', () => {
      customRender(
        <TicketDetailPresentational
          data={{ role: 'employee', ticket: mockTicket, comments: mockComments }}
          uiState={{ isLoading: false, isError: false }}
          commentForm={mockCommentForm}
          assignment={mockAssignment}
          unassignment={mockUnassignment}
          statusChange={mockStatusChange}
          publish={mockPublish}
          unpublish={mockUnpublish}
        />,
      )

      expect(screen.getByTestId('mocked-ticket-detail-info')).toBeInTheDocument()
      expect(mockTicketDetailInfo).toHaveBeenCalledWith(
        {
          data: { ticket: mockTicket, role: 'employee' },
          statusChange: mockStatusChange,
          publish: mockPublish,
          unpublish: mockUnpublish,
        },
        undefined,
      )
    })

    it('TicketDetailCommentFormにcommentFormのdata/uiState/handlersがそのまま渡されること', () => {
      customRender(
        <TicketDetailPresentational
          data={{ role: 'employee', ticket: mockTicket, comments: mockComments }}
          uiState={{ isLoading: false, isError: false }}
          commentForm={mockCommentForm}
          assignment={mockAssignment}
          unassignment={mockUnassignment}
          statusChange={mockStatusChange}
          publish={mockPublish}
          unpublish={mockUnpublish}
        />,
      )

      expect(screen.getByTestId('mocked-ticket-detail-comment-form')).toBeInTheDocument()
      expect(mockTicketDetailCommentForm).toHaveBeenCalledWith(
        {
          data: mockCommentForm.data,
          uiState: mockCommentForm.uiState,
          handlers: mockCommentForm.handlers,
        },
        undefined,
      )
    })

    it('TicketDetailHistoryにcommentsがそのまま渡されること', () => {
      customRender(
        <TicketDetailPresentational
          data={{ role: 'employee', ticket: mockTicket, comments: mockComments }}
          uiState={{ isLoading: false, isError: false }}
          commentForm={mockCommentForm}
          assignment={mockAssignment}
          unassignment={mockUnassignment}
          statusChange={mockStatusChange}
          publish={mockPublish}
          unpublish={mockUnpublish}
        />,
      )

      expect(screen.getByTestId('mocked-ticket-detail-history')).toBeInTheDocument()
      expect(mockTicketDetailHistory).toHaveBeenCalledWith(
        { data: { comments: mockComments } },
        undefined,
      )
    })

    it('TicketDetailAssignButtonにassignmentのuiState/handlersが渡されること', () => {
      customRender(
        <TicketDetailPresentational
          data={{ role: 'employee', ticket: mockTicket, comments: mockComments }}
          uiState={{ isLoading: false, isError: false }}
          commentForm={mockCommentForm}
          assignment={mockAssignment}
          unassignment={mockUnassignment}
          statusChange={mockStatusChange}
          publish={mockPublish}
          unpublish={mockUnpublish}
        />,
      )

      expect(screen.getByTestId('mocked-ticket-detail-assign-button')).toBeInTheDocument()
      expect(mockTicketDetailAssignButton).toHaveBeenCalledWith(
        {
          uiState: mockAssignment.uiState,
          handlers: mockAssignment.handlers,
        },
        undefined,
      )
    })

    it('ticket.isAssignableToMeがfalseの場合、TicketDetailAssignButtonが表示されないこと', () => {
      customRender(
        <TicketDetailPresentational
          data={{
            role: 'employee',
            ticket: { ...mockTicket, isAssignableToMe: false },
            comments: mockComments,
          }}
          uiState={{ isLoading: false, isError: false }}
          commentForm={mockCommentForm}
          assignment={mockAssignment}
          unassignment={mockUnassignment}
          statusChange={mockStatusChange}
          publish={mockPublish}
          unpublish={mockUnpublish}
        />,
      )

      expect(screen.queryByTestId('mocked-ticket-detail-assign-button')).not.toBeInTheDocument()
    })

    it('TicketDetailUnassignButtonにunassignmentのuiState/handlersが渡されること', () => {
      customRender(
        <TicketDetailPresentational
          data={{
            role: 'employee',
            ticket: { ...mockTicket, isUnassignableByMe: true },
            comments: mockComments,
          }}
          uiState={{ isLoading: false, isError: false }}
          commentForm={mockCommentForm}
          assignment={mockAssignment}
          unassignment={mockUnassignment}
          statusChange={mockStatusChange}
          publish={mockPublish}
          unpublish={mockUnpublish}
        />,
      )

      expect(screen.getByTestId('mocked-ticket-detail-unassign-button')).toBeInTheDocument()
      expect(mockTicketDetailUnassignButton).toHaveBeenCalledWith(
        {
          uiState: mockUnassignment.uiState,
          handlers: mockUnassignment.handlers,
        },
        undefined,
      )
    })

    it('ticket.isUnassignableByMeがtrueの場合、担当解除ボタンと担当者名の間の区切り「|」が表示されること', () => {
      customRender(
        <TicketDetailPresentational
          data={{
            role: 'employee',
            ticket: { ...mockTicket, isUnassignableByMe: true },
            comments: mockComments,
          }}
          uiState={{ isLoading: false, isError: false }}
          commentForm={mockCommentForm}
          assignment={mockAssignment}
          unassignment={mockUnassignment}
          statusChange={mockStatusChange}
          publish={mockPublish}
          unpublish={mockUnpublish}
        />,
      )

      expect(screen.getByTestId('ticket-detail-unassign-separator')).toBeInTheDocument()
    })

    it('ticket.isUnassignableByMeがfalseの場合、TicketDetailUnassignButtonが表示されないこと', () => {
      customRender(
        <TicketDetailPresentational
          data={{
            role: 'employee',
            ticket: { ...mockTicket, isUnassignableByMe: false },
            comments: mockComments,
          }}
          uiState={{ isLoading: false, isError: false }}
          commentForm={mockCommentForm}
          assignment={mockAssignment}
          unassignment={mockUnassignment}
          statusChange={mockStatusChange}
          publish={mockPublish}
          unpublish={mockUnpublish}
        />,
      )

      expect(screen.queryByTestId('mocked-ticket-detail-unassign-button')).not.toBeInTheDocument()
    })

    it('ticket.isUnassignableByMeがfalseの場合、区切り「|」も表示されないこと', () => {
      customRender(
        <TicketDetailPresentational
          data={{
            role: 'employee',
            ticket: { ...mockTicket, isUnassignableByMe: false },
            comments: mockComments,
          }}
          uiState={{ isLoading: false, isError: false }}
          commentForm={mockCommentForm}
          assignment={mockAssignment}
          unassignment={mockUnassignment}
          statusChange={mockStatusChange}
          publish={mockPublish}
          unpublish={mockUnpublish}
        />,
      )

      expect(screen.queryByTestId('ticket-detail-unassign-separator')).not.toBeInTheDocument()
    })

    it('ticket.supportUserNameが設定されている場合、担当者名が表示されること', () => {
      customRender(
        <TicketDetailPresentational
          data={{
            role: 'employee',
            ticket: { ...mockTicket, supportUserName: '山田太郎' },
            comments: mockComments,
          }}
          uiState={{ isLoading: false, isError: false }}
          commentForm={mockCommentForm}
          assignment={mockAssignment}
          unassignment={mockUnassignment}
          statusChange={mockStatusChange}
          publish={mockPublish}
          unpublish={mockUnpublish}
        />,
      )

      expect(screen.getByText('山田太郎')).toBeInTheDocument()
    })

    it('ticket.supportUserNameがnullの場合、担当者名が表示されないこと', () => {
      customRender(
        <TicketDetailPresentational
          data={{ role: 'employee', ticket: mockTicket, comments: mockComments }}
          uiState={{ isLoading: false, isError: false }}
          commentForm={mockCommentForm}
          assignment={mockAssignment}
          unassignment={mockUnassignment}
          statusChange={mockStatusChange}
          publish={mockPublish}
          unpublish={mockUnpublish}
        />,
      )

      expect(screen.queryByText('山田太郎')).not.toBeInTheDocument()
    })
  })

  // ── 準正常系（取得中・取得失敗時の表示の出し分け） ─────────────────
  describe('準正常系', () => {
    it('isLoadingがtrueの場合、ローディング表示になり、TicketDetailInfoは表示されないこと', () => {
      customRender(
        <TicketDetailPresentational
          data={{ role: 'employee', ticket: undefined, comments: [] }}
          uiState={{ isLoading: true, isError: false }}
          commentForm={mockCommentForm}
          assignment={mockAssignment}
          unassignment={mockUnassignment}
          statusChange={mockStatusChange}
          publish={mockPublish}
          unpublish={mockUnpublish}
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
          commentForm={mockCommentForm}
          assignment={mockAssignment}
          unassignment={mockUnassignment}
          statusChange={mockStatusChange}
          publish={mockPublish}
          unpublish={mockUnpublish}
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
          commentForm={mockCommentForm}
          assignment={mockAssignment}
          unassignment={mockUnassignment}
          statusChange={mockStatusChange}
          publish={mockPublish}
          unpublish={mockUnpublish}
        />,
      )

      expect(screen.getByText('チケットの取得に失敗しました')).toBeInTheDocument()
    })

    it('isLoadingとisErrorが両方trueの場合、ローディング表示が優先されること', () => {
      customRender(
        <TicketDetailPresentational
          data={{ role: 'employee', ticket: undefined, comments: [] }}
          uiState={{ isLoading: true, isError: true }}
          commentForm={mockCommentForm}
          assignment={mockAssignment}
          unassignment={mockUnassignment}
          statusChange={mockStatusChange}
          publish={mockPublish}
          unpublish={mockUnpublish}
        />,
      )

      expect(screen.getByRole('status')).toBeInTheDocument()
      expect(screen.queryByText('チケットの取得に失敗しました')).not.toBeInTheDocument()
    })
  })
})
