// フィールドごとのエラー文言。各入力欄の直下に表示する前提のため、フィールド名は含めない
// generalは、想定していないフィールド名が返ってきた場合など、特定の入力欄に紐付けられないエラー用
export type AccountFieldErrors = {
  name?: string
  email?: string
  password?: string
  role?: string
  general?: string
}
