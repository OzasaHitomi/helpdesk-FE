import axios from 'axios'
import { type ErrorResponse } from '@/services/internal/backend/v1/types/response/error'

// BEのエラーレスポンス（403・500はdetailが文字列、422はValidationErrorResponseItem[]）から
// detail・typeを取り出す。axios以外のエラー（ネットワークエラー等）の場合はundefinedを返す
//
// axios.isAxiosError(e): eが「axiosが投げたエラー」かどうかを判定する関数（型ガード）
// ここでtrueになった場合、TypeScript上でもeがAxiosErrorとして扱えるようになる
export const extractErrorInfo = (
  e: unknown,
): { detail: ErrorResponse['detail']; type: ErrorResponse['type'] } | undefined => {
  // e.response?.data: レスポンス自体が無い（通信できなかった等）場合はresponseがundefinedになるため、
  // ?.（オプショナルチェイニング）でエラーにならないようにしている
  if (!axios.isAxiosError<ErrorResponse>(e) || !e.response) {
    return undefined
  }
  return { detail: e.response.data.detail, type: e.response.data.type }
}
