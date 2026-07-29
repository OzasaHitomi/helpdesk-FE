import { useQuery } from '@tanstack/react-query'
import { ticketQueryKeys } from './queryKeys'

// チケット一覧取得（GET /tickets）用フックのスタブ
// 一覧画面の実装時に、services層のGET関数（listTickets等）をqueryFnとして呼び出す形にする
// 呼び出し元がまだ無いため、enabled:falseにして誤って実行されないようにしている
export const useGetTicketsQuery = () => {
  return useQuery({
    queryKey: ticketQueryKeys.all,
    queryFn: (): never => {
      throw new Error('useGetTicketsQuery is not implemented yet')
    },
    enabled: false,
  })
}
