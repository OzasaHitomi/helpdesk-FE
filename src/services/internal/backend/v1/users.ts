import { internalBackendV1Client } from '@/services/internal/backend/v1/client'
import { type GetUsersResponseItem } from '@/services/internal/backend/v1/types/response/users'

const COMMON_URL = '/admin/users'

// 成功時は200（社員・サポートアカウントの一覧を返す。管理者アカウントはBE側で除外済み）
export const getUsers = async (): Promise<GetUsersResponseItem[]> => {
  const response = await internalBackendV1Client.get<GetUsersResponseItem[]>(COMMON_URL)
  return response.data
}
