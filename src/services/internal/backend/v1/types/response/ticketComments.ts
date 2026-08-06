// GET /tickets/{id}/comments のレスポンス型（Itemは配列の1要素）
// BEはcreated_by_user_idがNULL(システムによる自動生成)の場合、commenterNameに"system"を返す
export type GetTicketCommentsResponseItem = {
  id: number
  content: string
  commenterName: string
  // BEのcreated_atはDateTime型(日付+時刻)だが、JSのDateは日付だけでなく時刻も保持するため、
  // FE側の型はDatetimeと区別せずDateのままで問題ない
  createdAt: Date
}

// 通信では受け取れないため、createdAtはDate型ではなく文字列型として受け取る
export type GetTicketCommentsResponseItemJson = Omit<GetTicketCommentsResponseItem, 'createdAt'> & {
  createdAt: string
}
