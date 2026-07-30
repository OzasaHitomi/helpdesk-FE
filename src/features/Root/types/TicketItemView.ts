import { type TicketVisibility } from '@/share/types/ticketVisibility'
import { type TicketStatus } from '@/share/types/ticketStatus'

// FEが使いやすいような型定義
// サービス層のレスポンス型(GetTicketsResponseItem)をUI層が直接参照しないよう、
// 画面表示に必要な項目だけを持つView用の型として分離しておく
export type TicketItemView = {
  id: number
  title: string
  visibility: TicketVisibility
  status: TicketStatus
  createdAt: Date
  questionerName: string
  supportUserName: string | null
}
