import { TicketDetailInfo } from '../TicketDetailInfo'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { type TicketDetailView } from '../../types/TicketDetailView'
import { type UserRole } from '@/share/types/userRole'

// TicketDetailInfoの表示内容（各項目の値・質問日のフォーマット・公開設定/ステータスの選択状態）
// と、ステータスの編集可否（遷移可能かつ権限がある場合のみボタンとして操作できること）のみをテストする
// （日本語変換自体のロジックはtransformTicketVisibilityToJa.test.ts/transformTicketStatusToJa.test.tsが担保する）
// （遷移ルール自体の判定はTicketStatusTransitionsを直接参照するため、ここでは組み合わせの出し分けのみを見る）

const mockTicket: TicketDetailView = {
  id: 1,
  title: 'ログインできない',
  detail: 'パスワードを変更したらログインできなくなりました',
  visibility: 'private',
  status: 'in_progress',
  supportUserId: null,
  supportUserName: null,
  isAssignableToMe: false,
  isUnassignableByMe: false,
  isStatusEditableByMe: false,
  createdAt: new Date('2026-07-30T00:00:00'),
}

const mockOnClick = vi.fn()

const mockStatusChange = {
  uiState: { isSubmitting: false },
  handlers: { onClick: mockOnClick },
}

// 公開設定の編集可否はroleによって変わるため、デフォルトはsupport(非社員)で描画する
const renderInfo = (
  role: UserRole | undefined = 'support',
  ticketOverrides?: Partial<TicketDetailView>,
  statusChangeOverrides?: Partial<typeof mockStatusChange>,
) => {
  customRender(
    <TicketDetailInfo
      data={{ ticket: { ...mockTicket, ...ticketOverrides }, role }}
      statusChange={{ ...mockStatusChange, ...statusChangeOverrides }}
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

    it('visibilityがprivateの場合、非公開ボタンだけが選択状態(aria-pressed=true)であること', () => {
      renderInfo()

      expect(screen.getByRole('button', { name: '非公開' })).toHaveAttribute('aria-pressed', 'true')
      expect(screen.getByRole('button', { name: '公開' })).toHaveAttribute('aria-pressed', 'false')
    })

    it('statusがin_progressの場合、対応中だけが選択状態(aria-current=true)であること', () => {
      renderInfo()

      expect(screen.getByText('対応中')).toHaveAttribute('aria-current', 'true')
      expect(screen.getByText('新規質問')).toHaveAttribute('aria-current', 'false')
    })

    it('ステータスの全項目が「ー」で連結されて表示されること', () => {
      renderInfo()

      expect(screen.getByText('新規質問')).toBeInTheDocument()
      expect(screen.getByText('担当者アサイン済み')).toBeInTheDocument()
      expect(screen.getByText('対応中')).toBeInTheDocument()
      expect(screen.getByText('解決済み')).toBeInTheDocument()
      expect(screen.getByText('クローズ')).toBeInTheDocument()
      // 5項目を繋ぐ「ー」は4つ表示される
      expect(screen.getAllByText('ー')).toHaveLength(4)
    })
  })

  // ── 公開設定ボタンのdisabled出し分け（社員のみ無効化） ─────────────
  describe('公開設定の編集可否', () => {
    it('roleがemployeeの場合、公開設定のボタンが無効化されること', () => {
      renderInfo('employee')

      expect(screen.getByRole('button', { name: '非公開' })).toBeDisabled()
      expect(screen.getByRole('button', { name: '公開' })).toBeDisabled()
    })

    it('roleがsupportの場合、公開設定のボタンが無効化されないこと', () => {
      renderInfo('support')

      expect(screen.getByRole('button', { name: '非公開' })).not.toBeDisabled()
      expect(screen.getByRole('button', { name: '公開' })).not.toBeDisabled()
    })

    it('roleがadminの場合、公開設定のボタンが無効化されないこと', () => {
      renderInfo('admin')

      expect(screen.getByRole('button', { name: '非公開' })).not.toBeDisabled()
      expect(screen.getByRole('button', { name: '公開' })).not.toBeDisabled()
    })

    it('roleが未取得(undefined)の場合、公開設定のボタンが無効化されないこと', () => {
      renderInfo(undefined)

      expect(screen.getByRole('button', { name: '非公開' })).not.toBeDisabled()
      expect(screen.getByRole('button', { name: '公開' })).not.toBeDisabled()
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
      expect(screen.getByRole('button', { name: '担当者アサイン済み' })).toBeInTheDocument()
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
