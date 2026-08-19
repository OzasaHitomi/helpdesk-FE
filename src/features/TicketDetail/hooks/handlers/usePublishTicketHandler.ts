import { usePublishTicketMutation } from '../mutations/usePublishTicketMutation'
import { toaster } from '@/components/ui/toaster'
import { extractErrorInfo } from '@/share/logic/extractErrorInfo'
import { transformTicketVisibilityToJa } from '@/share/logic/transform/transformTicketVisibilityToJa'

// チケットを公開する操作のFE側ロジックを担当するhook（非公開にする操作は別hookの担当）
export const usePublishTicketHandler = (ticketId: number) => {
  const { mutateAsync, isPending } = usePublishTicketMutation(ticketId)

  const onClick = async () => {
    try {
      await mutateAsync()
      toaster.create({
        type: 'success',
        title: `チケット：${String(ticketId)} を${transformTicketVisibilityToJa('public')}に設定しました`,
      })
    } catch (e) {
      const info = extractErrorInfo(e)
      if (info == undefined) {
        toaster.create({ type: 'error', title: '公開設定の変更に失敗しました' })
      } else if (info.type === 'BUSINESS_ERROR') {
        const title = typeof info.detail === 'string' ? info.detail : '公開設定の変更に失敗しました'
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
