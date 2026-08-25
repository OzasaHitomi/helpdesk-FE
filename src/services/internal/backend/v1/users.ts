import { internalBackendV1Client } from '@/services/internal/backend/v1/client'
import { type CreateUserRequest } from '@/services/internal/backend/v1/types/request/users'
import {
  type GetUsersResponseItem,
  type CreateUserResponse,
} from '@/services/internal/backend/v1/types/response/users'

const COMMON_URL = '/admin/users'

// 成功時は200（社員・サポートアカウントの一覧を返す。管理者アカウントはBE側で除外済み）
export const getUsers = async (): Promise<GetUsersResponseItem[]> => {
  const response = await internalBackendV1Client.get<GetUsersResponseItem[]>(COMMON_URL)
  return response.data
}

// 成功時は201（発行されたアカウントの内容を返す）
export const createUser = async (body: CreateUserRequest): Promise<CreateUserResponse> => {
  const { data } = await internalBackendV1Client.post<CreateUserResponse>(COMMON_URL, body)
  return data
}
