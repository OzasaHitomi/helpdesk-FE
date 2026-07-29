import { type TicketVisibility } from '@/share/types/ticketVisibility'

// POST /tickets に送るリクエストボディの型
// フォームの型(CreateTicketForm)と現状フィールドは同じだが、
// 「BEに送る形」と「画面の入力用の形」は本来別の関心事なので型としても分けている
export type CreateTicketRequest = {
  title: string
  detail: string
  visibility: TicketVisibility
}
