import { useGetTicketQuery } from '../queries/useGetTicketQuery'
import { type TicketDetailView } from '../../types/TicketDetailView'
import { type UserRole } from '@/share/types/userRole'

// チケット詳細取得のFE側ロジックを担当するhook
// Containerはqueryを直接呼ばず、このhandlerを経由することで
// 「通信(query)」と「画面用の加工(詰め替え)」を分離する
export const useGetTicketHandler = (
  ticketId: number,
  role: UserRole | undefined,
  // userId: number | undefined,
) => {
  const { data, isLoading, isError } = useGetTicketQuery(ticketId)

  // サービス層の型(GetTicketResponse)からFE用の型(TicketDetailView)に詰め替える
  // dataが未取得(undefined)の間は、詰め替えずそのままundefinedを返す
  
  const ticket: TicketDetailView | undefined = data
    ? {
        ...data,
        isAssignableToMe:
          role === 'support' && data.status === 'new_question' && data.supportUserId == null,
      }
    : undefined

  return {
    data: { ticket },
    uiState: { isLoading, isError },
  }
}
