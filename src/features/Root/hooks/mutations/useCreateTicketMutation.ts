import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTicket } from '@/services/internal/backend/v1/tickets'
import { type CreateTicketRequest } from '@/services/internal/backend/v1/types/request/tickets'
import { ticketQueryKeys } from '@/share/hooks/queries/queryKeys'

// TanStack Queryの「更新系（POST）通信」をラップするフック
// 通信そのもの(createTicket)や画面のロジック(useCreateTicketHandler)とは分けて、
// 「送信する」「送信できたらキャッシュをどうするか」だけに責務を絞っている
export const useCreateTicketMutation = () => {
  // キャッシュ（TanStack Queryが保持しているデータ）を操作するためのクライアントを取得する
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn: 実際に呼ばれる通信処理。ここではBEへチケット登録をPOSTするcreateTicketをそのまま呼ぶ
    // 受け取ったCreateTicketRequest（handler側でフォーム入力値から詰め替え済み）をそのままAPI呼び出し関数に渡す
    mutationFn: (data: CreateTicketRequest) => createTicket(data),
    // onSuccess: mutationFnが成功した直後に呼ばれるコールバック
    onSuccess: () => {
      // チケット一覧のキャッシュを無効化し、次回表示時に最新の一覧を再取得させる
      // （invalidateQueriesは戻り値のPromiseを使わないため、voidを付けてESLintに「意図的に無視している」ことを伝える）
      void queryClient.invalidateQueries({ queryKey: ticketQueryKeys.all })
    },
  })
}
