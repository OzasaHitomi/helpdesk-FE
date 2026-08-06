import { useQuery } from '@tanstack/react-query'
import { getTicketComments } from '@/services/internal/backend/v1/ticketComments'
import { ticketDetailQueryKeys } from './queryKeys'

// 対応履歴取得（GET /tickets/{id}/comments）
export const useGetTicketCommentsQuery = (id: number) => {
  return useQuery({
    queryKey: ticketDetailQueryKeys.comments(id),
    queryFn: () => getTicketComments(id),
    // idが不正な値(NaN)の場合はBEに問い合わせず、取得失敗として扱う
    enabled: !Number.isNaN(id),
  })
}
