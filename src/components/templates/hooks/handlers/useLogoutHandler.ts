import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useLogoutMutation } from '../mutations/useLogoutMutation'
import { authQueryKeys } from '@/share/hooks/queries/queryKeys'
import { toaster } from '@/components/ui/toaster'

export const useLogoutHandler = () => {
  const { mutateAsync, isPending } = useLogoutMutation() // isPending: ログアウトAPI実行中かどうか
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const onLogout = async () => {
    try {
      await mutateAsync() // ログアウトAPIを呼ぶ

      // /auth/meのキャッシュを破棄する
      // （破棄しないと、ブラウザの戻る操作でTopページに戻った際staleTime:Infinityのキャッシュがそのまま使われ、
      // RequireAuthが再認証チェックせずログイン済み扱いのまま表示されてしまうため）
      queryClient.removeQueries({ queryKey: authQueryKeys.me })

      // ログイン画面に遷移する
      // （replace: trueで履歴を置き換え、ログアウト後に「戻る」でログアウト前の画面に戻れないようにする）
      void navigate('/login', { replace: true })
      toaster.create({ type: 'success', title: 'ログアウトしました' })
    } catch {
      // ログアウト失敗時は画面を変えず、再度ボタンを押せる状態のままにする
      toaster.create({ type: 'error', title: 'ログアウトに失敗しました' })
    }
  }

  return {
    data: { isLoggingOut: isPending },
    handlers: { onLogout },
  }
}
