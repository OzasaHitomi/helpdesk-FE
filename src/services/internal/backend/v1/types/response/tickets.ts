import { type TicketVisibility } from '@/share/types/ticketVisibility'
import { type TicketStatus } from '@/share/types/ticketStatus'

// POST /tickets のレスポンス型
// BE(Pydantic)はalias_generator=to_camelでcamelCaseとして返すため、FEもcamelCaseで受け取る
export type CreateTicketResponse = {
  id: number
  title: string
  detail: string
  visibility: TicketVisibility
  status: TicketStatus
  createdByUserId: number
  supportUserId: number | null
}

// GET /tickets のレスポンス型（Itemは配列の1要素）
export type GetTicketsResponseItem = {
  id: number
  title: string
  visibility: TicketVisibility
  status: TicketStatus
  createdAt: Date
  questionerName: string
  supportUserName: string | null
}

// 通信では受け取れないため、createdAtはDate型ではなく文字列型として受け取る
export type GetTicketsResponseItemJson = Omit<GetTicketsResponseItem, 'createdAt'> & {
  createdAt: string
}
