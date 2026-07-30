import { type TicketStatus } from '@/share/types/ticketStatus'

// Record<K, V>: キーがK型、値がV型のオブジェクトを表す型。TicketStatusの全パターンを網羅しないとエラーになる
const TicketStatusJaMap: Record<TicketStatus, string> = {
  new_question: '新規質問',
  assigned: '担当者アサイン済み',
  in_progress: '対応中',
  resolved: '解決済み',
  closed: 'クローズ',
}

// 渡された文字列がTicketStatusの値として妥当かどうかを判定する
const isTicketStatus = (status: string): status is TicketStatus => status in TicketStatusJaMap

// TicketStatusの値を日本語表示用の文字列に変換する(不正な値の場合は空文字を返す)
export const transformTicketStatusToJa = (status: string): string =>
  isTicketStatus(status) ? TicketStatusJaMap[status] : ''
