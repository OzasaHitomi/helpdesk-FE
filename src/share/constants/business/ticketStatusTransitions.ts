import { type TicketStatus } from '@/share/types/ticketStatus'

// 各ステータスから、チケット詳細画面のステータス変更操作(PUT /tickets/{id}/status)で
// 直接遷移可能な次ステータスの一覧（BEのTICKET_STATUS_TRANSITIONSに対応）
// new_questionが関わる遷移（担当者アサイン/解除）はassign/unassign専用のAPIが担うため、
// このAPIでは常に拒否される。そのためnew_questionの遷移先は空にしている
export const TicketStatusTransitions: Record<TicketStatus, readonly TicketStatus[]> = {
  new_question: [],
  assigned: ['in_progress', 'resolved', 'closed'],
  in_progress: ['assigned', 'resolved', 'closed'],
  resolved: ['in_progress', 'closed'],
  closed: ['in_progress'],
}
