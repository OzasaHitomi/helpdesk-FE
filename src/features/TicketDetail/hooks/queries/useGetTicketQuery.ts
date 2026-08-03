import { useQuery } from '@tanstack/react-query'
import { getTicket } from '@/services/internal/backend/v1/tickets'
import { ticketDetailQueryKeys } from './queryKeys'

// チケット詳細取得（GET /tickets/{id}）
export const useGetTicketQuery = (id: number) => {
  return useQuery({
    queryKey: ticketDetailQueryKeys.detail(id),
    queryFn: () => getTicket(id),
    // idが不正な値(NaN)の場合はBEに問い合わせず、取得失敗として扱う
    enabled: !Number.isNaN(id),
  })
}
