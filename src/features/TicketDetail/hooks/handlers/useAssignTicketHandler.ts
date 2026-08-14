import { useAssignTicketToSelfMutation } from '../mutations/useAssignTicketToSelfMutation'
import { toaster } from '@/components/ui/toaster'
import { extractErrorInfo } from '@/share/logic/extractErrorInfo'

// チケット担当者になる操作のFE側ロジックを担当するhook（担当解除は別hookの担当）
export const useAssignTicketHandler = (ticketId: number) => {
  const { mutateAsync, isPending } = useAssignTicketToSelfMutation(ticketId)

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
    uiState: { isSubmitting: isPending },
    handlers: { onClick },
  }
}
