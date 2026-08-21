import { useGetUsersQuery } from '../queries/useGetUsersQuery'
import { type AccountItemView } from '../../types/AccountItemView'

// アカウント一覧取得のFE側ロジックを担当するhook
// Containerはqueryを直接呼ばず、このhandlerを経由することで
// 「通信(query)」と「画面用の加工(詰め替え)」を分離する
export const useGetUsersHandler = () => {
  // dataが未取得(undefined)の場合に備えて初期値に空配列を設定する
  const { data = [], isFetching, isError } = useGetUsersQuery()

  // サービス層の型(GetUsersResponseItem)からFE用の型(AccountItemView)に詰め替える
  const accounts = data.map((d): AccountItemView => ({ ...d }))

  return {
    data: { accounts },
    uiState: { isFetching, isError },
  }
}
