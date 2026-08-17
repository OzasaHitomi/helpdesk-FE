import { TicketDetailInfo } from '../TicketDetailInfo'
import { customRender } from '@/tests/helpers/customRender'
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { type TicketDetailView } from '../../types/TicketDetailView'
import { type UserRole } from '@/share/types/userRole'

// TicketDetailInfoの表示内容（各項目の値・質問日のフォーマット・公開設定/ステータスの選択状態）
// と、編集不可であること（disabled表示・ステータスがボタンではなく表示専用の要素であること）のみをテストする
// （日本語変換自体のロジックはtransformTicketVisibilityToJa.test.ts/transformTicketStatusToJa.test.tsが担保する）

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
  createdAt: new Date('2026-07-30T00:00:00'),
}

// 公開設定の編集可否はroleによって変わるため、デフォルトはsupport(非社員)で描画する
const renderInfo = (role: UserRole | undefined = 'support') => {
  customRender(<TicketDetailInfo data={{ ticket: mockTicket, role }} />)
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

  // ── 準正常系（ステータスは常に編集不可であること） ───────────────
  describe('準正常系', () => {
    it('ステータスはボタンではなく、クリック操作を持たない表示専用の要素であること', () => {
      renderInfo()

      expect(screen.queryByRole('button', { name: '対応中' })).not.toBeInTheDocument()
    })
  })
})
