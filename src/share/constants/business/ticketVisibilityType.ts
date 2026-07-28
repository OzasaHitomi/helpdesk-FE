import { type TicketVisibility } from '@/share/types/ticketVisibility'

// 型（TicketVisibility）は「取りうる値の種類」を表すだけで、実際の値の一覧としては使えない
// ボタンをmapで並べたい時などは、こうして値そのものを持った配列も別途用意しておく
// 公開設定ボタンをforで並べるためのリスト（型定義した値の実体を持ったリスト）
export const TicketVisibilityList: TicketVisibility[] = ['public', 'private']
