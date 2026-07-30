import { useGetTicketsQuery } from '../queries/useGetTicketsQuery'
import { type TicketItemView } from '../../types/TicketItemView'

// チケット一覧取得のFE側ロジックを担当するhook
// Containerはqueryを直接呼ばず、このhandlerを経由することで
// 「通信(query)」と「画面用の加工(詰め替え・並び替え)」を分離する
export const useGetTicketsHandler = () => {
  // dataが未取得(undefined)の場合に備えて初期値に空配列を設定する
  const { data = [], isFetching, isError } = useGetTicketsQuery()

  // サービス層の型(GetTicketsResponseItem)からFE用の型(TicketItemView)に詰め替える
  const tickets = data.map((d): TicketItemView => ({ ...d }))

  // 受け入れ要件: 一覧の並び順は質問日(createdAt)が新しい順
  // getTime()で数値化して比較し、降順に並び替える
  tickets.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  return {
    data: { tickets },
    uiState: { isFetching, isError },
  }
}
