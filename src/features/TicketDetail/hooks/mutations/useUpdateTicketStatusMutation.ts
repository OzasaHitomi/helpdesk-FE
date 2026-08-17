import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTicketStatus } from '@/services/internal/backend/v1/tickets'
import { ticketDetailQueryKeys } from '../queries/queryKeys'
import { type TicketStatus } from '@/share/types/ticketStatus'

// TanStack Queryの「更新系（PUT）通信」をラップするフック
// ticketIdは詳細ページ表示時点で確定しているため、mutateAsyncの引数ではなくフック自体の引数として受け取る
// 変更先のstatusは呼び出し側（ステータスボタン押下時）まで決まらないため、mutateAsyncの引数として受け取る
export const useUpdateTicketStatusMutation = (ticketId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (status: TicketStatus) => updateTicketStatus(ticketId, { status }),
    // onSuccess: mutationFnが成功した直後に呼ばれるコールバック
    onSuccess: () => {
      // チケット詳細（ステータス）のキャッシュを無効化し、最新の状態を再取得させる
      void queryClient.invalidateQueries({
        queryKey: ticketDetailQueryKeys.detail(ticketId),
      })
      // ステータス変更時にBE側で対応履歴（systemコメント）が追加されるため、そちらも再取得させる
      void queryClient.invalidateQueries({
        queryKey: ticketDetailQueryKeys.comments(ticketId),
      })
    },
  })
}
