import { useAssignTicketToSelfMutation } from '../mutations/useAssignTicketToSelfMutation'
import { toaster } from '@/components/ui/toaster'
import { extractErrorInfo } from '@/share/logic/extractErrorInfo'
import { type TicketDetailView } from '../../types/TicketDetailView'
import { type UserRole } from '@/share/types/userRole'

// チケット担当者の割り当て・表示ボタンのFE側ロジックを担当するhook
// 担当解除の実際の処理(API)は別タスクのため、「担当解除」表示は行うがonClickは未接続にする
export const useAssignTicketHandler = (
  ticketId: number,
  ticket: TicketDetailView | undefined,
  role: UserRole | undefined,
  currentUserId: number | undefined,
) => {
  const { mutateAsync, isPending } = useAssignTicketToSelfMutation(ticketId)

  // 新規質問かつ担当者未割り当てで、サポート担当がログインしている場合のみ「担当者になる」を表示する
  const isAssignableToMe =
    role === 'support' && ticket?.status === 'new_question' && ticket.supportUserId == null

  // 担当者が設定されていて、それがログインユーザー自身の場合は「担当解除」を表示する
  // （ステータスに関わらず、担当者が自分である間は常に表示する）
  const isAssignedToMe =
    role === 'support' && ticket?.supportUserId != null && ticket.supportUserId === currentUserId

  const buttonLabel = isAssignableToMe ? '担当者になる' : isAssignedToMe ? '担当解除' : null

  const onClick = async () => {
    try {
      await mutateAsync()
      toaster.create({ type: 'success', title: '担当者に設定されました' })
    } catch (e) {
      const info = extractErrorInfo(e)
      if (info == undefined) {
        toaster.create({ type: 'error', title: '担当者の設定に失敗しました' })
      } else if (info.type === 'BUSINESS_ERROR') {
        const title = typeof info.detail === 'string' ? info.detail : '担当者の設定に失敗しました'
        toaster.create({ type: 'error', title })
      } else {
        const title = typeof info.detail === 'string' ? info.detail : 'システムエラーが発生しました'
        toaster.create({ type: 'error', title })
      }
    }
  }

  return {
    data: { buttonLabel, supportUserName: ticket?.supportUserName ?? null },
    uiState: { isSubmitting: isPending },
    // 「担当解除」はまだAPIが無いため、実際にクリックできる操作(onClick)を渡すのは「担当者になる」の場合のみ
    handlers: { onClick: isAssignableToMe ? onClick : undefined },
  }
}
