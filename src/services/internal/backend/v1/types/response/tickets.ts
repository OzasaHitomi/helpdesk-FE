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

// GET /tickets/{id} のレスポンス型
// 質問者名は現時点の画面要件に無いためBE側のレスポンスにも含まれない
export type GetTicketResponse = {
  id: number
  title: string
  detail: string
  visibility: TicketVisibility
  status: TicketStatus
  // 担当者が未割当ての場合はNone
  supportUserId: number | null
  supportUserName: string | null
  createdAt: Date
}

// 通信では受け取れないため、createdAtはDate型ではなく文字列型として受け取る
export type GetTicketResponseJson = Omit<GetTicketResponse, 'createdAt'> & {
  createdAt: string
}

// PUT /tickets/{id}/assign のレスポンス型（チケット担当者の自己アサインAPI）
export type AssignTicketResponse = {
  id: number
  status: TicketStatus
  supportUserId: number
  supportUserName: string
  updatedAt: Date
}

// 通信では受け取れないため、updatedAtはDate型ではなく文字列型として受け取る
export type AssignTicketResponseJson = Omit<AssignTicketResponse, 'updatedAt'> & {
  updatedAt: string
}

// DELETE /tickets/{id}/assign のレスポンス型（チケット担当解除API）
// 解除後は担当者がいなくなるため、PUT /tickets/{id}/assign（担当者になるAPI）のレスポンスとは異なる型として定義する
export type UnassignTicketResponse = {
  id: number
  status: TicketStatus
  supportUserId: null
  supportUserName: null
  updatedAt: Date
}

// 通信では受け取れないため、updatedAtはDate型ではなく文字列型として受け取る
export type UnassignTicketResponseJson = Omit<UnassignTicketResponse, 'updatedAt'> & {
  updatedAt: string
}

// PUT /tickets/{id}/status のレスポンス型（チケットステータス変更API）
export type UpdateTicketStatusResponse = {
  id: number
  status: TicketStatus
  updatedAt: Date
}

// 通信では受け取れないため、updatedAtはDate型ではなく文字列型として受け取る
export type UpdateTicketStatusResponseJson = Omit<UpdateTicketStatusResponse, 'updatedAt'> & {
  updatedAt: string
}
