import { useMutation, useQueryClient } from '@tanstack/react-query'
import { unassignTicket } from '@/services/internal/backend/v1/tickets'
import { ticketDetailQueryKeys } from '../queries/queryKeys'

// TanStack Queryの「更新系（DELETE）通信」をラップするフック
// ticketIdは詳細ページ表示時点で確定しているため、mutateAsyncの引数ではなくフック自体の引数として受け取る
export const useUnassignTicketMutation = (ticketId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => unassignTicket(ticketId),
    // onSuccess: mutationFnが成功した直後に呼ばれるコールバック
    onSuccess: () => {
      // チケット詳細（ステータス・担当者）のキャッシュを無効化し、最新の状態を再取得させる
      void queryClient.invalidateQueries({
        queryKey: ticketDetailQueryKeys.detail(ticketId),
      })
      // 担当解除時にBE側で対応履歴（systemコメント）が追加されるため、そちらも再取得させる
      void queryClient.invalidateQueries({
        queryKey: ticketDetailQueryKeys.comments(ticketId),
      })
    },
  })
}
