import { useGetTicketCommentsQuery } from '../queries/useGetTicketCommentsQuery'
import { type TicketCommentView } from '../../types/TicketCommentView'

// 対応履歴取得のFE側ロジックを担当するhook
// Containerはqueryを直接呼ばず、このhandlerを経由することで
// 「通信(query)」と「画面用の加工(詰め替え)」を分離する
export const useGetTicketCommentsHandler = (id: number) => {
  const { data=[], isLoading, isError } = useGetTicketCommentsQuery(id)

  // dataのデフォルト値が[]のため、未取得の間も空配列を返す（一覧表示のため、ticket詳細のようにundefinedにはしない）
  // GetTicketCommentsResponseItemとTicketCommentViewはフィールドが一致するため、spreadでFE用の型に詰め替える
  const comments: TicketCommentView[] = [...data]
  

  return {
    data: { comments },
    uiState: { isLoading, isError },
  }
}
