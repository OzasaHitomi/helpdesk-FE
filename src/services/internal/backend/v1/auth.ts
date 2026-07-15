import { internalBackendV1Client } from '@/services/internal/backend/v1/client'
import { type LoginRequest } from '@/services/internal/backend/v1/types/request/auth'

const COMMON_URL = '/auth'

// 成功時は204 No Content（Cookieにアクセストークンが設定される）
export const postLogin = async (body: LoginRequest): Promise<void> => {
  await internalBackendV1Client.post(COMMON_URL, body)
}
