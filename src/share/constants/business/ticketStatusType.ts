import { type TicketStatus } from '@/share/types/ticketStatus'

// 型（TicketStatus）は「取りうる値の種類」を表すだけで、実際の値の一覧としては使えない
// ステータスボタンをmapで並べたい時などは、こうして値そのものを持った配列も別途用意しておく
// as const: タプル型（readonly [...]）として保持する
// satisfies readonly TicketStatus[]: タプル型を保ったまま、値がTicketStatusの範囲内であることをチェックする
export const TicketStatusList = [
  'new_question',
  'assigned',
  'in_progress',
  'resolved',
  'closed',
] as const satisfies readonly TicketStatus[]
