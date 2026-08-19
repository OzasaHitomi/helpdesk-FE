import { TicketDetailInfo } from '../TicketDetailInfo'
import { TicketDetailPublishButton } from '../TicketDetailPublishButton/TicketDetailPublishButton'
import { TicketDetailUnpublishButton } from '../TicketDetailUnpublishButton/TicketDetailUnpublishButton'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { type TicketDetailView } from '../../types/TicketDetailView'
import { type UserRole } from '@/share/types/userRole'

// TicketDetailInfoの表示内容（各項目の値・質問日のフォーマット・ステータスの選択状態）
// と、ステータスの編集可否（遷移可能かつ権限がある場合のみボタンとして操作できること）のみをテストする
// （日本語変換自体のロジックはtransformTicketStatusToJa.test.tsが担保する）
// （遷移ルール自体の判定はTicketStatusDisplayTransitionsを直接参照するため、ここでは組み合わせの出し分けのみを見る）
// （公開/非公開ボタン自体の見た目・クリック挙動はTicketDetailPublishButton.test.tsx/
//  TicketDetailUnpublishButton.test.tsxが担保するため、ここではisSelected/isEditable/disabled/handlersが
//  ticketの状態から正しく計算されて渡っているかのみを見る）

vi.mock('../TicketDetailPublishButton/TicketDetailPublishButton', () => ({
  TicketDetailPublishButton: vi.fn(() => <div data-testid='mocked-ticket-detail-publish-button' />),
}))

vi.mock('../TicketDetailUnpublishButton/TicketDetailUnpublishButton', () => ({
  TicketDetailUnpublishButton: vi.fn(() => (
    <div data-testid='mocked-ticket-detail-unpublish-button' />
  )),
}))

const mockTicketDetailPublishButton = vi.mocked(TicketDetailPublishButton)
const mockTicketDetailUnpublishButton = vi.mocked(TicketDetailUnpublishButton)

const mockTicket: TicketDetailView = {
  id: 1,
  title: 'ログインできない',
  detail: 'パスワードを変更したらログインできなくなりました',
  visibility: 'private',
  status: 'in_progress',
  createdByUserId: 1,
  supportUserId: null,
  supportUserName: null,
  isAssignableToMe: false,
  isUnassignableByMe: false,
  isStatusEditableByMe: false,
  isPublishableByMe: false,
  isUnpublishableByMe: false,
  createdAt: new Date('2026-07-30T00:00:00'),
}

const mockOnClick = vi.fn()

const mockStatusChange = {
  uiState: { isSubmitting: false },
  handlers: { onClick: mockOnClick },
}

const mockPublishOnClick = vi.fn()
const mockUnpublishOnClick = vi.fn()

const mockPublish = {
  uiState: { isSubmitting: false },
  handlers: { onClick: mockPublishOnClick },
}

const mockUnpublish = {
  uiState: { isSubmitting: false },
  handlers: { onClick: mockUnpublishOnClick },
}

const renderInfo = (
  role: UserRole | undefined = 'support',
  ticketOverrides?: Partial<TicketDetailView>,
  statusChangeOverrides?: Partial<typeof mockStatusChange>,
  publishOverrides?: Partial<typeof mockPublish>,
  unpublishOverrides?: Partial<typeof mockUnpublish>,
) => {
  customRender(
    <TicketDetailInfo
      data={{ ticket: { ...mockTicket, ...ticketOverrides }, role }}
      statusChange={{ ...mockStatusChange, ...statusChangeOverrides }}
      publish={{ ...mockPublish, ...publishOverrides }}
      unpublish={{ ...mockUnpublish, ...unpublishOverrides }}
    />,
  )
}

describe('TicketDetailInfo', () => {
  describe('正常系', () => {
    it('各項目のラベルが表示されること', () => {
      renderInfo()

      expect(screen.getByText('質問日')).toBeInTheDocument()
      expect(screen.getByText('公開設定')).toBeInTheDocument()
      expect(screen.getByText('要件')).toBeInTheDocument()
      expect(screen.getByText('詳細')).toBeInTheDocument()
      expect(screen.getByText('ステータス')).toBeInTheDocument()
    })

    it('要件・詳細の内容が入力欄に表示されること', () => {
      renderInfo()

      expect(screen.getByDisplayValue(mockTicket.title)).toBeInTheDocument()
      expect(screen.getByDisplayValue(mockTicket.detail)).toBeInTheDocument()
    })

    it('質問日が「YYYY/MM/DD」形式（スラッシュ区切り）で表示されること', () => {
      renderInfo()

      expect(screen.getByDisplayValue('2026/07/30')).toBeInTheDocument()
    })

    it('質問日・要件・詳細の入力欄が編集不可(readOnly)であること', () => {
      renderInfo()

      expect(screen.getByDisplayValue('2026/07/30')).toHaveAttribute('readonly')
      expect(screen.getByDisplayValue(mockTicket.title)).toHaveAttribute('readonly')
      expect(screen.getByDisplayValue(mockTicket.detail)).toHaveAttribute('readonly')
    })

    it('statusがin_progressの場合、対応中だけが選択状態(aria-current=true)であること', () => {
      renderInfo()

      expect(screen.getByText('対応中')).toHaveAttribute('aria-current', 'true')
      expect(screen.getByText('新規質問')).toHaveAttribute('aria-current', 'false')
    })

    it('ステータスの全項目が「ー」で連結されて表示されること', () => {
      renderInfo()

      expect(screen.getByText('新規質問')).toBeInTheDocument()
      expect(screen.getByText('担当者割り当て済み')).toBeInTheDocument()
      expect(screen.getByText('対応中')).toBeInTheDocument()
      expect(screen.getByText('解決済み')).toBeInTheDocument()
      expect(screen.getByText('クローズ')).toBeInTheDocument()
      // 5項目を繋ぐ「ー」は4つ表示される
      expect(screen.getAllByText('ー')).toHaveLength(4)
    })
  })

  // ── 公開設定ボタンへ渡すprops（isSelected/isEditable/disabled/handlers）の計算 ─────
  describe('公開設定ボタンへのprops', () => {
    it('visibilityがprivateの場合、TicketDetailPublishButtonにisSelected=falseが渡ること', () => {
      renderInfo('support', { visibility: 'private' })

      expect(mockTicketDetailPublishButton).toHaveBeenCalledWith(
        expect.objectContaining({ isSelected: false }),
        undefined,
      )
    })

    it('visibilityがpublicの場合、TicketDetailPublishButtonにisSelected=trueが渡ること', () => {
      renderInfo('support', { visibility: 'public' })

      expect(mockTicketDetailPublishButton).toHaveBeenCalledWith(
        expect.objectContaining({ isSelected: true }),
        undefined,
      )
    })

    it('visibilityがprivateの場合、TicketDetailUnpublishButtonにisSelected=trueが渡ること', () => {
      renderInfo('support', { visibility: 'private' })

      expect(mockTicketDetailUnpublishButton).toHaveBeenCalledWith(
        expect.objectContaining({ isSelected: true }),
        undefined,
      )
    })

    it('isPublishableByMeがfalseの場合、TicketDetailPublishButtonにdisabled=trueが渡ること', () => {
      renderInfo('employee', { visibility: 'private', isPublishableByMe: false })

      expect(mockTicketDetailPublishButton).toHaveBeenCalledWith(
        expect.objectContaining({ disabled: true }),
        undefined,
      )
    })

    it('isPublishableByMeがtrueの場合、現在privateならTicketDetailPublishButtonにdisabled=falseが渡ること', () => {
      renderInfo('support', { visibility: 'private', isPublishableByMe: true })

      expect(mockTicketDetailPublishButton).toHaveBeenCalledWith(
        expect.objectContaining({ disabled: false }),
        undefined,
      )
    })

    it('isUnpublishableByMeがtrueでも、現在privateの場合はTicketDetailUnpublishButtonにdisabled=trueが渡ること', () => {
      renderInfo('support', { visibility: 'private', isUnpublishableByMe: true })

      expect(mockTicketDetailUnpublishButton).toHaveBeenCalledWith(
        expect.objectContaining({ disabled: true }),
        undefined,
      )
    })

    it('isUnpublishableByMeがtrueの場合、現在publicならTicketDetailUnpublishButtonにdisabled=falseが渡ること', () => {
      renderInfo('employee', { visibility: 'public', isUnpublishableByMe: true })

      expect(mockTicketDetailUnpublishButton).toHaveBeenCalledWith(
        expect.objectContaining({ disabled: false }),
        undefined,
      )
    })

    it('isUnpublishableByMeがfalseの場合、現在publicでもTicketDetailUnpublishButtonにdisabled=trueが渡ること', () => {
      renderInfo('employee', { visibility: 'public', isUnpublishableByMe: false })

      expect(mockTicketDetailUnpublishButton).toHaveBeenCalledWith(
        expect.objectContaining({ disabled: true }),
        undefined,
      )
    })

    it('TicketDetailPublishButtonにpublish.handlersがそのまま渡ること', () => {
      renderInfo('support', { visibility: 'private' })

      expect(mockTicketDetailPublishButton).toHaveBeenCalledWith(
        expect.objectContaining({ handlers: mockPublish.handlers }),
        undefined,
      )
    })

    it('TicketDetailUnpublishButtonにunpublish.handlersがそのまま渡ること', () => {
      renderInfo('support', { visibility: 'private' })

      expect(mockTicketDetailUnpublishButton).toHaveBeenCalledWith(
        expect.objectContaining({ handlers: mockUnpublish.handlers }),
        undefined,
      )
    })

    it('publish.uiState.isSubmittingがtrueの場合、TicketDetailUnpublishButtonにもdisabled=trueが渡ること', () => {
      renderInfo('employee', { visibility: 'public', isUnpublishableByMe: true }, undefined, {
        uiState: { isSubmitting: true },
      })

      expect(mockTicketDetailUnpublishButton).toHaveBeenCalledWith(
        expect.objectContaining({ disabled: true }),
        undefined,
      )
    })
  })

  // ── ステータスの編集可否（遷移可能かつ権限がある場合のみボタンになる） ───
  describe('ステータスの編集可否', () => {
    it('isStatusEditableByMeがfalseの場合、遷移可能なステータスもボタンにならないこと', () => {
      renderInfo('support', { isStatusEditableByMe: false })

      expect(screen.queryByRole('button', { name: '解決済み' })).not.toBeInTheDocument()
      expect(screen.getByText('解決済み')).toBeInTheDocument()
    })

    it('isStatusEditableByMeがtrueの場合、現在のステータスから直接遷移可能なステータスがボタンになること', () => {
      renderInfo('support', { status: 'in_progress', isStatusEditableByMe: true })

      // in_progressから直接遷移可能なのはassigned/resolved/closed
      expect(screen.getByRole('button', { name: '担当者割り当て済み' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '解決済み' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'クローズ' })).toBeInTheDocument()
    })

    it('isStatusEditableByMeがtrueでも、現在選択中のステータスはボタンにならないこと', () => {
      renderInfo('support', { status: 'in_progress', isStatusEditableByMe: true })

      expect(screen.queryByRole('button', { name: '対応中' })).not.toBeInTheDocument()
      expect(screen.getByText('対応中')).toBeInTheDocument()
    })

    it('isStatusEditableByMeがtrueでも、直接遷移不可能なステータスはボタンにならないこと', () => {
      renderInfo('support', { status: 'in_progress', isStatusEditableByMe: true })

      // in_progressからnew_questionへは直接遷移できない
      expect(screen.queryByRole('button', { name: '新規質問' })).not.toBeInTheDocument()
      expect(screen.getByText('新規質問')).toBeInTheDocument()
    })

    it('ステータスボタンを押すと、そのステータスでstatusChange.handlers.onClickが呼ばれること', () => {
      renderInfo('support', { status: 'in_progress', isStatusEditableByMe: true })

      fireEvent.click(screen.getByRole('button', { name: '解決済み' }))

      expect(mockOnClick).toHaveBeenCalledWith('resolved')
    })

    it('statusChange.uiState.isSubmittingがtrueの場合、ステータスボタンが無効化されること', () => {
      renderInfo(
        'support',
        { status: 'in_progress', isStatusEditableByMe: true },
        { uiState: { isSubmitting: true } },
      )

      expect(screen.getByRole('button', { name: '解決済み' })).toBeDisabled()
    })
  })
})
