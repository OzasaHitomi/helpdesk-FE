import { useDeactivateAccountMutation } from '../mutations/useDeactivateAccountMutation'
import { toaster } from '@/components/ui/toaster'
import { extractErrorInfo } from '@/share/logic/extractErrorInfo'
import { type AccountItemView } from '../../types/AccountItemView'

// アカウント停止操作のFE側ロジックを担当するhook（再開操作は別hookの担当）
export const useDeactivateAccountHandler = () => {
  const { mutateAsync, isPending } = useDeactivateAccountMutation()

  const onClick = async (account: AccountItemView) => {
    try {
      await mutateAsync(account.id)
      toaster.create({ type: 'success', title: `${account.name}を利用停止にしました` })
    } catch (e) {
      const info = extractErrorInfo(e)
      if (info == undefined) {
        toaster.create({ type: 'error', title: 'アカウントの利用停止に失敗しました' })
      } else {
        const title = typeof info.detail === 'string' ? info.detail : 'システムエラーが発生しました'
        toaster.create({ type: 'error', title: title })
      }
    }
  }

  return {
    uiState: { isSubmitting: isPending },
    handlers: { onClick },
  }
}
