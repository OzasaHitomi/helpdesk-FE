import { useAssignTicketToSelfMutation } from '../mutations/useAssignTicketToSelfMutation'
import { toaster } from '@/components/ui/toaster'
import { extractErrorInfo } from '@/share/logic/extractErrorInfo'
import { type TicketDetailView } from '../../types/TicketDetailView'
import { type UserRole } from '@/share/types/userRole'

// チケット担当者になる操作のFE側ロジックを担当するhook（担当解除は別hookの担当）
export const useAssignTicketHandler = (
  ticketId: number,
  ticket: TicketDetailView | undefined,
  role: UserRole | undefined,
) => {
  const { mutateAsync, isPending } = useAssignTicketToSelfMutation(ticketId)

  // 新規質問かつ担当者未割り当てで、サポート担当がログインしている場合のみ「担当者になる」を表示する
  const isAssignableToMe =
    role === 'support' && ticket?.status === 'new_question' && ticket.supportUserId == null

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
    data: { isAssignableToMe },
    uiState: { isSubmitting: isPending },
    handlers: { onClick },
  }
}
