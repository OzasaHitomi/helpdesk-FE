import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createUser } from '@/services/internal/backend/v1/users'
import { type CreateUserRequest } from '@/services/internal/backend/v1/types/request/users'
import { userQueryKeys } from '../queries/queryKeys'

// TanStack Queryの「更新系（POST）通信」をラップするフック
// 通信そのもの(createUser)や画面のロジック(useCreateAccountHandler)とは分けて、
// 「送信する」「送信できたらキャッシュをどうするか」だけに責務を絞っている
export const useCreateAccountMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateUserRequest) => createUser(data),
    onSuccess: () => {
      // アカウント一覧のキャッシュを無効化し、次回表示時に最新の一覧を再取得させる
      void queryClient.invalidateQueries({ queryKey: userQueryKeys.all })
    },
  })
}
