import {
  transformValidationErrorTypeToJa,
  GENERAL_VALIDATION_ERROR_MESSAGE,
} from './transform/transformValidationErrorTypeToJa'
import { type ErrorResponse } from '@/services/internal/backend/v1/types/response/error'

export const mapValidationErrorsToFiledMessage = (e: ErrorResponse) => {
  if (e.type != 'VALIDATION_ERROR' || !Array.isArray(e.detail) || e.detail.length === 0) {
    return { general: GENERAL_VALIDATION_ERROR_MESSAGE }
  }

  // ここから下はVALIDATION_ERROR かつ detailが配列で、要素が1つ以上入っている
  const errors: Record<string, string> = {}
  e.detail.forEach(({ loc, type }) => {
    const field = loc.pop()
    const message = transformValidationErrorTypeToJa(type)
    // locの配列が空の場合を蹴る
    if (field) {
      errors[field] = message
    } else {
      errors.general = GENERAL_VALIDATION_ERROR_MESSAGE
    }
  })

  return errors
}
