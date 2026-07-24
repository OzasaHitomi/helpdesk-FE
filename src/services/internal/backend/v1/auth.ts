import { internalBackendV1Client } from '@/services/internal/backend/v1/client'
import { type LoginRequest } from '@/services/internal/backend/v1/types/request/auth'
import { type GetMeResponse } from '@/services/internal/backend/v1/types/response/auth'

const COMMON_URL = '/auth'

// 成功時は204 No Content（Cookieにアクセストークンが設定される）
export const postLogin = async (body: LoginRequest): Promise<void> => {
  await internalBackendV1Client.post(COMMON_URL, body)
}

// 成功時は200（ログイン中のユーザー情報を返す）。未ログイン（Cookieが無い/不正）の場合は401
export const getMe = async (): Promise<GetMeResponse> => {
  const { data } = await internalBackendV1Client.get<GetMeResponse>(`${COMMON_URL}/me`)
  return data
}

// 成功時は204 No Content（Cookieのアクセストークンが削除される）。未ログインの場合は401
export const postLogout = async (): Promise<void> => {
  await internalBackendV1Client.post(`${COMMON_URL}/logout`)
}
