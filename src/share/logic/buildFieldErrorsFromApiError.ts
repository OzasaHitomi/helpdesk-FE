import { extractErrorInfo } from './extractErrorInfo'
import {
  transformValidationErrorTypeToJa,
  GENERAL_VALIDATION_ERROR_MESSAGE,
} from './transform/transformValidationErrorTypeToJa'

// BEのエラーレスポンスから、フィールドごとのエラー文言を組み立てる
//
// TField: 呼び出し元フォームのフィールド名（例: 'content' / 'title' | 'detail' | 'visibility'）。
//         呼び出し時に指定するのではなく、下のisField引数の型から自動的に決まる
// isField: エラー箇所(loc)が、呼び出し元フォームのどのフィールドに該当するかを判定する型ガード
//          （呼び出し元のisTicketCommentField・isTicketFieldをそのまま渡す）
// fallbackMessage: 422以外でBEがdetailを文字列で返さなかった場合に使う汎用エラー文言
//
// 戻り値の型 Partial<Record<TField, string>> は、TFieldに応じて
//   TField='content'                        → { content?: string }
//   TField='title'|'detail'|'visibility'    → { title?: string; detail?: string; visibility?: string }
// のように自動的に決まるため、TicketCommentFieldErrors／TicketFieldErrorsどちらの形にもそのまま代入できる
export const buildFieldErrorsFromApiError = <TField extends string>(
  e: unknown,
  isField: (field: unknown) => field is TField,
  fallbackMessage: string,
): Partial<Record<TField, string>> & { general?: string } => {
  const info = extractErrorInfo(e)
  const errors: Partial<Record<TField, string>> & { general?: string } = {}

  if (info?.type === 'VALIDATION_ERROR') {
    const detail = info.detail
    if (!Array.isArray(detail) || detail.length === 0) {
      errors.general = GENERAL_VALIDATION_ERROR_MESSAGE
    } else {
      detail.forEach(({ loc, type }) => {
        const field = loc.pop()
        const message = transformValidationErrorTypeToJa(type)
        if (isField(field)) {
          // ここでerrors[field] = messageとそのまま書くと、TSの型エラーになる。
          // TFieldは呼び出し元によって変わる型（ジェネリクス）なので、
          // TS自身は「fieldがerrorsの正しいキーである」とこの場所では確認できないため。
          // isField(field)がtrueになった時点で「fieldはTField型」と確認済みなので、
          // Record<TField, string>として扱ってよいという意味でキャストしている
          ;(errors as Record<TField, string>)[field] = message
        } else {
          errors.general = GENERAL_VALIDATION_ERROR_MESSAGE
        }
      })
    }
  } else {
    errors.general = typeof info?.detail === 'string' ? info.detail : fallbackMessage
  }

  return errors
}
