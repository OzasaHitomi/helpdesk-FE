import { useUnpublishTicketMutation } from '../mutations/useUnpublishTicketMutation'
import { toaster } from '@/components/ui/toaster'
import { extractErrorInfo } from '@/share/logic/extractErrorInfo'
import { transformTicketVisibilityToJa } from '@/share/logic/transform/transformTicketVisibilityToJa'

// チケットを非公開にする操作のFE側ロジックを担当するhook（公開する操作は別hookの担当）
export const useUnpublishTicketHandler = (ticketId: number) => {
  const { mutateAsync, isPending } = useUnpublishTicketMutation(ticketId)

  const onClick = async () => {
    try {
      await mutateAsync()
      toaster.create({
        type: 'success',
        title: `チケット：${String(ticketId)} を${transformTicketVisibilityToJa('private')}に設定しました`,
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
