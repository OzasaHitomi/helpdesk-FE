// BEのバリデーションエラー(422)のdetail配列の1要素（BEのValidationErrorResponseItemに対応）
export type ValidationErrorResponseItem = {
  loc: string[]
  type: string
}

// BEのエラーレスポンス共通形（BEのErrorResponseに対応）
// detailは403/500では文字列、422ではValidationErrorResponseItemの配列になる
export type ErrorResponse = {
  detail: string | ValidationErrorResponseItem[]
  type: string
}
