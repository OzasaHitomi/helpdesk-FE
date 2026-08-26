import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deactivateUser } from '@/services/internal/backend/v1/users'
import { userQueryKeys } from '../queries/queryKeys'

// TanStack Queryの「更新系（PUT）通信」をラップするフック
// 通信そのもの(deactivateUser)や画面のロジック(useDeactivateAccountHandler)とは分けて、
// 「送信する」「送信できたらキャッシュをどうするか」だけに責務を絞っている
export const useDeactivateAccountMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: number) => deactivateUser(userId),
    onSuccess: () => {
      // アカウント一覧のキャッシュを無効化し、次回表示時に最新の一覧を再取得させる
      void queryClient.invalidateQueries({ queryKey: userQueryKeys.all })
    },
  })
}
