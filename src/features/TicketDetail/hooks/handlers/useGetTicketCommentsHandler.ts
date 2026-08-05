import { useGetTicketCommentsQuery } from '../queries/useGetTicketCommentsQuery'
import { type TicketCommentView } from '../../types/TicketCommentView'

// 対応履歴取得のFE側ロジックを担当するhook
// Containerはqueryを直接呼ばず、このhandlerを経由することで
// 「通信(query)」と「画面用の加工(詰め替え)」を分離する
export const useGetTicketCommentsHandler = (id: number) => {
  const { data, isLoading, isError } = useGetTicketCommentsQuery(id)

  // サービス層の型(GetTicketCommentsResponseItem[])からFE用の型(TicketCommentView[])に詰め替える
  // dataが未取得の間は、空配列を返す（一覧表示のため、ticket詳細のようにundefinedにはしない）
  const comments: TicketCommentView[] = data ? [...data] : []

  return {
    data: { comments },
    uiState: { isLoading, isError },
  }
}
