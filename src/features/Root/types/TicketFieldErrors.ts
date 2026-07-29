// フィールドごとのエラー文言。各入力欄の直下に表示する前提のため、フィールド名は含めない
// generalは、想定していないフィールド名が返ってきた場合など、特定の入力欄に紐付けられないエラー用
// (チケット作成フォーム専用の型のため、share配下ではなくfeatures/Root配下に置いている)
export type TicketFieldErrors = {
  title?: string
  detail?: string
  visibility?: string
  general?: string
}
