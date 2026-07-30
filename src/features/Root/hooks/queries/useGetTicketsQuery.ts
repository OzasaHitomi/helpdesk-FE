import { useQuery } from '@tanstack/react-query'
import { getTickets } from '@/services/internal/backend/v1/tickets'
import { ticketQueryKeys } from './queryKeys'

// チケット一覧取得（GET /tickets）
export const useGetTicketsQuery = () => {
  return useQuery({
    queryKey: ticketQueryKeys.all,
    queryFn: getTickets,
  })
}
