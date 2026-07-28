import { type ValidationErrorResponseItem } from '@/services/internal/backend/v1/types/response/error'

// 422(バリデーションエラー)のdetail配列を日本語文言に変換する
// BEのvalidation_exception_handler.pyがloc(末尾がフィールド名)とtypeのみを返すため、FE側で文言を組み立てる
//
// 入力例: [{ loc: ['body', 'title'], type: 'missing' }]
// 出力例: '要件を入力してください'
export const resolveTicketValidationErrorMessage = (
  items: ValidationErrorResponseItem[],
): string => {
  // 複数のエラーが返ってきても、先頭の1件だけを日本語文言に変換する（画面には1つだけ表示するため）
  const firstItem = items.at(0)
  if (!firstItem) {
    // 配列が空（＝BEの仕様変更などで想定外の形になった）場合は汎用メッセージにフォールバックする
    return '入力内容を確認してください'
  }

  // loc（例: ['body', 'title']）の末尾が、エラーの原因になったフィールド名
  const field = firstItem.loc[firstItem.loc.length - 1]

  if (field === 'title') {
    // typeの値によって「未入力」か「文字数オーバー」かを判定する
    return firstItem.type === 'string_too_long'
      ? '要件は255文字以内で入力してください'
      : '要件を入力してください'
  }

  if (field === 'detail') {
    return '詳細を入力してください'
  }

  if (field === 'visibility') {
    return '公開設定を選択してください'
  }

  // 想定していないフィールド名が返ってきた場合の保険
  return '入力内容を確認してください'
}
