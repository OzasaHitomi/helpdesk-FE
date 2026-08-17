import { useUpdateTicketStatusMutation } from '../mutations/useUpdateTicketStatusMutation'
import { toaster } from '@/components/ui/toaster'
import { extractErrorInfo } from '@/share/logic/extractErrorInfo'
import { type TicketStatus } from '@/share/types/ticketStatus'

// チケットステータス変更操作のFE側ロジックを担当するhook
export const useUpdateTicketStatusHandler = (ticketId: number) => {
  const { mutateAsync, isPending } = useUpdateTicketStatusMutation(ticketId)

  const onClick = async (status: TicketStatus) => {
    try {
      await mutateAsync(status)
      toaster.create({ type: 'success', title: 'ステータスを変更しました' })
    } catch (e) {
      const info = extractErrorInfo(e)
      if (info == undefined) {
        toaster.create({ type: 'error', title: 'ステータス変更に失敗しました' })
      } else if (info.type === 'BUSINESS_ERROR') {
        const title = typeof info.detail === 'string' ? info.detail : 'ステータス変更に失敗しました'
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
