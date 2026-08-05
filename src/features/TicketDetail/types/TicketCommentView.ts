// FEが使いやすいような型定義
// サービス層のレスポンス型(GetTicketCommentsResponseItem)をUI層が直接参照しないよう、
// 画面表示に必要な項目だけを持つView用の型として分離しておく
export type TicketCommentView = {
  id: number
  content: string
  commenterName: string
  createdAt: Date
}
