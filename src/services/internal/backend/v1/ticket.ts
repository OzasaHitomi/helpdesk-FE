import { internalBackendV1Client } from '@/services/internal/backend/v1/client'
import { type CreateTicketRequest } from '@/services/internal/backend/v1/types/request/ticket'
import {
  type CreateTicketResponse,
  type CreateTicketResponseJson,
} from '@/services/internal/backend/v1/types/response/ticket'

// このファイル（services層）は「BEとの通信」と「BEの形(snake_case)→FEの形(camelCase)への変換」だけを担当する
// ここより上の層（mutation・handler）は、変換済みのFE用の型だけを扱えばよい
const COMMON_URL = '/tickets'

// 成功時は201（登録されたチケットの内容を返す）
export const createTicket = async (body: CreateTicketRequest): Promise<CreateTicketResponse> => {
  // internalBackendV1Client.post<T>(...): axiosでPOSTを送り、レスポンスのbodyをT型として受け取る
  // ここではBEがそのまま返すsnake_case形式（CreateTicketResponseJson）として受け取る
  const { data } = await internalBackendV1Client.post<CreateTicketResponseJson>(COMMON_URL, body)

  // BEのsnake_case（created_by_user_id等）を、FEで使うcamelCase（createdByUserId等）に詰め替えて返す
  return {
    id: data.id,
    title: data.title,
    detail: data.detail,
    visibility: data.visibility,
    status: data.status,
    createdByUserId: data.created_by_user_id,
    supportUserId: data.support_user_id,
  }
}
