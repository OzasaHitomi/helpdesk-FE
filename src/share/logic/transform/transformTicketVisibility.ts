import { type TicketVisibility } from '@/share/types/ticketVisibility'

// Record<K, V>: キーがK型、値がV型のオブジェクトを表す型。TicketVisibilityの全パターンを網羅しないとエラーになる
const TicketVisibilityJaMap: Record<TicketVisibility, string> = {
  public: '公開',
  private: '非公開',
}

// 渡された文字列がTicketVisibilityの値として妥当かどうかを判定する
const isTicketVisibility = (visibility: string): visibility is TicketVisibility =>
  visibility in TicketVisibilityJaMap

// TicketVisibilityの値を日本語表示用の文字列に変換する(不正な値の場合は空文字を返す)
export const transformTicketVisibilityToJa = (visibility: string): string =>
  isTicketVisibility(visibility) ? TicketVisibilityJaMap[visibility] : ''
