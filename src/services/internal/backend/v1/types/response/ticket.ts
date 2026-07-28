import { type TicketVisibility } from '@/share/types/ticketVisibility'
import { type TicketStatus } from '@/share/types/ticketStatus'

// POST /tickets のレスポンス型（BEからそのまま返るsnake_case表現）
// BE(Python)はsnake_case、FE(TypeScript)はcamelCaseで書くのが自然なため、
// 「BEがそのまま返す形」と「FEで使いたい形」の2つの型を用意している
export type CreateTicketResponseJson = {
  id: number
  title: string
  detail: string
  visibility: TicketVisibility
  status: TicketStatus
  created_by_user_id: number
  // 作成時点では未担当のためnull
  support_user_id: number | null
}

// POST /tickets のレスポンス型（FEで扱うcamelCase表現）
// BE表現(snake_case)の吸収はservices層(ticket.ts)の責務とする
export type CreateTicketResponse = {
  id: number
  title: string
  detail: string
  visibility: TicketVisibility
  status: TicketStatus
  createdByUserId: number
  supportUserId: number | null
}
