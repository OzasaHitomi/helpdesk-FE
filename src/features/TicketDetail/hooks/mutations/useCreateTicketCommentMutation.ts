import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTicketComment } from '@/services/internal/backend/v1/ticketComments'
import { type CreateTicketCommentRequest } from '@/services/internal/backend/v1/types/request/ticketComments'
import { ticketDetailQueryKeys } from '../queries/queryKeys'

// CreateTicketCommentVariablesはmutation変数の型(このフック専用)であり、外部から渡される値ではない
interface CreateTicketCommentVariables {
  ticketId: number
  request: CreateTicketCommentRequest
}

// TanStack Queryの「更新系（POST）通信」をラップするフック
// 通信そのもの(createTicketComment)や画面のロジック(useCreateTicketCommentHandler)とは分けて、
// 「送信する」「送信できたらキャッシュをどうするか」だけに責務を絞っている
export const useCreateTicketCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ ticketId, request }: CreateTicketCommentVariables) =>
      createTicketComment(ticketId, request),
    // onSuccess: mutationFnが成功した直後に呼ばれるコールバック(第2引数でmutateAsyncに渡した変数を受け取れる)
    // _data: APIのレスポンス、variables: mutateAsyncに渡した値
    onSuccess: (_data, variables) => {
      // 対応履歴のキャッシュを無効化し、次回表示時に今回登録した内容を含む最新の履歴を再取得させる
      void queryClient.invalidateQueries({
        queryKey: ticketDetailQueryKeys.comments(variables.ticketId),
      })
    },
  })
}
