// BEのバリデーションエラー(422)のtype(pydanticのエラー種別)を日本語文言に変換する
// BEのvalidation_exception_handler.pyはlocとtypeのみを返す(上限値などのctxは返さない)ため、
// FE側はtypeだけで文言を決める。どのAPI・どのフィールドにも依存しない汎用の翻訳dict
// (どのフィールドのエラーかの判定=locの解釈は、呼び出し側の責務)
const ValidationErrorTypeJaMap: Record<string, string> = {
  // 必須項目がリクエストに存在しない
  missing: '入力してください',
  // 空文字・空白のみなど、最小文字数を満たしていない
  string_too_short: '入力してください',
  // 最大文字数を超えている(上限値はBEのみが知っているため、文言には具体的な数値を含めない)
  string_too_long: '文字数が上限を超えています',
  // 許可された選択肢(enum)以外の値が送られた
  enum: '選択してください',
}

// 未知のtype(BEの仕様変更などで想定外の値が返ってきた)場合のフォールバック文言
export const GENERAL_VALIDATION_ERROR_MESSAGE = '入力内容を確認してください'

// typeに対応する日本語文言を返す(未知のtypeはフォールバック文言を返す)
export const transformValidationErrorTypeToJa = (type: string): string =>
  ValidationErrorTypeJaMap[type] ?? GENERAL_VALIDATION_ERROR_MESSAGE
