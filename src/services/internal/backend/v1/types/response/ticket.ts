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
