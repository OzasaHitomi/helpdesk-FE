import { useQuery } from '@tanstack/react-query'
import { getTicket } from '@/services/internal/backend/v1/tickets'
import { ticketQueryKeys } from '@/share/hooks/queries/queryKeys'

// チケット詳細取得（GET /tickets/{id}）
export const useGetTicketQuery = (id: number) => {
  return useQuery({
    queryKey: ticketQueryKeys.detail(id),
    queryFn: () => getTicket(id),
    // idが不正な値(NaN)の場合はBEに問い合わせず、取得失敗として扱う
    enabled: !Number.isNaN(id),
  })
}
