// BEのバリデーションエラー(422)のdetail配列の1要素（BEのValidationErrorResponseItemに対応）
export type ValidationErrorResponseItem = {
  loc: string[]
  type: string
}

// BEのエラーレスポンス共通形（BEのErrorResponseに対応）
// detailは403/500では文字列、422ではValidationErrorResponseItemの配列になる
// typeは422('VALIDATION_ERROR')・500('INTERNAL_SERVER_ERROR')は専用の例外ハンドラで付与されるが、
// 403/401(ForbiddenException/UnauthorizedException)はFastAPI標準のHTTPExceptionハンドラがそのまま使われるため、
// typeキー自体が存在しない。そのためオプショナルにしている
export type ErrorResponse = {
  detail: string | ValidationErrorResponseItem[]
  type?: 'VALIDATION_ERROR' | 'INTERNAL_SERVER_ERROR'
}
