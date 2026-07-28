// チケットステータスの種類（BEのTicketStatusTypeに対応）
// 文字列リテラルのユニオン型にすることで、この5つ以外の値を代入しようとするとコンパイルエラーになる
export type TicketStatus = 'new_question' | 'assigned' | 'in_progress' | 'resolved' | 'closed'
